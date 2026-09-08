import { NextResponse } from "next/server";
import { countPendingCommunityPosts } from "@/lib/community-posts";
import { getCommunityStats } from "@/lib/reviews";
import { countPendingCodOrders } from "@/lib/orders";
import { prisma, withDbFallback } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [stats, subscribers, pendingOrders, pendingCommunityPosts] =
    await Promise.all([
    getCommunityStats(),
    withDbFallback(
      () => prisma.newsletterSubscriber.count({ where: { active: true } }),
      0
    ),
    withDbFallback(() => countPendingCodOrders(), 0),
    countPendingCommunityPosts()
  ]);

  return NextResponse.json({
    ...stats,
    newsletterSubscribers: subscribers,
    pendingOrders,
    pendingCommunityPosts
  });
}
