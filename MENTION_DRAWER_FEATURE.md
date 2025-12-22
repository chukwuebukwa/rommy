# 🎯 Mention Drawer - Sidebar Preview for Exercises & Anatomy

## ✨ What It Does

When you **click on a mention** in a guide (exercise or anatomy), a **beautiful sidebar drawer** slides in from the right showing all the details - **without navigating away** from the guide!

### Features:
- 📊 **Full details** in a side panel
- 🎬 **Video player** for exercises (if available)
- 🎯 **Targeted anatomy** for exercises
- 🏋️ **Related exercises** for anatomy
- 🔗 **Quick link** to full page
- 🎨 **Beautiful UI** with gradient headers
- ⚡ **Smooth animations** (slide in/out)
- 📱 **Responsive** (full width on mobile, 600px on desktop)

---

## 🚀 How It Works

### 1. **In View Mode**

When reading a guide at `/guides/[id]` or `/learn/[region]`:

```
You see text with mentions:
"Train your 🦾 Biceps with 🏋️ Barbell Curls"
             └───┬────┘      └──────┬──────┘
            Clickable      Clickable
```

### 2. **Click a Mention**

**Before (old behavior):**
- Clicked → navigated to `/exercises/barbell_curl`
- Lost your place in the guide ❌

**Now (new behavior):**
- Clicked → drawer slides in from right ✅
- Shows all details ✅
- Stay in the guide ✅
- Can close and continue reading ✅

### 3. **Drawer Content**

**For Exercises:**
- 🎬 Video player (if CDN video available)
- 📊 Type & movement pattern
- 🏋️ Equipment needed
- 💡 Form cues
- 🎯 Targeted anatomy (primary/secondary)
- 🔗 "View Full Page" button

**For Anatomy:**
- 📋 Description & role summary
- ⚡ Primary functions
- 💪 Aesthetic notes
- 🏋️ Related exercises (top 10)
- 🔗 Sub-parts/children
- 🔗 "View Full Page" button

---

## 🏗️ Technical Architecture

### Components

**`MentionDrawer.tsx`**
- Main drawer component
- Handles open/close state
- Fetches data via API
- Renders exercise or anatomy details
- Responsive layout
- Backdrop with click-to-close

**`MentionRenderer.tsx` (Updated)**
- Changed from `<Link>` to `<button>`
- Opens drawer on click instead of navigating
- Passes type (exercise/anatomy) and ID to drawer

### API Route

**`/api/mention-data`**
- Accepts `?type=exercise&id=barbell_curl`
- Fetches from GraphQL
- Returns complete data for drawer

**Query Parameters:**
- `type`: "exercise" or "anatomy"
- `id`: The exercise/anatomy ID

**Returns:**
- Exercise: name, type, pattern, equipment, cues, anatomy links, video URL
- Anatomy: name, description, functions, notes, exercises, children

---

## 🎨 UI Design

### Drawer Structure

```
┌─────────────────────────────────────┐
│ [Gradient Header]                   │
│ 🏋️ Exercise                          │
│ Barbell Curl                     ✕  │
├─────────────────────────────────────┤
│                                     │
│ [Video Player]                      │
│                                     │
│ Type: Isolation                     │
│ Pattern: Curl                       │
│                                     │
│ 🏋️ Equipment                         │
│ • Barbell                           │
│                                     │
│ 💡 Form Cues                         │
│ Keep elbows stationary...           │
│                                     │
│ 🎯 Targets                           │
│ • Biceps Long Head (primary)        │
│ • Biceps Short Head (primary)       │
│ • Brachialis (secondary)            │
│                                     │
│ [View Full Page →]                  │
└─────────────────────────────────────┘
```

### Colors & Styling

**Gradient Header:**
- `from-blue-600 to-purple-600`
- White text
- Sticky position

**Exercise Content:**
- Green badges for equipment
- Yellow box for form cues
- Blue boxes for anatomy targets

**Anatomy Content:**
- Purple gradient background
- Green checkmarks for functions
- Blue bullets for aesthetic notes
- Gray boxes for exercises

### Animations

- **Slide in:** Right to left
- **Backdrop:** Fade in
- **Close:** Smooth transition out
- **Loading:** Pulse animation

---

## 📱 Responsive Design

**Desktop (>768px):**
- Drawer width: 600px
- Right side of screen
- Backdrop covers rest

**Mobile (<768px):**
- Drawer width: 100%
- Covers entire screen
- Still has close button

---

## 🎬 User Flow Example

### Reading Arms Guide

1. **Reading section** about biceps training
2. **See mention**: "Focus on the 🦾 Biceps Long Head"
3. **Click** on "Biceps Long Head"
4. **Drawer slides in** from right
5. **Shows**:
   - Description: "Outer portion of the bicep..."
   - Primary functions: "Elbow flexion, shoulder stability"
   - Related exercises: "Incline Curl, Spider Curl..."
6. **Click** "View Full Page" if you want more
7. **Or close** drawer and continue reading
8. **Guide stays** in the same spot

---

## 🔧 Integration Points

### Where It Works:

✅ **Guide view pages** (`/guides/[id]`)
✅ **Learn pages** (`/learn/[region]`)
✅ **Any component** using `MentionRenderer`

### What It Needs:

- GraphQL API (for data fetching)
- Valid exercise/anatomy IDs in mentions
- Format: `@[Name](type:id)`

---

## 🎯 Benefits

### For Readers:
- ✅ **No context switching** - stay in the guide
- ✅ **Quick reference** - see details instantly
- ✅ **Video preview** - watch technique without leaving
- ✅ **Smooth UX** - beautiful animations

### For Content:
- ✅ **Rich linking** - connect content seamlessly
- ✅ **Deep info** - provide full details on demand
- ✅ **Better retention** - readers stay engaged
- ✅ **Professional look** - polished experience

---

## 💡 Usage Tips

**As a Guide Writer:**
1. Use @mentions freely throughout your content
2. Mention exercises when describing techniques
3. Mention anatomy when explaining muscles
4. Readers can explore without leaving

**As a Reader:**
1. Click any colored badge (green/blue)
2. Explore details in the drawer
3. Click outside or ✕ to close
4. Continue reading where you left off

---

## 🚀 Try It Now!

1. **Go to**: `http://localhost:3002/guides/arms`
2. **Find a mention** (look for 🏋️ green or 🦾 blue badges)
3. **Click it**
4. **Watch** the drawer slide in
5. **Explore** the content
6. **Close** and continue reading

---

## 🔮 Future Enhancements (Optional)

### Keyboard Shortcuts
- `Esc` to close drawer
- `←` `→` to navigate between mentions

### History
- Back/forward through drawer history
- Remember what you've viewed

### Pin Mode
- Keep drawer open while scrolling guide
- Side-by-side reading

### Notes
- Add personal notes to exercises/anatomy
- Save for later reference

---

**Enjoy your interactive guide experience!** 🎉

Click mentions, explore details, stay in flow!

