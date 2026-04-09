"use client";

import { ChangeEvent } from "react";
import { SealConfig, SealTemplate } from "@/lib/types";
import { renderSealSvg } from "@/lib/renderSeal";

function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`;
}

export function BuilderPanel({
  templates,
  templateId,
  config,
  onTemplateChange,
  onConfigChange,
  onSaveAsset
}: {
  templates: SealTemplate[];
  templateId: string;
  config: SealConfig;
  onTemplateChange: (id: string) => void;
  onConfigChange: (config: SealConfig) => void;
  onSaveAsset: (asset: { name: string; imagePath: string; sourceType: string }) => void;
}) {
  function update<K extends keyof SealConfig>(key: K, value: SealConfig[K]) {
    onConfigChange({ ...config, [key]: value });
  }

  function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("logoDataUrl", String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  const svg = renderSealSvg({ ...config, watermark: false });
  const dataUrl = svgToDataUrl(svg);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">make a stamp</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Generate a clean transparent stamp</h2>
        </div>
        <button
          type="button"
          onClick={() => onSaveAsset({ name: config.title || config.primaryText, imagePath: dataUrl, sourceType: "generated" })}
          className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Save to library
        </button>
      </div>

      <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4" dangerouslySetInnerHTML={{ __html: svg }} />

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-600">Template</span>
          <select value={templateId} onChange={(e) => onTemplateChange(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3">
            {templates.map((template) => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-600">Title</span>
          <input value={config.title} onChange={(e) => update("title", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-600">Primary text</span>
          <input value={config.primaryText} onChange={(e) => update("primaryText", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-600">Secondary text</span>
          <input value={config.secondaryText} onChange={(e) => update("secondaryText", e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-600">Center text</span>
          <textarea value={config.centerText} onChange={(e) => update("centerText", e.target.value)} className="min-h-[90px] w-full rounded-2xl border border-slate-300 px-4 py-3" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-600">Color</span>
            <input type="color" value={config.color} onChange={(e) => update("color", e.target.value)} className="h-12 w-full rounded-2xl border border-slate-300 p-2" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-600">Border</span>
            <input type="range" min={6} max={28} step={1} value={config.borderWidth} onChange={(e) => update("borderWidth", Number(e.target.value))} className="mt-4 w-full" />
            <p className="text-xs text-slate-500">{config.borderWidth}px</p>
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-600">Logo</span>
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full rounded-2xl border border-slate-300 p-3" />
        </label>
      </div>
    </div>
  );
}
