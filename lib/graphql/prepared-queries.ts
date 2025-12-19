// lib/graphql/prepared-queries.ts
/**
 * Pre-made GraphQL queries for the Rommy app pages
 * Copy these into GraphiQL or use them in your GraphQL client
 */

// ===== HOMEPAGE - Database Explorer Stats =====

export const GET_DATABASE_STATS = `
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
`;

// ===== ANATOMY PAGE - List Regions with Counts =====

export const GET_ANATOMY_REGIONS = `
  query GetAnatomyRegions {
    anatomyNodes(kind: "region") {
      id
      name
      slug
      description
      roleSummary
      children {
        id
      }
      exerciseLinks {
        exercise {
          id
        }
      }
    }
  }
`;

// ===== ANATOMY DETAIL - Full Hierarchy =====

export const GET_ANATOMY_DETAIL = `
  query GetAnatomyDetail($id: String!) {
    anatomyNode(id: $id) {
      id
      name
      kind
      slug
      description
      roleSummary
      primaryFunctions
      aestheticNotes
      
      parent {
        id
        name
        kind
      }
      
      children {
        id
        name
        kind
        description
        
        children {
          id
          name
          kind
          description
          
          children {
            id
            name
            kind
            description
          }
        }
      }
      
      exerciseLinks {
        role
        exercise {
          id
          name
          type
          movementPattern
          videoUrl
        }
      }
      
      primaryGuides {
        id
        title
        slug
      }
    }
  }
`;

// ===== EXERCISES PAGE - Exercise Library =====

export const GET_ALL_EXERCISES = `
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
            id
            name
            parent {
              id
              name
            }
          }
        }
      }
    }
  }
`;

// ===== EXERCISES - Filter by Movement Pattern =====

export const GET_EXERCISES_BY_PATTERN = `
  query GetExercisesByPattern($pattern: String!) {
    exercises(movementPattern: $pattern) {
      id
      name
      type
      videoUrl
      cueSummary
      anatomyLinks {
        role
        anatomy {
          name
        }
      }
    }
  }
`;

// Variables: { "pattern": "curl" }

// ===== EXERCISES - Filter by Type =====

export const GET_COMPOUND_EXERCISES = `
  query GetCompoundExercises {
    exercises(type: "compound") {
      id
      name
      movementPattern
      equipment
      videoUrl
    }
  }
`;

export const GET_ISOLATION_EXERCISES = `
  query GetIsolationExercises {
    exercises(type: "isolation") {
      id
      name
      movementPattern
      equipment
      videoUrl
    }
  }
`;

// ===== EXERCISES - Search =====

export const SEARCH_EXERCISES = `
  query SearchExercises($query: String!) {
    searchExercises(query: $query) {
      id
      name
      type
      movementPattern
      videoUrl
      anatomyLinks {
        role
        anatomy {
          name
        }
      }
    }
  }
`;

// Variables: { "query": "dumbbell" }

// ===== GUIDES PAGE - List All Guides =====

export const GET_ALL_GUIDES = `
  query GetAllGuides {
    guides {
      id
      slug
      title
      author
      
      primaryRegion {
        id
        name
      }
      
      sections {
        id
        kind
        title
        order
      }
    }
  }
`;

// ===== GUIDE DETAIL - Complete Guide with Images =====

export const GET_GUIDE_DETAIL = `
  query GetGuideDetail($id: String!) {
    guide(id: $id) {
      id
      slug
      title
      author
      
      primaryRegion {
        id
        name
        kind
      }
      
      sections {
        id
        kind
        title
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
            movementPattern
            videoUrl
            cueSummary
            equipment
            
            anatomyLinks {
              role
              anatomy {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

// Variables: { "id": "arms" }

// ===== GUIDE - Get by Slug =====

export const GET_GUIDE_BY_SLUG = `
  query GetGuideBySlug($slug: String!) {
    guideBySlug(slug: $slug) {
      id
      title
      sections {
        title
        content
        images
      }
    }
  }
`;

// Variables: { "slug": "conceal-and-carry-pythons" }

// ===== GUIDE - Get Sections with Images Only =====

export const GET_GUIDE_IMAGES = `
  query GetGuideImages($id: String!) {
    guide(id: $id) {
      title
      sections {
        title
        images
        imageCount
      }
    }
  }
`;

// ===== FORMULAS PAGE - List All Formulas =====

export const GET_ALL_FORMULAS = `
  query GetAllFormulas {
    formulas {
      id
      name
      description
      pattern
      
      targets {
        anatomy {
          id
          name
          kind
        }
      }
      
      steps {
        id
        order
        role
        notes
        exercise {
          id
          name
          type
        }
      }
    }
  }
