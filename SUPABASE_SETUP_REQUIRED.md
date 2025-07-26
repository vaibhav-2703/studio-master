# ⚠️ SUPABASE SETUP REQUIRED

Your app is currently using JSON file storage instead of Supabase database.

## 🔧 To Enable Supabase Database:

### Step 1: Get Your Supabase Credentials
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy these values:
   - **Project URL** (starts with https://)
   - **anon/public key** (long string starting with ey...)
   - **service_role key** (long string starting with ey...)

### Step 2: Add Environment Variables in Vercel
1. Go to https://vercel.com/dashboard
2. Click on your **snipurl** project
3. Go to **Settings** → **Environment Variables**
4. Add these 3 variables:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 3: Create Database Tables
1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire contents of `database/schema.sql`
3. Click **Run** to create all tables

### Step 4: Redeploy
After adding environment variables, redeploy:
```bash
vercel --prod
```

## 📊 Current Status:
- ✅ Supabase client installed
- ✅ Database-ready code deployed
- ⚠️ Environment variables needed
- ⚠️ Database tables need creation

Once you complete these steps, your app will:
- Store all data in Supabase PostgreSQL
- Show user data in Supabase tables
- Scale automatically
- Have real-time capabilities
