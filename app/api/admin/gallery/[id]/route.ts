import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { deleteImage, uploadImage } from "@/lib/upload";
import { adminGalleryUpdateSchema, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const existing = await prisma.readerGalleryPhoto.findUnique({
      where: { id: params.id }
    });
    if (!existing) {
      return NextResponse.json({ error: "Fotografia nu există." }, { status: 404 });
    }

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const imageFile = formData.get("image");
      const updateData: Record<string, unknown> = {};

      for (const field of ["name", "bookId", "caption", "status", "featured"] as const) {
        const value = formData.get(field);
        if (value !== null && value !== "") {
          updateData[field] = field === "featured" ? value === "true" : String(value);
        }
      }

      if (imageFile instanceof File && imageFile.size > 0) {
        await deleteImage(existing.imageUrl);
        updateData.imageUrl = await uploadImage(imageFile, "gallery");
      }

      const photo = await prisma.readerGalleryPhoto.update({
        where: { id: params.id },
        data: {
          ...updateData,
          name: updateData.name ? sanitizeText(String(updateData.name)) : undefined,
          caption: updateData.caption === "" ? null : updateData.caption ? sanitizeText(String(updateData.caption)) : undefined
        }
      });

      revalidatePath("/galeria-cititorilor");

      return NextResponse.json(photo);
    }

    const body = await req.json();
    const parsed = adminGalleryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Date invalide." },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const photo = await prisma.readerGalleryPhoto.update({
      where: { id: params.id },
      data: {
        name: data.name ? sanitizeText(data.name) : undefined,
        bookId: data.bookId,
        caption: data.caption,
        status: data.status,
        featured: data.featured
      }
    });

    revalidatePath("/galeria-cititorilor");

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Eroare update gallery:", error);
    return NextResponse.json({ error: "Nu am putut actualiza fotografia." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const existing = await prisma.readerGalleryPhoto.findUnique({
    where: { id: params.id }
  });
  if (!existing) {
    return NextResponse.json({ error: "Fotografia nu există." }, { status: 404 });
  }

  await deleteImage(existing.imageUrl);
  await prisma.readerGalleryPhoto.delete({ where: { id: params.id } });
  revalidatePath("/galeria-cititorilor");
  return NextResponse.json({ success: true });
}
