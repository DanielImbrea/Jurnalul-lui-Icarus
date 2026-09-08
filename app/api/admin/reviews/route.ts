import { NextRequest, NextResponse } from "next/server";
import { getAdminReviews } from "@/lib/reviews";
import type { ReviewStatus } from "@/lib/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status") as ReviewStatus | null;
    const reviews = await getAdminReviews(status || undefined);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Eroare listare recenzii admin:", error);
    return NextResponse.json(
      { error: "Nu am putut încărca recenziile." },
      { status: 500 }
    );
  }
}
