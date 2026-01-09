# Subpage Feature - Quick Visual Guide

## 🎯 In the Editor: What You'll See

### The Section Details Panel Now Has 3 Fields:

```
┌─ Section Details ──────────────────────────────────────────────┐
│                                            [➕ Add After]       │
│                                            [📑 Add Subsection] ← NEW!
│                                            [🗑️ Delete]          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Title                    Type              Parent Section     │
│  ┌─────────────────┐    ┌──────────┐      ┌──────────────┐  │
│  │ Upper Traps     │    │Anatomy ▾ │      │The Trapezius▾│  │ ← NEW!
│  └─────────────────┘    └──────────┘      └──────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### The Sidebar Shows Hierarchy:

```
┌─ PAGES (46) ────────┐
│                     │
│ 1  BACK             │  ← Regular page
│ 2  ANATOMY          │  ← Regular page
│ 3  The Trapezius    │  ← Regular page (has children)
│ 4    └ Upper Traps  │  ← Child (indented)
│ 5    └ Middle Traps │  ← Child (indented)
│ 6    └ Lower Traps  │  ← Child (indented)
│ 7  Posterior Delt   │  ← Regular page
│                     │
└─────────────────────┘
```

---

## 🎯 In the Viewer: What You'll See

### When Viewing a Parent Page (e.g., "The Trapezius"):

```
┌──────────────────────────────────────────────────────────────┐
│  Back > Anatomy > The Trapezius          ✏️ Edit    3 / 46   │
│                                                              │
│  ANATOMY                                                     │
│  The Trapezius                                              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐│
│  │ 📑 SUBSECTIONS                                          ││
│  │                                                         ││
│  │  ┌──────────────────┐  ┌──────────────────┐          ││
│  │  │ ANATOMY          │  │ ANATOMY           │          ││
│  │  │ Upper Traps     →│  │ Middle Traps     →│          ││
│  │  │ Page 4           │  │ Page 5            │          ││
│  │  └──────────────────┘  └──────────────────┘          ││
│  │                                                         ││
│  │  ┌──────────────────┐                                  ││
│  │  │ ANATOMY          │                                  ││
│  │  │ Lower Traps     →│                                  ││
│  │  │ Page 6           │                                  ││
│  │  └──────────────────┘                                  ││
│  └────────────────────────────────────────────────────────┘│
│                                                              │
│  The trapezius is a large, triangular muscle that...       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### When Viewing a Child Page (e.g., "Upper Traps"):

```
┌──────────────────────────────────────────────────────────────┐
│  Back > Anatomy > The Trapezius > Upper Traps    ✏️ Edit  4/46│
│  ^^^^   ^^^^^^   ^^^^^^^^^^^^^^^   (current page)           │
│  (all clickable links)                                       │
│                                                              │
│  ANATOMY                                                     │
│  Upper Traps                                                 │
│                                                              │
│  The upper fibers of the trapezius originate from...        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📝 How to Use It - 3 Easy Steps

### Method 1: Create Subsection from Scratch

**Step 1:** Navigate to the parent page
- Example: Go to page 3 "The Trapezius"

**Step 2:** Click the **"📑 Add Subsection"** button
- Found in the Section Details header
- Creates a new page automatically set as a child

**Step 3:** Edit and save
- Change title to "Upper Traps"
- Add content
- Click **"💾 Save"**

**Result:**
```
Before:                  After:
3  The Trapezius        3  The Trapezius
4  Posterior Deltoid    4    └ Upper Traps      ← NEW!
                        5  Posterior Deltoid
