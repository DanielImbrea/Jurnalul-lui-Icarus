import { NextRequest, NextResponse } from "next/server";
import { getAdminReviews } from "@/lib/reviews";
import type { ReviewStatus } from "@/lib/reviews";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") as ReviewStatus | null;
  const reviews = await getAdminReviews(status || undefined);
  return NextResponse.json(reviews);
}
