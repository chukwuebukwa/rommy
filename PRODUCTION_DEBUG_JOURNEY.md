# Production Deployment Debug Journey

**Date:** December 21, 2024  
**Project:** Rommy Fitness Guide Visualizer  
**Deployment Platform:** Vercel  
**Framework:** Next.js 15.5.9 with React 19, Prisma, GraphQL (Pothos + Yoga)

---

## 🎯 Objective

Deploy the Rommy app to Vercel production and resolve all build and runtime errors preventing the application from functioning correctly.

---

## 📋 Table of Contents

1. [Initial State](#initial-state)
2. [Phase 1: Build Failures](#phase-1-build-failures)
3. [Phase 2: Security Vulnerabilities](#phase-2-security-vulnerabilities)
4. [Phase 3: Production Runtime Errors](#phase-3-production-runtime-errors)
5. [Phase 4: GraphQL Context Issues](#phase-4-graphql-context-issues)
6. [Phase 5: React Serialization Issues](#phase-5-react-serialization-issues)
7. [Key Lessons Learned](#key-lessons-learned)
8. [Final Architecture](#final-architecture)

---

## Initial State

The application was working locally in development mode but failing when deployed to Vercel. The primary symptoms were:

- Build failures during TypeScript compilation
- Server-side runtime errors on deployed pages
- Database connection issues
- GraphQL query failures

---

## Phase 1: Build Failures

### Issues Encountered

#### 1.1 Next.js 15 Async Params Breaking Change

**Error:**
```
Route "app/api/exercises/[id]/route.ts" has an invalid "PATCH" export:
Type "{ params: { id: string; }; }" is not a valid type
```

**Root Cause:**  
Next.js 15 changed dynamic route parameters from synchronous objects to asynchronous promises.

**Fix:**
```typescript
// ❌ BEFORE (Next.js 14)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // ...
}

// ✅ AFTER (Next.js 15)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

**Files Modified:**
- `app/api/exercises/[id]/route.ts`

---

#### 1.2 GraphQL Route Handler Incompatibility

**Error:**
```
Route "app/api/graphql/route.ts" has an invalid "GET" export:
Expected "Request | NextRequest", got "{ request: Request; } & ..."
```

**Root Cause:**  
Yoga GraphQL server instance cannot be directly exported as route handlers in Next.js 15.

**Fix:**
```typescript
// ❌ BEFORE
export { yoga as GET, yoga as POST };

// ✅ AFTER
export async function GET(request: Request) {
  return yoga.fetch(request);
}

export async function POST(request: Request) {
  return yoga.fetch(request);
}
```

**Files Modified:**
- `app/api/graphql/route.ts`

---

#### 1.3 TypeScript Strict Mode Violations

**Error:**
```
Parameter 'c' implicitly has an 'any' type
Parameter 'func' implicitly has an 'any' type
```

**Root Cause:**  
Missing type annotations in callback functions when TypeScript strict mode is enabled.

**Fix:**
Added explicit type annotations:
```typescript
// ❌ BEFORE
hierarchicalChildren.map(c => c.id)
primaryFunctions.map((func, i) => ...)

// ✅ AFTER
hierarchicalChildren.map((c: { id: string; name: string; kind: string }) => c.id)
primaryFunctions.map((func: string, i: number) => ...)
```

**Files Modified:**
- `app/api/learn-config/route.ts`
- `components/AnatomyTree.tsx`
- `components/AnatomyWiki.tsx`

---

#### 1.4 JSX Namespace Issue

**Error:**
```
Cannot find namespace 'JSX'
```

**Root Cause:**  
React 19 changed JSX namespace location.

**Fix:**
```typescript
// ❌ BEFORE
import { useState } from "react";
const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;

// ✅ AFTER
import React, { useState } from "react";
const HeaderTag = `h${level}` as keyof React.JSX.IntrinsicElements;
```

**Files Modified:**
- `components/AnatomyWiki.tsx`

---

#### 1.5 Exercise Type Mismatch

**Error:**
```
Type 'Exercise' is missing the following properties: cdnVideoUrl, equipment, cueSummary
```

**Root Cause:**  
Interface definitions were out of sync between components.

**Fix:**
Updated the Exercise interface in `ExerciseLibrary.tsx` to match `ExerciseEditor.tsx`:
```typescript
interface Exercise {
  id: string;
  name: string;
  type: string;
  movementPattern: string;
  videoUrl: string | null;
  cdnVideoUrl: string | null;      // Added
  equipment: string[] | null;      // Added
  cueSummary: string | null;       // Added
  anatomyLinks: Array<{...}>;
}
```

**Files Modified:**
- `components/ExerciseLibrary.tsx`

---

#### 1.6 Pothos Prisma Integration

**Error:**
```
Cannot find module '@pothos/plugin-prisma/generated'
```

**Root Cause:**  
Missing Pothos Prisma generator in schema.prisma.

**Fix:**
```prisma
// Added to schema.prisma
generator pothos {
  provider = "prisma-pothos-types"
}
```

Also updated the builder configuration:
```typescript
// lib/graphql/builder.ts
import { Prisma } from '@prisma/client';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,  // Added
    filterConnectionTotalCount: true,
  },
});
```

**Files Modified:**
- `prisma/schema.prisma`
- `lib/graphql/builder.ts`

---

#### 1.7 Prisma JSON Field Filtering

**Error:**
```
Type 'null' is not assignable to type 'InputJsonValue | JsonNullValueFilter'
```

**Root Cause:**  
Incorrect null check for JSON fields in Prisma queries.

**Fix:**
```typescript
// ❌ BEFORE
where: {
  images: {
    not: null,
  },
}

// ✅ AFTER
import { Prisma } from '@prisma/client';

where: {
  images: {
    not: Prisma.DbNull,
  },
}
```

**Files Modified:**
- `lib/graphql/queries/guides.ts`

---

#### 1.8 Archived Seed Files in Build

**Error:**
```
Type error in prisma/seed/archive/seed-arms.ts
```

**Root Cause:**  
TypeScript was checking archived files that don't need to be type-safe.

**Fix:**
```json
// tsconfig.json
{
  "exclude": ["node_modules", "prisma/seed/archive/**"]
}
```

**Files Modified:**
- `tsconfig.json`

---

## Phase 2: Security Vulnerabilities

### Issue Encountered

#### 2.1 Next.js CVE-2025-66478

**Error:**
```
Vulnerable version of Next.js detected, please update immediately.
Learn More: https://vercel.link/CVE-2025-66478
```

**Root Cause:**  
Using Next.js 15.5.6 which contained a security vulnerability.

**Fix:**
```bash
bun update next
# Updated from 15.5.6 to 15.5.9
```

**Files Modified:**
- `package.json`
- `bun.lock`

---

### Issue Encountered

#### 2.2 Prisma Client Not Generated on Vercel

**Error:**
```
Prisma has detected that this project was built on Vercel, which caches dependencies.
This leads to an outdated Prisma Client.
```

**Root Cause:**  
Vercel caches `node_modules`, preventing Prisma from auto-generating on build.

**Fix:**
Added postinstall script:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

This ensures Prisma Client is always generated after `npm install` / `bun install`.

**Files Modified:**
- `package.json`

---

### Issue Encountered

#### 2.3 Database Pages Prerendering at Build Time

**Error:**
```
Error [PageNotFoundError]: Cannot find module for page: /exercises/[id]
```

**Root Cause:**  
Pages trying to query the database during static build were failing because the production database wasn't accessible at build time.

**Fix:**
Added `force-dynamic` export to mark pages as server-rendered:
```typescript
// app/db/page.tsx
// app/exercises/[id]/page.tsx
export const dynamic = "force-dynamic";
```

**Files Modified:**
- `app/db/page.tsx`
- `app/exercises/[id]/page.tsx`

---

## Phase 3: Production Runtime Errors

### Issue Encountered

#### 3.1 Hardcoded Localhost URLs

**Error (in production):**
```
Uncaught Error: An error occurred in the Server Components render.
```

**Root Cause:**  
The GraphQL client was hardcoded to fetch from `http://localhost:3000/api/graphql`, which doesn't work in production.

```typescript
// lib/graphql/client.ts - ORIGINAL (BROKEN)
export async function graphqlQuery(query: string, variables?: any) {
  const response = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  // ...
}
```

**Fix:**
Instead of trying to construct production URLs, execute GraphQL queries **directly against the schema**:

```typescript
// lib/graphql/client.ts - FIXED
import { graphql } from 'graphql';
import { schema } from './schema';
import { createContext } from './context';

export async function graphqlQuery(query: string, variables?: any) {
  // Execute GraphQL query directly against the schema (server-side only)
  const context = await createContext();
  
  const result = await graphql({
    schema,
    source: query,
    variableValues: variables,
    contextValue: context,
  });

  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(result.errors[0]?.message || 'GraphQL query failed');
  }

  return result.data;
}
```

**Why This Works:**
- No HTTP overhead - direct schema execution
- Works in all environments (local, Vercel, etc.)
- Properly passes context to resolvers
- More efficient and reliable

**Files Modified:**
- `lib/graphql/client.ts`

---

#### 3.2 Error Handling and Logging

**Issue:**  
Production errors were cryptic and hard to debug.

**Fix:**
Added comprehensive error handling and logging:

```typescript
// lib/prisma.ts
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set!');
}

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
  errorFormat: 'pretty',
});

prisma.$connect()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    console.error('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  });
```

```typescript
// app/learn/page.tsx
try {
  const data = await graphqlQuery(GET_ANATOMY_REGIONS, {});
  // ... render success
} catch (error) {
  console.error("Error loading learn page:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-8">
      <h1 className="text-2xl font-bold text-red-800 mb-4">Error Loading Content</h1>
      <p className="text-red-600 mb-4">Unable to load learn page.</p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="bg-red-100 p-4 rounded text-xs overflow-auto">
          {errorMessage}
        </pre>
      )}
    </div>
  );
}
```

**Files Modified:**
- `lib/prisma.ts`
- `app/learn/page.tsx`
- `app/learn2/page.tsx`

---

## Phase 4: GraphQL Context Issues

### Issue Encountered

#### 4.1 Pothos Context Cache Error

**Error (critical production bug):**
```
GraphQLError: Cannot read properties of undefined (reading 'Symbol(Pothos.contextCache)')
    at resolve (.next/server/chunks/408.js:2:6579)
```

**Root Cause:**  
This was the **most critical bug**. The Pothos Prisma plugin expects to receive the Prisma client from the GraphQL context, not from direct imports. The resolvers were importing `prisma` directly and calling it, which broke Pothos's internal caching mechanism.

**The Problem:**
```typescript
// ❌ WRONG - All resolver files were doing this
import { prisma } from '@/lib/prisma';

builder.queryField('anatomyNodes', (t) =>
  t.prismaField({
    type: ['AnatomyNode'],
    resolve: async (query, _root, args) => {
      return prisma.anatomyNode.findMany({ ... });  // Direct import usage
    },
  })
);
```

**Why This Breaks:**
1. Pothos Prisma plugin stores metadata in `Symbol(Pothos.contextCache)`
2. This symbol is attached to the Prisma client in the context
3. When you import `prisma` directly, it bypasses the context system
4. Pothos can't find the cache symbol and crashes

**The Fix:**

**Step 1:** Update the builder to get Prisma from context:
```typescript
// lib/graphql/builder.ts
import type { GraphQLContext } from './context';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: GraphQLContext;  // Add Context type
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: (ctx) => ctx.prisma,  // ✅ Get from context, not direct import
    dmmf: Prisma.dmmf,
    filterConnectionTotalCount: true,
  },
});
```

**Step 2:** Update ALL resolver files to use `ctx.prisma`:
```typescript
// lib/graphql/queries/anatomy.ts
// ✅ CORRECT - Remove direct import, use context
builder.queryField('anatomyNodes', (t) =>
  t.prismaField({
    type: ['AnatomyNode'],
    resolve: async (query, _root, args, ctx) => {  // Add ctx parameter
      return ctx.prisma.anatomyNode.findMany({ ... });  // Use ctx.prisma
    },
  })
);
```

**Step 3:** Ensure context is passed in the client:
```typescript
// lib/graphql/client.ts
import { createContext } from './context';

export async function graphqlQuery(query: string, variables?: any) {
  const context = await createContext();  // Create context with prisma
  
  const result = await graphql({
    schema,
    source: query,
    variableValues: variables,
    contextValue: context,  // ✅ Pass context to GraphQL execution
  });
  
  return result.data;
}
```

**Files Modified:**
- `lib/graphql/builder.ts` - Updated to use context-based Prisma client
- `lib/graphql/client.ts` - Added context creation and passing
- `lib/graphql/queries/anatomy.ts` - All resolvers use `ctx.prisma`
- `lib/graphql/queries/exercises.ts` - All resolvers use `ctx.prisma`
- `lib/graphql/queries/guides.ts` - All resolvers use `ctx.prisma`
- `lib/graphql/queries/formulas-workouts.ts` - All resolvers use `ctx.prisma`

**Total Resolvers Fixed:** 16 GraphQL resolvers across 4 files

---

## Phase 5: React Serialization Issues

### Issue Encountered

#### 5.1 Prisma Objects in Client Components

**Error:**
```
Error: Only plain objects, and a few built-ins, can be passed to Client Components 
from Server Components. Classes or null prototypes are not supported.
  {id: "guide", label: "Guide", type: ..., data: {id: "arms", title: ..., sections: ...}}
                                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

**Root Cause:**  
Prisma returns objects with internal prototypes and metadata that React Server Components cannot serialize when passing to Client Components.

**The Problem:**
```typescript
// app/learn/[id]/page.tsx
const tabs = [
  {
    id: "guide",
    label: "Guide",
    type: "guide" as const,
    data: anatomy.primaryGuides[0],  // ❌ Prisma object with special prototype
  },
];

return (
  <LearnTabs tabs={tabs} />  // ❌ Fails - LearnTabs is a Client Component
);
```

**Why This Fails:**
- Prisma objects contain internal symbols and prototype chains
- React Server Components can only serialize plain JSON-compatible objects
- When crossing the server/client boundary, serialization fails

**The Fix:**
```typescript
// app/learn/[id]/page.tsx
const tabs = [
  {
    id: "guide",
    label: "Guide",
    type: "guide" as const,
    data: anatomy.primaryGuides[0],
  },
];

// ✅ Serialize to plain objects before passing to Client Component
const serializedTabs = JSON.parse(JSON.stringify(tabs));

return (
  <LearnTabs tabs={serializedTabs} />  // ✅ Works - plain objects
);
```

**How Serialization Works:**
1. `JSON.stringify(tabs)` converts Prisma objects to JSON string
2. `JSON.parse(...)` reconstructs as plain JavaScript objects
3. All Prisma metadata and prototypes are stripped away
4. Result is pure JSON-compatible data

**Files Modified:**
- `app/learn/[id]/page.tsx`
- `app/learn2/[id]/page.tsx`

---

## Key Lessons Learned

### 1. Framework Breaking Changes
- **Lesson:** Major version updates require careful migration
- **Action:** Always read migration guides and test builds before production
- **Next.js 15 Changes:**
  - Route params are now promises
  - Stricter type checking on route handlers
  - Enhanced serialization checks

### 2. Never Hardcode Environment-Specific URLs
- **Lesson:** Localhost URLs fail in production
- **Solution:** Use direct schema execution for server-side GraphQL
- **Benefit:** Faster, more reliable, works everywhere

### 3. Understand Your Plugin Architecture
- **Lesson:** Pothos Prisma plugin has specific context requirements
- **Critical Rule:** Always use `ctx.prisma`, never import directly
- **Why:** Plugins rely on context for caching and metadata

### 4. React Server Components Serialization
- **Lesson:** Not all objects can cross server/client boundary
- **Solution:** Serialize Prisma/ORM objects before passing to Client Components
- **Method:** `JSON.parse(JSON.stringify(data))`

### 5. Build vs Dev Mode Differences
- **Lesson:** Dev mode (`next dev`) hides many production issues
- **Action:** Always run `next build` locally before deployment
- **Why:** Build mode enables stricter checks and catches serialization issues

### 6. Vercel-Specific Considerations
- **Lesson:** Vercel caches dependencies aggressively
- **Solution:** Use `postinstall` scripts for code generation
- **Apply to:** Prisma, GraphQL schema generation, etc.

### 7. Comprehensive Error Handling
- **Lesson:** Production errors need detailed logging
- **Strategy:**
  - Log database connection status
  - Wrap async operations in try-catch
  - Show different messages in dev vs production
  - Include error context for debugging

### 8. TypeScript Strict Mode Benefits
- **Lesson:** Strict mode catches bugs early
- **Initially:** Seemed like unnecessary work
- **Reality:** Prevented runtime errors in production

---

## Final Architecture

### GraphQL Query Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Server Component (app/learn/page.tsx)                       │
│                                                              │
│  1. const data = await graphqlQuery(GET_ANATOMY_REGIONS)    │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ GraphQL Client (lib/graphql/client.ts)                      │
│                                                              │
│  2. const context = await createContext()                   │
│  3. const result = await graphql({                          │
│       schema,                                               │
│       source: query,                                        │
│       contextValue: context  ← Contains prisma client      │
│     })                                                      │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ GraphQL Resolver (lib/graphql/queries/anatomy.ts)           │
│                                                              │
│  4. resolve: async (query, _root, args, ctx) => {           │
│       return ctx.prisma.anatomyNode.findMany({ ... })       │
│     }                     │                                  │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Prisma Client (lib/prisma.ts)                               │
│                                                              │
│  5. Query PostgreSQL database                               │
│  6. Return results with metadata                            │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Back to Server Component                                    │
│                                                              │
│  7. const serializedData = JSON.parse(JSON.stringify(data)) │
│  8. return <ClientComponent data={serializedData} />        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Architecture Principles

1. **Direct GraphQL Execution**
   - No HTTP requests for server-side queries
   - Execute directly against schema
   - Faster and more reliable

2. **Context-Based Prisma**
   - Prisma client always accessed via context
   - Enables Pothos caching and metadata
   - Consistent pattern across all resolvers

3. **Proper Serialization**
   - Server Components serialize before passing to Client
   - Strips Prisma metadata and prototypes
   - Ensures React can serialize across boundary

4. **Environment-Aware Configuration**
   - Dynamic rendering for database-dependent pages
   - Different logging for dev vs production
   - Automatic Prisma generation on Vercel

---

## Commit History

1. `652f9ad` - Fix build issues: Next.js 15 compatibility, TypeScript strict mode
2. `c773a3c` - Add postinstall script for Vercel Prisma generation
3. `74015d3` - Update Next.js to 15.5.9, mark DB pages as dynamic
4. `6468200` - Add error handling to learn pages and improve Prisma logging
5. `96fefe5` - Fix production error: use direct GraphQL execution
6. `1620fbb` - Add detailed error logging for database connections
7. `f0dfb86` - **Fix Pothos context issue: use ctx.prisma in all resolvers** ⭐
8. `4ad4278` - Serialize Prisma objects before passing to Client Components

---

## Testing Checklist

Before deploying to production, verify:

- [ ] `bun run build` completes successfully
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] DATABASE_URL environment variable set in Vercel
- [ ] All dynamic routes work
- [ ] GraphQL queries return data
- [ ] Client Components render correctly
- [ ] Error handling displays user-friendly messages
- [ ] Check Vercel Function Logs for errors
- [ ] Test all main pages: `/`, `/learn`, `/learn/arms`, `/exercises`, etc.

---

## Resources

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [Pothos Prisma Plugin Documentation](https://pothos-graphql.dev/docs/plugins/prisma)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

## Conclusion

This debugging journey revealed several critical lessons about modern web application architecture:

1. **Plugin systems have rules** - Understand and follow them (Pothos context pattern)
2. **Framework upgrades need care** - Breaking changes affect production
3. **Development ≠ Production** - Always test builds, not just dev mode
4. **Serialization matters** - Not all objects can cross boundaries
5. **Direct is better** - For server-side operations, avoid unnecessary HTTP

The root cause was **architectural misunderstanding** of how Pothos Prisma plugin works. Once corrected to use the context pattern throughout, all GraphQL operations became stable and reliable.

**Final Result:** ✅ Production app fully functional on Vercel with proper error handling, logging, and performance optimization.

