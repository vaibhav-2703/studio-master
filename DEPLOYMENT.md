# SnipURL Deployment Guide

This guide will help you deploy SnipURL to production using free services.

## 🚀 Quick Deployment Steps

### 1. GitHub Student Pack (Free Resources)
- Sign up at [GitHub Education](https://education.github.com/pack)
- Get access to $200 in credits and premium tools

### 2. Database Setup (Supabase - Free)
```bash
# Visit https://supabase.com
# Create new project
# Copy your project URL and keys
```

### 3. Deployment (Vercel - Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository created and pushed
- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Domain name ready (optional)
- [ ] SSL certificate (automatic with Vercel)

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
JWT_SECRET=your-super-secure-jwt-secret-key-here
DATABASE_URL=postgresql://username:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🎯 Database Migration

Create these tables in Supabase:

```sql
-- Links table
CREATE TABLE links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_url TEXT NOT NULL,
  alias TEXT UNIQUE NOT NULL,
  name TEXT,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Click records table
CREATE TABLE click_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  country TEXT,
  city TEXT,
  user_agent TEXT,
  ip TEXT
);

-- Users table (for authentication)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🌐 Custom Domain Setup

1. **Add domain to Vercel:**
   - Go to Vercel dashboard
   - Click on your project
   - Go to Settings > Domains
   - Add your custom domain

2. **Configure DNS:**
   ```
   Type: CNAME
   Name: @ (or www)
   Value: cname.vercel-dns.com
   ```

## 📊 Monitoring & Analytics

### Free Monitoring Tools:
- **Vercel Analytics** (Built-in)
- **Sentry** (Error tracking)
- **Google Analytics** (User analytics)

## 🔒 Security Considerations

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] Rate limiting configured
- [ ] CORS headers set

## 🚀 Performance Optimization

- [ ] Next.js optimizations enabled
- [ ] Image optimization configured
- [ ] Static asset caching
- [ ] CDN distribution (Vercel Edge Network)

## 📈 Scaling Strategy

### Free Tier Limits:
- **Vercel:** 100GB bandwidth/month
- **Supabase:** 500MB database, 2GB bandwidth
- **GitHub:** Unlimited public repositories

### Upgrade Path:
1. Vercel Pro ($20/month)
2. Supabase Pro ($25/month)
3. Custom domain with SSL

## 🛠️ CI/CD Pipeline

Automatic deployment on every push to main:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🔍 Health Checks

Monitor your application:
- `/api/health` - Application health
- Database connectivity
- Response time monitoring
- Error rate tracking

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Student Pack](https://education.github.com/pack)
