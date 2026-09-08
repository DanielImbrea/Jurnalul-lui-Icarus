import { NextRequest, NextResponse } from "next/server";
import {
  getAdminCommunityPosts,
  type CommunityPostStatus
} from "@/lib/community-posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get(
      "status"
    ) as CommunityPostStatus | null;
    const posts = await getAdminCommunityPosts(status || undefined);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Eroare listare mesaje comunitate admin:", error);
    return NextResponse.json(
      { error: "Nu am putut încărca mesajele." },
      { status: 500 }
    );
  }
}
