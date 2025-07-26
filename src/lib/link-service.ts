/**
 * Service for extracting page titles from URLs with security measures
 */

export async function getPageTitle(url: string): Promise<string | undefined> {
  try {
    // Validate URL before making request
    const urlObj = new URL(url);
    
    // Block dangerous protocols
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      throw new Error('Invalid protocol');
    }
    
    // Block localhost and internal IPs in production
    if (process.env.NODE_ENV === 'production') {
      const hostname = urlObj.hostname.toLowerCase();
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
        throw new Error('Blocked hostname');
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SnipURL/1.0 (URL Title Fetcher)'
      },
      redirect: 'follow',
      signal: controller.signal
    });

    if (!response.ok) {
      return undefined;
    }
    
    const html = await response.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    return titleMatch ? titleMatch[1].trim() : undefined;
  } catch (error) {
    console.error('Error fetching page title:', error);
    return undefined;
  }
}

/**
 * Service for creating short links
 */
import { createLink, isAliasTaken } from '@/lib/data-service';
import { v4 as uuidv4 } from 'uuid';

interface CreateLinkInput {
  originalUrl: string;
  name?: string;
  alias?: string;
}

interface CreateLinkOutput {
  id: string;
  alias: string;
  shortUrl: string;
}

function generateAlias(): string {
  return Math.random().toString(36).substring(2, 8);
}

export async function createShortLink(input: CreateLinkInput): Promise<CreateLinkOutput> {
  let alias = input.alias;
  
  if (alias) {
    const taken = await isAliasTaken(alias);
    if (taken) {
      throw new Error(`The alias "${alias}" is already taken. Please choose another.`);
    }
  } else {
    alias = generateAlias();
  }

  // Generate a simple name from the URL if not provided
  const linkName = input.name || (() => {
    try {
      const url = new URL(input.originalUrl);
      return url.hostname;
    } catch {
      return input.originalUrl;
    }
  })();
  
  const newLink = {
    id: uuidv4(),
    originalUrl: input.originalUrl,
    alias: alias,
    name: linkName,
    clicks: 0,
    createdAt: new Date().toISOString(),
  };

  const createdLink = await createLink(newLink);

  return {
    id: createdLink.id,
    alias: createdLink.alias,
    shortUrl: `/${createdLink.alias}`,
  };
}

/**
 * Service for updating existing links
 */
import { updateLink } from '@/lib/data-service';
import { LinkData } from '@/lib/types';

interface UpdateLinkInput {
  id: string;
  name?: string;
  originalUrl?: string;
}

export async function updateShortLink(input: UpdateLinkInput): Promise<LinkData> {
  const updatedData: Partial<LinkData> = {};
  
  if (input.name) {
    updatedData.name = input.name;
  }
  if (input.originalUrl) {
    updatedData.originalUrl = input.originalUrl;
  }

  const updatedLink = await updateLink(input.id, updatedData);
  return updatedLink;
}

/**
 * Simple URL validation service
 */
export function validateUrl(url: string): { isValid: boolean; message?: string } {
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: "Please enter a valid URL." };
  }
}
