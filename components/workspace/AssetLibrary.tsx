"use client";

import { SavedStamp } from "@/lib/types";

export function AssetLibrary({
  assets,
  selectedStamp,
  onSelectStamp
}: {
  assets: SavedStamp[];
  selectedStamp: string;
  onSelectStamp: (imagePath: string) => void;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">stamp library</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">Reuse generated and extracted stamps</h2>

      <div className="mt-5 grid gap-3">
        {assets.length ? (
          assets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => onSelectStamp(asset.imagePath)}
              className={`flex items-center gap-3 rounded-2xl border p-3 text-left ${selectedStamp === asset.imagePath ? "border-slate-900 bg-slate-50" : "border-slate-200"}`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[radial-gradient(circle,_#e2e8f0_1px,_transparent_1px)] [background-size:10px_10px]">
                <img src={asset.imagePath} alt={asset.name} className="max-h-14 max-w-14" />
              </div>
              <div>
                <p className="font-medium text-slate-900">{asset.name}</p>
                <p className="text-sm text-slate-500">{asset.sourceType}</p>
              </div>
            </button>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            Your current-session stamp library is empty. Save a generated or extracted stamp here to reuse it instantly.
          </p>
        )}
      </div>
    </div>
  );
}
