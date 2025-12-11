# 🎯 GraphQL Query Guide - Quick Reference

This guide shows which pre-made query to use for each page in your app.

---

## 📍 Query Map - By Page

| Page | File | Query to Use | What It Gets |
|------|------|--------------|--------------|
| **Homepage** | `app/page.tsx` | `GET_DATABASE_STATS` | Counts for all models |
| **Anatomy List** | `app/anatomy/page.tsx` | `GET_ANATOMY_REGIONS` | All regions with child counts |
| **Anatomy Detail** | `app/anatomy/[id]/page.tsx` | `GET_ANATOMY_DETAIL` | Full hierarchy + exercises |
| **Exercise Library** | `app/exercises/page.tsx` | `GET_ALL_EXERCISES` | All exercises with muscles |
| **Guides List** | `app/guides/page.tsx` | `GET_ALL_GUIDES` | All guides with sections |
| **Guide Detail** | `app/guides/[id]/page.tsx` | `GET_GUIDE_DETAIL` ⭐ | Full guide with **IMAGES** |
| **Formulas List** | `app/formulas/page.tsx` | `GET_ALL_FORMULAS` | All formulas with steps |
| **Formula Detail** | `app/formulas/[id]/page.tsx` | `GET_FORMULA_DETAIL` | Complete formula breakdown |
| **Workouts List** | `app/workouts/page.tsx` | `GET_ALL_WORKOUTS` | All workouts with block counts |
| **Workout Detail** | `app/workouts/[id]/page.tsx` | `GET_WORKOUT_DETAIL` | Full workout with exercises |

---

## 🚀 Quick Start - Test Each Query

### 1. Open GraphiQL
```
http://localhost:3000/api/graphql
```

### 2. Try These Queries (Copy & Paste!)

#### Get All Guides
```graphql
query {
  guides {
    id
    title
    sections {
      title
    }
  }
}
```

#### Get Arms Guide with Images ⭐
```graphql
query {
  guide(id: "arms") {
    title
    sections {
      title
      images
      imageCount
    }
  }
}
```

#### Get Anatomy Regions
```graphql
query {
  anatomyNodes(kind: "region") {
    name
    description
  }
}
```

#### Search Exercises
```graphql
query {
  searchExercises(query: "curl") {
    name
    type
    videoUrl
  }
}
```

#### Get Workout
```graphql
query {
  workout(id: "snipers_arm_day") {
    name
    blocks {
      label
      schemeDesc
    }
  }
}
```

---

## 📖 Detailed Usage by Page

### Homepage (Database Explorer)

**Current code:**
```typescript
// app/page.tsx
const anatomyCount = await prisma.anatomyNode.count();
const exerciseCount = await prisma.exercise.count();
// ...
```

**GraphQL equivalent:**
```graphql
query GetDatabaseStats {
  anatomyNodes {
    id
    kind
  }
  exercises {
    id
  }
  formulas {
    id
  }
  workouts {
    id
  }
  guides {
    id
  }
}
```

Then count in your code:
```typescript
const anatomyCount = data.anatomyNodes.length;
const regionCount = data.anatomyNodes.filter(n => n.kind === 'region').length;
```

---

### Anatomy Page

**Current code:**
```typescript
const regions = await prisma.anatomyNode.findMany({
  where: { kind: "region" },
  include: {
    _count: {
      select: {
        children: true,
        exerciseLinks: true,
      },
    },
  },
});
```

**GraphQL equivalent:**
```graphql
query GetAnatomyRegions {
  anatomyNodes(kind: "region") {
    id
    name
    slug
    description
    children {
      id
    }
    exerciseLinks {
      exerciseId
    }
  }
}
```

Count in code:
```typescript
const childCount = region.children.length;
const exerciseCount = region.exerciseLinks.length;
```

---

### Anatomy Detail Page

**Use:** `GET_ANATOMY_DETAIL`

**With variables:**
```json
{
  "id": "biceps_long_head"
}
```

Gets you:
- ✅ Full node details
- ✅ Parent chain
- ✅ Children (nested 3 levels deep)
- ✅ All exercises that target it
- ✅ Related guides

---

### Exercise Library

**Current code:**
```typescript
const exercises = await prisma.exercise.findMany({
  include: {
    anatomyLinks: {
      include: {
        anatomy: {
          include: {
            parent: {
              include: { parent: true },
            },
          },
        },
      },
    },
  },
});
```

**GraphQL equivalent:**
```graphql
query GetAllExercises {
  exercises {
    id
    name
    type
    movementPattern
    equipment
    videoUrl
    cueSummary
    
    anatomyLinks {
      role
      anatomy {
        id
        name
        kind
        parent {
          name
          parent {
            name
          }
        }
      }
    }
  }
}
```

---

### Guides Page

**Current code:**
```typescript
const guides = await prisma.guide.findMany({
  include: {
    primaryRegion: true,
    sections: {
      orderBy: { order: "asc" },
    },
  },
});
```