```

---

### Method 2: Convert Existing Page to Subsection

**Step 1:** Navigate to the page you want to nest
- Example: Go to page 8 "Teres Minor"

**Step 2:** Click the **"Parent Section"** dropdown

**Step 3:** Select the parent
- Example: Select "The Trapezius"

**Step 4:** Click **"💾 Save"**

**Result:**
```
Before:                  After:
3  The Trapezius        3  The Trapezius
4  Upper Traps          4    └ Upper Traps
5  Middle Traps         5    └ Middle Traps
8  Teres Minor          6    └ Teres Minor      ← MOVED!
```

---

## 🎨 Visual Examples

### Example 1: Simple Parent-Child

```
EDITOR SIDEBAR:              VIEWER DISPLAY:
┌──────────────────┐        ┌─────────────────────────┐
│ 3  Nutrition     │   →    │ Nutrition               │
│ 4    └ Protein   │        │                         │
│ 5    └ Carbs     │        │ 📑 SUBSECTIONS          │
│ 6    └ Fats      │        │  [Protein →]  [Carbs →] │
└──────────────────┘        │  [Fats →]               │
                            └─────────────────────────┘
```

### Example 2: Multi-Level Nesting

```
EDITOR SIDEBAR:
┌────────────────────────┐
│ 10  Training Programs  │  ← Level 0 (top)
│ 11    └ Beginner      │  ← Level 1 (child)
│ 12      └ Week 1      │  ← Level 2 (grandchild)
│ 13      └ Week 2      │  ← Level 2 (grandchild)
│ 14    └ Advanced      │  ← Level 1 (child)
└────────────────────────┘

VIEWER BREADCRUMBS:
Training Programs > Beginner > Week 1
     ↑              ↑          ↑
   Level 0      Level 1     Level 2
```

---

## 🚀 Common Use Cases

### Use Case 1: Muscle Group with Parts
```
The Deltoids
└ Anterior Deltoid
└ Lateral Deltoid
└ Posterior Deltoid
```

### Use Case 2: Progressive Program
```
Training Program
└ Phase 1: Foundation
  └ Week 1
  └ Week 2
└ Phase 2: Hypertrophy
  └ Week 3
  └ Week 4
```

### Use Case 3: Conceptual Breakdown
```
Exercise Form
└ Setup
└ Execution
  └ Concentric Phase
  └ Eccentric Phase
└ Common Mistakes
```

---

## ✨ Key Features at a Glance

| Feature | Location | What It Does |
|---------|----------|--------------|
| **Parent Dropdown** | Editor > Section Details | Select which section is the parent |
| **Add Subsection Button** | Editor > Section Details | Create child section automatically |
| **Hierarchical Sidebar** | Editor > Left sidebar | Shows indentation for nested sections |
| **Breadcrumbs** | Viewer > Top of page | Shows path, click to navigate |
| **Subsection Cards** | Viewer > Below title | Shows child sections with links |

---

## 🎯 Try It Now!

1. Go to `/guides/editor/back` (or any guide)
2. Navigate to page 3
3. Click **"📑 Add Subsection"**
4. Edit the new subsection
5. Click **"💾 Save"**
6. Click **"👁️ View"** to see the result

You should see:
- ✅ Indented entry in the sidebar
- ✅ Breadcrumb navigation in the viewer
- ✅ Subsection card on the parent page

---

## 📋 Quick Reference Card

```
╔═══════════════════════════════════════════╗
║  SUBPAGE FEATURE CHEAT SHEET             ║
╠═══════════════════════════════════════════╣
║                                           ║
║  CREATE SUBSECTION:                       ║
║  1. Go to parent page                     ║
║  2. Click "📑 Add Subsection"             ║
║  3. Edit & Save                           ║
║                                           ║
║  CHANGE PARENT:                           ║
║  1. Go to any page                        ║
║  2. Select from "Parent Section" dropdown ║
║  3. Click "💾 Save"                       ║
║                                           ║
║  REMOVE NESTING:                          ║
║  1. Go to child page                      ║
║  2. Set parent to "None (Top Level)"      ║
║  3. Click "💾 Save"                       ║
║                                           ║
║  NAVIGATE IN VIEWER:                      ║
║  • Click breadcrumbs → go to parent       ║
║  • Click subsection cards → go to child   ║
║  • Use ← → keys → prev/next page          ║
║                                           ║
╚═══════════════════════════════════════════╝
```

