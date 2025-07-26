# 🚀 Supabase Setup Guide for SnipURL

This guide will help you set up Supabase as the production database for your SnipURL application.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click "Start your project"
3. Click "New project"
4. Choose your organization
5. Fill in project details:
   - **Project name**: `snipurl` (or any name you prefer)
   - **Database password**: Create a secure password and save it
   - **Region**: Choose the region closest to you
6. Click "Create new project"
7. Wait for the project to be created (takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public key** (starts with `eyJ...`)
   - **service_role secret key** (starts with `eyJ...`)

## Step 3: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the following SQL schema:

\`\`\`sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  original_url TEXT NOT NULL,
  alias VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) DEFAULT '',
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create click_records table
CREATE TABLE IF NOT EXISTS public.click_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  country VARCHAR(100),
  city VARCHAR(100),
  user_agent TEXT,
  ip_hash VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_links_alias ON public.links(alias);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON public.links(created_at);
CREATE INDEX IF NOT EXISTS idx_click_records_link_id ON public.click_records(link_id);
CREATE INDEX IF NOT EXISTS idx_click_records_timestamp ON public.click_records(timestamp);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_records ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your use case)
CREATE POLICY "Enable read access for all users" ON public.links
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.links
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.links
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.links
  FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.click_records
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.click_records
  FOR INSERT WITH CHECK (true);

-- Create a view for analytics data
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  l.id,
  l.alias,
  l.name,
  l.original_url,
  l.clicks,
  l.created_at,
  COUNT(cr.id) as recorded_clicks,
  COUNT(DISTINCT DATE(cr.timestamp)) as active_days
FROM public.links l
LEFT JOIN public.click_records cr ON l.id = cr.link_id
GROUP BY l.id, l.alias, l.name, l.original_url, l.clicks, l.created_at
ORDER BY l.created_at DESC;
\`\`\`

4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned" message

## Step 4: Configure Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your `snipurl` project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variables:

| Name | Value | Environment |
|------|-------|-------------|
| `SUPABASE_URL` | Your Project URL from Step 2 | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | Your anon public key from Step 2 | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service_role secret key from Step 2 | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Generate a random secret (use: `openssl rand -base64 32`) | Production, Preview, Development |
| `NEXTAUTH_URL` | Your production URL (e.g., `https://snipurl-xxx.vercel.app`) | Production |

## Step 5: Redeploy Your Application

1. Go to your Vercel project dashboard
2. Go to **Deployments** tab
3. Click "Redeploy" on the latest deployment
4. Or make a small change to your code and push to trigger a new deployment

## Step 6: Test the Integration

1. Visit your deployed application
2. Create a new short link
3. Go back to your Supabase dashboard → **Table Editor**
4. Check the `links` table - you should see your new link there
5. Click on your short link and check the `click_records` table

## Step 7: Monitor Your Database

You can monitor your database usage in the Supabase dashboard:
- **Database** → **Tables** to view your data
- **Database** → **Logs** to see query logs
- **Settings** → **Database** to monitor usage

## Troubleshooting

### If you see "Supabase not configured" in logs:
- Double-check your environment variables in Vercel
- Make sure all three Supabase environment variables are set
- Redeploy after adding environment variables

### If you get authentication errors:
- Verify your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check that RLS policies are set correctly

### If data isn't appearing:
- Check Supabase logs in the dashboard
- Verify the database schema was created correctly
- Test with a simple curl request to your API

## Security Notes

- The `service_role` key has full database access - keep it secure
- Consider implementing user authentication for production use
- Review and adjust RLS policies based on your security requirements
- Monitor your database usage to avoid unexpected costs

## Cost Information

- Supabase offers a generous free tier
- Monitor your usage in the Supabase dashboard
- Set up billing alerts if needed

---

Once you complete these steps, your SnipURL application will be using Supabase as the production database! 🎉
