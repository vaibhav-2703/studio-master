-- SnipURL Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(320) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE IF NOT EXISTS links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    original_url TEXT NOT NULL,
    alias VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    clicks INTEGER DEFAULT 0,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create click_records table
CREATE TABLE IF NOT EXISTS click_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    link_id UUID REFERENCES links(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    country VARCHAR(100),
    city VARCHAR(100),
    user_agent TEXT,
    ip_hash VARCHAR(64), -- Store hashed IP for privacy
    referrer TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_links_alias ON links(alias);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at);
CREATE INDEX IF NOT EXISTS idx_click_records_link_id ON click_records(link_id);
CREATE INDEX IF NOT EXISTS idx_click_records_timestamp ON click_records(timestamp);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at 
    BEFORE UPDATE ON links 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users 
    FOR UPDATE USING (auth.uid() = id);

-- Links policies
CREATE POLICY "Users can view own links" ON links 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own links" ON links 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links" ON links 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links" ON links 
    FOR DELETE USING (auth.uid() = user_id);

-- Public access for URL redirection (read-only)
CREATE POLICY "Public can read links for redirection" ON links 
    FOR SELECT USING (true);

-- Click records policies
CREATE POLICY "Users can view own link clicks" ON click_records 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM links 
            WHERE links.id = click_records.link_id 
            AND links.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert click records" ON click_records 
    FOR INSERT WITH CHECK (true);

-- Create view for analytics
CREATE OR REPLACE VIEW link_analytics AS
SELECT 
    l.id,
    l.alias,
    l.name,
    l.original_url,
    l.clicks,
    l.created_at,
    COUNT(cr.id) as actual_clicks,
    COUNT(DISTINCT cr.country) as unique_countries,
    MAX(cr.timestamp) as last_click
FROM links l
LEFT JOIN click_records cr ON l.id = cr.link_id
GROUP BY l.id, l.alias, l.name, l.original_url, l.clicks, l.created_at;

-- Grant permissions
GRANT SELECT ON link_analytics TO authenticated;
GRANT SELECT ON link_analytics TO anon;
