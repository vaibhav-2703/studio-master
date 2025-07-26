/**
 * Security utilities for URL validation and input sanitization
 */
import crypto from 'crypto';

export function isValidURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    // Production security: block internal networks
    if (process.env.NODE_ENV === 'production') {
      const hostname = urlObj.hostname.toLowerCase();
      
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
        return false;
      }
      
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipRegex.test(hostname)) {
        const parts = hostname.split('.').map(Number);
        // Private IP ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
        if (
          parts[0] === 10 ||
          (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
          (parts[0] === 192 && parts[1] === 168) ||
          parts[0] === 169
        ) {
          return false;
        }
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

// Validate and sanitize alias
export function validateAlias(alias: string): { isValid: boolean; sanitized?: string; error?: string } {
  if (!alias) {
    return { isValid: false, error: 'Alias cannot be empty' };
  }
  
  // Remove any potentially dangerous characters
  const sanitized = alias.replace(/[^a-zA-Z0-9\-_]/g, '');
  
  if (sanitized !== alias) {
    return { isValid: false, error: 'Alias can only contain letters, numbers, hyphens, and underscores' };
  }
  
  if (sanitized.length < 1 || sanitized.length > 50) {
    return { isValid: false, error: 'Alias must be between 1 and 50 characters' };
  }
  
  // Check for reserved words
  const reservedWords = ['api', 'admin', 'dashboard', 'auth', 'login', 'signup', 'www', 'app', 'about'];
  if (reservedWords.includes(sanitized.toLowerCase())) {
    return { isValid: false, error: 'This alias is reserved and cannot be used' };
  }
  
  return { isValid: true, sanitized };
}

// Validate link name
export function validateLinkName(name: string): { isValid: boolean; sanitized?: string; error?: string } {
  if (!name) {
    return { isValid: false, error: 'Name cannot be empty' };
  }
  
  // Basic HTML sanitization - remove any HTML tags
  const sanitized = name.replace(/<[^>]*>/g, '').trim();
  
  if (sanitized.length < 1 || sanitized.length > 100) {
    return { isValid: false, error: 'Name must be between 1 and 100 characters' };
  }
  
  return { isValid: true, sanitized };
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 320; // RFC 5321 limit
}

// Password strength validation
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password must be less than 128 characters' };
  }
  
  // Check for at least one uppercase, one lowercase, and one digit
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasDigit) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one uppercase letter, one lowercase letter, and one digit' 
    };
  }
  
  return { isValid: true };
}

// Rate limiting helper
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (identifier: string): { allowed: boolean; remainingRequests: number; resetTime: number } => {
    const now = Date.now();
    const userRequests = requests.get(identifier);
    
    if (!userRequests || now > userRequests.resetTime) {
      // Reset or initialize
      requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return { allowed: true, remainingRequests: maxRequests - 1, resetTime: now + windowMs };
    }
    
    if (userRequests.count >= maxRequests) {
      return { allowed: false, remainingRequests: 0, resetTime: userRequests.resetTime };
    }
    
    userRequests.count++;
    requests.set(identifier, userRequests);
    
    return { 
      allowed: true, 
      remainingRequests: maxRequests - userRequests.count,
      resetTime: userRequests.resetTime
    };
  };
}

// Generate secure random alias
export function generateSecureAlias(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const randomBytes = crypto.getRandomValues(new Uint8Array(length));
  
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  
  return result;
}
