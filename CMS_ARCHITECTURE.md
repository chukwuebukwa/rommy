# 📐 Guide CMS Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GUIDE CMS SYSTEM                          │
│                    "Your WordPress for Guides"                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   Dashboard      │       │   Editor         │       │   Published      │
│   /guides        │──────▶│   /guides/       │──────▶│   /guides/[id]   │
│                  │       │   editor/[id]    │       │                  │
│  • View all      │       │  • Create/Edit   │       │  • Read guide    │
│  • Stats         │       │  • Sections      │       │  • Beautiful     │
│  • Create new    │       │  • Images        │       │  • Image gallery │
│  • Edit/Delete   │       │  • Preview       │       │  • Links         │
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

## Page Flow

```
Homepage (/)
    │
    ├─▶ Click "Guide" card ──▶ Dashboard (/guides)
    │                              │
    │                              ├─▶ Create New ──▶ Editor (/guides/editor/new)
    │                              │                      │
    │                              │                      ├─▶ Fill metadata
    │                              │                      ├─▶ Add sections
    │                              │                      ├─▶ Pick images
    │                              │                      ├─▶ Preview
    │                              │                      └─▶ Save ──▶ Published view
    │                              │
    │                              └─▶ Edit Existing ──▶ Editor (/guides/editor/[id])
    │
    └─▶ Learn (/learn/[region]) ──▶ Guide Tab (if linked to region)
```

## Component Hierarchy

```
GuideEditor (Main Editor)
├── Guide Metadata Form
│   ├── Title input
│   ├── Slug input
│   ├── Author input
│   └── Region selector
│
├── Sections List
│   └── SectionEditor (for each section)
│       ├── Section Header
│       │   ├── Type selector (9 types)
│       │   ├── Title input
│       │   └── Controls (up/down/delete)
│       │
│       ├── Content Editor
│       │   └── Textarea (multi-line)
│       │
│       └── Image Manager
│           ├── Image Grid (display)
│           └── ImagePicker (modal)
│               ├── Category sidebar
│               ├── Image grid
│               ├── Search bar
│               └── Selection controls
│
├── Add Section Button
│
└── Actions Bar
    ├── Preview Button ──▶ Preview Mode
    └── Save Button ──▶ API call
```

## Data Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       │ User creates/edits guide
       ▼
┌──────────────────┐
│  GuideEditor     │◀─── Load existing guide (if editing)
│  (React State)   │
└──────┬───────────┘
       │
       │ Click Save
       ▼
┌──────────────────┐
│  POST /api/      │
│  guides/save     │
└──────┬───────────┘
       │
       │ Prisma operations
       ▼
┌──────────────────┐
│   PostgreSQL     │
│   Database       │
│                  │
│  Guide table     │
│  Section table   │
└──────┬───────────┘
       │
       │ GraphQL query
       ▼
┌──────────────────┐
│  Published View  │
│  /guides/[id]    │
└──────────────────┘
```

## Image System

```
public/guides/                      Browser
    ├── arms/                          │
    │   ├── image1.jpeg                │
    │   ├── image2.png          ┌──────▼──────┐
    │   └── ...                 │  GET /api/  │
    ├── back/                   │  guides/    │
    ├── chest/                  │  images     │
    └── shoulders/              └──────┬──────┘
                                       │
                            Read filesystem
                                       │
                            ┌──────────▼────────────┐
                            │  Return JSON:         │
                            │  {                    │
                            │    categories: [...], │
                            │    images: [...]      │
                            │  }                    │
                            └───────────────────────┘
                                       │
                            ┌──────────▼────────────┐
                            │   ImagePicker         │
                            │   Component           │
                            │                       │
                            │  • Browse categories  │
                            │  • Search images      │
                            │  • Multi-select       │
                            │  • Return selections  │
                            └───────────────────────┘
```

## Database Schema

```sql
┌──────────────────────────────────────────────────┐
│ Guide                                             │
├──────────────────────────────────────────────────┤
│ id: String (PK)         "arms"                   │
│ slug: String (Unique)   "conceal-carry-pythons"  │
│ title: String           "Arms Training Guide"    │
│ author: String?         "Uncle Rommy"            │
│ primaryRegionId: String? "arms"                  │
│                                                   │
│ sections: Section[] ────┐                        │
└─────────────────────────┼────────────────────────┘
                          │
                          │ One-to-Many
                          │
                          ▼
┌──────────────────────────────────────────────────┐
│ Section                                           │
├──────────────────────────────────────────────────┤
│ id: String (PK)         "intro-young-man"        │
│ guideId: String (FK)    "arms"                   │
│ kind: String            "intro"                  │
│ title: String           "Introduction"           │
│ order: Int              0                        │
│ content: String         "Long text..."           │
│ images: Json            ["arms/page1.jpeg", ...] │
└──────────────────────────────────────────────────┘
```

## API Routes

```typescript
// GET /api/guides/images
// Returns categories or images for a category
{
  categories?: [
    { name: "arms", path: "arms", count: 69 },
    { name: "back", path: "back", count: 51 },
    ...
  ],
  images?: [
    "arms/page1_img1.jpeg",
    "arms/page1_img2.png",
    ...
  ]
}

