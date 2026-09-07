import { createSupabaseAdminClient } from "./server";
import type { SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_UPLOADS_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ?? "uploads";

async function ensureUploadsBucket(supabase: SupabaseClient) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    throw new Error(listError.message);
  }

  const exists = buckets?.some(
    (bucket) =>
      bucket.id === SUPABASE_UPLOADS_BUCKET ||
      bucket.name === SUPABASE_UPLOADS_BUCKET
  );

  if (exists) return;

  const { error: createError } = await supabase.storage.createBucket(
    SUPABASE_UPLOADS_BUCKET,
    {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"]
    }
  );

  if (
    createError &&
    !createError.message.toLowerCase().includes("already exists")
  ) {
    throw new Error(createError.message);
  }
}

export async function uploadToSupabaseStorage(
  path: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const supabase = createSupabaseAdminClient();
  await ensureUploadsBucket(supabase);

  const { error } = await supabase.storage
    .from(SUPABASE_UPLOADS_BUCKET)
    .upload(path, buffer, {
      contentType,
      upsert: false,
      cacheControl: "3600"
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(SUPABASE_UPLOADS_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function deleteFromSupabaseStorage(publicUrl: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const path = getStoragePathFromPublicUrl(publicUrl);

  if (!path) return;

  const { error } = await supabase.storage
    .from(SUPABASE_UPLOADS_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}

function getStoragePathFromPublicUrl(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${SUPABASE_UPLOADS_BUCKET}/`;
    const index = url.pathname.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}
