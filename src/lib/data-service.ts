'use server'

import { LinkData, AnalyticsData, ClickRecord } from './types';
import { getLocationFromIP } from './geolocation';
import { subDays, format } from 'date-fns';
import { isValidURL, validateAlias, validateLinkName } from './security';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin, isSupabaseConfigured } from './supabase';

// Helper function to ensure Supabase is configured and available
function ensureSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }
  return supabaseAdmin;
}

// Fallback to JSON file if Supabase not configured
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

interface Database {
  links: LinkData[];
  clicks: ClickRecord[];
}

async function readDb(): Promise<Database> {
    try {
        const fileContent = await fs.readFile(dbPath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.links)) {
            throw new Error('Database structure corrupted');
        }
        
        if (!parsed.clicks) {
            parsed.clicks = [];
        }
        
        return parsed;
    } catch (error) {
        console.warn('Database file not found or corrupted, creating new one:', error);
        const newDb: Database = { links: [], clicks: [] };
        await writeDb(newDb);
        return newDb;
    }
}

async function writeDb(data: Database): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Supabase data functions
async function getLinksFromSupabase(): Promise<LinkData[]> {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }
  
  const { data, error } = await supabaseAdmin
    .from('links')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching links from Supabase:', error);
    return [];
  }
  
  return data.map(link => ({
    id: link.id,
    originalUrl: link.original_url,
    alias: link.alias,
    name: link.name || '',
    clicks: link.clicks || 0,
    createdAt: link.created_at
  }));
}

async function saveLinkToSupabase(linkData: LinkData): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error('Supabase not configured');
  }
  
  const { error } = await supabaseAdmin
    .from('links')
    .insert({
      id: linkData.id,
      original_url: linkData.originalUrl,
      alias: linkData.alias,
      name: linkData.name,
      clicks: linkData.clicks,
      created_at: linkData.createdAt
    });
    
  if (error) {
    console.error('Error saving link to Supabase:', error);
    throw new Error('Failed to save link');
  }
}

async function updateLinkInSupabase(id: string, updates: Partial<LinkData>): Promise<void> {
  const supabase = ensureSupabaseAdmin();
  const updateData: any = {};
  
  if (updates.originalUrl) updateData.original_url = updates.originalUrl;
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.clicks !== undefined) updateData.clicks = updates.clicks;
  
  const { error } = await supabase
    .from('links')
    .update(updateData)
    .eq('id', id);
    
  if (error) {
    console.error('Error updating link in Supabase:', error);
    throw new Error('Failed to update link');
  }
}

async function saveClickToSupabase(clickData: ClickRecord): Promise<void> {
  const supabase = ensureSupabaseAdmin();
  const { error } = await supabase
    .from('click_records')
    .insert({
      id: clickData.id,
      link_id: clickData.linkId,
      timestamp: clickData.timestamp,
      country: clickData.country,
      city: clickData.city,
      user_agent: clickData.userAgent,
      ip_hash: clickData.ip
    });
    
  if (error) {
    console.error('Error saving click to Supabase:', error);
    // Don't throw error for click tracking failures
  }
}

async function getClicksFromSupabase(): Promise<ClickRecord[]> {
  const supabase = ensureSupabaseAdmin();
  const { data, error } = await supabase
    .from('click_records')
    .select('*')
    .order('timestamp', { ascending: false });
    
  if (error) {
    console.error('Error fetching clicks from Supabase:', error);
    return [];
  }
  
  return data.map(click => ({
    id: click.id,
    linkId: click.link_id,
    timestamp: click.timestamp,
    country: click.country || '',
    city: click.city,
    userAgent: click.user_agent,
    ip: click.ip_hash
  }));
}

// Main data functions that use either Supabase or JSON
export async function getAllLinks(): Promise<LinkData[]> {
    if (isSupabaseConfigured()) {
        return await getLinksFromSupabase();
    } else {
        const db = await readDb();
        return db.links;
    }
}

