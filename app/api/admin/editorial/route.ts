import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminEditorialPosts } from "@/lib/content";
import { adminEditorialSchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const posts = await getAdminEditorialPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adminEditorialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const post = await prisma.editorialPost.create({
      data: {
        slug: data.slug,
        title: sanitizeText(data.title),
        excerpt: data.excerpt ? sanitizeText(data.excerpt) : null,
        content: sanitizeText(data.content),
        imageUrl: data.imageUrl ?? null,
        status: data.status ?? "DRAFT",
        featured: data.featured ?? false,
        sortOrder: data.sortOrder ?? 0,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Eroare creare articol:", error);
    return NextResponse.json({ error: "Nu am putut crea articolul." }, { status: 500 });
  }
}
