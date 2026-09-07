const DEFAULT_PROJECT_ID = "bxjivmxxwrirwynokctc";

export function getSupabaseProjectId(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID ?? DEFAULT_PROJECT_ID;
}

export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    `https://${getSupabaseProjectId()}.supabase.co`
  );
}

export function getSupabasePublishableKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

export function getSupabaseSecretKey(): string | undefined {
  return process.env.SUPABASE_SECRET_KEY;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseSecretKey());
}

export function isSupabaseStorageConfigured(): boolean {
  return isSupabaseConfigured();
}