export async function getLinkByAlias(alias: string): Promise<LinkData | null> {
    if (isSupabaseConfigured()) {
        const supabase = ensureSupabaseAdmin();
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('alias', alias)
            .single();
            
        if (error || !data) return null;
        
        return {
            id: data.id,
            originalUrl: data.original_url,
            alias: data.alias,
            name: data.name || '',
            clicks: data.clicks || 0,
            createdAt: data.created_at
        };
    } else {
        const db = await readDb();
        return db.links.find(link => link.alias === alias) || null;
    }
}

export async function getLinkById(id: string): Promise<LinkData | null> {
    if (isSupabaseConfigured()) {
        const supabase = ensureSupabaseAdmin();
        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error || !data) return null;
        
        return {
            id: data.id,
            originalUrl: data.original_url,
            alias: data.alias,
            name: data.name || '',
            clicks: data.clicks || 0,
            createdAt: data.created_at
        };
    } else {
        const db = await readDb();
        return db.links.find(link => link.id === id) || null;
    }
}

export async function createLink(
    originalUrl: string, 
    alias?: string, 
    name?: string
): Promise<{ success: boolean; link?: LinkData; error?: string }> {
    
    if (!isValidURL(originalUrl)) {
        return { success: false, error: 'Invalid URL format' };
    }

    let finalAlias = alias;
    
    if (!finalAlias) {
        finalAlias = generateRandomAlias();
    } else {
        const aliasValidation = validateAlias(finalAlias);
        if (!aliasValidation.isValid) {
            return { success: false, error: aliasValidation.error };
        }
    }

    const existingLink = await getLinkByAlias(finalAlias);
    if (existingLink) {
        return { success: false, error: 'Alias already exists. Please choose a different one.' };
    }

    if (name) {
        const nameValidation = validateLinkName(name);
        if (!nameValidation.isValid) {
            return { success: false, error: nameValidation.error };
        }
    }

    const newLink: LinkData = {
        id: uuidv4(),
        originalUrl,
        alias: finalAlias,
        name: name || '',
        clicks: 0,
        createdAt: new Date().toISOString()
    };

    try {
        if (isSupabaseConfigured()) {
            await saveLinkToSupabase(newLink);
        } else {
            const db = await readDb();
            db.links.unshift(newLink);
            await writeDb(db);
        }
        
        return { success: true, link: newLink };
    } catch (error) {
        console.error('Error creating link:', error);
        return { success: false, error: 'Failed to create link. Please try again.' };
    }
}

