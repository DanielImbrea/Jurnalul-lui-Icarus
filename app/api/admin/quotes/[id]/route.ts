import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminQuoteSchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const body = await req.json();
    const parsed = adminQuoteSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        bookId: data.bookId,
        content: data.content ? sanitizeText(data.content) : undefined,
        source: data.source,
        featured: data.featured,
        status: data.status,
        sortOrder: data.sortOrder
      }
    });

    return NextResponse.json(quote);
  } catch {
    return NextResponse.json({ error: "Citatul nu există." }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  await prisma.quote.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