`;

// ===== FORMULA DETAIL =====

export const GET_FORMULA_DETAIL = `
  query GetFormulaDetail($id: String!) {
    formula(id: $id) {
      id
      name
      description
      pattern
      
      targets {
        anatomy {
          id
          name
          kind
          description
        }
      }
      
      steps {
        id
        order
        role
        notes
        exercise {
          id
          name
          type
          movementPattern
          videoUrl
          cueSummary
          equipment
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
`;

// Variables: { "id": "triceps_long_head_formula_1" }

// ===== WORKOUTS PAGE - List All Workouts =====

export const GET_ALL_WORKOUTS = `
  query GetAllWorkouts {
    workouts {
      id
      slug
      name
      goal
      priorityRules
      
      primaryRegion {
        id
        name
      }
      
      blocks {
        id
        label
        exercises {
          exercise {
            id
            name
          }
        }
      }
    }
  }
`;

// ===== WORKOUT DETAIL - Complete Workout =====

export const GET_WORKOUT_DETAIL = `
  query GetWorkoutDetail($id: String!) {
    workout(id: $id) {
      id
      slug
      name
      goal
      priorityRules
      
      primaryRegion {
        id
        name
        kind
      }
      
      blocks {
        id
        label
        schemeStyle
        schemeDesc
        notes
        
        targets {
          anatomy {
            id
            name
            kind
          }
        }
        
        exercises {
          kind
          exercise {
            id
            name
            type
            movementPattern
            videoUrl
            cueSummary
            equipment
          }
        }
      }
    }
  }
`;

// Variables: { "id": "snipers_arm_day" }

// ===== WORKOUT - Get by Slug =====

export const GET_WORKOUT_BY_SLUG = `
  query GetWorkoutBySlug($slug: String!) {
    workoutBySlug(slug: $slug) {
      id
      name
      goal
      blocks {
        label
        schemeDesc
      }
    }
  }
`;

// Variables: { "slug": "snipers-arm-day" }

// ===== UTILITY QUERIES =====

// Get anatomy tree for navigation
export const GET_ANATOMY_TREE = `
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
`;

// Get all sections with images (for image gallery)
export const GET_ALL_IMAGES = `
  query GetAllImages {
    sectionsWithImages {
      id
      title
      images
      imageCount
      guide {
        id
        title
      }
    }
  }
`;

// Get exercises for a specific muscle
export const GET_EXERCISES_FOR_MUSCLE = `
  query GetExercisesForMuscle($muscleId: String!) {
    anatomyNode(id: $muscleId) {
      name
      description
      exerciseLinks {
        role
        exercise {
          id
          name
          type
          movementPattern
          videoUrl
          cueSummary
        }
      }
    }
  }
`;

// Variables: { "muscleId": "biceps_long_head" }

// Get related content (anatomy → guides → exercises)
export const GET_RELATED_CONTENT = `
  query GetRelatedContent($anatomyId: String!) {
    anatomyNode(id: $anatomyId) {
      name
      kind
      
      primaryGuides {
        id
        title
        slug
      }
      
      exerciseLinks {
        role
        exercise {
          id
          name
          videoUrl
        }
      }
      
      primaryWorkouts {
        id
        name
        slug
      }
    }
  }
`;

// ===== LEARN PAGE - Unified Anatomy + Guide View =====

export const GET_LEARN_PAGE = `
  query GetLearnPage($id: String!) {
    anatomyNode(id: $id) {
      id
      name
      kind
      description
      roleSummary
      
      # Get direct children (these become tabs: Biceps, Triceps, etc.)
      children {
        id
        name
        kind
        description
        roleSummary
        primaryFunctions
        aestheticNotes
        
        # Nested children for full hierarchy
        children {
          id
          name
          kind
          description
          primaryFunctions
          aestheticNotes
          
          children {
            id
            name
            kind
            description
            primaryFunctions
            aestheticNotes
            
            # Exercises at the deepest level (e.g., triceps heads)
            exerciseLinks {
              role
              exercise {
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
                  }
                }
              }
            }
          }
          
          # Exercises at each level
          exerciseLinks {
            role
            exercise {
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
                }
              }
            }
          }
        }
        
        # Exercises for child groups
        exerciseLinks {
          role
          exercise {
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
              }
            }
          }
        }
      }
      
      # Guide content with images
      primaryGuides {
        id
        title
        author
        sections {
          id
          kind
          title
          order
          content
          images
          
          focusAnatomyLinks {
            anatomy {
              id
              name
            }
          }
        }
      }
    }
  }
`;

// ===== PAGE-SPECIFIC QUERY MAPPING =====

/*
PAGE QUERY MAP:

/                         → GET_DATABASE_STATS
/anatomy                  → GET_ANATOMY_REGIONS
/anatomy/[id]             → GET_ANATOMY_DETAIL
/exercises                → GET_ALL_EXERCISES
/exercises/[id]           → GET_ANATOMY_DETAIL (via muscle)
/guides                   → GET_ALL_GUIDES
/guides/[id]              → GET_GUIDE_DETAIL ⭐ (includes images!)
/formulas                 → GET_ALL_FORMULAS
/formulas/[id]            → GET_FORMULA_DETAIL
/workouts                 → GET_ALL_WORKOUTS
/workouts/[id]            → GET_WORKOUT_DETAIL

SPECIAL QUERIES:

Images Gallery            → GET_ALL_IMAGES
Search Exercises          → SEARCH_EXERCISES
Filter by Pattern         → GET_EXERCISES_BY_PATTERN
Muscle → Exercises        → GET_EXERCISES_FOR_MUSCLE
Related Content           → GET_RELATED_CONTENT
Navigation Tree           → GET_ANATOMY_TREE
*/

// ===== QUICK START =====

/*
🚀 TRY THESE FIRST:

1. List all guides:
   { guides { title } }

2. Get arms guide with images:
   { guide(id: "arms") { title sections { title images } } }

3. Get all anatomy regions:
   { anatomyNodes(kind: "region") { name } }

4. Search for curl exercises:
   { searchExercises(query: "curl") { name type } }

5. Get workout details:
   { workout(id: "snipers_arm_day") { name blocks { label } } }
*/

