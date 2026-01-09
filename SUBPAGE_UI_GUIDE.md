# Subpage/Subsection UI Guide

## How to Configure Subpages in the Editor

### Step 1: Open the Guide Editor

Navigate to `/guides/editor/[id]` (e.g., `/guides/editor/back`)

### Step 2: Understanding the New UI Elements

You'll see **3 new features** in the editor:

#### A. Hierarchical Sidebar (Left Side)
The sidebar now shows indentation for nested sections:

```
PAGES (46)
┌─────────────────────────┐
│ 1  BACK                 │  ← Top level
│ 2  ANATOMY              │  ← Top level
│ 3    The Trapezius      │  ← Top level
│ 4    └ Upper Traps      │  ← Child of #3
│ 5    └ Middle Traps     │  ← Child of #3
│ 6  Posterior Deltoids   │  ← Top level
└─────────────────────────┘
```

**What you see:**
- Regular pages are flush left
- Child pages have indent + "└ " prefix
- Multiple levels = more indentation

---

#### B. Parent Section Dropdown (Section Details)

In the "Section Details" area, you'll now see **3 fields** instead of 2:

```
┌─ Section Details ────────────────────────────────┐
│                                                   │
│  Title                Type           Parent       │
│  [The Trapezius]     [Anatomy ▾]    [None ▾]    │
│                                                   │
└───────────────────────────────────────────────────┘
```

