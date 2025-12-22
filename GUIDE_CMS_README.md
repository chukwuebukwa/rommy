# 📚 Guide CMS - Custom Guide Builder

A beautiful, WordPress-style CMS for creating and managing custom training guides with full control over content, images, and layout.

## 🚀 Quick Start

### Access the CMS Dashboard

Navigate to: **`http://localhost:3002/guides`**

This is your main CMS dashboard where you can:
- View all existing guides
- Create new guides
- Edit existing guides
- See stats (total guides, sections, regions covered)

## ✨ Creating a New Guide

### 1. Start Creating

Click **"✨ Create New Guide"** on the dashboard or go to:
```
http://localhost:3002/guides/editor/new
```

### 2. Fill in Guide Metadata

**Required Fields:**
- **Title**: The main title of your guide (e.g., "Arms Training Guide")
- **Slug**: URL-friendly identifier (e.g., "arms-training-guide")

**Optional Fields:**
- **Author**: Who wrote it (defaults to "Uncle Rommy")
- **Primary Region**: Link to an anatomy region (arms, back, chest, shoulders, etc.)

### 3. Add Sections

Click **"➕ Add New Section"** to create a new page/section.

Each section has:

#### Section Header
- **Title**: Section name (e.g., "Introduction", "Anatomy Overview")
- **Type**: Choose from 9 types:
  - 👋 Introduction
  - 🦾 Anatomy
  - 🧠 Mindset
  - 💪 Strength
  - 📋 Program
  - 🏋️ Exercise
  - 💡 Tips & Tricks
  - 🔬 Science
  - 🎯 Conclusion

#### Content Editor
- **📝 Content**: Write your text content here
  - Multi-line support
  - Preserves formatting
  - Character count displayed
  - Think of it like writing a page in a PDF

#### Image Manager
- **🖼️ Images**: Add images from your library
  - Click "➕ Add Images"
  - Browse by category (arms, back, chest, shoulders)
  - Select multiple images
  - Preview before adding
  - Remove images with the ✕ button

#### Section Controls
- **↑ / ↓**: Reorder sections
- **🗑️**: Delete section
- **▼ / ▶**: Collapse/expand section

### 4. Preview Your Guide

Click **"👁️ Preview"** to see how your guide will look when published:
- Beautiful typography
- Image galleries
- Section badges
- Professional layout

### 5. Save & Publish

Click **"💾 Save Guide"** to:
- Save to database
- Create all sections
- Make it available at `/guides/[id]`
- Show it in the Learn section (if linked to a region)

## 🖼️ Image Library

Your images are organized by muscle group:

```
public/guides/
  ├── arms/        (69 images)
  ├── back/        (51 images)
  ├── chest/       (56 images)
  └── shoulders/   (48 images)
```

The **ImagePicker** component:
1. Shows all categories with image counts
2. Lets you browse images in each category
3. Search functionality
4. Multi-select with visual feedback
5. Shows selected count

## 📄 Viewing Published Guides

### Individual Guide View
```
http://localhost:3002/guides/[id]
```

Features:
- Clean, readable layout
- Image galleries per section
- Section type badges
- Links to anatomy nodes
- Links to exercises
- Easy navigation back to dashboard
- Quick edit button

### In Learn Section
If you linked your guide to a Primary Region (e.g., "arms"), it will automatically appear in:
```
http://localhost:3002/learn/arms
```

With a dedicated "Guide" tab showing all sections.

## 🎨 Design Features

### Beautiful UI Elements
- **Gradient stats cards** on dashboard
- **Hover effects** on all interactive elements
- **Modal dialogs** for image picker
- **Responsive grid layouts** for images
- **Typography optimized** for reading
- **Shadow and border effects** for depth
- **Color-coded badges** by section type

### Section Types & Colors
- All types have distinct emoji icons
- Purple badges (`bg-purple-100 text-purple-800`)
- Semantic meaning for organization

## 📊 Features Breakdown

### ✅ What You Can Do

1. **Full Content Control**
   - Write custom text for each section
   - Multi-line, formatted text
   - As many sections as you want

2. **Image Management**
   - Pick specific images per section
   - Multiple images per section
   - Browse existing library by category
   - Search by filename

3. **Multi-Page Support**
   - Each section = a "page"
   - Reorder easily with drag controls
   - Collapse sections while editing

4. **Beautiful Layouts**
   - Automatic image galleries
   - Responsive design
   - Professional typography
   - Magazine-style presentation

5. **Preview Mode**
   - See exactly how it will look
   - No surprises when publishing
   - Easy toggle back to editing

6. **Database Integration**
   - Saves to PostgreSQL/Prisma
   - GraphQL API access
   - Automatic section ordering
   - Update existing guides

### 🎯 Integration Points

Your guides automatically integrate with:

1. **Anatomy System**
   - Link to regions, groups, muscles
   - Cross-reference in guide sections
   - Show in Learn pages

