# Supabase Setup Guide for SnipURL

## 🗄️ Database Configuration

### 1. After creating your Supabase project, get these values:

#### From Supabase Dashboard → Settings → API:
```
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

#### From Supabase Dashboard → Settings → Database:
```
DATABASE_URL=postgresql://postgres:[your-password]@db.[your-project-ref].supabase.co:5432/postgres
```

### 2. Set up the Database Schema:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire contents of `database/schema.sql`
3. Click "Run" to create all tables and policies

### 3. Configure Environment Variables in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your `snipurl` project
3. Go to Settings → Environment Variables
4. Add these variables:

```
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
DATABASE_URL=postgresql://postgres:[your-password]@db.[your-project-ref].supabase.co:5432/postgres
JWT_SECRET=[generate-random-32-char-string]
```

### 4. Test Database Connection:

After setting up environment variables, redeploy your app:
```bash
vercel --prod
```

The health endpoint will show database status:
`https://your-app.vercel.app/api/health`

### 5. Migrate from JSON to PostgreSQL:

Once database is connected, you can:
- Keep using JSON for development
- Gradually migrate to PostgreSQL
- Use both during transition

## 📊 Database Features Enabled:

✅ User authentication with secure password hashing
✅ URL link management with analytics
✅ Click tracking with geolocation
✅ Row Level Security (RLS) for data protection
✅ Automatic timestamps and triggers
✅ Optimized indexes for performance
✅ Real-time subscriptions capability
