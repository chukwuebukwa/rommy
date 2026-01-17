# LLM Querying of the Anatomy Graph

This document describes how to make the anatomy graph queryable by LLMs and other AI systems.

## Overview

The anatomy graph contains:
- **73 anatomy nodes** (regions, groups, muscles, parts)
- **230 exercises** with movement patterns and equipment
- **Exercise-muscle links** with primary/secondary roles
- **Cross-region relationships** showing how muscles work together

## Export Formats

Three LLM-optimized exports are available:

| File | Size | Tokens | Use Case |
|------|------|--------|----------|
| `anatomy-compact.txt` | 24KB | ~6K | System prompts, minimal context |
| `anatomy-llm.md` | 45KB | ~11K | Human-readable, full detail |
| `anatomy-llm.json` | 104KB | ~26K | Programmatic access, RAG systems |

### Regenerating Exports

```bash
# From ts/ directory
bun run prisma/export-llm-compact.ts > anatomy-compact.txt
bun run prisma/export-llm-graph.ts > anatomy-llm.md
bun run prisma/export-llm-json.ts > anatomy-llm.json
```

## Format Details

### Compact Format (`anatomy-compact.txt`)

Ultra-dense format using abbreviations to minimize tokens:

```
Arms>Biceps Long Head: p=[Drag Crl,Inc DB Crl] s=[Preacher Bar Crl]
```

**Abbreviations:**
- `DB`=Dumbbell, `BB`=Barbell, `Cb`=Cable, `Mc`=Machine
- `Inc`=Incline, `Dec`=Decline, `Std`=Standing, `Sit`=Seated
- `Pr`=Press, `Crl`=Curl, `Rw`=Row, `Rs`=Raise, `Ext`=Extension
- `PU`=Pull-Up, `PD`=Pulldown, `HS`=Hammer Strength
- `1A`=Single Arm, `2x`=Double, `Rev`=Reverse
- `p=`primary, `s=`secondary

**Structure:**
1. MUSCLES section: `REGION>muscle: p=[exercises] s=[exercises]`
2. EXERCISES section: `name (c/i): p=[muscles] s=[muscles]`
3. CROSS-REGION section: top 20 muscle pairs that work across regions
4. QUICK LOOKUPS: common groupings (push/pull/legs)

### Markdown Format (`anatomy-llm.md`)

Human-readable with full names:

```markdown
## ANATOMY TREE
R: Arms
  G: Biceps
    M: Biceps Brachii [9 ex]
      P: Biceps Long Head [9 ex]

## MUSCLE EXERCISES
Biceps Long Head (Arms): primary=[Drag Curls, Close Grip Bar Curl] secondary=[Preacher Bar Curls]

## EXERCISE TARGETS
Incline Dumbbell Press (compound/press): primary=[Upper Chest] secondary=[Front Delts, Triceps]
```

### JSON Format (`anatomy-llm.json`)

Structured for programmatic access:

```json
{
  "regions": {
    "arms": {
      "name": "Arms",
      "muscles": {
        "biceps_long_head": {
          "name": "Biceps Long Head",
          "kind": "part",
          "parent": "biceps_brachii",
          "primary": ["Drag Curls", "Incline Dumbbell Curls"],
          "secondary": ["Preacher Bar Curls"]
        }
      }
    }
  },
  "exercises": {
    "incline_dumbbell_press": {
      "name": "Incline Dumbbell Press",
      "type": "compound",
      "pattern": "press",
      "primary": ["Upper Chest"],
      "secondary": ["Front Delts", "Triceps Brachii"]
    }
  },
  "coactivation": [
    { "muscles": ["Front Delts", "Triceps"], "regions": ["Shoulders", "Arms"], "count": 19 }
  ]
}
```

## Integration Approaches

### 1. System Prompt Injection

Inject `anatomy-compact.txt` directly into the system prompt:

```typescript
const systemPrompt = `You are a fitness assistant with knowledge of anatomy.

ANATOMY DATA:
${await Bun.file("anatomy-compact.txt").text()}

Use this data to answer questions about exercises and muscles.`;
```

**Pros:** Simple, always available, no tool calls needed
**Cons:** Uses ~6K tokens of context permanently

### 2. RAG (Retrieval-Augmented Generation)

Embed exercises and muscles, retrieve relevant chunks:

```typescript
// Pseudocode
const chunks = exercises.map(ex => ({
  id: ex.id,
  text: `${ex.name} is a ${ex.type} ${ex.pattern} exercise that primarily targets ${ex.primary.join(", ")}`,
  embedding: embed(text)
}));

// At query time
const relevant = vectorSearch(query, chunks, topK=10);
const context = relevant.map(r => r.text).join("\n");
```

