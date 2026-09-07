import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminQuotes } from "@/lib/content";
import { adminQuoteSchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const quotes = await getAdminQuotes();
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adminQuoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const quote = await prisma.quote.create({
      data: {
        bookId: data.bookId ?? null,
        content: sanitizeText(data.content),
        source: data.source ? sanitizeText(data.source) : null,
        featured: data.featured ?? false,
        status: data.status ?? "DRAFT",
        sortOrder: data.sortOrder ?? 0
      }
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("Eroare creare citat:", error);
    return NextResponse.json({ error: "Nu am putut crea citatul." }, { status: 500 });
  }
}
