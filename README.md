# SnipURL - Advanced URL Shortener 🚀

A powerful, production-ready URL shortener built with Next.js 15, featuring real-time analytics, QR codes, and smart security measures.

## ✨ Features

- **Lightning Fast**: Built with Next.js 15 and Turbopack for optimal performance
- **Smart Analytics**: Real-time click tracking with geographical insights
- **QR Code Generation**: Instant QR codes for easy sharing
- **Security First**: URL validation, rate limiting, and malicious link detection
- **Database Options**: Supabase PostgreSQL with JSON fallback for development
- **Modern UI**: Beautiful, responsive design with dark/light mode
- **Link Management**: Edit, delete, and organize your links
- **Custom Aliases**: Create memorable short URLs

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/vaibhav-2703/URL-Shortener.git
   cd URL-Shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📊 Database Setup

This application supports both **Supabase** (production) and **JSON file** (development) storage:

### For Production (Supabase):
Follow the comprehensive [Supabase Setup Guide](./SUPABASE_SETUP_GUIDE.md) for production deployment.

### For Development (JSON):
The app automatically uses JSON file storage when Supabase environment variables aren't configured.

## 🔧 Environment Variables

```bash
# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# Database (Supabase - optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy!

3. **Set up Supabase** (for production database)
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP_GUIDE.md)
   - Add environment variables to Vercel
   - Redeploy

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL (production) / JSON (development)
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: NextAuth.js (ready for implementation)
- **Deployment**: Vercel
- **Analytics**: Real-time click tracking

## 📱 API Endpoints

- `GET /[slug]` - Redirect to original URL
- `POST /api/links` - Create short link
- `GET /api/links` - Get user links
- `PUT /api/links/[id]` - Update link
- `DELETE /api/links/[id]` - Delete link
- `GET /api/analytics` - Get analytics data

## 🔒 Security Features

- URL validation and sanitization
- Rate limiting
- IP-based click tracking (hashed)
- Malicious URL detection (configurable)
- CORS protection
- Environment-based configuration

## 🎯 Performance

- Server-side rendering for SEO
- Optimized images and assets
- Efficient database queries
- Caching strategies
- Progressive Web App features

## 📈 Analytics Features

- Real-time click tracking
- Geographic insights (country/city)
- Device and browser analytics
- Time-based statistics
- Link performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**Live Demo**: [https://snipurl-n6119fxgb-vaibhav-2703s-projects.vercel.app](https://snipurl-n6119fxgb-vaibhav-2703s-projects.vercel.app)

Made with ❤️ by [Vaibhav](https://github.com/vaibhav-2703)
