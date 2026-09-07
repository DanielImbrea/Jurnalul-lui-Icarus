import { NextResponse } from "next/server";
import { getCommunityStats } from "@/lib/reviews";
import { prisma, withDbFallback } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [stats, subscribers] = await Promise.all([
    getCommunityStats(),
    withDbFallback(
      () => prisma.newsletterSubscriber.count({ where: { active: true } }),
      0
    )
  ]);

  return NextResponse.json({ ...stats, newsletterSubscribers: subscribers });
}
