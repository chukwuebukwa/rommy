# 🚀 GraphQL API Documentation

Type-safe GraphQL API for the Rommy Fitness Guide database, built with Pothos + GraphQL Yoga.

---

## 📊 Overview

This GraphQL API exposes your entire Prisma database including:
- ✅ **4 Guides** (Arms, Shoulders, Back, Chest)
- ✅ **63 Sections** (19 with images)
- ✅ **70 Anatomy Nodes** (regions, groups, muscles, parts)
- ✅ **201 Exercises** 
- ✅ **17 Formulas**
- ✅ **4 Workouts**
- ✅ **224 Images** (referenced by path)

---

## 🌐 Access

### GraphiQL Playground (Development)
```
http://localhost:3000/api/graphql
```

Open in your browser to get:
- 🎯 Interactive query editor
- 📚 Full API documentation
- ✨ Auto-complete
- 🔍 Schema explorer

### Endpoint
```
POST http://localhost:3000/api/graphql
```

---

## ⚡ Quick Start

### 1. Start the Server

```bash
bun run dev
```

### 2. Open GraphiQL

Visit: `http://localhost:3000/api/graphql`

### 3. Try a Query

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

---

## 🏗️ Architecture

### Stack
- **Pothos** - Code-first GraphQL schema builder
- **GraphQL Yoga** - Modern GraphQL server
- **Prisma** - Database ORM
- **Next.js 15** - API Routes

### File Structure

```
lib/graphql/
├── builder.ts           # Pothos configuration
├── context.ts          # GraphQL context (Prisma client)
├── schema.ts           # Compiled schema
├── types/
│   ├── anatomy.ts      # AnatomyNode type
│   ├── guide.ts        # Guide + Section types (with images!)
│   ├── exercise.ts     # Exercise type
│   ├── formula.ts      # Formula types
│   ├── workout.ts      # Workout types
│   └── index.ts        # Export all
└── queries/
    ├── anatomy.ts      # Anatomy queries
    ├── guides.ts       # Guide queries
    ├── exercises.ts    # Exercise queries
    ├── formulas-workouts.ts  # Formula + Workout queries
    └── index.ts        # Export all

app/api/graphql/
└── route.ts            # GraphQL endpoint
```

---

## 📖 Key Features

### 1. Type Safety

All types are generated from your Prisma schema automatically:

```typescript
// Impossible to query non-existent fields!
// GraphQL client gets full type inference
```

### 2. Image Support

Sections return images as string arrays:

```graphql
query {
  section(id: "intro-young-man-muscle") {
    images  # ["arms/page9_img1.jpeg", "arms/page9_img2.jpeg"]
    imageCount  # 3
  }
}
```

### 3. Relation Traversal

Easy deep queries:

```graphql
query {
  anatomyNode(id: "biceps_long_head") {
    name
    parent {
      name
      parent {
        name
      }
    }
  }
}
```

### 4. Filtering

Built-in filters:

```graphql
query {
  exercises(
    type: "compound"
    movementPattern: "press"
  ) {
    name
  }
}
```

### 5. Computed Fields

Virtual fields like `imageCount`:

```graphql
query {
  section(id: "anatomy-biceps") {
    imageCount  # Calculated on-the-fly
  }
}
```

---

## 🔍 Available Queries

### Guides
- `guides` - List all guides
- `guide(id)` - Get guide by ID
- `guideBySlug(slug)` - Get guide by slug
- `section(id)` - Get section by ID
- `sectionsWithImages` - All sections that have images

### Anatomy
- `anatomyNodes(kind?)` - List anatomy (optional filter)
- `anatomyNode(id)` - Get single anatomy node
- `anatomyTree` - Get hierarchy (regions with children)

### Exercises
- `exercises(type?, movementPattern?)` - List with filters
- `exercise(id)` - Get single exercise
- `searchExercises(query)` - Search by name

### Workouts & Formulas
- `workouts` - List all workouts
- `workout(id)` - Get workout by ID
- `workoutBySlug(slug)` - Get workout by slug
- `formulas` - List all formulas
- `formula(id)` - Get formula by ID

See `GRAPHQL_EXAMPLES.md` for detailed query examples.

