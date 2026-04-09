import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

function normalizeSubscriptionStatus(status: string) {
  switch (status) {
    case "active":
      return "ACTIVE" as const;
    case "trialing":
      return "TRIALING" as const;
    case "past_due":
      return "PAST_DUE" as const;
    case "unpaid":
      return "UNPAID" as const;
    case "incomplete":
    case "incomplete_expired":
      return "INCOMPLETE" as const;
    case "canceled":
      return "CANCELED" as const;
    default:
      return "INCOMPLETE" as const;
  }
}

async function upsertMembershipFromSubscription(subscription: Stripe.Subscription) {
  const email = subscription.metadata.email || undefined;
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  const tier = subscription.metadata.tier === "PRO" ? "PRO" : "FREE";
  const currentPeriodEnd = (subscription as any).current_period_end
    ? new Date((subscription as any).current_period_end * 1000)
    : null;

  const lookupEmail = email || (customerId ? (await prisma.membership.findFirst({ where: { stripeCustomerId: customerId } }))?.email : undefined);
  if (!lookupEmail) return;

  await prisma.membership.upsert({
    where: { email: lookupEmail },
    update: {
      tier,
      status: normalizeSubscriptionStatus(subscription.status),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    },
    create: {
      email: lookupEmail,
      tier,
      status: normalizeSubscriptionStatus(subscription.status),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ received: true, skipped: true });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    return NextResponse.json({ error: "Invalid webhook signature", detail: String(error) }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const kind = session.metadata?.kind;

      if (kind === "one_time" && session.metadata?.orderId) {
        await prisma.order.update({
          where: { id: session.metadata.orderId },
          data: { status: "PAID", stripeSessionId: session.id }
        }).catch(() => null);
      }

      if (kind === "subscription") {
        const email = session.metadata?.email || session.customer_details?.email || undefined;
        const customerId = typeof session.customer === "string" ? session.customer : undefined;
        if (email) {
          await prisma.membership.upsert({
            where: { email },
            update: { tier: "PRO", status: "ACTIVE", stripeCustomerId: customerId || undefined },
            create: { email, tier: "PRO", status: "ACTIVE", stripeCustomerId: customerId || undefined }
          });
        }
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertMembershipFromSubscription(subscription);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : undefined;
      if (subscriptionId) {
        await prisma.membership.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "PAST_DUE" }
        });
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : undefined;
      if (subscriptionId) {
        await prisma.membership.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "ACTIVE" }
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
