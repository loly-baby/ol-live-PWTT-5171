import { NextRequest, NextResponse } from "next/server";
import { applyStampToImage, applyStampToPdf } from "@/lib/server/applyStamp";
import { StampPlacement } from "@/lib/types";

function parseDataUrl(dataUrl: string) {
  const base64Match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (base64Match) {
    return { mime: base64Match[1], buffer: Buffer.from(base64Match[2], "base64") };
  }

  const utf8Match = dataUrl.match(/^data:(.*?),(.*)$/);
  if (utf8Match) {
    return { mime: utf8Match[1], buffer: Buffer.from(decodeURIComponent(utf8Match[2]), "utf8") };
  }

  throw new Error("Invalid data URL");
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const placementsRaw = formData.get("placements");

  if (!(file instanceof File) || typeof placementsRaw !== "string") {
    return NextResponse.json({ error: "Missing file or placements" }, { status: 400 });
  }

  const placements = JSON.parse(placementsRaw) as StampPlacement[];
  if (!placements.length) {
    return NextResponse.json({ error: "At least one stamp placement is required" }, { status: 400 });
  }

  const documentBuffer = Buffer.from(await file.arrayBuffer());
  const resolved = placements.map((placement) => {
    const { buffer: stampBuffer } = parseDataUrl(placement.stampDataUrl);
    return { ...placement, stampBuffer };
  });

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const out = isPdf ? await applyStampToPdf(documentBuffer, resolved) : await applyStampToImage(documentBuffer, resolved);

  return new NextResponse(out, {
    headers: {
      "Content-Type": isPdf ? "application/pdf" : "image/png",
      "Content-Disposition": `attachment; filename="stamped-${file.name.replace(/\.[^.]+$/, isPdf ? ".pdf" : ".png")}"`
    }
  });
}
