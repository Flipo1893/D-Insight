import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseUrl } from "./config";

/**
 * For Server Components, Server Actions and Route Handlers. Only call after
 * checking isSupabaseConfigured; it throws when the env vars are missing.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called during a Server Component render. proxy.ts already
          // refreshes the session cookie on the request, so this write can
          // safely be dropped.
        }
      },
    },
  });
}