// POST /api/guides/save
// Saves or updates a guide
{
  id: "arms",
  slug: "arms-guide",
  title: "Complete Arms Training",
  author: "Uncle Rommy",
  primaryRegionId: "arms",
  sections: [
    {
      id: "section_123",
      kind: "intro",
      title: "Introduction",
      order: 0,
      content: "Welcome...",
      images: ["arms/page1.jpeg"]
    },
    ...
  ]
}
```

## GraphQL Schema

```graphql
type Guide {
  id: ID!
  slug: String!
  title: String!
  author: String
  primaryRegion: AnatomyNode
  sections: [Section!]!
}

type Section {
  id: ID!
  kind: String!
  title: String!
  order: Int!
  content: String!
  images: [String]
  imageCount: Int!
  guide: Guide!
  focusAnatomyLinks: [SectionAnatomy!]!
  exerciseLinks: [SectionExercise!]!
}

type Query {
  guides: [Guide!]!
  guide(id: String!): Guide
  guideBySlug(slug: String!): Guide
}
```

## URL Structure

```
/guides                          # Dashboard (list all)
/guides/[id]                     # View published guide
/guides/editor/new              # Create new guide
/guides/editor/[id]             # Edit existing guide

/learn/[region]                 # Guide tab appears here (if linked)

/api/guides/images              # Image library API
/api/guides/images?category=arms # Images for specific category
/api/guides/save                # Save guide API
```

## Section Types

```
┌─────────────────────────────────────────────────────────┐
│ Section Type    │ Emoji │ Use Case                      │
├─────────────────────────────────────────────────────────┤
│ intro           │  👋   │ Start your guide              │
│ anatomy         │  🦾   │ Explain muscle structure      │
│ mindset         │  🧠   │ Mental approach & philosophy  │
│ strength        │  💪   │ Training principles           │
│ program         │  📋   │ Workout structure             │
│ exercise        │  🏋️   │ Specific movements            │
│ tips            │  💡   │ Pro advice & tricks           │
│ science         │  🔬   │ Research & studies            │
│ conclusion      │  🎯   │ Wrap up & summary             │
└─────────────────────────────────────────────────────────┘
```

## Integration Points

```
Guide CMS
    │
    ├─▶ Anatomy System
    │   └─ Link to regions/groups/muscles
    │
    ├─▶ Exercise Library
    │   └─ Reference exercises in sections
    │
    ├─▶ Learn Pages
    │   └─ Auto-appear when linked to region
    │
    ├─▶ GraphQL API
    │   └─ Query guides anywhere
    │
    └─▶ Image Library
        └─ Access 224 organized images
```

## User Journey

```
1. User wants to create an Arms guide
   ↓
2. Visits /guides dashboard
   ↓
3. Clicks "Create New Guide"
   ↓
4. Fills in:
   • Title: "Complete Arms Training"
   • Slug: "complete-arms-training"
   • Author: "Uncle Rommy"
   • Region: "arms"
   ↓
5. Adds Introduction section:
   • Type: Introduction
   • Title: "Welcome to Arms Training"
   • Content: [Types intro text]
   • Clicks "Add Images"
     ↓
     • Selects "arms" category
     • Chooses 3 anatomy diagrams
     • Confirms selection
   ↓
6. Adds more sections (Anatomy, Tips, Exercises)
   ↓
7. Clicks "Preview" to review
   ↓
8. Makes adjustments
   ↓
9. Clicks "Save Guide"
   ↓
10. Redirected to /guides/complete-arms-training
    ↓
11. Guide also appears at /learn/arms (Guide tab)
```

## Technology Stack

```
Frontend:
├── Next.js 14 (App Router)
├── React 18
├── TypeScript
└── Tailwind CSS

Backend:
├── Next.js API Routes
├── GraphQL (Pothos)
├── Prisma ORM
└── PostgreSQL

Components:
├── GuideEditor.tsx (main editor)
├── SectionEditor.tsx (section editing)
└── ImagePicker.tsx (image browser)

State Management:
└── React useState (local component state)

File System:
└── public/guides/[category]/[images]
```

---

## Summary

You now have a **complete CMS** that lets you:

1. ✅ Create custom guides from scratch
2. ✅ Write multi-page content with sections
3. ✅ Pick and choose images per section
4. ✅ Preview before publishing
5. ✅ Beautiful, magazine-style layouts
6. ✅ Integration with anatomy & exercises
7. ✅ Database persistence
8. ✅ GraphQL API access

**It's like WordPress for your fitness guides!** 🎉

