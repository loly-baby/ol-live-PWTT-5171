import fs from "fs/promises";
import path from "path";

export const publicDir = path.join(process.cwd(), "public");
export const uploadsDir = path.join(publicDir, "uploads");
export const assetsDir = path.join(publicDir, "stamp-assets");

export async function ensureDirs() {
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(assetsDir, { recursive: true });
}

export async function saveBufferToPublic(subdir: "uploads" | "stamp-assets", fileName: string, buffer: Buffer) {
  await ensureDirs();
  const dir = subdir === "uploads" ? uploadsDir : assetsDir;
  const absolute = path.join(dir, fileName);
  await fs.writeFile(absolute, buffer);
  return `/${subdir}/${fileName}`;
}
