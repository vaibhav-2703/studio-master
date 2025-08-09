import { getUserStats } from '@/lib/data-service';
import { NextResponse } from 'next/server';
import { withSecurityHeaders } from '@/lib/security-middleware';

export async function GET() {
  try {
    const userStats = await getUserStats();
    return withSecurityHeaders(NextResponse.json(userStats));
  } catch (error) {
    console.error('User stats API error:', error);
    return withSecurityHeaders(
      NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 })
    );
  }
}
