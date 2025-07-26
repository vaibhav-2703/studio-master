
import { z } from 'zod';

export interface LinkData {
    id: string;
    originalUrl: string;
    alias: string;
    name: string;
    clicks: number;
    createdAt: string; // ISO 8601 date string
}

export interface ClickRecord {
    id: string;
    linkId: string;
    timestamp: string; // ISO 8601 date string
    country: string;
    city?: string;
    userAgent?: string;
    ip?: string; // Hashed or anonymized
}

export interface AnalyticsData {
    totalLinks: number;
    totalClicks: number;
    topCountry: string;
    averageCtr: number;
    clicksByDate: { date: string; clicks: number }[];
    clicksByCountry: { country: string; clicks: number }[];
}


// Schema for validating input when updating a link
export const UpdateLinkInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  originalUrl: z.string().url().optional(),
});

// Schema for creating a new link
export const CreateLinkInputSchema = z.object({
  originalUrl: z.string().url(),
  name: z.string().optional().nullable(),
  alias: z.string().optional(),
});

export const CreateLinkOutputSchema = z.object({
  id: z.string(),
  alias: z.string(),
  shortUrl: z.string(),
});

// Schemas for getting page title
export const GetPageTitleInputSchema = z.object({
  url: z.string().url(),
});

export const GetPageTitleOutputSchema = z.object({
  title: z.string().optional(),
});
