import { NextResponse } from "next/server";
import { SEAL_TEMPLATES } from "@/lib/templates";

export async function GET() {
  return NextResponse.json({ templates: SEAL_TEMPLATES });
}
