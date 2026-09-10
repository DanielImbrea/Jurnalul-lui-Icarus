import type { ReviewDisplay } from "@/components/reviews/ReviewCard";
import { prisma, withDbFallback } from "@/lib/db";
import { products } from "@/lib/products";
import type { BookId } from "@/lib/validation";

export type ReviewRecord = {
  id: string;
  bookId: string;
  name: string;
  rating: number;
  content: string;
  imageUrl?: string | null;
  verifiedPurchase?: boolean;
  featured?: boolean;
};

function bookTitleForReview(bookId: string) {
  if (bookId === "blake" || bookId === "durere") {
    return products[bookId].title;
  }
  return undefined;
}

export function toReviewDisplay(review: ReviewRecord): ReviewDisplay {
  return {
    id: review.id,
    name: review.name,
    rating: review.rating,
    content: review.content,
    imageUrl: review.imageUrl,
    verifiedPurchase: review.verifiedPurchase,
    featured: review.featured,
    bookTitle: bookTitleForReview(review.bookId)
  };
}

export function toReviewDisplays(reviews: ReviewRecord[]): ReviewDisplay[] {
  return reviews.map(toReviewDisplay);
}

export type ReviewStatus =
  | "PENDING"
  | "APPROVED"
  | "HIDDEN"
  | "REJECTED";

export async function getApprovedReviewsForBook(
  bookId: BookId,
  { limit = 10, featuredOnly = false }: { limit?: number; featuredOnly?: boolean } = {}
) {
  return withDbFallback(
    () =>
      prisma.review.findMany({
        where: {
          bookId,
          status: "APPROVED",
          ...(featuredOnly ? { featured: true } : {})
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: limit,
        select: {
          id: true,
          bookId: true,
          name: true,
          rating: true,
          content: true,
          imageUrl: true,
          socialHandle: true,
          featured: true,
          verifiedPurchase: true,
          createdAt: true
        }
      }),
    []
  );
}

export async function getBookReviewStats(bookId: BookId) {
  return withDbFallback(
    async () => {
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
    },
    { averageRating: null, count: 0 }
  );
}

export async function getFeaturedReviews(limit = 3) {
  return withDbFallback(
    () =>
      prisma.review.findMany({
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
      }),
    []
  );
}

export async function getHomepageReviews(limit = 4) {
  return withDbFallback(
    () =>
      prisma.review.findMany({
        where: { status: "APPROVED" },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: limit,
        select: {
          id: true,
          bookId: true,
          name: true,
          rating: true,
          content: true,
          imageUrl: true,
          verifiedPurchase: true,
          featured: true,
          createdAt: true
        }
      }),
    []
  );
}

const EMPTY_COMMUNITY_STATS = {
  totalReviews: 0,
  pendingReviews: 0,
  featuredReviews: 0,
  averageRating: null as number | null,
  totalPhotos: 0,
  pendingPhotos: 0
};

export async function getCommunityStats() {
  return withDbFallback(async () => {
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
  }, EMPTY_COMMUNITY_STATS);
}

export async function getAllApprovedReviews(bookId?: BookId) {
  return withDbFallback(
    () =>
      prisma.review.findMany({
        where: {
          status: "APPROVED",
          ...(bookId ? { bookId } : {})
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          bookId: true,
          name: true,
          rating: true,
          content: true,
          imageUrl: true,
          verifiedPurchase: true,
          featured: true,
          createdAt: true
        }
      }),
    []
  );
}

export async function getAdminReviews(status?: ReviewStatus) {
  return withDbFallback(
    () =>
      prisma.review.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
        include: { order: true }
      }),
    []
  );
}
