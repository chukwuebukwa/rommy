# 🖼️ Image Integration System Guide

Complete guide for the Rommy database export/import system with image references.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Directory Structure](#directory-structure)
4. [Available Commands](#available-commands)
5. [Complete Workflow](#complete-workflow)
6. [Viewing Images in the App](#viewing-images-in-the-app)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This system allows you to:
- ✅ Export your entire database including image references
- ✅ Import/restore the database with all images linked
- ✅ Display guide images automatically in your Next.js app
- ✅ Keep images organized by guide (arms, shoulders, back, chest)

**Total Images:** 224 across 4 guides (arms: 69, shoulders: 48, back: 51, chest: 56)

---

## How It Works

### 1. Schema
The `Section` model has an `images` field:
```prisma
model Section {
  id       String   @id
  guideId  String
  kind     String
  title    String
  order    Int
  content  String
  images   Json?    // Array of image paths: ["arms/page9_img1.jpeg"]
  // ...
}
```

### 2. Image References
Images are stored as JSON arrays with **namespaced paths**:
```json
{
  "images": "[\"arms/page9_img1.jpeg\",\"arms/page9_img2.jpeg\"]"
}
```

### 3. Physical Images
Images are served from:
```
public/guides/
  ├── arms/       (69 images)
  ├── shoulders/  (48 images)
  ├── back/       (51 images)
  └── chest/      (56 images)
```

---

## Directory Structure

```
ts/
├── prisma/
│   ├── schema.prisma              # Has images field on Section
│   ├── export-db.ts               # Exports database to JSON
│   ├── import-db.ts               # Imports database from JSON
│   ├── extract-guide-images.ts    # Extracts images from structured_data
│   ├── auto-map-sections.ts       # Auto-maps sections to pages
│   ├── update-section-images.ts   # Updates DB with image references
│   ├── image-mappings.json        # Generated: page→image mapping
│   ├── section-page-mapping.json  # Generated: section→pages mapping
│   └── exports/
│       └── db-export-2025-12-10.json  # Latest database export
│
├── full-exports/                  # Original PDF exports (backup)
│   ├── arms_export/
│   │   ├── images/
│   │   └── structured_data.json
│   ├── shoulders_export/
│   ├── back_export/
│   └── chest_export/
│
└── public/
    └── guides/                    # Images served from here
        ├── arms/
        ├── shoulders/
        ├── back/
        └── chest/
```

---

## Available Commands

### Database Export/Import
```bash
# Export current database (includes images)
bun run db:export

# Import database from latest export
bun run db:import

# Import from specific file
bun run db:import prisma/exports/db-export-2025-12-10.json
```

### Image System
```bash
# Extract images from structured_data files
bun run images:extract

# Auto-map sections to pages (smart matching)
bun run images:automap

# Update database with image references
bun run images:update
```

### Development
```bash
# Start dev server
bun run dev

# Open Prisma Studio (view database)
bun run studio
```

---

## Complete Workflow

### Initial Setup (Already Done ✅)
```bash
# 1. Images extracted from structured_data.json
bun run images:extract

# 2. Sections auto-mapped to pages
bun run images:automap

# 3. Database updated with image references
bun run images:update

# 4. Images copied to public directory
# Done automatically

# 5. Database exported
bun run db:export
```

### Daily Usage

#### Making Changes
1. Edit database via Prisma Studio or your app
2. Export when ready:
   ```bash
   bun run db:export
   ```
3. Commit the export to git (optional)

#### Restoring from Export
```bash
# Reset and import
bun run db:reset --skip-seed
bun run db:import
```

#### Adding New Guides with Images
If you get new guide exports:

```bash
# 1. Add new export folder to full-exports/
# Example: full-exports/legs_export/

# 2. Re-extract images
bun run images:extract

# 3. Auto-map sections
bun run images:automap

# 4. Update database
bun run images:update

# 5. Copy images to public
cp full-exports/legs_export/images/* public/guides/legs/

# 6. Export updated database
bun run db:export
```

---

## Viewing Images in the App

### In Guide Pages

Images display automatically in guide sections that have them.

**URL:** `http://localhost:3000/guides/arms`

**Code:** See `components/GuideDetailClient.tsx`

```tsx
{section.images && (() => {
  const imageList = JSON.parse(section.images) as string[];
  return imageList.length > 0 ? (
    <div className="mt-6 pt-4 border-t">
      <h3 className="font-semibold text-gray-900 mb-3">📸 Images</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageList.map((imagePath) => (
          <img
            key={imagePath}
            src={`/guides/${imagePath}`}
            alt={section.title}
            className="w-full h-auto"
          />
        ))}
      </div>
    </div>
  ) : null;
})()}
```

### Sections with Images (Current)

| Guide | Section | Image Count |
|-------|---------|-------------|
| Arms | intro-young-man-muscle | 3 images |
| Arms | anatomy-overview-arms | 1 image |
| Arms | anatomy-biceps | 6 images |
| Arms | anatomy-triceps | 3 images |
| Arms | formulas-arms | 2 images |
| Arms | anatomy-forearms | 2 images |
| Shoulders | anatomy-shoulders-overview | 1 image |
| Shoulders | anatomy-rear-delt-supremacist | 1 image |
| Shoulders | anatomy-side-and-front-delts | 2 images |
| Shoulders | anatomy-rotator-cuff-shoulders | 1 image |
| Shoulders | mobility-shoulders | 2 images |
| Back | back-rhomboids | 1 image |
| Back | back-rear-delts | 1 image |
| Back | back-middle-traps | 2 images |
| Back | anatomy-traps | 2 images |
| Back | back-lower-traps | 2 images |
| Back | mobility-back | 4 images |
| Back | shoulder-rehab-sequence | 1 image |
| Back | back-shoulder-rehab-exercise-bank | 3 images |

**Total: 19 sections with images**

---

## Troubleshooting

### Images Not Showing in App

**Check:**
1. Images exist in `public/guides/[guidename]/`
   ```bash
   ls public/guides/arms/
   ```

2. Section has images in database:
   ```bash
   sqlite3 prisma/dev.db "SELECT id, images FROM Section WHERE images IS NOT NULL;"
   ```

3. Dev server is running:
   ```bash
   bun run dev
   ```

### Import Not Working

**Solution:**
```bash
# Make sure you have a valid export file
ls prisma/exports/

# Try importing specific file
bun run db:import prisma/exports/db-export-2025-12-10.json
```

### Need to Re-map Images

**If sections don't have correct images:**
```bash
# Re-run auto-mapping
bun run images:automap

# Update database
bun run images:update

# Export
bun run db:export
```

### Missing Images in Export

**The export always includes image references because they're stored in the Section table.**

Check export has images:
```bash
grep '"images": "\[' prisma/exports/db-export-2025-12-10.json | wc -l
# Should show: 19
```

---

## Quick Reference Card

### Most Common Commands
```bash
# Export database
bun run db:export

# Import database
bun run db:import

# View database
bun run studio

# Start app
bun run dev
```

### File Locations
- **Export:** `prisma/exports/db-export-2025-12-10.json`
- **Images:** `public/guides/[guidename]/`
- **Originals:** `full-exports/[guide]_export/images/`

### Image Path Format
- **In Database:** `"[\"arms/page9_img1.jpeg\"]"`
- **In App:** `/guides/arms/page9_img1.jpeg`
- **On Disk:** `public/guides/arms/page9_img1.jpeg`

---

## Summary

✅ **Images are in the database** (as JSON references)  
✅ **Images are on disk** (`public/guides/`)  
✅ **Images display in the app** (GuideDetailClient.tsx)  
✅ **Export includes images** (automatic)  
✅ **Import restores images** (automatic)  

**Everything works together seamlessly!** 🎉

---

*Last Updated: December 10, 2025*
*System Version: 1.0*
*Total Images: 224*

