# RAG Implementation Status

## Completed

- [x] Weaviate deployed on Railway (`weaviate-production-8fd8.up.railway.app`)
- [x] `weaviate-ts-client` installed
- [x] `lib/weaviate.ts` - client singleton
- [x] `lib/rag.ts` - search function with `nearText`
- [x] `prisma/rag/setup-schema.ts` - creates Anatomy, Exercise, Section collections
- [x] `prisma/rag/embed-content.ts` - imports data from Postgres to Weaviate
- [x] `app/api/rag/search/route.ts` - search API endpoint
- [x] Initial data imported: 73 anatomy, 230 exercises, 80 sections

## To Do

### High Priority
- [ ] Add `OPENAI_APIKEY` to Railway Weaviate if not already done (needed for embeddings)
- [ ] Add Transcript collection for video transcripts
- [ ] Transcribe Uncle Rommy's YouTube/IG videos (Whisper API)
- [ ] Chunk and import transcripts to Weaviate

### Medium Priority
- [ ] Build LLM chat endpoint that uses RAG context
- [ ] Add re-embed script for when Postgres data changes
- [ ] Consider hybrid search (keyword + semantic)

### Low Priority
- [ ] Add more metadata filtering (by region, exercise type, etc.)
- [ ] Explore Weaviate's generative module for direct Q&A
- [ ] Add caching layer for frequent queries

## Quick Reference

```bash
# Setup Weaviate collections (run once)
bun run prisma/rag/setup-schema.ts

# Import/re-import data to Weaviate
bun run prisma/rag/embed-content.ts

# Test search API
curl "http://localhost:3000/api/rag/search?q=rear+delts"
curl "http://localhost:3000/api/rag/search?q=bigger+arms&collections=Exercise&limit=5"
```

## Architecture

```
Postgres (Railway)          Weaviate (Railway)
┌──────────────────┐       ┌──────────────────┐
│ AnatomyNode      │──────▶│ Anatomy          │
│ Exercise         │──────▶│ Exercise         │
│ Section          │──────▶│ Section          │
│ (future)         │──────▶│ Transcript       │
└──────────────────┘       └──────────────────┘
                                   │
                           ┌───────▼───────┐
                           │ /api/rag/search│
                           └───────┬───────┘
                                   │
                           ┌───────▼───────┐
                           │  LLM Context  │
                           └───────────────┘
```

## Files

| File | Purpose |
|------|---------|
| `lib/weaviate.ts` | Weaviate client |
| `lib/rag.ts` | Search function |
| `prisma/rag/setup-schema.ts` | Create collections |
| `prisma/rag/embed-content.ts` | Import data |
| `app/api/rag/search/route.ts` | Search API |

## Env Vars

```bash
# .env (local)
WEAVIATE_HOST=weaviate-production-8fd8.up.railway.app

# Railway Weaviate service
OPENAI_APIKEY=sk-...
```
