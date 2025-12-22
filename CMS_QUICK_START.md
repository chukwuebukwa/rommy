# 🚀 Guide CMS - Quick Start

## What I Just Built For You

A complete WordPress-style CMS for creating custom training guides with full control over:
- ✍️ Custom text content per section
- 🖼️ Image selection from your library
- 📄 Multiple pages/sections
- 🎨 Beautiful layouts
- 👁️ Live preview
- 💾 Database integration

## How to Access

### 1. Go to the CMS Dashboard
```
http://localhost:3002/guides
```

Or click the **"Guide"** card on your homepage (shows guide count)

### 2. Create Your First Guide

Click **"✨ Create New Guide"** and you'll get:

**Guide Settings:**
- Title: "Complete Arms Training" ✏️
- Slug: "complete-arms-training" 🔗
- Author: "Uncle Rommy" 👨
- Region: Select "arms" 🎯

**Add Sections:**
- Click "➕ Add New Section"
- Choose section type (Intro, Anatomy, Tips, etc.)
- Write content in the text box
- Click "➕ Add Images" to pick from your library
- Reorder with ↑↓ buttons

**Preview & Save:**
- Click "👁️ Preview" to see how it looks
- Click "💾 Save Guide" to publish

## 🖼️ Image Library

You have **224 images** organized by category:
- **arms**: 69 images
- **back**: 51 images  
- **chest**: 56 images
- **shoulders**: 48 images

The image picker lets you:
- Browse by category
- Search by filename
- Select multiple images
- Preview before adding

## 📍 Where Your Guides Appear

### 1. Individual Guide Page
```
http://localhost:3002/guides/[id]
```
Clean, readable view with image galleries

### 2. Learn Section
```
http://localhost:3002/learn/arms
```
If you set `Primary Region: arms`, your guide appears in the "Guide" tab

### 3. CMS Dashboard
```
http://localhost:3002/guides
```
Manage all guides, see stats, edit/view/delete

## 🎨 Section Types

Choose from 9 beautiful section types:
- 👋 **Introduction** - Start your guide
- 🦾 **Anatomy** - Explain muscles
- 🧠 **Mindset** - Uncle Rommy wisdom
- 💪 **Strength** - Training principles  
- 📋 **Program** - Workout structure
- 🏋️ **Exercise** - Movement details
- 💡 **Tips & Tricks** - Pro advice
- 🔬 **Science** - Research insights
- 🎯 **Conclusion** - Wrap it up

## ✨ Features

- **Drag & Reorder**: Move sections up/down
- **Collapse/Expand**: Focus on one section at a time
- **Image Grid**: Automatic gallery layout
- **Character Count**: See content length
- **Live Preview**: No surprises
- **Auto-Save**: Database persistence

## 📁 Files I Created

```
app/
├── guides/
│   ├── page.tsx                    # CMS Dashboard
│   ├── [id]/page.tsx              # View published guide  
│   └── editor/[id]/page.tsx       # Editor (create/edit)

components/
├── GuideEditor.tsx         # Main editor
├── SectionEditor.tsx       # Section editor
└── ImagePicker.tsx         # Image browser

app/api/guides/
├── images/route.ts         # Image library API
└── save/route.ts           # Save guide API
```

## 🎯 Example Workflow

1. **Navigate**: `http://localhost:3002/guides`
2. **Create**: Click "Create New Guide"
3. **Name**: "Complete Arms Training"
4. **Region**: Select "arms"
5. **Add Intro**: Type intro content
6. **Add Images**: Select 3 arm anatomy images
7. **Add More Sections**: Anatomy, exercises, tips
8. **Preview**: Check how it looks
9. **Save**: Publish to database
10. **View**: See at `/guides/arms` and `/learn/arms`

## 💡 Pro Tips

- **Start with structure**: Add all section titles first, then fill in content
- **Use Preview often**: See your guide as readers will
- **Pick relevant images**: 2-4 per section is perfect
- **Mix section types**: Vary between anatomy, tips, exercises
- **Link to regions**: Makes it appear in Learn pages

## 🚀 Next Steps

1. **Create your first guide** for Arms
2. **Add images** from your library
3. **Preview** to see the layout
4. **Save & view** the published version
5. **Repeat** for Back, Chest, Shoulders

---

**You now have a full CMS!** Create as many guides as you want, with complete control over every page, image, and word. 🎉

For detailed docs, see: [GUIDE_CMS_README.md](./GUIDE_CMS_README.md)