---

## 🖼️ Working with Images

### GraphQL Returns Paths

```graphql
query {
  guide(id: "arms") {
    sections {
      title
      images  # ["arms/page9_img1.jpeg", ...]
    }
  }
}
```

### Frontend Displays Images

```tsx
// React component
const section = data.section;

section.images?.map(imagePath => (
  <img src={`/guides/${imagePath}`} alt={section.title} />
))
```

**Image URL:** `/guides/arms/page9_img1.jpeg`  
**Physical Location:** `public/guides/arms/page9_img1.jpeg`

---

## 🔧 Development

### Adding New Types

1. Define in `lib/graphql/types/yourtype.ts`
2. Import in `lib/graphql/types/index.ts`
3. Pothos auto-generates GraphQL schema

### Adding New Queries

1. Define in `lib/graphql/queries/yourqueries.ts`
2. Import in `lib/graphql/queries/index.ts`
3. Available immediately in GraphiQL

### Schema Changes

When you modify `schema.prisma`:

```bash
# 1. Run migration
bunx prisma migrate dev

# 2. Regenerate types
bunx prisma generate

# 3. Restart dev server
bun run dev
```

GraphQL types automatically sync with Prisma!

---

## 🧪 Testing

### Using GraphiQL

1. Open `http://localhost:3000/api/graphql`
2. Write query on left
3. See results on right
4. Explore docs with "Docs" button

### Using curl

```bash
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ guides { title } }"}'
```

### Using GraphQL Client

```typescript
// urql example
import { useQuery } from 'urql';

const GUIDES_QUERY = `
  query {
    guides {
      title
      sections {
        title
        images
      }
    }
  }
`;

function GuidesPage() {
  const [result] = useQuery({ query: GUIDES_QUERY });
  // result.data is fully typed!
}
```

---

## 📚 Resources

- **GraphQL Examples:** See `GRAPHQL_EXAMPLES.md`
- **Pothos Docs:** https://pothos-graphql.dev/
- **GraphQL Yoga:** https://the-guild.dev/graphql/yoga-server
- **GraphQL Spec:** https://graphql.org/

---

## 🎯 Use Cases

### Frontend (React/Next.js)
- Fetch exactly the data needed for each component
- Fully typed responses with codegen
- No over-fetching

### Mobile Apps
- Apollo iOS/Android clients
- Type-safe queries
- Efficient data loading

### External Integrations
- Headless CMS
- Third-party apps
- API consumers

---

## ⚡ Performance

### Automatic Optimizations

Pothos + Prisma automatically:
- ✅ Only fetch requested fields
- ✅ Batch relation queries (no N+1)
- ✅ Use Prisma's `select` and `include`
- ✅ Lazy-load relations

### Caching (Future)

Can add:
- Response caching
- DataLoader for batching
- CDN caching for static data

---

## 🔒 Security

### Current State
- ✅ Read-only API (no mutations)
- ✅ All data is public
- ✅ No authentication needed

### Future Enhancements
- Add authentication context
- Permission checks for mutations
- Rate limiting
- Query complexity limits

---

## 🚀 Next Steps

### Add Mutations (Optional)

Currently read-only. To add writes:

```typescript
// lib/graphql/mutations/exercises.ts
builder.mutationField('createExercise', (t) =>
  t.prismaField({
    type: 'Exercise',
    args: {
      name: t.arg.string({ required: true }),
      type: t.arg.string({ required: true }),
      // ...
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.exercise.create({
        ...query,
        data: args,
      });
    },
  })
);
```

### Add Subscriptions

For real-time updates:

```typescript
builder.subscriptionField('workoutUpdated', (t) =>
  t.field({
    type: 'Workout',
    subscribe: () => workoutUpdateStream,
    resolve: (workout) => workout,
  })
);
```

---

## 🎉 Summary

**You now have a complete, type-safe GraphQL API!**

- ✅ All models exposed
- ✅ Images supported
- ✅ Relations working
- ✅ Filtering enabled
- ✅ Documentation complete
- ✅ Playground active

**Ready to query your fitness guide data!** 🏋️‍♂️

---

*Built with Pothos + GraphQL Yoga + Prisma + Next.js 15*

