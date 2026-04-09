import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">document stamping + extraction</p>
        <h1 className="mt-4 text-5xl font-semibold leading-tight text-slate-900">
          Turn a real-world stamp into a reusable transparent asset, then place it on any file.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">
          Upload a phone photo of an existing stamp, extract it to transparent PNG, save it to your library, and drag it onto PDFs or images in seconds. Start with one-time checkout, then upgrade to Pro if this becomes a repeat workflow.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/workspace" className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white">Open workspace</Link>
          <Link href="/pricing" className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700">See pricing</Link>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="grid gap-4">
          {[
            ["1", "Upload a stamped paper photo"],
            ["2", "Extract the stamp to transparent PNG"],
            ["3", "Drag it onto a new PDF or image"],
            ["4", "Export once or switch to Pro for repeat use"]
          ].map(([num, text]) => (
            <div key={num} className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">{num}</div>
              <p className="pt-2 text-slate-700">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
