import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ membership: null });

  const membership = await prisma.membership.findUnique({ where: { email } });
  return NextResponse.json({ membership });
}
