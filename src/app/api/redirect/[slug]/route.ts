import { getLinkByAlias, recordClick } from '@/lib/data-service';
import { getClientIP } from '@/lib/geolocation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const alias = slug;
    
    if (!alias) {
      return NextResponse.json({ error: 'Alias not provided' }, { status: 400 });
    }

    const link = await getLinkByAlias(alias);
    
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Record the click with geolocation data
    try {
      const clientIP = getClientIP(request);
      await recordClick(link.id, clientIP);
    } catch (error) {
      // Don't fail the redirect if click recording fails
      console.error('Error recording click:', error);
    }

    return NextResponse.json({ 
      originalUrl: link.originalUrl,
      name: link.name,
      clicks: link.clicks 
    });
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
