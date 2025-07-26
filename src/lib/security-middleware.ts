import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter } from './security';
import crypto from 'crypto';

// Create rate limiters for different endpoints
const loginLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
const generalLimiter = createRateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes
const linkCreationLimiter = createRateLimiter(10, 60 * 1000); // 10 links per minute

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Security headers middleware
export function withSecurityHeaders(response: NextResponse): NextResponse {
  // Set security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Note: Consider removing unsafe-inline/eval in production
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  return response;
}

// Rate limiting middleware
export function withRateLimit(
  request: NextRequest, 
  type: 'login' | 'general' | 'links' = 'general'
): { allowed: boolean; response?: NextResponse } {
  const clientIP = getClientIP(request);
  
  let rateLimiter;
  switch (type) {
    case 'login':
      rateLimiter = loginLimiter;
      break;
    case 'links':
      rateLimiter = linkCreationLimiter;
      break;
    default:
      rateLimiter = generalLimiter;
  }
  
  const { allowed, remainingRequests, resetTime } = rateLimiter(clientIP);
  
  if (!allowed) {
    const response = NextResponse.json(
      { 
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
      },
      { status: 429 }
    );
    
    response.headers.set('Retry-After', Math.ceil((resetTime - Date.now()) / 1000).toString());
    response.headers.set('X-RateLimit-Limit', rateLimiter === loginLimiter ? '5' : rateLimiter === linkCreationLimiter ? '10' : '100');
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());
    
    return { allowed: false, response: withSecurityHeaders(response) };
  }
  
  return { allowed: true };
}

// Input sanitization middleware
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input.trim()
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// CSRF protection helper
export function generateCSRFToken(): string {
  return crypto.getRandomValues(new Uint32Array(4)).join('-');
}

export function validateCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken;
}
