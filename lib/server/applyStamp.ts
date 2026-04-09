import sharp from "sharp";
import { PDFDocument, degrees } from "pdf-lib";
import { StampPlacement } from "@/lib/types";

type ResolvedPlacement = StampPlacement & { stampBuffer: Buffer };

async function renderStampBuffer(buffer: Buffer, placement: ResolvedPlacement, docWidth: number, docHeight: number) {
  const stampMeta = await sharp(buffer).metadata();
  const stampAspect = (stampMeta.width || 1) / (stampMeta.height || 1);
  const width = Math.max(1, Math.round((placement.width / placement.previewWidth) * docWidth));
  const height = Math.max(1, Math.round(width / stampAspect));
  const raw = await sharp(buffer)
    .resize({ width, height })
    .rotate(placement.rotation, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 3; i < raw.data.length; i += 4) {
    raw.data[i] = Math.round(raw.data[i] * Math.max(0.1, Math.min(1, placement.opacity)));
  }

  return {
    input: raw.data,
    left: Math.max(0, Math.round((placement.x / placement.previewWidth) * docWidth)),
    top: Math.max(0, Math.round((placement.y / placement.previewHeight) * docHeight)),
    raw: { width: raw.info.width, height: raw.info.height, channels: raw.info.channels }
  };
}

export async function applyStampToImage(documentBuffer: Buffer, placements: ResolvedPlacement[]) {
  const docMeta = await sharp(documentBuffer).metadata();
  const docWidth = docMeta.width || 1;
  const docHeight = docMeta.height || 1;
  const composites = await Promise.all(placements.map((placement) => renderStampBuffer(placement.stampBuffer, placement, docWidth, docHeight)));
  return sharp(documentBuffer).composite(composites as any).png().toBuffer();
}

export async function applyStampToPdf(documentBuffer: Buffer, placements: ResolvedPlacement[]) {
  const pdfDoc = await PDFDocument.load(documentBuffer);

  for (const placement of placements) {
    const page = pdfDoc.getPage(Math.max(0, placement.page - 1));
    if (!page) continue;
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const stampImage = await pdfDoc.embedPng(placement.stampBuffer);
    const aspect = stampImage.width / stampImage.height;

    const targetWidth = (placement.width / placement.previewWidth) * pageWidth;
    const targetHeight = targetWidth / aspect;
    const targetX = (placement.x / placement.previewWidth) * pageWidth;
    const targetYTop = (placement.y / placement.previewHeight) * pageHeight;
    const targetY = pageHeight - targetYTop - targetHeight;

    page.drawImage(stampImage, {
      x: targetX,
      y: targetY,
      width: targetWidth,
      height: targetHeight,
      rotate: degrees(placement.rotation),
      opacity: Math.max(0.1, Math.min(1, placement.opacity))
    });
  }

  return Buffer.from(await pdfDoc.save());
}
