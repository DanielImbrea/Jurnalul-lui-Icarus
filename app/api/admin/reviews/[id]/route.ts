import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deleteImage, uploadImage } from "@/lib/upload";
import { adminReviewUpdateSchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const existing = await prisma.review.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Recenzia nu există." }, { status: 404 });
    }

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const removeImage = formData.get("removeImage") === "true";
      const imageFile = formData.get("image");

      const updateData: Record<string, unknown> = {};

      const fields = ["name", "bookId", "rating", "content", "socialHandle", "status", "featured", "verifiedPurchase"] as const;
      for (const field of fields) {
        const value = formData.get(field);
        if (value !== null && value !== "") {
          updateData[field] = field === "rating" || field === "featured" || field === "verifiedPurchase"
            ? field === "rating" ? Number(value) : value === "true"
            : String(value);
        }
      }

      if (removeImage && existing.imageUrl) {
        await deleteImage(existing.imageUrl);
        updateData.imageUrl = null;
      }

      if (imageFile instanceof File && imageFile.size > 0) {
        if (existing.imageUrl) await deleteImage(existing.imageUrl);
        updateData.imageUrl = await uploadImage(imageFile, "reviews");
      }

      const review = await prisma.review.update({
        where: { id: params.id },
        data: {
          ...updateData,
          name: updateData.name ? sanitizeText(String(updateData.name)) : undefined,
          content: updateData.content ? sanitizeText(String(updateData.content)) : undefined,
          socialHandle: updateData.socialHandle === null || updateData.socialHandle === ""
            ? null
            : updateData.socialHandle
              ? sanitizeText(String(updateData.socialHandle))
              : undefined
        }
      });

      return NextResponse.json(review);
    }

    const body = await req.json();
    const parsed = adminReviewUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const review = await prisma.review.update({
      where: { id: params.id },
      data: {
        name: data.name ? sanitizeText(data.name) : undefined,
        bookId: data.bookId,
        rating: data.rating,
        content: data.content ? sanitizeText(data.content) : undefined,
        socialHandle: data.socialHandle,
        status: data.status,
        featured: data.featured,
        verifiedPurchase: data.verifiedPurchase,
        ...(data.removeImage && existing.imageUrl
          ? { imageUrl: null }
          : {})
      }
    });

    if (data.removeImage && existing.imageUrl) {
      await deleteImage(existing.imageUrl);
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Eroare update review:", error);
    return NextResponse.json({ error: "Nu am putut actualiza recenzia." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const existing = await prisma.review.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Recenzia nu există." }, { status: 404 });
  }

  if (existing.imageUrl) {
    await deleteImage(existing.imageUrl);
  }

  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
