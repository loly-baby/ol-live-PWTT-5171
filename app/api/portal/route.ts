import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBaseUrl, getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body?.email;
  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  const membership = await prisma.membership.findUnique({ where: { email } });
  if (!membership?.stripeCustomerId) {
    return NextResponse.json({ error: "No Stripe customer found for this email" }, { status: 404 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({
      mode: "mock",
      url: `${getBaseUrl()}/billing?email=${encodeURIComponent(email)}&portal=mock`
    });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: membership.stripeCustomerId,
    return_url: `${getBaseUrl()}/billing?email=${encodeURIComponent(email)}`
  });

  return NextResponse.json({ url: session.url });
}
