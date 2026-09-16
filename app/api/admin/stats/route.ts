import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/admin/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getAdminStats());
}
