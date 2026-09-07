import { put, del } from "@vercel/blob";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { isSupabaseStorageConfigured } from "@/lib/supabase/env";
import {
  deleteFromSupabaseStorage,
  uploadToSupabaseStorage
} from "@/lib/supabase/storage";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Format acceptat: JPG, PNG sau WebP.";
  }
  if (file.size > MAX_SIZE) {
    return "Imaginea nu poate depăși 5 MB.";
  }
  return null;
}

function getExtension(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

function isSupabasePublicUrl(url: string): boolean {
  return url.includes(".supabase.co/storage/v1/object/public/");
}

export async function uploadImage(
  file: File,
  folder: "reviews" | "gallery"
): Promise<string> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const ext = getExtension(file.type);
  const filename = `${folder}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isSupabaseStorageConfigured()) {
    try {
      return await uploadToSupabaseStorage(filename, buffer, file.type);
    } catch (error) {
      console.error("Supabase upload failed:", error);

      if (process.env.NODE_ENV !== "development") {
        throw error;
      }
    }
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: file.type
    });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadsDir, { recursive: true });
  const localPath = path.join(uploadsDir, `${randomUUID()}.${ext}`);
  await writeFile(localPath, buffer);
  return `/uploads/${folder}/${path.basename(localPath)}`;
}

export async function deleteImage(url: string): Promise<void> {
  if (isSupabasePublicUrl(url)) {
    try {
      await deleteFromSupabaseStorage(url);
    } catch {
      // ignore missing object
    }
    return;
  }

  if (url.startsWith("http") && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await del(url);
    } catch {
      // ignore missing blob
    }
    return;
  }

  if (url.startsWith("/uploads/")) {
    const localPath = path.join(process.cwd(), "public", url);
    try {
      await unlink(localPath);
    } catch {
      // ignore missing file
    }
  }
}
