import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl } from "./env";

let browserClient: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient {
  const publishableKey = getSupabasePublishableKey();

  if (!publishableKey) {
    throw new Error(
      "Supabase publishable key lipsește. Setează NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  if (!browserClient) {
    browserClient = createClient(getSupabaseUrl(), publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return browserClient;
}
