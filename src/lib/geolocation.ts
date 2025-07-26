/**
 * Geolocation service for IP-based location detection
 */

interface GeoLocationData {
  country: string;
  city?: string;
}

// Free IP geolocation service
const IPAPI_URL = 'http://ip-api.com/json/';

export async function getLocationFromIP(ip: string): Promise<GeoLocationData> {
  try {
    // For development/localhost, return a default location
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return { country: 'Local Development', city: 'Localhost' };
    }

    const response = await fetch(`${IPAPI_URL}${ip}?fields=status,country,city`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country || 'Unknown',
        city: data.city || undefined
      };
    }
    
    // Fallback to unknown location
    return { country: 'Unknown' };
  } catch (error) {
    console.error('Geolocation lookup failed:', error);
    return { country: 'Unknown' };
  }
}

// Get IP address from request headers (for Edge/Vercel deployment)
export function getClientIP(request: Request): string {
  // Try different headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback for development
  return '127.0.0.1';
}

// Offline country list for fallback
export const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 
  'Japan', 'Australia', 'Brazil', 'India', 'China', 'South Korea',
  'Netherlands', 'Sweden', 'Switzerland', 'Norway', 'Denmark',
  'Spain', 'Italy', 'Russia', 'Mexico', 'Argentina', 'South Africa'
];
