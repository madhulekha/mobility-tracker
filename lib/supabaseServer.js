import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRole) {
  // server-side log only
  console.warn('Supabase server client not configured (missing env vars)')
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRole)
