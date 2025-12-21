# Vercel Deployment Guide

## 🚀 Quick Deploy Steps

### 1. Set Up Production Database

**Option A: Vercel Postgres (Recommended)**
```bash
# In your Vercel project dashboard:
# Storage → Create Database → Postgres
# Copy the DATABASE_URL environment variable
```

**Option B: Supabase (Free)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Use "Transaction" pooler URL for Prisma

### 2. Update Prisma Schema for Production

Change `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 3. Create Environment Variable File

Create `.env.local` (already gitignored):

```env
# For local development (keep using SQLite)
DATABASE_URL="file:./dev.db"

# For production (will be set in Vercel dashboard)
# DATABASE_URL="postgresql://..."
```

### 4. Push to GitHub

```bash
cd /Users/jimmyjiggler/Documents/rommy/ts
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 5. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repo: `chukwuebukwa/rommy`
4. Vercel will auto-detect Next.js settings
5. **Important:** Add Environment Variables:
   ```
   DATABASE_URL = your_production_database_url
   ```
6. Click "Deploy"

### 6. Run Database Migrations

After first deployment, you need to set up your production database:

```bash
# Option 1: Using Vercel CLI (install: npm i -g vercel)
vercel env pull .env.production
DATABASE_URL="your_production_url" bunx prisma migrate deploy
DATABASE_URL="your_production_url" bunx prisma db seed

# Option 2: Import your existing data
DATABASE_URL="your_production_url" bun run db:import
```

## ⚙️ Build Settings for Vercel

Vercel should auto-detect these, but if needed:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (or leave empty for auto-detect)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (Vercel uses npm by default)

### Using Bun on Vercel

If you want to use Bun instead of npm, add this to your project settings:
- **Install Command:** `bun install`
- **Build Command:** `bun run build`

## 🔧 Post-Deployment Configuration

### Environment Variables Needed:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Production database connection string | `postgresql://user:pass@host/db` |
| `NODE_ENV` | Set automatically by Vercel | `production` |

### Custom Domains (Optional)

1. Go to your project settings on Vercel
2. Domains tab
3. Add your custom domain

## 🐛 Troubleshooting

### "Can't reach database server" error
- Check DATABASE_URL is set correctly in Vercel dashboard
- Ensure database allows connections from Vercel's IP ranges
- For Vercel Postgres, this is automatic

### Build fails with Prisma errors
- Make sure you changed schema from `sqlite` to `postgresql`
- Run `bunx prisma generate` locally first
- Check that `@prisma/client` version matches `prisma` version

### "Module not found" errors
- Clear Vercel build cache (Settings → Functions → Clear Build Cache)
- Redeploy

## 📊 Database Options Comparison

| Provider | Free Tier | Prisma Support | Setup Difficulty |
|----------|-----------|----------------|------------------|
| Vercel Postgres | 256 MB | ✅ Excellent | ⭐ Easiest |
| Supabase | 500 MB | ✅ Excellent | ⭐⭐ Easy |
| PlanetScale | 5 GB | ✅ Good | ⭐⭐⭐ Medium |
| Neon | 3 GB | ✅ Excellent | ⭐⭐ Easy |

## 🎯 Next Steps After Deployment

1. Test your deployed app
2. Set up monitoring (Vercel Analytics)
3. Configure custom domain
4. Set up preview deployments for branches
5. Add production secrets securely

## 📝 Important Notes

- Your SQLite `dev.db` file is now gitignored (won't be uploaded)
- Keep using SQLite locally for development
- Use PostgreSQL (or MySQL) for production only
- Consider using `db:export` and `db:import` scripts to move data between environments

## 🔗 Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Prisma Deployment Docs](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

