import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Only create clients if environment variables are provided
export const supabase = supabaseUrl && supabaseUrl.trim() && supabaseAnonKey && supabaseAnonKey.trim()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Server-side client with service role key for admin operations
export const supabaseAdmin = supabaseUrl && supabaseUrl.trim() && supabaseServiceRoleKey && supabaseServiceRoleKey.trim()
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  // In production, we should always use Supabase if any URL is provided
  if (process.env.NODE_ENV === 'production') {
    return !!(supabaseUrl && supabaseUrl.trim() && supabaseAnonKey && supabaseAnonKey.trim());
  }
  
  // For development, require all three keys
  return !!(supabaseUrl && supabaseUrl.trim() && 
           supabaseAnonKey && supabaseAnonKey.trim() && 
           supabaseServiceRoleKey && supabaseServiceRoleKey.trim())
}
