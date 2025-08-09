
"use server"

import prisma from './db';
import { LinkData, AnalyticsData } from './types';
import { getLocationFromIP } from './geolocation';
import { subDays, format } from 'date-fns';
import { isValidURL, validateAlias, validateLinkName } from './security';
import crypto from 'crypto';

// File-based DB removed; using Prisma.

function mapLink(l: { id: string; originalUrl: string; alias: string; name: string; clicks: number; createdAt: Date }): LinkData {
    return { id: l.id, originalUrl: l.originalUrl, alias: l.alias, name: l.name, clicks: l.clicks, createdAt: l.createdAt.toISOString() };
}

function hashIP(ip?: string | null): string | undefined {
    if (!ip) return undefined;
    return crypto.createHash('sha256').update(ip).digest('hex');
}

// C R U D

export async function createLink(newLink: LinkData): Promise<LinkData> {
    if (!isValidURL(newLink.originalUrl)) throw new Error('Invalid or potentially dangerous URL provided.');
    if (newLink.alias) {
        const aliasValidation = validateAlias(newLink.alias);
        if (!aliasValidation.isValid) throw new Error(aliasValidation.error || 'Invalid alias.');
        newLink.alias = aliasValidation.sanitized!;
    }
    const nameValidation = validateLinkName(newLink.name);
    if (!nameValidation.isValid) throw new Error(nameValidation.error || 'Invalid link name.');
    newLink.name = nameValidation.sanitized!;
    const created = await prisma.link.create({ data: { id: newLink.id, originalUrl: newLink.originalUrl, alias: newLink.alias, name: newLink.name, clicks: newLink.clicks, createdAt: new Date(newLink.createdAt) } });
    return mapLink(created);
}

export async function isAliasTaken(alias: string): Promise<boolean> {
    const existing = await prisma.link.findUnique({ where: { alias } });
    return !!existing;
}

export async function getLinks(): Promise<LinkData[]> {
    const links = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } });
    return links.map(mapLink);
}

export async function getLinkByAlias(alias: string): Promise<LinkData | null> {
        const updated = await prisma.$transaction(async (tx: any) => {
            const link = await tx.link.findUnique({ where: { alias } });
            if (!link) return null;
            const saved = await tx.link.update({ where: { id: link.id }, data: { clicks: { increment: 1 } } });
            return saved;
        });
    return updated ? mapLink(updated) : null;
}

export async function updateLink(id: string, updates: Partial<LinkData>): Promise<LinkData> {
    const updated = await prisma.link.update({ where: { id }, data: { originalUrl: updates.originalUrl, name: updates.name } });
    return mapLink(updated);
}

export async function deleteLink(id: string): Promise<void> {
    await prisma.link.delete({ where: { id } }).catch(() => {});
}

// Analytics

export async function recordClick(linkId: string, ipAddress: string): Promise<void> {
    const location = await getLocationFromIP(ipAddress);
        await prisma.$transaction(async (tx: any) => {
            await tx.click.create({ data: { linkId, country: location.country, city: location.city, ipHash: hashIP(ipAddress) } });
            await tx.link.update({ where: { id: linkId }, data: { clicks: { increment: 1 } } });
        });
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
    const [linkCount, clickAgg, countryAgg, recentClicks] = await Promise.all([
        prisma.link.count(),
        prisma.link.aggregate({ _sum: { clicks: true } }),
        prisma.click.groupBy({ by: ['country'], _count: { country: true }, orderBy: { _count: { country: 'desc' } }, take: 10 }),
        prisma.click.findMany({ where: { timestamp: { gte: subDays(new Date(), 7) } } })
    ]);
    const totalLinks = linkCount;
    const totalClicks = clickAgg._sum.clicks || 0;
        const clicksByCountry = countryAgg.map((c: any) => ({ country: c.country, clicks: c._count.country }));
    const topCountry = clicksByCountry[0]?.country || 'N/A';
    const clicksByDateMap = new Map<string, number>();
    Array.from({ length: 7 }).forEach((_, i) => { const date = subDays(new Date(), i); clicksByDateMap.set(format(date, 'MMM d'), 0); });
        recentClicks.forEach((c: any) => { const key = format(c.timestamp, 'MMM d'); if (clicksByDateMap.has(key)) clicksByDateMap.set(key, (clicksByDateMap.get(key) || 0) + 1); });
    const clicksByDate = Array.from(clicksByDateMap.entries()).map(([date, clicks]) => ({ date, clicks })).reverse();
    const averageCtr = totalLinks > 0 ? Math.round((recentClicks.length / totalLinks) * 100 * 10) / 10 : 0;
    return { totalLinks, totalClicks, topCountry, averageCtr, clicksByDate, clicksByCountry };
}

// Get user statistics for quick stats display
export async function getUserStats(): Promise<{ totalLinks: number; totalClicks: number }> {
    const [totalLinks, totalClicks] = await Promise.all([prisma.link.count(), prisma.click.count()]);
    return { totalLinks, totalClicks };
}
