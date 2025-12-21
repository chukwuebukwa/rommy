# Database Export/Import System - Updated 🎉

## What Was Updated

### ✨ Enhanced Export Script (`prisma/export-db.ts`)

**New Features:**
1. **Version 2.0** - Enhanced export format
2. **Schema Version Tracking** - Tracks schema state (`with_cdn_video_url`)
3. **Configuration Files** - Now exports `learn-page-config.json` alongside database
4. **Field Verification** - Validates new fields like `cdnVideoUrl` are present
5. **Better Logging** - Detailed output with file size, record counts, and verification

**What Gets Exported:**
- ✅ All 14 database models (201 exercises, 70 anatomy nodes, 63 sections, etc.)
- ✅ All fields including new `cdnVideoUrl` (155/201 exercises have CDN videos)
- ✅ Configuration files (learn-page-config.json for Learn/Learn2 pages)
- ✅ Metadata (export date, version, schema version)

### 🔄 Enhanced Import Script (`prisma/import-db.ts`)

**New Features:**
1. **Config File Restoration** - Restores `learn-page-config.json` automatically
2. **Version Display** - Shows export version and schema version
3. **Better Logging** - Clear progress indicators for each import step

### 📊 Latest Export Stats

**File:** `prisma/exports/db-export-2025-12-21.json`
**Date:** December 21, 2025
**Size:** 405.10 KB
**Version:** 2.0 (with_cdn_video_url)

#### Database Records:
| Model | Count |
|-------|-------|
| anatomyNodes | 70 |
| guides | 4 |
| sections | 63 |
| sectionAnatomy | 228 |
| sectionExercise | 522 |
| **exercises** | **201** |
| exerciseAnatomy | 514 |
| formulas | 17 |
| formulaSteps | 37 |
| formulaTargets | 29 |
| workouts | 4 |
| workoutBlocks | 27 |
| workoutBlockTargets | 77 |
| workoutBlockExercises | 156 |

#### Exercise Video Status:
- 📹 **155/201** exercises have `cdnVideoUrl` (CDN-hosted videos)
- 🎬 **189/201** exercises have `videoUrl` (YouTube shorts)
- 📦 **46** exercises need CDN video upload

#### Configuration Files:
- ✅ `learnPageConfig` - Settings for Learn & Learn2 pages
  - Arms configuration
  - Back configuration (with cross-references)
  - Chest, Shoulders, Legs, Core configurations

## Schema Changes Captured

### Exercise Model - New Field:
```prisma
model Exercise {
  id              String   @id
  name            String
  type            String
  movementPattern String
  equipment       Json?
  videoUrl        String?     // YouTube shorts URL (existing)
  cdnVideoUrl     String?     // ✨ NEW: CDN video URL
  cueSummary      String?
  // ... relations
}
```

## Usage

### Export Database:
```bash
bun run db:export
```

### Import Database:
```bash
# Import most recent export
bun run db:import

# Import specific export file
bun run db:import prisma/exports/db-export-2025-12-21.json
```

## Comparison: Old vs New

| Feature | Old (v1.0) | New (v2.0) |
|---------|-----------|------------|
| Database Models | ✅ All 14 | ✅ All 14 |
| New Schema Fields | ❌ Missing cdnVideoUrl | ✅ Includes cdnVideoUrl |
| Config Files | ❌ Not included | ✅ learn-page-config.json |
| Schema Tracking | ❌ No version tracking | ✅ Schema version tag |
| Field Verification | ❌ No validation | ✅ Counts CDN videos |
| File Size | ~350 KB | 405 KB |
| Export Date | 2025-12-10 | 2025-12-21 |

## Why This Matters for Deployment

### Before (Old Export):
- Missing `cdnVideoUrl` field data
- No config file backups
- Can't verify schema completeness
- Learn/Learn2 pages would need manual config restoration

### After (New Export):
- ✅ Complete schema including all new fields
- ✅ Config files bundled with data
- ✅ Verification that 155 exercises have CDN videos ready
- ✅ Learn/Learn2 pages automatically configured on import
- ✅ Production-ready backup for Vercel deployment

## For Production Deployment

When you deploy to Vercel with PostgreSQL:

1. **Set up production database** (Vercel Postgres/Supabase/etc.)
2. **Update schema** to use `postgresql` instead of `sqlite`
3. **Run migrations:**
   ```bash
   DATABASE_URL="production_url" bunx prisma migrate deploy
   ```
4. **Import your data:**
   ```bash
   DATABASE_URL="production_url" bun run db:import
   ```
5. **Verify:**
   - All 201 exercises imported
   - 155 CDN videos accessible
   - Learn/Learn2 config working

## What Learn/Learn2 Use

The **Learn** and **Learn2** pages (`/learn/[id]` and `/learn2/[id]`) use:

### From Database:
- `AnatomyNode` - Hierarchy of regions, groups, muscles, parts
- `Guide` - Uncle Rommy's comprehensive guides per region
- `Section` - Guide sections with content and images
- `Exercise` - Exercise library with videos
- `Formula` - Superset patterns
- `Workout` - Complete workout programs

### From Config File:
- `learn-page-config.json` - Per-region settings:
  - `crossReferences` - Which anatomy nodes to show across regions
  - `excludeChildren` - Which child nodes to hide from tabs
  
Both are now captured in Version 2.0 exports! 🎉

## Files Modified

1. ✏️ `prisma/export-db.ts` - Enhanced with config export and verification
2. ✏️ `prisma/import-db.ts` - Enhanced with config restoration
3. ✏️ `.gitignore` - Added `*.db` and `*.db-journal` to exclude SQLite files
4. 📄 `VERCEL_DEPLOYMENT.md` - Complete deployment guide
5. 📄 `EXPORT_IMPORT_SUMMARY.md` - This file

## Next Steps

✅ **Completed:**
- Export script updated with all schema fields
- Import script updated to restore configs
- Fresh export created (2025-12-21)
- All fields verified (cdnVideoUrl present)

🚀 **Ready for Deployment:**
- GitHub repo is up to date (except .db files - now gitignored)
- Export file has complete data
- Follow `VERCEL_DEPLOYMENT.md` to deploy to Vercel

---

**Pro Tip:** Keep the old export (`db-export-2025-12-10.json`) as a backup, but use the new one (`db-export-2025-12-21.json`) for production deployment since it has all the latest fields!

