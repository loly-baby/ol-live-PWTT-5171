import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveBufferToPublic } from "@/lib/server/storage";

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!match) throw new Error("Invalid data URL");
  return { mime: match[1], buffer: Buffer.from(match[2], "base64") };
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email") || undefined;
  const items = await prisma.stampAsset.findMany({
    where: email ? { email } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, imageDataUrl, email, sourceType = "generated", meta } = body;

  if (!name || !imageDataUrl) {
    return NextResponse.json({ error: "name and imageDataUrl are required" }, { status: 400 });
  }

  const { mime, buffer } = parseDataUrl(imageDataUrl);
  const ext = mime.includes("svg") ? "svg" : "png";
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const imagePath = await saveBufferToPublic("stamp-assets", fileName, buffer);

  const asset = await prisma.stampAsset.create({
    data: {
      name,
      email: email || undefined,
      sourceType,
      imagePath,
      previewPath: imagePath,
      metaJson: meta || undefined
    }
  });

  return NextResponse.json(asset);
}
