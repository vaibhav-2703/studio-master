// NextAuth route disabled - using custom authentication
// Custom auth implementation provides better control
// Authentication handled in individual /api/auth/ routes

export async function GET() {
  return new Response('Route not available', { status: 404 });
}

export async function POST() {
  return new Response('Route not available', { status: 404 });
} 