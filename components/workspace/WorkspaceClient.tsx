"use client";

import { useEffect, useState } from "react";
import { SealTemplate, SealConfig, SavedStamp } from "@/lib/types";
import { renderSealSvg } from "@/lib/renderSeal";
import { BuilderPanel } from "@/components/workspace/BuilderPanel";
import { ExtractorPanel } from "@/components/workspace/ExtractorPanel";
import { AssetLibrary } from "@/components/workspace/AssetLibrary";
import { DocumentStamper } from "@/components/workspace/DocumentStamper";

function svgToDataUrl(svg: string) {
  if (typeof window === "undefined") return "";
  return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`;
}

export function WorkspaceClient({ templates }: { templates: SealTemplate[] }) {
  const [templateId, setTemplateId] = useState(templates[0]?.id || "");
  const [config, setConfig] = useState<SealConfig>(templates[0].config);
  const [assets, setAssets] = useState<SavedStamp[]>([]);
  const [selectedStamp, setSelectedStamp] = useState<string>("");

  useEffect(() => {
    if (!selectedStamp) {
      setSelectedStamp(svgToDataUrl(renderSealSvg({ ...templates[0].config, watermark: false })));
    }
  }, [selectedStamp, templates]);

  function handleTemplateChange(nextId: string) {
    const found = templates.find((item) => item.id === nextId) || templates[0];
    setTemplateId(found.id);
    setConfig(found.config);
    setSelectedStamp(svgToDataUrl(renderSealSvg({ ...found.config, watermark: false })));
  }

  function handleConfigChange(next: SealConfig) {
    setConfig(next);
    setSelectedStamp(svgToDataUrl(renderSealSvg({ ...next, watermark: false })));
  }

  function pushAsset(asset: SavedStamp | { name: string; imagePath: string; sourceType: string }) {
    const normalized = {
      id: crypto.randomUUID(),
      name: asset.name,
      imagePath: asset.imagePath,
      sourceType: asset.sourceType
    };
    setAssets((prev) => [normalized, ...prev]);
    setSelectedStamp(normalized.imagePath);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="space-y-6">
        <BuilderPanel
          templates={templates}
          templateId={templateId}
          config={config}
          onTemplateChange={handleTemplateChange}
          onConfigChange={handleConfigChange}
          onSaveAsset={pushAsset}
        />

        <ExtractorPanel onUseStamp={(dataUrl) => setSelectedStamp(dataUrl)} onSaveAsset={pushAsset} />

        <AssetLibrary assets={assets} selectedStamp={selectedStamp} onSelectStamp={setSelectedStamp} />
      </div>

      <DocumentStamper selectedStamp={selectedStamp} />
    </div>
  );
}
