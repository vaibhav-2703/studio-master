
'use server'

import fs from 'fs/promises';
import path from 'path';
import { LinkData, AnalyticsData, ClickRecord } from './types';
import { getLocationFromIP } from './geolocation';
import { subDays, format } from 'date-fns';
import { isValidURL, validateAlias, validateLinkName } from './security';
import { v4 as uuidv4 } from 'uuid';

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
        
        // Backward compatibility for clicks tracking
        if (!parsed.clicks) {
            parsed.clicks = [];
        }
        
        return parsed;
    } catch (error) {
        // Initialize new database if file doesn't exist
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await writeDb({ links: [], clicks: [] });
            return { links: [], clicks: [] };
        }
        
        console.error('Database read error:', error);
        throw new Error('Database access error');
    }
}

async function writeDb(data: Database): Promise<void> {
    try {
        if (!data || !Array.isArray(data.links)) {
            throw new Error('Invalid data structure');
        }
        
        // Create secure directory structure
        const dir = path.dirname(dbPath);
        await fs.mkdir(dir, { recursive: true, mode: 0o700 });
        
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), { 
            encoding: 'utf-8',
            mode: 0o600
        });
    } catch (error) {
        console.error('Database write error:', error);
        throw new Error('Database write failed');
    }
}

// C R U D

export async function createLink(newLink: LinkData): Promise<LinkData> {
    if (!isValidURL(newLink.originalUrl)) {
        throw new Error('Invalid or potentially dangerous URL provided.');
    }

    if (newLink.alias) {
        const aliasValidation = validateAlias(newLink.alias);
        if (!aliasValidation.isValid) {
            throw new Error(aliasValidation.error || 'Invalid alias.');
        }
        newLink.alias = aliasValidation.sanitized!;
    }

    const nameValidation = validateLinkName(newLink.name);
    if (!nameValidation.isValid) {
        throw new Error(nameValidation.error || 'Invalid link name.');
    }
    newLink.name = nameValidation.sanitized!;

    const db = await readDb();
    
    if (newLink.alias && db.links.some(link => link.alias === newLink.alias)) {
        throw new Error('This alias is already taken.');
    }

    db.links.push(newLink);
    await writeDb(db);
    return newLink;
}

export async function isAliasTaken(alias: string): Promise<boolean> {
    const db = await readDb();
    return db.links.some(link => link.alias === alias);
}

export async function getLinks(): Promise<LinkData[]> {
    const db = await readDb();
    // sort by most recent
    return db.links.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getLinkByAlias(alias: string): Promise<LinkData | null> {
    const db = await readDb();
    const link = db.links.find(l => l.alias === alias);
    
    if (link) {
        // Create a copy with incremented clicks
        const updatedLink = { ...link, clicks: link.clicks + 1 };
        
        // Update the specific link in the array
        const updatedLinks = db.links.map(l => 
            l.alias === alias ? updatedLink : l
        );
        
        // Write back to database
        await writeDb({ links: updatedLinks, clicks: db.clicks });
        return updatedLink;
    }

    return null;
}

export async function updateLink(id: string, updates: Partial<LinkData>): Promise<LinkData> {
    const db = await readDb();
    const linkIndex = db.links.findIndex(l => l.id === id);

    if (linkIndex === -1) {
        throw new Error('Link not found.');
    }

    const updatedLink = { ...db.links[linkIndex], ...updates };
    db.links[linkIndex] = updatedLink;

    await writeDb(db);
    return updatedLink;
}

export async function deleteLink(id: string): Promise<void> {
    const db = await readDb();
    const filteredLinks = db.links.filter(l => l.id !== id);

    if (filteredLinks.length === db.links.length) {
        return;
    }

    await writeDb({ links: filteredLinks, clicks: db.clicks || [] });
}

// Analytics

export async function recordClick(linkId: string, ipAddress: string): Promise<void> {
    const db = await readDb();
    const location = await getLocationFromIP(ipAddress);
    
    const clickRecord: ClickRecord = {
        id: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        linkId,
        timestamp: new Date().toISOString(),
        country: location.country,
        city: location.city,
        ip: ipAddress
    };
    
    if (!db.clicks) {
        db.clicks = [];
    }
    
    db.clicks.push(clickRecord);
    await writeDb(db);
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
    const db = await readDb();
    const links = db.links;
    const clicks = db.clicks || [];

    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    
    // Calculate top country from actual click data
    const countryClickCounts = new Map<string, number>();
    clicks.forEach(click => {
        const count = countryClickCounts.get(click.country) || 0;
        countryClickCounts.set(click.country, count + 1);
    });
    
    let topCountry = "N/A";
    let maxClicks = 0;
    countryClickCounts.forEach((count, country) => {
        if (count > maxClicks) {
            maxClicks = count;
            topCountry = country;
        }
    });
    
    // Calculate clicks by country for chart data
    const clicksByCountry = Array.from(countryClickCounts.entries())
        .map(([country, count]) => ({ country, clicks: count }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10); // Top 10 countries
    
    // Calculate average CTR based on actual data
    let averageCtr = 0;
    if (totalLinks > 0 && clicks.length > 0) {
        // CTR = (Total Tracked Clicks / Total Links) as percentage
        averageCtr = Math.round((clicks.length / totalLinks) * 100 * 10) / 10;
    }

    // Aggregate clicks by date for the last 7 days from actual click data
    const clicksByDateMap = new Map<string, number>();
    Array.from({ length: 7 }).forEach((_, i) => {
        const date = subDays(new Date(), i);
        clicksByDateMap.set(format(date, 'MMM d'), 0);
    });

    // Count actual clicks by date
    clicks.forEach(click => {
        const clickDate = new Date(click.timestamp);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - clickDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 0 && daysDiff < 7) {
            const dateKey = format(clickDate, 'MMM d');
            if (clicksByDateMap.has(dateKey)) {
                clicksByDateMap.set(dateKey, (clicksByDateMap.get(dateKey) || 0) + 1);
            }
        }
    });

    const clicksByDate = Array.from(clicksByDateMap.entries())
        .map(([date, clicks]) => ({ date, clicks }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
        totalLinks,
        totalClicks,
        topCountry,
        averageCtr,
        clicksByDate,
        clicksByCountry,
    };
}

// Get user statistics for quick stats display
export async function getUserStats(): Promise<{ totalLinks: number; totalClicks: number }> {
    const db = await readDb();
    const links = db.links;
    const clicks = db.clicks || [];
    
    const totalLinks = links.length;
    // Use actual click records count instead of link.clicks sum
    const totalClicks = clicks.length;
    
    return {
        totalLinks,
        totalClicks
    };
}
