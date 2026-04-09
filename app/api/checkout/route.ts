import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PlanTier, ProductType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getMembershipPriceId, MEMBERSHIP_PLANS, PRODUCT_PRICING } from "@/lib/pricing";
import { findOrCreateCustomer, getBaseUrl, getStripe } from "@/lib/stripe";

const schema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("one_time"),
    email: z.string().email(),
    productType: z.nativeEnum(ProductType),
    projectId: z.string().optional()
  }),
  z.object({
    kind: z.literal("subscription"),
    email: z.string().email(),
    tier: z.nativeEnum(PlanTier)
  })
]);

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const stripe = getStripe();
  const baseUrl = getBaseUrl();

  if (parsed.data.kind === "one_time") {
    const price = PRODUCT_PRICING[parsed.data.productType];
    const order = await prisma.order.create({
      data: {
        projectId: parsed.data.projectId,
        email: parsed.data.email,
        productType: parsed.data.productType,
        amount: price.amount,
        status: stripe ? "PENDING" : "PAID"
      }
    });

    if (!stripe) {
      return NextResponse.json({
        mode: "mock",
        checkoutUrl: `${baseUrl}/history?email=${encodeURIComponent(parsed.data.email)}&mockPaid=1&orderId=${order.id}`,
        orderId: order.id
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.email,
      success_url: `${baseUrl}/history?email=${encodeURIComponent(parsed.data.email)}&paid=1`,
      cancel_url: `${baseUrl}/pricing?canceled=1`,
      metadata: {
        kind: "one_time",
        orderId: order.id,
        email: parsed.data.email,
        productType: parsed.data.productType
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: price.amount,
            product_data: {
              name: price.label,
              description: price.description
            }
          }
        }
      ]
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id }
    });

    return NextResponse.json({ checkoutUrl: session.url, orderId: order.id });
  }

  if (parsed.data.tier === "FREE") {
    const membership = await prisma.membership.upsert({
      where: { email: parsed.data.email },
      update: { tier: "FREE", status: "ACTIVE", cancelAtPeriodEnd: false },
      create: { email: parsed.data.email, tier: "FREE", status: "ACTIVE" }
    });

    return NextResponse.json({ mode: "free", membership });
  }

  const priceId = getMembershipPriceId(parsed.data.tier);
  if (!stripe || !priceId) {
    const membership = await prisma.membership.upsert({
      where: { email: parsed.data.email },
      update: { tier: parsed.data.tier, status: "ACTIVE" },
      create: { email: parsed.data.email, tier: parsed.data.tier, status: "ACTIVE" }
    });

    return NextResponse.json({
      mode: "mock",
      checkoutUrl: `${baseUrl}/billing?email=${encodeURIComponent(parsed.data.email)}&mockPro=1`,
      membership
    });
  }

  const customer = await findOrCreateCustomer(parsed.data.email);
  const plan = MEMBERSHIP_PLANS[parsed.data.tier];

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customer?.id,
    customer_email: customer ? undefined : parsed.data.email,
    success_url: `${baseUrl}/billing?email=${encodeURIComponent(parsed.data.email)}&upgraded=1`,
    cancel_url: `${baseUrl}/pricing?canceled=1`,
    metadata: {
      kind: "subscription",
      tier: parsed.data.tier,
      email: parsed.data.email
    },
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      metadata: {
        tier: parsed.data.tier,
        email: parsed.data.email
      }
    }
  });

  await prisma.membership.upsert({
    where: { email: parsed.data.email },
    update: { tier: parsed.data.tier, stripeCustomerId: customer?.id },
    create: { email: parsed.data.email, tier: parsed.data.tier, stripeCustomerId: customer?.id }
  });

  return NextResponse.json({ checkoutUrl: session.url, plan: plan.label });
}
