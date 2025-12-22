# 🎯 @Mentions Feature - Tag Exercises & Anatomy in Guides

## ✨ What It Does

You can now **tag exercises and anatomy nodes** directly in your guide content using an **@mention system**!

### In the Editor:
- Type `@` anywhere in your text
- Autocomplete dropdown appears
- Search and select exercises or anatomy nodes
- They get inserted as inline mentions

### In the View:
- Mentions are **highlighted** with colored badges
- 🏋️ Green badges for exercises
- 🦾 Blue badges for anatomy nodes  
- Click them → links to the exercise/anatomy page
- Hover → preview popup with details

---

## 🚀 How to Use

### 1. **In the Guide Editor**

When writing content in any section:

```
Type: The biceps has two heads @

↓ Autocomplete appears ↓

[🦾 muscle] Biceps Long Head
[🦾 muscle] Biceps Short Head  
[🏋️ Exercise] Barbell Curl
[🏋️ Exercise] Dumbbell Curl

↓ Select one ↓

Result: "The biceps has two heads @[Biceps Long Head](anatomy:biceps_long_head)"
```

### 2. **Navigation**

- **Arrow Up/Down**: Navigate suggestions
- **Enter**: Insert selected mention
- **Escape**: Close autocomplete
- **Type to search**: Filter by name

### 3. **Published View**

When viewing the guide, mentions appear as:

```
The biceps has two heads 🦾 Biceps Long Head and 🦾 Biceps Short Head
                          └─────────────┬─────────────┘
                                 Clickable badges
```

- **Click**: Navigate to anatomy/exercise page
- **Hover**: See preview popup with details

---

## 📝 Mention Format

Mentions are stored in markdown-like format:

```
@[Display Name](type:id)
```

**Examples:**
- `@[Barbell Curl](exercise:barbell_curl)`
- `@[Biceps Long Head](anatomy:biceps_long_head)`
- `@[Triceps](anatomy:triceps)`

This format:
- ✅ Human-readable in the database
- ✅ Portable (works in any text editor)
- ✅ Easy to parse and render
- ✅ Doesn't break if you edit outside the CMS

---

## 🎨 Visual Design

### Autocomplete Dropdown
```
┌──────────────────────────────────────┐
│ 🏋️ Exercise   Barbell Curl          │ ← Green badge
│   barbell_curl                       │
├──────────────────────────────────────┤
│ 🦾 muscle   Biceps Long Head         │ ← Blue badge
│   biceps_long_head                   │
├──────────────────────────────────────┤
│ 🏋️ Exercise   Dumbbell Curl          │
│   dumbbell_curl                      │
└──────────────────────────────────────┘
```

### In Published View
```
Train your 🦾 Biceps with 🏋️ Barbell Curls
           └───┬────┘      └──────┬──────┘
         Blue badge      Green badge
         (anatomy)       (exercise)
```

### Hover Preview
```
┌──────────────────────────────┐
│ 🏋️ Barbell Curl              │
│ Exercise • barbell_curl      │
│                              │
│ Click to view details →      │
└──────────────────────────────┘
```

---

## 🏗️ Technical Architecture

### Components

**`MentionTextarea.tsx`**
- Editor component with @ autocomplete
- Keyboard navigation (↑↓ Enter Esc)
- Real-time search/filtering
- Caret position tracking
- Inserts formatted mentions

**`MentionRenderer.tsx`**
- Parses mention syntax
- Renders as clickable links
- Hover preview popup
- Color-coded badges

### Data Flow

```
Editor
  │
  ├─ User types @
  ├─ Shows autocomplete
  ├─ Filters exercises + anatomy
  └─ Inserts: @[Name](type:id)
      │
      └─ Stored in database
          │
          └─ View
              │
              ├─ Parse mentions
              ├─ Render as badges
              └─ Make clickable
```

### Integration Points

**✅ GuideEditor** → Fetches exercises + anatomy
**✅ SectionEditor** → Uses MentionTextarea
**✅ Guide View (`/guides/[id]`)** → Uses MentionRenderer
**✅ Learn Page** → Uses MentionRenderer

