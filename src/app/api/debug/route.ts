import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    nodeEnv: process.env.NODE_ENV,
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    supabaseUrlLength: process.env.SUPABASE_URL?.length || 0,
    supabaseUrlPreview: process.env.SUPABASE_URL?.substring(0, 20) + '...',
    hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
    anonKeyLength: process.env.SUPABASE_ANON_KEY?.length || 0,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    timestamp: new Date().toISOString()
  };

  console.log('Debug endpoint called:', envCheck);

  return NextResponse.json({
    message: 'Environment Debug Information',
    ...envCheck
  });
}
