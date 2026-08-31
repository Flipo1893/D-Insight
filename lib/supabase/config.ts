export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// The rest of the app checks this instead of duplicating the null-check —
// it flips to true the moment real keys land in .env.local, no code changes
// needed. Until then, auth UI stays visible but explains it's not wired up.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
