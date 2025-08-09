import { getAnalyticsData } from '@/lib/data-service';
import { NextResponse } from 'next/server';
import { withSecurityHeaders } from '@/lib/security-middleware';

export async function GET() {
  try {
    const analyticsData = await getAnalyticsData();
    return withSecurityHeaders(NextResponse.json(analyticsData));
  } catch (error) {
    console.error('Analytics API error:', error);
    return withSecurityHeaders(
      NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
    );
  }
}