export async function updateLink(
    id: string, 
    updates: { originalUrl?: string; name?: string }
): Promise<{ success: boolean; error?: string }> {
    
    try {
        if (updates.originalUrl) {
            if (!isValidURL(updates.originalUrl)) {
                return { success: false, error: 'Invalid URL format' };
            }
        }

        if (updates.name !== undefined) {
            const nameValidation = validateLinkName(updates.name);
            if (!nameValidation.isValid) {
                return { success: false, error: nameValidation.error };
            }
        }

        if (isSupabaseConfigured()) {
            await updateLinkInSupabase(id, updates);
        } else {
            const db = await readDb();
            const linkIndex = db.links.findIndex(link => link.id === id);
            
            if (linkIndex === -1) {
                return { success: false, error: 'Link not found' };
            }

            if (updates.originalUrl) {
                db.links[linkIndex].originalUrl = updates.originalUrl;
            }
            if (updates.name !== undefined) {
                db.links[linkIndex].name = updates.name;
            }

            await writeDb(db);
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating link:', error);
        return { success: false, error: 'Failed to update link. Please try again.' };
    }
}

export async function incrementClicks(alias: string, ip?: string, userAgent?: string): Promise<void> {
    try {
        const link = await getLinkByAlias(alias);
        if (!link) return;

        const newClicks = link.clicks + 1;
        
        // Get location data
        const location = ip ? await getLocationFromIP(ip) : { country: 'Unknown', city: undefined };
        
        // Create click record
        const clickRecord: ClickRecord = {
            id: uuidv4(),
            linkId: link.id,
            timestamp: new Date().toISOString(),
            country: location.country,
            city: location.city,
            userAgent,
            ip: ip ? hashIP(ip) : undefined
        };

        if (isSupabaseConfigured()) {
            await updateLinkInSupabase(link.id, { clicks: newClicks });
            await saveClickToSupabase(clickRecord);
        } else {
            const db = await readDb();
            const linkIndex = db.links.findIndex(l => l.alias === alias);
            if (linkIndex !== -1) {
                db.links[linkIndex].clicks = newClicks;
                db.clicks.push(clickRecord);
                await writeDb(db);
            }
        }
    } catch (error) {
        console.error('Error incrementing clicks:', error);
    }
}

export async function deleteLink(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        if (isSupabaseConfigured()) {
            const supabase = ensureSupabaseAdmin();
            const { error } = await supabase
                .from('links')
                .delete()
                .eq('id', id);
                
            if (error) {
                throw new Error('Failed to delete link from database');
            }
        } else {
            const db = await readDb();
            const linkIndex = db.links.findIndex(link => link.id === id);
            
            if (linkIndex === -1) {
                return { success: false, error: 'Link not found' };
            }

            db.links.splice(linkIndex, 1);
            db.clicks = db.clicks.filter(click => click.linkId !== id);
            await writeDb(db);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting link:', error);
        return { success: false, error: 'Failed to delete link. Please try again.' };
    }
}

export async function getAnalytics(): Promise<AnalyticsData> {
    try {
        let links: LinkData[];
        let clicks: ClickRecord[];
        
        if (isSupabaseConfigured()) {
            links = await getLinksFromSupabase();
            clicks = await getClicksFromSupabase();
        } else {
            const db = await readDb();
            links = db.links;
            clicks = db.clicks;
        }

        const totalLinks = links.length;
        const totalClicks = clicks.length;

        // Country analysis
        const countryStats = clicks.reduce((acc, click) => {
            const country = click.country || 'Unknown';
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topCountry = Object.entries(countryStats)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

        // Calculate average CTR (clicks per link)
        const averageCtr = totalLinks > 0 ? totalClicks / totalLinks : 0;

        // Clicks by date (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(new Date(), 6 - i);
            return format(date, 'yyyy-MM-dd');
        });

        const clicksByDate = last7Days.map(date => {
            const dayClicks = clicks.filter(click => 
                format(new Date(click.timestamp), 'yyyy-MM-dd') === date
            ).length;
            
            return { date, clicks: dayClicks };
        });

        // Clicks by country (top 5)
        const clicksByCountry = Object.entries(countryStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([country, clicks]) => ({ country, clicks }));

        return {
            totalLinks,
            totalClicks,
            topCountry,
            averageCtr: Math.round(averageCtr * 100) / 100,
            clicksByDate,
            clicksByCountry
        };
    } catch (error) {
        console.error('Error getting analytics:', error);
        return {
            totalLinks: 0,
            totalClicks: 0,
            topCountry: 'N/A',
            averageCtr: 0,
            clicksByDate: [],
            clicksByCountry: []
        };
    }
}

// Aliases for backward compatibility
export const getAnalyticsData = getAnalytics;
export const getLinks = getAllLinks;
export const recordClick = incrementClicks;

// Additional helper functions
export async function isAliasTaken(alias: string): Promise<boolean> {
    const link = await getLinkByAlias(alias);
    return link !== null;
}

export async function getUserStats(): Promise<{ totalLinks: number; totalClicks: number }> {
    const analytics = await getAnalytics();
    return {
        totalLinks: analytics.totalLinks,
        totalClicks: analytics.totalClicks
    };
}

function generateRandomAlias(length: number = 6): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function hashIP(ip: string): string {
    // Simple hash function for IP anonymization
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
        const char = ip.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
}
