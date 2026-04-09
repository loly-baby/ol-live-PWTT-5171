import Link from "next/link";
import { Hero } from "@/components/Hero";

const features = [
  { title: "Generate new stamps", text: "Create clean digital stamps from templates with transparent export." },
  { title: "Extract old stamps", text: "Pull a red or blue stamp out of a phone photo and save it as a reusable asset." },
  { title: "Stamp files fast", text: "Drag the stamp anywhere on a PDF or image, then export the finished file." }
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((item) => (
            <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
              <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-soft">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">why this is different</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Most tools can make a stamp. This one helps you digitize the stamp you already have.</h2>
            <p className="mt-4 text-lg text-slate-600">
              That means your real-world stamp becomes a reusable digital asset you can place on invoices, forms, packaging docs, and internal paperwork without redesigning it from scratch.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/workspace" className="inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white">Start extracting and stamping</Link>
            <Link href="/pricing" className="inline-flex rounded-2xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700">See pay-per-result + Pro</Link>
          </div>
        </div>
      </section>
    </>
  );
}
