import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminEditorialSchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const body = await req.json();
    const parsed = adminEditorialSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const existing = await prisma.editorialPost.findUnique({ where: { id: params.id } });

    const post = await prisma.editorialPost.update({
      where: { id: params.id },
      data: {
        slug: data.slug,
        title: data.title ? sanitizeText(data.title) : undefined,
        excerpt: data.excerpt,
        content: data.content ? sanitizeText(data.content) : undefined,
        imageUrl: data.imageUrl,
        status: data.status,
        featured: data.featured,
        sortOrder: data.sortOrder,
        publishedAt:
          data.status === "PUBLISHED" && !existing?.publishedAt
            ? new Date()
            : undefined
      }
    });

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Articolul nu există." }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  await prisma.editorialPost.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
