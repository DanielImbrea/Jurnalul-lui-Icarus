import { prisma } from "@/lib/db";
import type { BookId } from "@/lib/validation";

export type GalleryStatus =
  | "PENDING"
  | "APPROVED"
  | "HIDDEN"
  | "REJECTED";

export async function getApprovedGalleryPhotos(limit = 24) {
  return prisma.readerGalleryPhoto.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: {
      id: true,
      bookId: true,
      name: true,
      imageUrl: true,
      caption: true,
      featured: true,
      createdAt: true
    }
  });
}

export async function getAdminGalleryPhotos(status?: GalleryStatus) {
  return prisma.readerGalleryPhoto.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { review: true }
  });
}

export async function getFeaturedGalleryPhotos(limit = 1) {
  return prisma.readerGalleryPhoto.findMany({
    where: { status: "APPROVED", featured: true },
    orderBy: { updatedAt: "desc" },
    take: limit
  });
}
