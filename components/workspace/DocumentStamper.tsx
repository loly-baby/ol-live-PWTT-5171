"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import type { StampPlacement } from "@/lib/types";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PREVIEW_WIDTH = 760;

export function DocumentStamper({ selectedStamp }: { selectedStamp: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [placements, setPlacements] = useState<StampPlacement[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewHeight, setPreviewHeight] = useState(980);
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const isPdf = !!file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
  const selectedPlacement = placements.find((item) => item.id === selectedId) || null;

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPlacements([]);
    setSelectedId("");
    setCurrentPage(1);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function addStamp() {
    if (!selectedStamp) return;
    const id = crypto.randomUUID();
    const placement: StampPlacement = {
      id,
      x: PREVIEW_WIDTH / 2 - 90,
      y: previewHeight / 2 - 90,
      width: 180,
      opacity: 0.92,
      rotation: 0,
      page: currentPage,
      previewWidth: PREVIEW_WIDTH,
      previewHeight,
      stampDataUrl: selectedStamp
    };
    setPlacements((prev) => [...prev, placement]);
    setSelectedId(id);
  }

  function updatePlacement(id: string, patch: Partial<StampPlacement>) {
    setPlacements((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch, previewHeight } : item)));
  }

  function removeSelected() {
    if (!selectedId) return;
    setPlacements((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId("");
  }

  async function handleExport() {
    if (!file || !placements.length) return;
    setExporting(true);
    setStatus("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("placements", JSON.stringify(placements));

    try {
      const response = await fetch("/api/export-file", { method: "POST", body: formData });
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Failed to export file");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stamped-${file.name.replace(/\.[^.]+$/, isPdf ? ".pdf" : ".png")}`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("Export complete.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>, id: string) {
    const stage = stageRef.current?.getBoundingClientRect();
    const placement = placements.find((item) => item.id === id);
    if (!stage || !placement) return;
    setSelectedId(id);
    setDragging({ id, offsetX: event.clientX - stage.left - placement.x, offsetY: event.clientY - stage.top - placement.y });
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const stage = stageRef.current?.getBoundingClientRect();
    if (!stage) return;
    updatePlacement(dragging.id, {
      x: Math.max(0, Math.min(PREVIEW_WIDTH - 50, event.clientX - stage.left - dragging.offsetX)),
      y: Math.max(0, Math.min(previewHeight - 50, event.clientY - stage.top - dragging.offsetY))
    });
  }

  function onPointerUp() {
    setDragging(null);
  }

  const visiblePlacements = useMemo(() => placements.filter((item) => item.page === currentPage), [placements, currentPage]);

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">stamp file</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Drag your stamp onto a document</h2>
          <p className="mt-2 text-sm text-slate-600">Upload a PDF or image. Add one or more stamp placements, then export the final file.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addStamp} disabled={!selectedStamp || !previewUrl} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:bg-slate-400">Add stamp</button>
          <button type="button" onClick={removeSelected} disabled={!selectedId} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:text-slate-400">Remove selected</button>
          <button type="button" onClick={handleExport} disabled={!file || !placements.length || exporting} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:text-slate-400">{exporting ? "Exporting..." : "Export stamped file"}</button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-600">Upload document</span>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full rounded-2xl border border-slate-300 p-3" />
          </label>

          {isPdf ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">PDF page</p>
              <div className="mt-3 flex items-center gap-2">
                <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="rounded-xl border border-slate-300 px-3 py-2 text-xs disabled:text-slate-400">Prev</button>
                <span className="text-sm text-slate-600">{currentPage} / {pageCount}</span>
                <button type="button" disabled={currentPage >= pageCount} onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))} className="rounded-xl border border-slate-300 px-3 py-2 text-xs disabled:text-slate-400">Next</button>
              </div>
            </div>
          ) : null}

          {selectedPlacement ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Selected stamp</p>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs text-slate-500">Size</span>
                  <input type="range" min={80} max={420} value={selectedPlacement.width} onChange={(e) => updatePlacement(selectedPlacement.id, { width: Number(e.target.value) })} className="w-full" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs text-slate-500">Opacity</span>
                  <input type="range" min={0.1} max={1} step={0.02} value={selectedPlacement.opacity} onChange={(e) => updatePlacement(selectedPlacement.id, { opacity: Number(e.target.value) })} className="w-full" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs text-slate-500">Rotation</span>
                  <input type="range" min={-45} max={45} step={1} value={selectedPlacement.rotation} onChange={(e) => updatePlacement(selectedPlacement.id, { rotation: Number(e.target.value) })} className="w-full" />
                </label>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">Upload a document and click “Add stamp”, then drag it to any position.</div>
          )}

          {status ? <p className="text-sm text-slate-600">{status}</p> : null}
        </div>

        <div className="overflow-auto rounded-[28px] border border-slate-200 bg-slate-100 p-4">
          <div
            ref={stageRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="relative mx-auto touch-none overflow-hidden rounded-2xl bg-white shadow-soft"
            style={{ width: PREVIEW_WIDTH, height: previewHeight }}
          >
            {previewUrl ? (
              isPdf ? (
                <Document file={previewUrl} onLoadSuccess={({ numPages }) => setPageCount(numPages)} loading={<div className="p-10 text-sm text-slate-500">Loading PDF...</div>}>
                  <Page
                    pageNumber={currentPage}
                    width={PREVIEW_WIDTH}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onLoadSuccess={(page) => {
                      const ratio = page.height / page.width;
                      setPreviewHeight(Math.round(PREVIEW_WIDTH * ratio));
                    }}
                  />
                </Document>
              ) : (
                <img
                  src={previewUrl}
                  alt="Document preview"
                  className="h-full w-full object-contain"
                  onLoad={(event) => {
                    const img = event.currentTarget;
                    const ratio = img.naturalHeight / img.naturalWidth;
                    setPreviewHeight(Math.round(PREVIEW_WIDTH * ratio));
                  }}
                />
              )
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Your document preview appears here.</div>
            )}

            {visiblePlacements.map((placement) => (
              <div
                key={placement.id}
                onPointerDown={(event) => onPointerDown(event, placement.id)}
                className={`absolute cursor-move select-none ${placement.id === selectedId ? "ring-2 ring-slate-900" : ""}`}
                style={{ left: placement.x, top: placement.y, width: placement.width, opacity: placement.opacity, transform: `rotate(${placement.rotation}deg)` }}
              >
                <img src={placement.stampDataUrl} alt="Stamp placement" draggable={false} className="w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
