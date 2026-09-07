import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { uploadImage } from "@/lib/upload";
import { gallerySubmitSchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`gallery:${ip}`, { windowMs: 60_000, max: 3 });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Prea multe încercări. Încearcă din nou peste câteva minute." },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const raw = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      bookId: String(formData.get("bookId") ?? ""),
      caption: String(formData.get("caption") ?? ""),
      consentGiven: formData.get("consentGiven") === "true"
    };

    const parsed = gallerySubmitSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const imageFile = formData.get("image");
    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Fotografia este obligatorie." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const imageUrl = await uploadImage(imageFile, "gallery");

    await prisma.readerGalleryPhoto.create({
      data: {
        bookId: data.bookId,
        name: sanitizeText(data.name),
        email: data.email ? data.email.toLowerCase() : null,
        imageUrl,
        caption: data.caption ? sanitizeText(data.caption) : null,
        status: "PENDING"
      }
    });

    return NextResponse.json({
      success: true,
      message:
        "Am primit fotografia. O voi vedea personal înainte de a o publica în galerie."
    });
  } catch (error) {
    console.error("Eroare la trimiterea fotografiei:", error);

    const message =
      error instanceof Error ? error.message.toLowerCase() : "";

    if (message.includes("bucket not found")) {
      return NextResponse.json(
        {
          error:
            "Storage-ul nu este configurat încă. Contactează administratorul site-ului."
        },
        { status: 503 }
      );
    }

    if (message.includes("payload too large") || message.includes("file size")) {
      return NextResponse.json(
        { error: "Fotografia nu poate depăși 5 MB." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Nu am putut trimite fotografia. Încearcă din nou." },
      { status: 500 }
    );
  }
}
