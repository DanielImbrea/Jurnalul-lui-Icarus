import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`newsletter:${ip}`, { windowMs: 60_000, max: 5 });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Prea multe încercări. Încearcă din nou peste câteva minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Email invalid." },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      create: { email: parsed.data.email.toLowerCase() },
      update: { active: true }
    });

    return NextResponse.json({
      success: true,
      message: "Ești aproape. Te vom ține la curent, discret."
    });
  } catch (error) {
    console.error("Eroare newsletter:", error);
    return NextResponse.json(
      { error: "Nu am putut procesa abonarea." },
      { status: 500 }
    );
  }
}
