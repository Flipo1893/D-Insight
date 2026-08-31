import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./config";

// For use inside Client Components. Only call this after checking
// isSupabaseConfigured — it throws if the env vars are missing.
export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
