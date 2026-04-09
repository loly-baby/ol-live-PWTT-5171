"use client";

import { useState } from "react";

type ActionState = {
  loading: boolean;
  message?: string;
};

const oneTimeCards = [
  {
    productType: "STAMP_FILE",
    title: "Stamp one file",
    price: "$2.9",
    description: "Best for one PDF or image that just needs a stamp placed and exported.",
    points: ["One image/PDF export", "Use an existing saved stamp", "Fastest pay-per-result option"]
  },
  {
    productType: "EXTRACT_ONLY",
    title: "Extract one stamp",
    price: "$4.9",
    description: "Digitize a real-world stamp from a phone photo and save it as a reusable transparent PNG.",
    points: ["Auto background removal", "Transparent PNG output", "Great for creating your first reusable stamp"]
  },
  {
    productType: "COMBO",
    title: "Extract + stamp",
    price: "$6.9",
    description: "The best first-time workflow: extract the stamp, place it on a file, and export the result.",
    points: ["Digitize a real stamp", "Apply it immediately", "Best value for first use"]
  }
] as const;

const membershipCard = {
  title: "Pro membership",
  price: "$12.9/mo",
  description: "For repeat users who keep extracting, saving, and stamping files every month.",
  points: [
    "Unlimited high-resolution exports",
    "Unlimited stamp extraction and saving",
    "Persistent email-based stamp library",
    "PDF stamping included",
    "Stripe billing portal support"
  ]
};

export function PricingClient() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<ActionState>({ loading: false });

  async function checkoutOneTime(productType: string) {
    if (!email) {
      setState({ loading: false, message: "Enter your email first so exports and assets can be linked to you." });
      return;
    }

    setState({ loading: true, message: undefined });
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "one_time", email, productType })
    });
    const result = await response.json();
    if (!response.ok) {
      setState({ loading: false, message: result.error || "Checkout failed." });
      return;
    }

    window.location.href = result.checkoutUrl;
  }

  async function checkoutPro() {
    if (!email) {
      setState({ loading: false, message: "Enter your email first so your Pro membership can be created." });
      return;
    }

    setState({ loading: true, message: undefined });
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "subscription", email, tier: "PRO" })
    });
    const result = await response.json();
    if (!response.ok) {
      setState({ loading: false, message: result.error || "Subscription checkout failed." });
      return;
    }

    window.location.href = result.checkoutUrl ?? `/billing?email=${encodeURIComponent(email)}`;
  }

  return (
    <>
      <div className="mt-8 max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <label className="block text-sm font-medium text-slate-700">Email for orders, saved stamps, and Pro access</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="you@example.com"
          className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-500"
        />
        <p className="mt-3 text-sm text-slate-500">This MVP uses email as the lightweight identity layer before full accounts are added.</p>
        {state.message ? <p className="mt-3 text-sm text-slate-700">{state.message}</p> : null}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">pay per result</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">One-time workflows for first-time users</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {oneTimeCards.map((tier) => (
              <div key={tier.title} className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
                <h3 className="text-2xl font-semibold text-slate-900">{tier.title}</h3>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{tier.price}</p>
                <p className="mt-4 text-sm text-slate-600">{tier.description}</p>
                <ul className="mt-6 space-y-3 text-slate-600">
                  {tier.points.map((point) => <li key={point}>• {point}</li>)}
                </ul>
                <button
                  disabled={state.loading}
                  onClick={() => checkoutOneTime(tier.productType)}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  Buy {tier.price}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">light subscription</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Keep single payments, add one clean monthly plan</h2>
          </div>

          <div className="rounded-[28px] border border-slate-900 bg-slate-900 p-8 text-white shadow-soft">
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">recommended next step</div>
            <h3 className="mt-4 text-3xl font-semibold">{membershipCard.title}</h3>
            <p className="mt-3 text-5xl font-semibold">{membershipCard.price}</p>
            <p className="mt-4 text-sm text-slate-200">{membershipCard.description}</p>
            <ul className="mt-6 space-y-3 text-slate-100">
              {membershipCard.points.map((point) => <li key={point}>• {point}</li>)}
            </ul>
            <button
              disabled={state.loading}
              onClick={checkoutPro}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-900 disabled:opacity-60"
            >
              Start Pro
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
