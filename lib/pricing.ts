import { ProductType, PlanTier } from "@prisma/client";

export const PRODUCT_PRICING: Record<ProductType, { amount: number; label: string; formats: string[]; description: string }> = {
  STAMP_FILE: {
    amount: 290,
    label: "Stamp one file",
    formats: ["png", "jpg", "pdf"],
    description: "Place a saved stamp on one image or PDF and export the result."
  },
  EXTRACT_ONLY: {
    amount: 490,
    label: "Extract and save stamp",
    formats: ["png"],
    description: "Digitize one real-world stamp from a phone photo and save it as a reusable transparent asset."
  },
  COMBO: {
    amount: 690,
    label: "Extract + stamp",
    formats: ["png", "jpg", "pdf"],
    description: "Best first-use workflow: digitize a real stamp and place it on a file right away."
  }
};

export const MEMBERSHIP_PLANS: Record<PlanTier, { amount: number; label: string; interval: "month" | "year"; priceIdEnv?: string; perks: string[] }> = {
  FREE: {
    amount: 0,
    label: "Free",
    interval: "month",
    perks: [
      "Preview generation and extraction",
      "Current-session stamp library",
      "No recurring fee"
    ]
  },
  PRO: {
    amount: 1290,
    label: "Pro",
    interval: "month",
    priceIdEnv: "STRIPE_PRICE_PRO_MONTHLY",
    perks: [
      "Unlimited high-resolution exports",
      "Unlimited stamp extraction and saving",
      "Persistent stamp library by email",
      "PDF stamping included",
      "Manage billing in Stripe customer portal"
    ]
  }
};

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2
  }).format(amount / 100);
}

export function getMembershipPriceId(tier: PlanTier) {
  const plan = MEMBERSHIP_PLANS[tier];
  if (!plan?.priceIdEnv) return null;
  return process.env[plan.priceIdEnv] || null;
}

export function isPaidTier(tier: PlanTier) {
  return tier !== "FREE";
}