---

## 💡 Usage Examples

### Example 1: Anatomy Explanation

**Editor:**
```
The @triceps consists of three heads:
- @[Triceps Long Head](anatomy:triceps_long_head)
- @[Triceps Lateral Head](anatomy:triceps_lateral_head)
- @[Triceps Medial Head](anatomy:triceps_medial_head)
```

**Published View:**
```
The 🦾 triceps consists of three heads:
- 🦾 Triceps Long Head
- 🦾 Triceps Lateral Head
- 🦾 Triceps Medial Head
```

### Example 2: Exercise Recommendations

**Editor:**
```
For bigger arms, focus on:
1. @[Barbell Curl](exercise:barbell_curl) for biceps mass
2. @[Close Grip Bench Press](exercise:close_grip_bench_press) for triceps
3. @[Hammer Curl](exercise:hammer_curl) for brachialis
```

**Published View:**
```
For bigger arms, focus on:
1. 🏋️ Barbell Curl for biceps mass
2. 🏋️ Close Grip Bench Press for triceps
3. 🏋️ Hammer Curl for brachialis
```

### Example 3: Mixed Content

**Editor:**
```
To build your @[Biceps](anatomy:biceps), you need to train both the 
@[Biceps Long Head](anatomy:biceps_long_head) with exercises like 
@[Incline Dumbbell Curl](exercise:incline_dumbbell_curl) and the 
@[Biceps Short Head](anatomy:biceps_short_head) with 
@[Preacher Curl](exercise:preacher_curl).
```

**Published View:**
```
To build your 🦾 Biceps, you need to train both the 
🦾 Biceps Long Head with exercises like 
🏋️ Incline Dumbbell Curl and the 
🦾 Biceps Short Head with 
🏋️ Preacher Curl.
```

---

## 🎯 Benefits

### For Content Creation:
- ✅ **Faster writing** - autocomplete speeds up referencing
- ✅ **Accurate references** - no typos in IDs
- ✅ **Visual feedback** - see what you're linking
- ✅ **Searchable** - find exercises/anatomy as you type

### For Readers:
- ✅ **Interactive content** - clickable references
- ✅ **Easy navigation** - jump to details
- ✅ **Visual cues** - color-coded badges
- ✅ **Hover previews** - see what before clicking

### For Your Database:
- ✅ **Structured data** - mentions are parseable
- ✅ **Portable format** - works outside CMS
- ✅ **No extra tables** - stored inline
- ✅ **Easy migration** - standard markdown-like syntax

---

## 🔮 Future Enhancements (Optional)

### Sidebar with Mentioned Items
Show a sidebar listing all exercises/anatomy mentioned in the guide:

```
┌─────────────────────────────┐
│ 📋 Mentioned in This Guide  │
├─────────────────────────────┤
│ 🦾 Anatomy (5)              │
│   • Biceps                  │
│   • Biceps Long Head        │
│   • Triceps                 │
│                             │
│ 🏋️ Exercises (8)            │
│   • Barbell Curl            │
│   • Dumbbell Curl           │
│   • Preacher Curl           │
└─────────────────────────────┘
```

### Auto-Suggestions
As you type muscle names, automatically suggest mentioning them.

### Rich Previews
Show exercise videos or anatomy diagrams in hover popups.

### Analytics
Track which exercises/anatomy are most referenced across guides.

---

## 🚀 Try It Now!

1. **Go to**: `http://localhost:3002/guides/editor/arms`
2. **Click on a section** to expand it
3. **Type `@`** in the content textarea
4. **Select** an exercise or anatomy node
5. **Save** the guide
6. **View** at `/guides/arms` to see clickable mentions!

---

## 📊 What's Available to Mention

You have access to:
- **201 exercises** (all in your exercise library)
- **All anatomy nodes** (regions, groups, muscles, parts)

The autocomplete searches across:
- Exercise names
- Anatomy node names
- IDs

Showing up to **10 results** at a time, sorted by relevance.

---

**Enjoy your new interactive guide system!** 🎉

Tag exercises, link anatomy, create rich interconnected content!

