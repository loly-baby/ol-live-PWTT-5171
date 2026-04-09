import { NextRequest, NextResponse } from "next/server";
import { extractTransparentStamp } from "@/lib/server/extractStamp";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const mode = (formData.get("mode") as string) || "auto";
  const threshold = Number(formData.get("threshold") || 24);
  const cleanup = Number(formData.get("cleanup") || 1);

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing uploaded image" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { buffer: out, bbox } = await extractTransparentStamp(buffer, {
    mode: mode === "red" || mode === "blue" ? mode : "auto",
    threshold,
    cleanup
  });

  return NextResponse.json({
    dataUrl: `data:image/png;base64,${out.toString("base64")}`,
    bbox
  });
}
