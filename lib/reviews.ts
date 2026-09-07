import { prisma } from "@/lib/db";
import type { BookId } from "@/lib/validation";

export type ReviewStatus =
  | "PENDING"
  | "APPROVED"
  | "HIDDEN"
  | "REJECTED";

export async function getApprovedReviewsForBook(
  bookId: BookId,
  { limit = 10, featuredOnly = false }: { limit?: number; featuredOnly?: boolean } = {}
) {
  return prisma.review.findMany({
    where: {
      bookId,
      status: "APPROVED",
      ...(featuredOnly ? { featured: true } : {})
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      rating: true,
      content: true,
      imageUrl: true,
      socialHandle: true,
      featured: true,
      verifiedPurchase: true,
      createdAt: true
    }
  });
}

export async function getBookReviewStats(bookId: BookId) {
  const result = await prisma.review.aggregate({
    where: { bookId, status: "APPROVED" },
    _avg: { rating: true },
    _count: { id: true }
  });

  return {
    averageRating: result._avg.rating
      ? Math.round(result._avg.rating * 10) / 10
      : null,
    count: result._count.id
  };
}

export async function getFeaturedReviews(limit = 3) {
  return prisma.review.findMany({
    where: { status: "APPROVED", featured: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      bookId: true,
      name: true,
      rating: true,
      content: true,
      imageUrl: true,
      verifiedPurchase: true,
      createdAt: true
    }
  });
}

export async function getCommunityStats() {
  const [
    totalReviews,
    pendingReviews,
    featuredReviews,
    avgRating,
    totalPhotos,
    pendingPhotos
  ] = await Promise.all([
    prisma.review.count(),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.review.count({ where: { featured: true, status: "APPROVED" } }),
    prisma.review.aggregate({
      where: { status: "APPROVED" },
      _avg: { rating: true }
    }),
    prisma.readerGalleryPhoto.count(),
    prisma.readerGalleryPhoto.count({ where: { status: "PENDING" } })
  ]);

  return {
    totalReviews,
    pendingReviews,
    featuredReviews,
    averageRating: avgRating._avg.rating
      ? Math.round(avgRating._avg.rating * 10) / 10
      : null,
    totalPhotos,
    pendingPhotos
  };
}

export async function getAdminReviews(status?: ReviewStatus) {
  return prisma.review.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { order: true }
  });
}
