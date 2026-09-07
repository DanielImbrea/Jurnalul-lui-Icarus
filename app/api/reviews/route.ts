import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { findVerifiedOrderForBook } from "@/lib/orders";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { uploadImage } from "@/lib/upload";
import {
  reviewSubmitSchema,
  sanitizeText,
  type BookId
} from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`review:${ip}`, { windowMs: 60_000, max: 3 });

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
      rating: formData.get("rating"),
      content: String(formData.get("content") ?? ""),
      socialHandle: String(formData.get("socialHandle") ?? ""),
      consentGiven: formData.get("consentGiven") === "true"
    };

    const parsed = reviewSubmitSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    let imageUrl: string | undefined;

    const imageFile = formData.get("image");
    if (imageFile instanceof File && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile, "reviews");
    }

    const verified = await findVerifiedOrderForBook(
      data.email,
      data.bookId as BookId
    );

    const review = await prisma.review.create({
      data: {
        name: sanitizeText(data.name),
        email: data.email.toLowerCase(),
        bookId: data.bookId,
        rating: data.rating,
        content: sanitizeText(data.content),
        socialHandle: data.socialHandle
          ? sanitizeText(data.socialHandle)
          : null,
        imageUrl,
        consentGiven: true,
        status: "PENDING",
        verifiedPurchase: !!verified,
        orderId: verified?.orderId ?? null
      }
    });

    if (imageUrl) {
      await prisma.readerGalleryPhoto.create({
        data: {
          reviewId: review.id,
          bookId: data.bookId,
          name: sanitizeText(data.name),
          email: data.email.toLowerCase(),
          imageUrl,
          caption: sanitizeText(data.content).slice(0, 300),
          status: "PENDING"
        }
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Mulțumim că ai lăsat o parte din povestea ta aici. Recenzia va fi verificată înainte de publicare."
    });
  } catch (error) {
    console.error("Eroare la trimiterea recenziei:", error);
    return NextResponse.json(
      { error: "Nu am putut trimite recenzia. Încearcă din nou." },
      { status: 500 }
    );
  }
}