The **"Parent Section"** dropdown shows:
- `None (Top Level)` - makes this a top-level page
- List of all other sections that can be parents
- **Automatically excludes:**
  - The current section (can't be parent of itself)
  - Any child/descendant sections (prevents loops)

**Example dropdown content:**
```
┌─ Parent Section ─────────┐
│ None (Top Level)         │ ← Default
│ BACK                     │
│ ANATOMY                  │
│ The Trapezius           │
│ Posterior Deltoids       │
└──────────────────────────┘
```

---

#### C. New Button: "Add Subsection"

In the Section Details header, you'll see:

```
┌─ Section Details ────────────────────────────────┐
│                              [➕ Add After]      │
│                              [📑 Add Subsection] │ ← NEW!
│                              [🗑️ Delete]         │
└───────────────────────────────────────────────────┘
```

**What it does:**
- Creates a new section immediately after the current one
- **Automatically sets parentId** to the current section's ID
- Takes you to the new subsection to edit it

---

## How to Create a Subpage Structure

### Method 1: Using "Add Subsection" Button (Recommended)

1. Navigate to the section that should be the **parent**
   - Example: Go to page 3 "The Trapezius"

2. Click **"📑 Add Subsection"**

3. A new section is created:
   - Title: "New Subsection"
   - Parent: Automatically set to "The Trapezius"
   - Position: Right after the parent in the list

4. Edit the new subsection:
   - Change title to "Upper Traps"
   - Add content
   - Click "💾 Save"

5. **Result in sidebar:**
   ```
   3  The Trapezius
   4    └ Upper Traps     ← New subsection appears indented
   ```

---

### Method 2: Using Parent Dropdown

1. Navigate to any existing section
   - Example: Go to page 8 "Teres Minor"

2. In **Section Details**, click the **"Parent Section"** dropdown

3. Select the parent:
   ```
   ┌─ Parent Section ─────────┐
   │ None (Top Level)         │
   │ BACK                     │
   │ ANATOMY                  │
   │ The Trapezius           │ ← Click this
   └──────────────────────────┘
   ```

4. Click **"💾 Save"**

5. **Result in sidebar:**
   ```
   3  The Trapezius
   4    └ Upper Traps
   5    └ Middle Traps
   6    └ Teres Minor        ← Moved under parent
   ```

---

## How Subpages Display in the Viewer

### When Viewing a Parent Section

Navigate to `/guides/back?page=2` (viewing "The Trapezius")

**You'll see:**

#### 1. Breadcrumb Navigation (Top)
```
Back > Anatomy > The Trapezius
  ↑      ↑           ↑
  │      │           └─ Current page (not clickable)
  │      └───────────── Clickable (goes to Anatomy page)
  └──────────────────── Clickable (goes to Back page)
```

#### 2. Section Header
```
ANATOMY                                    ✏️ Edit  3 / 46
                                           
The Trapezius
```

#### 3. Subsections Card (if section has children)
```
┌─────────────────────────────────────────────────────────┐
│ 📑 SUBSECTIONS                                          │
│                                                         │
│  ┌─────────────────────────┐  ┌─────────────────────┐ │
│  │ ANATOMY                 │  │ ANATOMY             │ │
│  │ Upper Traps            →│  │ Middle Traps       →│ │
│  │ Page 4                  │  │ Page 5              │ │
│  └─────────────────────────┘  └─────────────────────┘ │
│                                                         │
│  ┌─────────────────────────┐                           │
│  │ ANATOMY                 │                           │
│  │ Teres Minor            →│                           │
│  │ Page 6                  │                           │
│  └─────────────────────────┘                           │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- **Blue background** - easily distinguishable
- **Grid layout** - 2 columns on desktop, 1 on mobile
- **Hover effect** - border turns darker blue, shadow appears
- **Click anywhere** - navigates to that subsection
- **Shows:** Type badge, title, page number, arrow icon

#### 4. Section Content (Below)
```
The trapezius is a large, triangular muscle...

[Rest of page content]
```

---

### When Viewing a Child Section

Navigate to `/guides/back?page=3` (viewing "Upper Traps")

**You'll see:**

#### 1. Breadcrumb Navigation (Shows Full Path)
```
Back > Anatomy > The Trapezius > Upper Traps
  ↑      ↑            ↑              ↑
  │      │            │              └─ Current (not clickable)
  │      │            └──────────────── Clickable (goes to parent)
  │      └───────────────────────────── Clickable (goes to Anatomy)
  └──────────────────────────────────── Clickable (goes to Back)
```

**Navigation is easy:**
- Click any breadcrumb to jump to that level
- Shows complete hierarchy path
- Always know where you are

#### 2. Section Content
```
ANATOMY                                    ✏️ Edit  4 / 46

Upper Traps

The upper fibers of the trapezius...
```

**No subsections card** (unless this section also has children)

---

## Real-World Example: Creating a Back Guide Structure

### Step-by-Step Creation

Starting with a flat structure:
```
1  BACK
2  ANATOMY
3  The Trapezius
4  Posterior Deltoids
5  Teres Major
6  Teres Minor
7  The Rotator Cuff
```

**Goal:** Organize muscle groups hierarchically

#### Create "Muscles of the Back" Parent

1. Go to page 3 "The Trapezius"
2. In "Parent Section" dropdown, select "ANATOMY"
3. Click "💾 Save"

#### Add Trapezius Subsections

1. Go to page 3 "The Trapezius"
2. Click "📑 Add Subsection" → creates page 4
3. Change title to "Upper Traps"
4. Click "📑 Add Subsection" again → creates page 5
5. Change title to "Middle Traps"
6. Click "📑 Add Subsection" again → creates page 6
7. Change title to "Lower Traps"

#### Organize Other Muscles

1. Go to "Posterior Deltoids" (now page 7)
2. Set parent to "ANATOMY"
3. Repeat for "Teres Major", "Teres Minor", etc.

### Final Structure

```
1  BACK
2  ANATOMY
3    └ The Trapezius
4      └ Upper Traps
5      └ Middle Traps
6      └ Lower Traps
7    └ Posterior Deltoids
8    └ Teres Major
9    └ Teres Minor
10   └ The Rotator Cuff
11     └ Supraspinatus
12     └ Infraspinatus
```

---

## Visual Reference: Full UI Layout

### Editor View
```
┌─────────────┬──────────────────────────────────────────┐
│ PAGES (46)  │ BACK - Page 4 of 46  [💾 Save] [👁️ View] │
│             ├──────────────────────────────────────────┤
│ 1  BACK     │ [≡] Toggle  ←  Prev  ●●●●○○  Next →     │
│ 2  ANATOMY  ├──────────────────────────────────────────┤
│ 3  The Trap │ Section Details    [➕ Add] [📑 Sub] [🗑️]│
│ 4  └ Upper  │ ┌────────────────────────────────────┐  │
│ 5  └ Middle │ │ Title: [Upper Traps            ]   │  │
│ 6  └ Lower  │ │ Type:  [Anatomy ▾]                 │  │
│ 7  Post Delt│ │ Parent:[The Trapezius ▾]          │  │
│ 8  Teres Maj│ └────────────────────────────────────┘  │
│ 9  Teres Min│                                          │
│             │ Content                                  │
│             │ ┌────────────────────────────────────┐  │
│             │ │ The upper trapezius fibers...     │  │
│             │ │                                    │  │
│             │ │ @ mentions exercises & anatomy    │  │
│             │ └────────────────────────────────────┘  │
└─────────────┴──────────────────────────────────────────┘
```

### Viewer View
```
┌──────────────────────────────────────────────────────┐
│  ← Prev     Page 4 of 46     Next →                  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Back > Anatomy > The Trapezius > Upper Traps       │
│                                                      │
│  ANATOMY                          ✏️ Edit  4 / 46    │
│  Upper Traps                                         │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 📑 SUBSECTIONS                                 │ │
│  │  [Shows child sections if any]                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  The upper trapezius fibers originate from the      │
│  occipital bone and insert into the clavicle...     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Tips & Tricks

### 1. **Quick Navigation in Editor**
- Use arrow keys to navigate between pages
- Ctrl/Cmd + Arrow keys work even when typing
- Ctrl/Cmd + S to save quickly

### 2. **Organizing Content**
- Create the parent page first with overview content
- Then add subsections with detailed information
- Use meaningful titles for easy navigation

### 3. **Visual Hierarchy**
- Limit nesting to 2-3 levels for readability
- Use consistent section types within a hierarchy
- Parent sections work well as "overview" or "intro" type

### 4. **Preventing Issues**
- The UI automatically prevents circular references
- If a dropdown looks empty, check if you're at max depth
- Save regularly when reorganizing structure

### 5. **Best Practices**
```
✅ Good:
   Muscles of the Back
   └ Trapezius
     └ Upper Fibers
     └ Middle Fibers
     └ Lower Fibers

❌ Avoid:
   Muscles
   └ Back
     └ Upper Back
       └ Trapezius
         └ Upper Trapezius  (too deep)
```

---

## Troubleshooting

**Q: I don't see the Parent dropdown**
- Make sure you're using the latest code
- Refresh the page (Cmd/Ctrl + Shift + R)
- Check that you have other sections to select as parents

**Q: The sidebar doesn't show indentation**
- Save the guide after setting parent relationships
- Refresh the browser
- Check that parentId is set in the database

**Q: Breadcrumbs don't appear**
- Breadcrumbs only show when viewing a child section
- Make sure the section has a parentId set
- Verify the parent section exists

**Q: Subsection cards not showing**
- Cards only appear when viewing a parent section with children
- Make sure child sections have the correct parentId
- Check that the GraphQL query includes children

---

## Keyboard Shortcuts

In the editor:
- `←` / `→` - Navigate between pages (when not typing)
- `Ctrl/Cmd + ←/→` - Navigate even when typing in fields
- `Ctrl/Cmd + S` - Save guide

In the viewer:
- `←` / `→` - Navigate between pages
- Click breadcrumbs - Jump to parent sections
- Click subsection cards - Jump to child sections

