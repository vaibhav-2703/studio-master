import { NextResponse } from 'next/server';

export async function GET() {
  // Check all possible Supabase environment variable names
  const envCheck = {
    nodeEnv: process.env.NODE_ENV,
    // Standard names
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    supabaseUrlLength: process.env.SUPABASE_URL?.length || 0,
    hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
    anonKeyLength: process.env.SUPABASE_ANON_KEY?.length || 0,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    // Possible Vercel integration names
    hasNextPublicSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    nextPublicSupabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
    hasNextPublicSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    nextPublicSupabaseAnonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    // Alternative names
    hasSupabaseProjectUrl: !!process.env.SUPABASE_PROJECT_URL,
    hasSupabaseKey: !!process.env.SUPABASE_KEY,
    hasSupabaseApiKey: !!process.env.SUPABASE_API_KEY,
    // Show all environment variables that contain 'supabase' (case insensitive)
    supabaseEnvVars: Object.keys(process.env)
      .filter(key => key.toLowerCase().includes('supabase'))
      .map(key => ({ key, hasValue: !!process.env[key], length: process.env[key]?.length || 0 })),
    timestamp: new Date().toISOString()
  };

  console.log('Debug endpoint called:', envCheck);

  return NextResponse.json({
    message: 'Environment Debug Information',
    ...envCheck
  });
}
