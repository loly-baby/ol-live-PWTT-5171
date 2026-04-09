"use client";

import { useEffect, useMemo, useState } from "react";

type Membership = {
  email: string;
  tier: "FREE" | "PRO";
  status: string;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
};

export default function BillingPage() {
  const params = useMemo(() => new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""), []);
  const [email, setEmail] = useState("");
  const [membership, setMembership] = useState<Membership | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const preset = params.get("email") || "";
    setEmail(preset);
    if (preset) {
      fetchMembership(preset);
    }
    if (params.get("upgraded")) setMessage("Pro checkout completed. Refreshing membership status...");
    if (params.get("mockPro")) setMessage("Mock Pro mode enabled because Stripe subscription keys were not configured.");
  }, [params]);

  async function fetchMembership(targetEmail: string) {
    setLoading(true);
    const response = await fetch(`/api/subscription?email=${encodeURIComponent(targetEmail)}`);
    const data = await response.json();
    setMembership(data.membership || null);
    setLoading(false);
  }

  async function openPortal() {
    if (!email) return;
    setLoading(true);
    const response = await fetch("/api/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error || "Unable to open billing portal.");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">billing</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Check your membership and manage Pro</h1>
        <p className="mt-4 text-lg text-slate-600">
          This page is intentionally lightweight: email-based lookup for MVP, then Stripe portal for recurring billing management.
        </p>
      </div>

      <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
          />
          <button onClick={() => fetchMembership(email)} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white">Lookup</button>
          <button onClick={openPortal} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700">Open portal</button>
        </div>

        {message ? <p className="mt-4 text-sm text-slate-700">{message}</p> : null}

        <div className="mt-8 rounded-2xl bg-slate-50 p-6">
          {loading ? <p className="text-slate-600">Loading…</p> : null}
          {!loading && !membership ? <p className="text-slate-600">No membership found yet for this email. One-time checkout still works without a membership.</p> : null}
          {!loading && membership ? (
            <div className="space-y-2 text-slate-700">
              <p><span className="font-semibold text-slate-900">Plan:</span> {membership.tier}</p>
              <p><span className="font-semibold text-slate-900">Status:</span> {membership.status}</p>
              <p><span className="font-semibold text-slate-900">Renews / ends:</span> {membership.currentPeriodEnd ? new Date(membership.currentPeriodEnd).toLocaleString() : "—"}</p>
              <p><span className="font-semibold text-slate-900">Cancel at period end:</span> {membership.cancelAtPeriodEnd ? "Yes" : "No"}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
