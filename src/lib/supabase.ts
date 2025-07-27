import { createClient } from '@supabase/supabase-js'

// Support both manual and Vercel integration environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_JWT_SECRET

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
