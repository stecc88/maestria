import { createClient } from '@supabase/supabase-js'

export const createAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    // Return a dummy client instead of crashing during build if env vars are missing
    return createClient(
      url || 'https://placeholder.supabase.co',
      key || 'placeholder-service-role'
    )
  }

  return createClient(url, key)
}
