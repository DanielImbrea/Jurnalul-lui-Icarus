import { NextRequest, NextResponse } from "next/server";
import { getApprovedCommunityThreads } from "@/lib/community-posts";
import { getPrismaErrorCode, isDbConnectionError, prisma } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { communityPostSubmitSchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const threads = await getApprovedCommunityThreads();
    return NextResponse.json(threads);
  } catch (error) {
    console.error("Eroare listare comunitate:", error);
    return NextResponse.json(
      { error: "Nu am putut încărca mesajele." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`community:${ip}`, { windowMs: 60_000, max: 5 });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Prea multe încercări. Încearcă din nou peste câteva minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = communityPostSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const parentId = data.parentId?.trim() || null;

    if (parentId) {
      const parent = await prisma.communityPost.findFirst({
        where: { id: parentId, parentId: null, status: "APPROVED" }
      });

      if (!parent) {
        return NextResponse.json(
          { error: "Conversația nu există sau nu este publică." },
          { status: 400 }
        );
      }
    }

    await prisma.communityPost.create({
      data: {
        name: sanitizeText(data.name),
        email: data.email.toLowerCase(),
        content: sanitizeText(data.content),
        parentId,
        consentGiven: true,
        status: "PENDING"
      }
    });

    return NextResponse.json({
      success: true,
      message: parentId
        ? "Mulțumesc — răspunsul tău va apărea după moderare."
        : "Mulțumesc că ai lăsat ceva din tine aici. Mesajul va apărea după moderare."
    });
  } catch (error) {
    console.error("Eroare trimitere mesaj comunitate:", error);

    const prismaCode = getPrismaErrorCode(error);

    if (isDbConnectionError(error)) {
      return NextResponse.json(
        {
          error:
            "Serverul nu poate contacta baza de date momentan. Încearcă din nou peste câteva minute."
        },
        { status: 503 }
      );
    }

    if (prismaCode === "P2021") {
      return NextResponse.json(
        {
          error:
            "Spațiul de comunitate nu este configurat încă pe server. Contactează administratorul site-ului."
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Nu am putut trimite mesajul. Încearcă din nou." },
      { status: 500 }
    );
  }
}
