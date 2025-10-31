import { createBrowserClient } from "@supabase/ssr"

let supabaseAdmin: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabaseAdmin
}

let supabaseServer: ReturnType<typeof createBrowserClient> | null = null

export async function getSupabaseServer() {
  if (!supabaseServer) {
    supabaseServer = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabaseServer
}
