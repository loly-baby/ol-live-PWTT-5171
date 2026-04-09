"use client";

import { useState } from "react";

export function ExtractorPanel({
  onUseStamp,
  onSaveAsset
}: {
  onUseStamp: (dataUrl: string) => void;
  onSaveAsset: (asset: { name: string; imagePath: string; sourceType: string }) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"auto" | "red" | "blue">("auto");
  const [threshold, setThreshold] = useState(24);
  const [cleanup, setCleanup] = useState(1);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleExtract() {
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);
    formData.append("threshold", String(threshold));
    formData.append("cleanup", String(cleanup));

    try {
      const response = await fetch("/api/extract-stamp", { method: "POST", body: formData });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Extraction failed");
      setResult(json.dataUrl);
      onUseStamp(json.dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">extract from photo</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Turn a paper stamp into a transparent digital asset</h2>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-600">Upload a phone photo</span>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full rounded-2xl border border-slate-300 p-3" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-600">Color mode</span>
            <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="w-full rounded-2xl border border-slate-300 px-4 py-3">
              <option value="auto">Auto</option>
              <option value="red">Red stamp</option>
              <option value="blue">Blue stamp</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-600">Threshold</span>
            <input type="range" min={8} max={80} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="mt-4 w-full" />
            <p className="text-xs text-slate-500">{threshold}</p>
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-600">Cleanup</span>
          <input type="range" min={0} max={5} value={cleanup} onChange={(e) => setCleanup(Number(e.target.value))} className="mt-4 w-full" />
          <p className="text-xs text-slate-500">Median cleanup: {cleanup}</p>
        </label>

        <button type="button" onClick={handleExtract} disabled={!file || loading} className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:bg-slate-400">
          {loading ? "Extracting..." : "Extract transparent stamp"}
        </button>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {result ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="rounded-2xl bg-[radial-gradient(circle,_#e2e8f0_1px,_transparent_1px)] [background-size:16px_16px] p-4">
              <img src={result} alt="Extracted stamp" className="mx-auto max-h-56" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => onUseStamp(result)} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Use on document</button>
              <button type="button" onClick={() => onSaveAsset({ name: file?.name.replace(/\.[^.]+$/, "") || "Extracted stamp", imagePath: result, sourceType: "extracted" })} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Save to library</button>
              <a href={result} download="extracted-stamp.png" className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Download PNG</a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
