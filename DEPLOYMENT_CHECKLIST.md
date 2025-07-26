# 🚀 SnipURL Deployment Checklist

## Pre-Deployment Setup

### 1. GitHub Student Pack (Recommended)
- [ ] Apply for [GitHub Student Pack](https://education.github.com/pack)
- [ ] Gain access to $200+ in free credits and premium tools
- [ ] Get access to enhanced Vercel Pro features

### 2. Required Accounts Setup
- [ ] Create [GitHub](https://github.com) account
- [ ] Create [Vercel](https://vercel.com) account
- [ ] Create [Supabase](https://supabase.com) account
- [ ] Optional: [Sentry](https://sentry.io) account for error tracking

### 3. Domain Setup (Optional)
- [ ] Purchase domain or use free subdomain
- [ ] Configure DNS settings for custom domain

## Database Setup (Supabase)

### 4. Create Supabase Project
- [ ] Go to [Supabase Dashboard](https://app.supabase.com)
- [ ] Create new project
- [ ] Note down:
  - Project URL
  - API Key (anon/public)
  - Service Role Key
  - Database URL

### 5. Database Schema
- [ ] Open Supabase SQL Editor
- [ ] Run `database/schema.sql` to create tables
- [ ] Verify tables are created correctly
- [ ] Optional: Run `database/migrate.sql` if migrating existing data

## Environment Configuration

### 6. Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all required values:
  ```env
  NODE_ENV=production
  NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
  JWT_SECRET=your-super-secure-jwt-secret-key-here
  DATABASE_URL=postgresql://username:password@host:port/database
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_ANON_KEY=your-supabase-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
  ```

### 7. Security Keys
- [ ] Generate strong JWT secret (32+ characters)
- [ ] Optional: Get Google Safe Browsing API key
- [ ] Store all secrets securely

## Code Repository

### 8. Git Setup
- [ ] Initialize git repository: `git init`
- [ ] Add files: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit"`
- [ ] Create GitHub repository
- [ ] Add remote: `git remote add origin <your-repo-url>`
- [ ] Push code: `git push -u origin main`

### 9. Code Quality
- [ ] Run type check: `npm run type-check`
- [ ] Run build: `npm run build`
- [ ] Test locally: `npm run dev`
- [ ] Verify all functionality works

## Deployment

### 10. Vercel Deployment
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`
- [ ] Deploy: `vercel --prod`
- [ ] Add environment variables in Vercel dashboard
- [ ] Test deployed application

### 11. Domain Configuration (If Custom Domain)
- [ ] Add domain in Vercel dashboard
- [ ] Configure DNS records:
  - Type: CNAME
  - Name: @ (or www)
  - Value: cname.vercel-dns.com
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate is issued

## Post-Deployment

### 12. Health Checks
- [ ] Test `/api/health` endpoint
- [ ] Verify database connectivity
- [ ] Test URL shortening functionality
- [ ] Test analytics dashboard
- [ ] Test user authentication

### 13. Monitoring Setup
- [ ] Configure Vercel Analytics
- [ ] Optional: Setup Sentry for error tracking
- [ ] Setup uptime monitoring
- [ ] Configure email alerts

### 14. Performance Optimization
- [ ] Enable Vercel Edge Functions
- [ ] Configure caching headers
- [ ] Optimize images and assets
- [ ] Monitor Core Web Vitals

## Security Checklist

### 15. Security Verification
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured
- [ ] Database access properly configured
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] CORS headers configured

### 16. Backup & Recovery
- [ ] Database backup strategy
- [ ] Code repository backup
- [ ] Environment variables backup
- [ ] Recovery procedures documented

## Scaling Preparation

### 17. Free Tier Limits
- [ ] Understand Vercel limits (100GB bandwidth/month)
- [ ] Understand Supabase limits (500MB database, 2GB bandwidth)
- [ ] Plan for scaling when needed

### 18. Upgrade Path
- [ ] Know when to upgrade to Vercel Pro ($20/month)
- [ ] Know when to upgrade to Supabase Pro ($25/month)
- [ ] Monitor usage through dashboards

## Final Launch

### 19. Go Live
- [ ] Update README.md with live URL
- [ ] Announce launch
- [ ] Monitor for initial issues
- [ ] Gather user feedback

### 20. Maintenance
- [ ] Regular dependency updates
- [ ] Security patches
- [ ] Performance monitoring
- [ ] Feature updates based on feedback

---

## Quick Deploy Commands

```bash
# For Windows PowerShell
.\deploy.ps1

# For macOS/Linux
chmod +x deploy.sh
./deploy.sh

# Manual deployment
npm ci
npm run type-check
npm run build
vercel --prod
```

## Support Resources

- [Deployment Guide](./DEPLOYMENT.md)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Student Pack](https://education.github.com/pack)

---

**Status**: ✅ Ready for deployment
**Build**: ✅ Passing
**Type Check**: ✅ Passing
**Security**: ✅ Implemented
