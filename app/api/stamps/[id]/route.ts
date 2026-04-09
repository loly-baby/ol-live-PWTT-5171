import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.stampAsset.findUnique({ where: { id } });

  if (!asset) {
    return NextResponse.json({ error: "Stamp not found" }, { status: 404 });
  }

  return NextResponse.json(asset);
}
