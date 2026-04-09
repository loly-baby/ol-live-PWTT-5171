import { WorkspaceClient } from "@/components/workspace/WorkspaceClient";
import { SEAL_TEMPLATES } from "@/lib/templates";

export default function WorkspacePage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">workspace</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Digitize a real stamp, then place it on any file.</h1>
        <p className="mt-4 text-lg text-slate-600">
          Create a new stamp or extract one from a phone photo, then drag it onto a PDF or image and export the final file.
        </p>
      </div>

      <div className="mt-10">
        <WorkspaceClient templates={SEAL_TEMPLATES} />
      </div>
    </section>
  );
}
