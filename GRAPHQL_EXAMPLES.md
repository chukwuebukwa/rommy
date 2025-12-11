# 🚀 GraphQL API Examples

Complete guide to querying the Rommy fitness guide GraphQL API.

## 🌐 Endpoint

- **Development:** `http://localhost:3000/api/graphql`
- **GraphiQL Playground:** Visit the endpoint in your browser (dev mode only)

---

## 📋 Table of Contents

1. [Basic Queries](#basic-queries)
2. [Guide Queries](#guide-queries)
3. [Anatomy Queries](#anatomy-queries)
4. [Exercise Queries](#exercise-queries)
5. [Workout & Formula Queries](#workout--formula-queries)
6. [Advanced Queries](#advanced-queries)
7. [Image Handling](#image-handling)

---

## Basic Queries

### Get All Guides

```graphql
query GetAllGuides {
  guides {
    id
    title
    author
    slug
  }
}
```

### Get Single Guide

```graphql
query GetGuide {
  guide(id: "arms") {
    id
    title
    author
    primaryRegion {
      name
      kind
    }
  }
}
```

---

## Guide Queries

### Get Guide with All Sections

```graphql
query GetGuideWithSections {
  guide(id: "arms") {
    title
    sections {
      id
      title
      kind
      order
      content
      imageCount
    }
  }
}
```

### Get Guide with Sections and Images

```graphql
query GetGuideWithImages {
  guide(id: "arms") {
    title
    author
    sections {
      id
      title
      kind
      images
      imageCount
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "guide": {
      "title": "Conceal & Carry Pythons (Arm Guide)",
      "author": "Uncle Rommy",
      "sections": [
        {
          "id": "intro-young-man-muscle",
          "title": "The Young Man Muscle",
          "kind": "intro",
          "images": [
            "arms/page9_img1.jpeg",
            "arms/page9_img2.jpeg",
            "arms/page9_img3.png"
          ],
          "imageCount": 3
        }
      ]
    }
  }
}
```

### Get All Sections with Images

```graphql
query GetSectionsWithImages {
  sectionsWithImages {
    id
    title
    images
    imageCount
    guide {
      title
    }
  }
}
```

### Get Section by ID

```graphql
query GetSection {
  section(id: "anatomy-biceps") {
    title
    content
    kind
    order
    images
    guide {
      title
    }
    focusAnatomyLinks {
      anatomy {
        name
        kind
      }
    }
    exerciseLinks {
      exercise {
        name
        type
      }
    }
  }
}
```

---

## Anatomy Queries

### Get All Anatomy Nodes

```graphql
query GetAllAnatomy {
  anatomyNodes {
    id
    name
    kind
    description
  }
}
```

### Get Anatomy Filtered by Kind

```graphql
query GetRegions {
  anatomyNodes(kind: "region") {
    id
    name
    description
    roleSummary
  }
}
```

```graphql
query GetMuscles {
  anatomyNodes(kind: "muscle") {
    id
    name
    description
    primaryFunctions
    aestheticNotes
  }
}
```

### Get Anatomy Node with Relations

```graphql
query GetAnatomyWithRelations {
  anatomyNode(id: "biceps_brachii") {
    name
    kind
    description
    roleSummary
    primaryFunctions
    aestheticNotes
    
    parent {
      name
      kind
    }
    
    children {
      name
      kind
      description
    }
    
    primaryGuides {
      title
    }
  }
}
```

### Get Anatomy Tree (Hierarchy)

```graphql
query GetAnatomyTree {
  anatomyTree {
    id
    name
    kind
    children {
      id
      name
      kind
      children {
        id
        name
        kind
        children {
          id
          name
          kind
        }
      }
    }
  }
}
```

### Deep Anatomy Traversal

```graphql
query DeepAnatomyQuery {
  anatomyNode(id: "biceps_long_head") {
    name
    description
    primaryFunctions
    
    parent {
      name
      parent {
        name
        parent {
          name
        }
      }
    }
    
    primaryGuides {
      title
      sections {
        title
        images
      }
    }
  }
}
```

---

## Exercise Queries

### Get All Exercises

```graphql
query GetAllExercises {
  exercises {
    id
    name
    type
    movementPattern
    equipment
    videoUrl
  }
}
```

### Filter Exercises by Type

```graphql
query GetCompoundExercises {
  exercises(type: "compound") {
    name
    movementPattern
    equipment
  }
}
```

### Filter Exercises by Movement Pattern

```graphql
query GetCurls {
  exercises(movementPattern: "curl") {
    name
    type
    cueSummary
    videoUrl
  }
}
```

### Get Exercise with Anatomy Links

```graphql
query GetExerciseWithMuscles {
  exercise(id: "barbell_ez_bar_curl") {
    name
    type
    movementPattern
    equipment
    cueSummary
    videoUrl
    
    anatomyLinks {
      role
      anatomy {
        name
        kind
        description
      }
    }
  }
}
```

### Search Exercises by Name

```graphql
query SearchBicepExercises {
  searchExercises(query: "curl") {
    name
    type
    movementPattern
  }
}
```

### Get Exercises Mentioned in Section

```graphql
query GetSectionExercises {
  section(id: "anatomy-biceps") {
    title
    exerciseLinks {
      exercise {
        name
        type
        videoUrl
        anatomyLinks {
          role
          anatomy {
            name
          }
        }
      }
    }
  }
}
```

---

## Workout & Formula Queries

### Get All Workouts

```graphql
query GetAllWorkouts {
  workouts {
    id
    name
    goal
    slug
    primaryRegion {
      name
    }
  }
}
```

### Get Workout with Blocks

```graphql
query GetWorkoutDetails {
  workout(id: "snipers_arm_day") {
    name
    goal
    priorityRules
    
    blocks {
      id
      label
      schemeStyle
      schemeDesc
      notes
      
      targets {
        anatomy {
          name
        }
      }
      
      exercises {
        kind
        exercise {
          name
          type
        }
      }
    }
  }
}
```

### Get All Formulas

```graphql
query GetAllFormulas {
  formulas {
    id
    name
    description
    pattern
  }
}
```

### Get Formula with Steps

```graphql
query GetFormulaDetails {
  formula(id: "triceps_long_head_formula_1") {
    name
    description
    pattern
    
    steps {
      order
      role
      notes
      exercise {
        name
        type
        cueSummary
      }
    }
    
    targets {
      anatomy {
        name
        kind
      }
    }
  }
}
```

---

## Advanced Queries

### Complete Guide Data

```graphql
query CompleteGuideData {
  guide(id: "arms") {
    id
    title
    author
    slug
    
    primaryRegion {
      id
      name
      kind
      description
    }
    
    sections {
      id
      title
      kind
      order
      content
      images
      imageCount
      
      focusAnatomyLinks {
        anatomy {
          id
          name
          kind
        }
      }
      
      exerciseLinks {
        exercise {
          id
          name
          type
          videoUrl
          
          anatomyLinks {
            role
            anatomy {
              name
            }
          }
        }
      }
    }
  }
}
```

### Find Exercises for Specific Muscle

```graphql
query GetBicepsExercises {
  anatomyNode(id: "biceps_long_head") {
    name
    description
    
    # Get exercises that target this muscle
    exerciseLinks {
      role
      exercise {
        name
        type
        movementPattern
        videoUrl
      }
    }
  }
}
```

### Cross-Reference: Guides, Anatomy, and Exercises

```graphql
query CrossReference {
  guide(id: "arms") {
    title
    
    primaryRegion {
      name
      
      # Exercises that target this region
      exerciseLinks {
        exercise {
          name
        }
      }
    }
    
    sections {
      title
      
      # Anatomy focused in this section
      focusAnatomyLinks {
        anatomy {
          name
        }
      }
      
      # Exercises mentioned in this section
      exerciseLinks {
        exercise {
          name
        }
      }
    }
  }
}
```

---

## Image Handling

### Get Images for a Guide

```graphql
query GetGuideImages {
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

**How to display images:**

In your frontend:
```typescript
// Parse the image paths
section.images?.map(imagePath => (
  <img src={`/guides/${imagePath}`} alt={section.title} />
))

// Example: imagePath = "arms/page9_img1.jpeg"
// Renders: <img src="/guides/arms/page9_img1.jpeg" />
```

### Count Total Images

```graphql
query CountImages {
  guides {
    id
    title
    sections {
      imageCount
    }
  }
}
```

---

## Tips & Best Practices

### 1. Request Only What You Need

❌ **Bad** - Fetching everything:
```graphql
query {
  guides {
    id
    title
    author
    slug
    primaryRegion { ... }
    sections { ... }
  }
}
```

✅ **Good** - Specific fields:
```graphql
query {
  guides {
    id
    title
  }
}
```

### 2. Use Fragments for Reusable Fields

```graphql
fragment ExerciseBasic on Exercise {
  id
  name
  type
  movementPattern
}

query {
  exercises {
    ...ExerciseBasic
  }
}
```

### 3. Use Variables for Dynamic Queries

```graphql
query GetGuide($id: String!) {
  guide(id: $id) {
    title
    sections {
      title
    }
  }
}
```

Variables:
```json
{
  "id": "arms"
}
```

### 4. Leverage Relations

GraphQL automatically optimizes relation queries:
```graphql
query {
  guide(id: "arms") {
    sections {
      exerciseLinks {
        exercise {
          anatomyLinks {
            anatomy {
              parent {
                name
              }
            }
          }
        }
      }
    }
  }
}
```

---

## Quick Reference

| Query | Purpose |
|-------|---------|
| `guides` | List all guides |
| `guide(id)` | Get specific guide |
| `guideBySlug(slug)` | Get guide by slug |
| `section(id)` | Get specific section |
| `sectionsWithImages` | All sections with images |
| `anatomyNodes(kind)` | List anatomy (filter by kind) |
| `anatomyNode(id)` | Get specific anatomy |
| `anatomyTree` | Get hierarchy tree |
| `exercises(type, movementPattern)` | List exercises (with filters) |
| `exercise(id)` | Get specific exercise |
| `searchExercises(query)` | Search by name |
| `formulas` | List all formulas |
| `formula(id)` | Get specific formula |
| `workouts` | List all workouts |
| `workout(id)` | Get specific workout |

---

## Testing

Visit `http://localhost:3000/api/graphql` in your browser to use GraphiQL playground with:
- ✅ Auto-complete
- ✅ Documentation explorer
- ✅ Query history
- ✅ Variable editor

---

*Generated for Rommy Fitness Guide GraphQL API*
*Total: 224 images across 4 guides (arms: 69, shoulders: 48, back: 51, chest: 56)*

