# Subpage/Subsection Navigation Feature

## Overview

The guide system now supports hierarchical page organization with parent-child relationships between sections. This allows you to create nested content structures with breadcrumb navigation and subsection links.

## Features

### 1. **Hierarchical Section Structure**

Sections can now have parent-child relationships:
- Top-level sections (no parent)
- Subsections (have a parent section)
- Multi-level nesting supported

### 2. **Editor Enhancements**

In the Guide Editor (`/guides/editor/[id]`):

- **Parent Section Dropdown**: Select a parent section for the current page
- **Add Subsection Button**: Quickly create a child section under the current page
- **Hierarchical Sidebar**: The table of contents now shows indentation for nested sections
- **Smart Parent Selection**: Prevents circular references (can't set a section as its own parent or descendant)

### 3. **Viewer Enhancements**

In the Guide Viewer (`/guides/[id]`):

- **Breadcrumb Navigation**: Shows the path from top-level to current section
- **Subsection Cards**: Displays child sections as clickable cards with metadata
- **Quick Navigation**: Click breadcrumbs or subsection cards to jump between related pages

## Database Schema

The `Section` model includes hierarchical fields:

```prisma
model Section {
  // ... other fields ...
  
  parentId String?
  parent   Section?  @relation("SectionHierarchy", fields: [parentId], references: [id])
  children Section[] @relation("SectionHierarchy")
}
```

## GraphQL API

The Section type now exposes:

```graphql
type Section {
  # ... other fields ...
  
  parentId: String
  parent: Section
  children: [Section!]!
}
```

Updated queries automatically fetch parent/child data:
- `GET_GUIDE_DETAIL` - includes `parentId`, `parent`, and `children`

## Usage Examples

### Creating a Hierarchical Guide Structure

1. **Top-Level Section**: "The Trapezius" (parentId: null)
   - **Subsection 1**: "Upper Traps" (parentId: "trapezius_section_id")
   - **Subsection 2**: "Middle Traps" (parentId: "trapezius_section_id")
   - **Subsection 3**: "Lower Traps" (parentId: "trapezius_section_id")

2. **Top-Level Section**: "Training Programs" (parentId: null)
   - **Subsection 1**: "Beginner Program" (parentId: "programs_section_id")
   - **Subsection 2**: "Advanced Program" (parentId: "programs_section_id")

### In the Editor

1. Navigate to a section that should be a parent
2. Click **"📑 Add Subsection"** to create a child section
3. Or edit any section and use the **"Parent Section"** dropdown to set its parent

### In the Viewer

When viewing a section with children:
- A blue card appears showing all subsections
- Click any subsection to navigate to it
- Use breadcrumbs at the top to navigate back up the hierarchy

## UI Components

### Modified Components

1. **`GuidePaginatedEditor.tsx`**
   - Added `parentId` to Section interface
   - Added parent section dropdown
   - Added "Add Subsection" button
   - Hierarchical sidebar with indentation
   - Circular reference prevention logic

2. **`GuidePaginatedView.tsx`**
   - Added breadcrumb navigation
   - Added subsection cards display
   - Navigation between related sections

3. **`lib/graphql/types/guide.ts`**
   - Exposed `parentId`, `parent`, and `children` fields

4. **`app/api/guides/save/route.ts`**
   - Saves `parentId` when creating/updating sections

## Visual Indicators

### In Editor Sidebar
```
1  BACK
2  ANATOMY
3    The Trapezius
4    └ Upper Traps
5    └ Middle Traps
```

### In Viewer
```
Back > Anatomy > The Trapezius

📑 Subsections
┌─────────────────────────┐
│ ANATOMY                 │
│ Upper Traps             │
│ Page 4                  │
└─────────────────────────┘
```

## Benefits

1. **Better Content Organization**: Group related content logically
2. **Improved Navigation**: Users can easily understand content hierarchy
3. **Flexible Structure**: Support any depth of nesting
4. **Clear Context**: Breadcrumbs show where you are in the guide
5. **Discovery**: Subsection cards help users explore related content

## Future Enhancements

Potential improvements:
- Collapsible sections in the sidebar
- Auto-generated table of contents based on hierarchy
- Drag-and-drop reordering with hierarchy preservation
- Visual tree view in the editor
- Keyboard shortcuts for navigating hierarchy (Ctrl+Up/Down for parent/child)

## Technical Notes

- The hierarchy is stored in the database via `parentId` foreign key
- GraphQL resolves the full tree structure automatically
- Circular references are prevented in the UI
- The save API handles parent relationships correctly
- No migration needed - the schema already supported this feature