2. **Exercise Library**
   - Reference exercises in sections
   - Automatic linking
   - Show in guide context

3. **GraphQL API**
   - Query guides via GraphQL
   - Full type safety
   - Nested section queries

## 🛠️ Technical Architecture

### Components

```
components/
├── GuideEditor.tsx         # Main editor with section management
├── SectionEditor.tsx       # Individual section editor
└── ImagePicker.tsx         # Image browser & selector
```

### Pages

```
app/
├── guides/
│   ├── page.tsx                    # Dashboard/CMS home
│   ├── [id]/page.tsx              # View published guide
│   └── editor/[id]/page.tsx       # Edit/create guide
└── api/
    └── guides/
        ├── images/route.ts         # Image library API
        └── save/route.ts           # Save guide API
```

### Database Schema

```prisma
model Guide {
  id              String       @id
  slug            String       @unique
  title           String
  author          String?
  primaryRegionId String?
  primaryRegion   AnatomyNode?
  sections        Section[]
}

model Section {
  id       String   @id
  guideId  String
  kind     String
  title    String
  order    Int
  content  String
  images   Json?    // Array of image paths
}
```

### API Endpoints

**GET `/api/guides/images`**
- Without `category`: Returns all categories with counts
- With `?category=arms`: Returns all images in that category

**POST `/api/guides/save`**
- Saves complete guide with all sections
- Creates or updates based on ID
- Returns saved guide data

### GraphQL Queries

```graphql
# Get all guides
query {
  guides {
    id
    title
    sections { id title }
  }
}

# Get single guide with content
query GetGuide($id: String!) {
  guide(id: $id) {
    title
    author
    sections {
      kind
      title
      content
      images
    }
  }
}
```

## 💡 Tips & Best Practices

### Writing Great Guides

1. **Start with an Introduction section** to set the tone
2. **Use Anatomy sections** to explain the science
3. **Add Mindset sections** for Uncle Rommy's wisdom
4. **Include Exercise sections** with specific movements
5. **End with a Conclusion** to tie it together

### Image Selection

1. **Choose relevant images** that match the content
2. **Use 2-4 images per section** for visual variety
3. **Mix diagram types**: muscles, exercises, form
4. **Consider image flow** - tell a visual story

### Organization

1. **Use descriptive titles** for easy navigation
2. **Keep sections focused** - one topic per section
3. **Order logically** - intro → content → conclusion
4. **Preview often** to see the flow

### SEO & URLs

1. **Use descriptive slugs**: "complete-arms-guide" not "guide1"
2. **Match ID to content**: `id: "arms"` for arms guide
3. **Link to regions** for better navigation

## 🔄 Workflow Example

Here's a typical workflow for creating a new guide:

1. **Go to dashboard**: `http://localhost:3002/guides`
2. **Click "Create New Guide"**
3. **Enter metadata**:
   - Title: "Complete Shoulder Training"
   - Slug: "complete-shoulder-training"
   - Author: "Uncle Rommy"
   - Region: "shoulders"
4. **Add Introduction section**:
   - Type: Introduction
   - Title: "Building Cannonball Delts"
   - Content: [Write intro text]
   - Images: Add 2-3 shoulder overview images
5. **Add Anatomy section**:
   - Type: Anatomy
   - Title: "The Three Heads"
   - Content: [Explain anterior, lateral, posterior delts]
   - Images: Add anatomy diagrams
6. **Add more sections** (Exercise, Tips, etc.)
7. **Click Preview** to review
8. **Make adjustments**
9. **Click Save**
10. **View at** `/guides/complete-shoulder-training`
11. **Also visible at** `/learn/shoulders` (Guide tab)

## 🚨 Troubleshooting

### Images Not Showing
- Check image exists in `public/guides/[category]/`
- Verify path format: `category/filename.jpg`
- No leading slash needed

### Save Fails
- Ensure Title and Slug are filled
- Check database connection
- Look at browser console for errors
- Verify Prisma client is working

### GraphQL Errors
- Check schema is built: `bun run prisma generate`
- Restart dev server
- Verify database has Guide/Section tables

## 🎓 Next Steps

1. **Create your first guide** using the CMS
2. **Customize section types** if needed
3. **Add more images** to `public/guides/`
4. **Link guides to anatomy** for Learn page integration
5. **Create guide templates** for different muscle groups

## 📚 Related Documentation

- [LEARN_PAGE_README.md](./LEARN_PAGE_README.md) - Learn page integration
- [IMAGE_SYSTEM_GUIDE.md](./IMAGE_SYSTEM_GUIDE.md) - Image management
- [GRAPHQL_README.md](./GRAPHQL_README.md) - GraphQL API docs

---

**Enjoy your new Guide CMS!** 🎉

Create beautiful, custom guides just like writing a PDF or WordPress post, with full control over every page!

