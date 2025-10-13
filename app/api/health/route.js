// app/api/health/route.js
import { NextResponse } from "next/server";
import { dbHealth } from "@/lib/db";

export async function GET() {
  const ok = await dbHealth();
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}
