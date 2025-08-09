import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/auth';
import { withRateLimit, withSecurityHeaders, sanitizeInput } from '@/lib/security-middleware';
import { isValidEmail } from '@/lib/security';

export async function POST(request: NextRequest) {
  // Apply rate limiting for login attempts
  const rateLimitCheck = withRateLimit(request, 'login');
  if (!rateLimitCheck.allowed) {
    return rateLimitCheck.response!;
  }

  try {
    const body = await request.json();
    const sanitizedBody = sanitizeInput(body) as { email?: string; password?: string };
    const { email, password } = sanitizedBody;

    // Validate input
    if (!email || !password) {
      return withSecurityHeaders(NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      ));
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return withSecurityHeaders(NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      ));
    }

    // Rate limiting: Add delay for failed attempts
    const user = await authenticateUser(email, password);
    if (!user) {
      // Add artificial delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      return withSecurityHeaders(NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      ));
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    // Create response with token in httpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

    // Set secure httpOnly cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Changed from 'lax' to 'strict' for better security
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return withSecurityHeaders(response);
  } catch (error) {
    console.error('Login error:', error);
    return withSecurityHeaders(NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    ));
  }
}
