import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseSecretKey,
  getSupabaseUrl,
  isSupabaseConfigured
} from "./env";

let adminClient: SupabaseClient | null = null;

export function createSupabaseAdminClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase nu este configurat. Setează NEXT_PUBLIC_SUPABASE_URL și SUPABASE_SECRET_KEY."
    );
  }

  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), getSupabaseSecretKey()!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return adminClient;
}
