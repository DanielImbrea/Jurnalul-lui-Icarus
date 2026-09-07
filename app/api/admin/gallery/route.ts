import { NextRequest, NextResponse } from "next/server";
import { getAdminGalleryPhotos } from "@/lib/gallery";
import type { GalleryStatus } from "@/lib/gallery";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") as GalleryStatus | null;
  const photos = await getAdminGalleryPhotos(status || undefined);
  return NextResponse.json(photos);
}
