import sharp from "sharp";

type ExtractOptions = {
  mode: "auto" | "red" | "blue";
  threshold: number;
  cleanup: number;
};

function shouldKeep(r: number, g: number, b: number, mode: ExtractOptions["mode"], threshold: number) {
  const brightness = (r + g + b) / 3;
  if (brightness > 252) return 0;

  const redScore = r - Math.max(g, b);
  const blueScore = b - Math.max(r, g);

  if (mode === "red") return redScore > threshold ? Math.min(255, 120 + redScore * 4) : 0;
  if (mode === "blue") return blueScore > threshold ? Math.min(255, 120 + blueScore * 4) : 0;

  const score = Math.max(redScore, blueScore);
  return score > threshold ? Math.min(255, 120 + score * 4) : 0;
}

export async function extractTransparentStamp(input: Buffer, options: ExtractOptions) {
  const image = sharp(input).rotate();
  const metadata = await image.metadata();
  const { width = 0, height = 0 } = metadata;
  const raw = await image.ensureAlpha().raw().toBuffer();
  const output = Buffer.alloc(raw.length);

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let kept = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (y * width + x) * 4;
      const r = raw[idx];
      const g = raw[idx + 1];
      const b = raw[idx + 2];
      const a = raw[idx + 3];
      const keepAlpha = shouldKeep(r, g, b, options.mode, options.threshold);

      if (keepAlpha > 0 && a > 0) {
        output[idx] = r;
        output[idx + 1] = g;
        output[idx + 2] = b;
        output[idx + 3] = keepAlpha;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        kept += 1;
      } else {
        output[idx] = 0;
        output[idx + 1] = 0;
        output[idx + 2] = 0;
        output[idx + 3] = 0;
      }
    }
  }

  const transparent = sharp(output, { raw: { width, height, channels: 4 } });
  const padded = 24;

  if (!kept) {
    return { buffer: await transparent.png().toBuffer(), bbox: null };
  }

  const left = Math.max(0, minX - padded);
  const top = Math.max(0, minY - padded);
  const cropWidth = Math.min(width - left, maxX - minX + padded * 2);
  const cropHeight = Math.min(height - top, maxY - minY + padded * 2);

  let pipeline = transparent.extract({ left, top, width: cropWidth, height: cropHeight });

  if (options.cleanup > 0) {
    pipeline = pipeline.median(Math.max(1, Math.min(5, options.cleanup)));
  }

  const buffer = await pipeline.png().toBuffer();
  return {
    buffer,
    bbox: { left, top, width: cropWidth, height: cropHeight }
  };
}