**GraphQL equivalent:**
```graphql
query GetAllGuides {
  guides {
    id
    slug
    title
    author
    
    primaryRegion {
      name
    }
    
    sections {
      kind
      title
      order
    }
  }
}
```

---

### Guide Detail (WITH IMAGES!) ⭐

**This is the most important one!**

**Use:** `GET_GUIDE_DETAIL`

**Query:**
```graphql
query GetGuideDetail($id: String!) {
  guide(id: $id) {
    title
    author
    sections {
      title
      content
      images        # ← IMAGE PATHS HERE!
      imageCount
      
      exerciseLinks {
        exercise {
          name
          videoUrl
        }
      }
    }
  }
}
```

**Variables:**
```json
{
  "id": "arms"
}
```

**Returns images like:**
```json
{
  "images": [
    "arms/page9_img1.jpeg",
    "arms/page9_img2.jpeg",
    "arms/page9_img3.png"
  ],
  "imageCount": 3
}
```

---

### Formulas Page

**Current code:**
```typescript
const formulas = await prisma.formula.findMany({
  include: {
    targets: {
      include: { anatomy: true },
    },
    steps: {
      include: { exercise: true },
      orderBy: { order: "asc" },
    },
  },
});
```

**GraphQL equivalent:**
```graphql
query GetAllFormulas {
  formulas {
    id
    name
    pattern
    
    targets {
      anatomy {
        name
      }
    }
    
    steps {
      order
      role
      exercise {
        name
      }
    }
  }
}
```

---

### Workouts Page

**Current code:**
```typescript
const workouts = await prisma.workout.findMany({
  include: {
    primaryRegion: true,
    blocks: {
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    },
  },
});
```

**GraphQL equivalent:**
```graphql
query GetAllWorkouts {
  workouts {
    id
    name
    goal
    
    primaryRegion {
      name
    }
    
    blocks {
      label
      exercises {
        exercise {
          name
        }
      }
    }
  }
}
```

---

## 🎮 How to Use in GraphiQL

### Step 1: Open Playground
```
http://localhost:3000/api/graphql
```

### Step 2: Copy a Query
Open `lib/graphql/prepared-queries.ts` and copy any query

### Step 3: Add Variables (if needed)
Click "Variables" tab at bottom and add:
```json
{
  "id": "arms"
}
```

### Step 4: Execute
Click the Play button (▶️)

### Step 5: Explore
- Click "Docs" to see all available fields
- Use Ctrl+Space for auto-complete
- Click any field in the result to jump to its type

---

## 💡 Pro Tips

### Tip 1: Start Simple
```graphql
query {
  guides {
    title
  }
}
```

Then add fields as needed:
```graphql
query {
  guides {
    title
    sections {
      title
      images
    }
  }
}
```

### Tip 2: Use Variables
Instead of hardcoding IDs:
```graphql
query GetGuide($id: String!) {
  guide(id: $id) {
    title
  }
}
```

### Tip 3: Name Your Queries
Helps with debugging:
```graphql
query GetArmGuideWithImages {
  # Your query here
}
```

### Tip 4: Request Only What You Need
❌ Don't fetch everything if you only need titles!

---

## 🎯 Most Useful Queries for Your App

### 1. Get Complete Guide with Images (Most Common!)
```graphql
query {
  guide(id: "arms") {
    title
    sections {
      title
      content
      images
      imageCount
    }
  }
}
```

### 2. Search Exercises by Name
```graphql
query {
  searchExercises(query: "dumbbell") {
    name
    type
    videoUrl
  }
}
```

### 3. Get Exercises for a Muscle
```graphql
query {
  anatomyNode(id: "biceps_long_head") {
    name
    exerciseLinks {
      role
      exercise {
        name
        videoUrl
      }
    }
  }
}
```

### 4. Get Workout with All Details
```graphql
query {
  workout(id: "snipers_arm_day") {
    name
    blocks {
      label
      exercises {
        exercise {
          name
        }
      }
    }
  }
}
```

---

## 📊 All Available Queries

From `lib/graphql/queries/`:

### Guides
- `guides` - List all
- `guide(id: String!)` - Get one by ID
- `guideBySlug(slug: String!)` - Get one by slug
- `section(id: String!)` - Get section by ID
- `sectionsWithImages` - All sections with images

### Anatomy
- `anatomyNodes(kind: String)` - List all (filter optional)
- `anatomyNode(id: String!)` - Get one by ID
- `anatomyTree` - Get hierarchy

### Exercises
- `exercises(type: String, movementPattern: String)` - List with filters
- `exercise(id: String!)` - Get one by ID
- `searchExercises(query: String!)` - Search by name

### Formulas
- `formulas` - List all
- `formula(id: String!)` - Get one by ID

### Workouts
- `workouts` - List all
- `workout(id: String!)` - Get one by ID
- `workoutBySlug(slug: String!)` - Get one by slug

---

**All queries are in:** `lib/graphql/prepared-queries.ts`  
**Try them at:** `http://localhost:3000/api/graphql`

🎉 **Ready to query!**

