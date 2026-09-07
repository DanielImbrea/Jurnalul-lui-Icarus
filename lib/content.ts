import { prisma } from "@/lib/db";
import type { BookId } from "@/lib/validation";

export async function getPublishedQuotes(bookId?: BookId, limit = 6) {
  return prisma.quote.findMany({
    where: {
      status: "PUBLISHED",
      ...(bookId ? { bookId } : {})
    },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: limit
  });
}

export async function getFeaturedQuotes(limit = 3) {
  return prisma.quote.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: limit
  });
}

export async function getAdminQuotes() {
  return prisma.quote.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });
}

export async function getPublishedEditorialPosts(limit = 12) {
  return prisma.editorialPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { publishedAt: "desc" }],
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      imageUrl: true,
      featured: true,
      publishedAt: true
    }
  });
}

export async function getEditorialPostBySlug(slug: string) {
  return prisma.editorialPost.findFirst({
    where: { slug, status: "PUBLISHED" }
  });
}

export async function getAdminEditorialPosts() {
  return prisma.editorialPost.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });
}
