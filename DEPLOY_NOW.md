# 🚀 Deploy to Vercel NOW - Step by Step

## ✅ What's Already Done

- ✅ Schema updated to PostgreSQL
- ✅ Export/import scripts enhanced
- ✅ Fresh database backup created (405 KB)
- ✅ All changes committed and pushed to GitHub
- ✅ SQLite files excluded from git

**Your GitHub repo is ready:** https://github.com/chukwuebukwa/rommy

---

## 🎯 Follow These Steps to Deploy

### Step 1: Go to Vercel (2 minutes)

1. Open https://vercel.com
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Find and import **`chukwuebukwa/rommy`**

### Step 2: Configure Project (1 minute)

Vercel will auto-detect your Next.js app! Settings should be:

```
Framework Preset: Next.js (auto-detected ✅)
Root Directory: ./ts or ./ (if you want the whole repo)
Build Command: (leave default)
Output Directory: (leave default)
Install Command: (leave default or set to "bun install" if you want Bun)
```

**IMPORTANT:** Set the Root Directory:
- If deploying the TS folder only: `ts`
- If deploying whole repo: `./` (recommended to use `ts`)

### Step 3: Add Database Storage (3 minutes)

**Option A: Vercel Postgres (Easiest - RECOMMENDED)**

1. In Vercel, before clicking "Deploy", scroll down
2. Or after first deploy, go to your project dashboard
3. Click **"Storage"** tab
4. Click **"Create Database"** → Choose **"Postgres"**
5. Select your project
6. Click **"Create"**
7. Vercel automatically adds `POSTGRES_URL`, `POSTGRES_PRISMA_URL` environment variables

**Option B: External PostgreSQL (Supabase/Neon/etc.)**

1. Create database on your chosen provider
2. Get connection string (looks like `postgresql://user:pass@host:5432/dbname`)
3. In Vercel project settings → **Environment Variables**
4. Add: `DATABASE_URL` = your connection string

### Step 4: Update Environment Variable for Prisma (1 minute)

Prisma needs the right DATABASE_URL:

1. Go to Project Settings → **Environment Variables**
2. If using Vercel Postgres:
   - Add new variable: `DATABASE_URL`
   - Value: Copy from `POSTGRES_PRISMA_URL` (should end with `?pgbouncer=true&connect_timeout=15`)
3. Apply to: **Production, Preview, Development**

### Step 5: Deploy! (2 minutes)

1. Click **"Deploy"** button
2. Wait for build to complete (usually 1-2 minutes)
3. ✅ Your site will be live at `https://your-project.vercel.app`

### Step 6: Set Up Production Database (5 minutes)

Your app is live but database is empty! Let's populate it:

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
cd /Users/jimmyjiggler/Documents/rommy/ts
vercel login
vercel link

# Pull production environment variables
vercel env pull .env.production

# Run migrations
bunx prisma migrate deploy

# Import your data
bun run db:import
```

**Option B: Manual (Alternative)**

```bash
# Get your production DATABASE_URL from Vercel dashboard
# Then run locally:

export DATABASE_URL="your_production_postgres_url_here"

# Run migrations
bunx prisma migrate deploy

# Import data
bun run db:import prisma/exports/db-export-2025-12-21.json
```

### Step 7: Verify Deployment (2 minutes)

Visit your deployed site and check:

- ✅ Homepage loads
- ✅ `/learn` page shows 4 regions (Arms, Back, Chest, Shoulders)
- ✅ `/learn/arms` loads with Uncle Rommy's guide
- ✅ `/anatomy` page shows anatomy explorer
- ✅ Exercise videos play
- ✅ Images load from `/public/guides/`

---

## 🐛 Troubleshooting

### "Can't reach database server"

**Fix:** Check DATABASE_URL in Vercel environment variables
- Go to Settings → Environment Variables
- Verify `DATABASE_URL` matches `POSTGRES_PRISMA_URL` (if using Vercel Postgres)
- Redeploy after changing

### "Prisma Client not initialized"

**Fix:** Regenerate Prisma client in build
- This should happen automatically
- If not, check your `package.json` has `"postinstall": "prisma generate"`
- Or add it:
  ```json
  "scripts": {
    "postinstall": "prisma generate"
  }
  ```

### Build fails with module errors

**Fix:** Clear build cache
- Go to Settings → Functions
- Click "Clear Build Cache"
- Redeploy

### Images not loading

**Check:**
- Images should be in `/ts/public/guides/`
- Access at `/guides/arms/page3_img1.jpeg` (no /public in URL)
- Verify files are committed to GitHub

### Database is empty after deploy

**You need to import data!** See Step 6 above.

---

## 📊 What Gets Deployed

### Your App:
- ✅ Next.js 15 app with App Router
- ✅ 201 exercises with videos
- ✅ 4 muscle group guides (Arms, Back, Chest, Shoulders)
- ✅ 70 anatomy nodes (hierarchical structure)
- ✅ Learn & Learn2 pages
- ✅ GraphQL API at `/api/graphql`
- ✅ Formula & Workout systems

### Database (After Import):
- ✅ 201 exercises (155 with CDN videos)
- ✅ 70 anatomy nodes
- ✅ 63 guide sections
- ✅ 17 formulas
- ✅ 4 complete workouts
- ✅ All relationships and links

### Static Assets:
- ✅ 224 guide images (arms, back, chest, shoulders)
- ✅ From `/public/guides/` served at `/guides/`

---

## 🔧 Optional: Custom Domain

1. Go to Project Settings → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `rommy.fitness`)
4. Follow DNS configuration instructions
5. Wait for DNS to propagate (5-30 minutes)

---

## 📝 Environment Variables Summary

Required for production:

```env
DATABASE_URL="postgresql://..." or from POSTGRES_PRISMA_URL
```

Auto-added by Vercel Postgres:
```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..." (use this for Prisma)
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"
```

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Site loads at vercel.app URL
- [ ] `/learn` shows 4 muscle regions
- [ ] `/learn/arms` shows Uncle Rommy's guide
- [ ] Exercise videos play
- [ ] Images display correctly
- [ ] `/anatomy` explorer works
- [ ] GraphQL API responds at `/api/graphql`
- [ ] No console errors in browser

---

## 💡 Pro Tips

1. **Use Preview Deployments** - Every git branch gets auto-deployed
2. **Enable Vercel Analytics** - Free usage tracking (Settings → Analytics)
3. **Set up Monitoring** - Enable error tracking
4. **Branch Protection** - Set `main` as production branch
5. **Local Development** - Keep using SQLite locally, PostgreSQL only for production

---

## 🚨 Important Notes

- **Dev Database:** Your local `dev.db` is NOT on GitHub (gitignored ✅)
- **Production Data:** Lives in PostgreSQL on Vercel
- **Backups:** You have `db-export-2025-12-21.json` (405 KB)
- **Images:** Are in git and deploy automatically
- **Videos:** CDN URLs work immediately (155/201 ready)

---

## 🔄 Future Deployments

Every time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel automatically:
1. Detects the push
2. Builds your app
3. Deploys to production
4. Takes ~2 minutes

---

**Need help?** Check `VERCEL_DEPLOYMENT.md` for detailed troubleshooting or the official Vercel docs at https://vercel.com/docs

**Ready to deploy?** Go to https://vercel.com/new and import `chukwuebukwa/rommy`! 🚀

