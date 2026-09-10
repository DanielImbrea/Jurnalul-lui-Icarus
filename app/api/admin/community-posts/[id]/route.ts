import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminCommunityPostUpdateSchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const existing = await prisma.communityPost.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json({ error: "Mesajul nu există." }, { status: 404 });
    }

    const body = await req.json();
    const parsed = adminCommunityPostUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.emailApproved === true && !existing.emailConsentGiven) {
      return NextResponse.json(
        { error: "Cititorul nu a acceptat publicarea emailului." },
        { status: 400 }
      );
    }

    const post = await prisma.communityPost.update({
      where: { id: params.id },
      data: {
        name: data.name ? sanitizeText(data.name) : undefined,
        content: data.content ? sanitizeText(data.content) : undefined,
        status: data.status,
        emailApproved: data.emailApproved,
        createdAt: data.createdAt
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Eroare update mesaj comunitate:", error);
    return NextResponse.json(
      { error: "Nu am putut actualiza mesajul." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const existing = await prisma.communityPost.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json({ error: "Mesajul nu există." }, { status: 404 });
    }

    await prisma.communityPost.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Eroare ștergere mesaj comunitate:", error);
    return NextResponse.json(
      { error: "Nu am putut șterge mesajul." },
      { status: 500 }
    );
  }
}
