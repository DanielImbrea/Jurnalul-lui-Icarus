import { NextRequest, NextResponse } from "next/server";
import { AUTHOR_NAME } from "@/lib/products";
import { prisma } from "@/lib/db";
import { adminCommunityReplySchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";

interface RouteContext {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const parent = await prisma.communityPost.findUnique({
      where: { id: params.id }
    });

    if (!parent) {
      return NextResponse.json({ error: "Mesajul nu există." }, { status: 404 });
    }

    const body = await req.json();
    const parsed = adminCommunityReplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const reply = await prisma.communityPost.create({
      data: {
        parentId: parent.parentId ?? parent.id,
        name: AUTHOR_NAME,
        content: sanitizeText(parsed.data.content),
        status: "APPROVED",
        isAuthorReply: true,
        consentGiven: true
      }
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.error("Eroare răspuns autor comunitate:", error);
    return NextResponse.json(
      { error: "Nu am putut publica răspunsul." },
      { status: 500 }
    );
  }
}