**Pros:** Scales to larger datasets, only loads relevant context
**Cons:** Requires embedding infrastructure

### 3. Tool Use / Function Calling

Expose the graph as tools the LLM can call:

```typescript
const tools = [
  {
    name: "find_exercises_for_muscle",
    description: "Find exercises that target a specific muscle",
    parameters: {
      muscle: { type: "string", description: "Muscle name (e.g., 'biceps', 'rear delts')" },
      role: { type: "string", enum: ["primary", "secondary", "any"] }
    }
  },
  {
    name: "find_muscles_for_exercise",
    description: "Find which muscles an exercise targets",
    parameters: {
      exercise: { type: "string", description: "Exercise name" }
    }
  },
  {
    name: "find_related_muscles",
    description: "Find muscles that commonly work together with a given muscle",
    parameters: {
      muscle: { type: "string" }
    }
  }
];
```

**Pros:** Precise queries, minimal token usage, can hit live database
**Cons:** Requires tool implementation, adds latency

### 4. GraphQL Queries

The existing GraphQL schema already supports anatomy queries:

```graphql
# Get exercises for a muscle
query GetMuscleExercises($id: String!) {
  anatomyNode(id: $id) {
    name
    exerciseLinks {
      role
      exercise {
        name
        type
        movementPattern
      }
    }
  }
}

# Get muscles for an exercise
query GetExerciseTargets($id: String!) {
  exercise(id: $id) {
    name
    anatomyLinks {
      role
      anatomy {
        name
        kind
      }
    }
  }
}
```

## Query Examples

### "What exercises hit rear delts?"

**From compact format:**
```
Shoulders>Rear Delts: p=[Triple Rear Delt Delight,Rev Pec Dec Flyes,Y Rs,Rev Inc Flyes,Face Pulls,...]
```

**From JSON:**
```typescript
const rearDeltExercises = graph.regions.shoulders.muscles.rear_delts.primary;
```

### "What muscles does incline press work?"

**From compact format:**
```
Inc DB Pr (c): p=[Upper Chest] s=[Front Delts,Triceps Brachii]
```

### "What muscles connect shoulders and back?"

**From coactivation data:**
```
19x: Front Delts <> Triceps
16x: Middle Traps <> Rear Delts
10x: Rear Delts <> Rhomboids
10x: Traps <> Side Delts
```

## Functional Clusters

The graph reveals natural muscle groupings based on exercise overlap:

### Push Cluster
- **Muscles:** Chest + Front Delts + Triceps
- **Pattern:** Fire together on pressing movements
- **Cross-region connections:** 58+

### Pull Cluster
- **Muscles:** Lats + Traps + Rhomboids + Rear Delts
- **Pattern:** Back and Shoulders heavily intertwined
- **Cross-region connections:** 90

### Posterior Chain
- **Muscles:** Glutes + Hamstrings + Erector Spinae
- **Pattern:** Connect through hip hinge movements
- **Cross-region connections:** 46

### Isolated Groups
- **Biceps:** Works primarily within Arms region
- **Calves:** Minimal cross-region activation
- **Quads:** Some erector connection via squats

## Data Model Reference

```
AnatomyNode
├── id: string (e.g., "biceps_long_head")
├── kind: "region" | "group" | "muscle" | "part"
├── name: string
├── parentId: string? (for hierarchy)
├── description: string?
├── primaryFunctions: string[]
└── exerciseLinks: ExerciseAnatomy[]

Exercise
├── id: string (e.g., "incline_dumbbell_press")
├── name: string
├── type: "compound" | "isolation"
├── movementPattern: "press" | "curl" | "row" | ...
├── equipment: string[]
└── anatomyLinks: ExerciseAnatomy[]

ExerciseAnatomy
├── exerciseId: string
├── anatomyNodeId: string
└── role: "primary" | "secondary"
```

## Files

| Path | Description |
|------|-------------|
| `prisma/export-llm-compact.ts` | Generates ultra-compact format |
| `prisma/export-llm-graph.ts` | Generates markdown format |
| `prisma/export-llm-json.ts` | Generates JSON format |
| `prisma/analyze-anatomy.ts` | Analyzes cross-region relationships |
| `prisma/analyze-bridges.ts` | Finds bridge muscles between regions |
| `anatomy-compact.txt` | Compact export output |
| `anatomy-llm.md` | Markdown export output |
| `anatomy-llm.json` | JSON export output |
| `anatomy-report.md` | Analysis report |
