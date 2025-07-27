-- Supabase database setup for SnipURL
-- Run these SQL commands in your Supabase SQL Editor

-- Create the links table
CREATE TABLE IF NOT EXISTS links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_url TEXT NOT NULL,
    alias VARCHAR(50) UNIQUE NOT NULL,
    name TEXT,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the click_records table
CREATE TABLE IF NOT EXISTS click_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES links(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    country TEXT,
    city TEXT,
    user_agent TEXT,
    ip_hash TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_links_alias ON links(alias);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_click_records_link_id ON click_records(link_id);
CREATE INDEX IF NOT EXISTS idx_click_records_timestamp ON click_records(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_records ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now
-- You can make these more restrictive later based on your auth requirements
CREATE POLICY "Allow all operations on links" ON links FOR ALL USING (true);
CREATE POLICY "Allow all operations on click_records" ON click_records FOR ALL USING (true);

-- Verify the tables were created
SELECT 'Tables created successfully!' as status;
