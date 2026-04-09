import { PricingClient } from "@/components/pricing/PricingClient";

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">pricing</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Start with single outcomes. Add Pro for repeat workflows.</h1>
        <p className="mt-4 text-lg text-slate-600">
          This product should not force a heavy SaaS subscription from day one. Keep one-time checkout for first conversions, then add one light membership for people who extract and stamp files every month.
        </p>
      </div>

      <PricingClient />
    </section>
  );
}
