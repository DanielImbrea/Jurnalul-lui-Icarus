import { NextRequest, NextResponse } from "next/server";
import { getAdminGalleryPhotos } from "@/lib/gallery";
import type { GalleryStatus } from "@/lib/gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status") as GalleryStatus | null;
    const photos = await getAdminGalleryPhotos(status || undefined);
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Eroare listare galerie admin:", error);
    return NextResponse.json(
      { error: "Nu am putut încărca fotografiile." },
      { status: 500 }
    );
  }
}
