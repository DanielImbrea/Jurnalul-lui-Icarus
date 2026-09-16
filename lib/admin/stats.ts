import { cache } from "react";
import { countPendingCommunityPosts } from "@/lib/community-posts";
import { getCommunityStats } from "@/lib/reviews";
import { countPendingCodOrders } from "@/lib/orders";
import { prisma, withDbFallback } from "@/lib/db";

export type AdminStats = Awaited<ReturnType<typeof getCommunityStats>> & {
  newsletterSubscribers: number;
  pendingOrders: number;
  pendingCommunityPosts: number;
};

/** Deduped per request — safe to call from layout and page. */
export const getAdminStats = cache(async (): Promise<AdminStats> => {
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

  return {
    ...stats,
    newsletterSubscribers: subscribers,
    pendingOrders,
    pendingCommunityPosts
  };
});
