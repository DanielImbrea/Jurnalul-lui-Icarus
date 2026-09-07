import { NextResponse } from "next/server";
import { getCommunityStats } from "@/lib/reviews";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const [stats, subscribers] = await Promise.all([
    getCommunityStats(),
    prisma.newsletterSubscriber.count({ where: { active: true } })
  ]);

  return NextResponse.json({ ...stats, newsletterSubscribers: subscribers });
}
