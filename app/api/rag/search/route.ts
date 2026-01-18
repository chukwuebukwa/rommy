import { search } from '@/lib/rag';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const collectionsParam = searchParams.get('collections');
  const limitParam = searchParams.get('limit');

  if (!query) {
    return Response.json({ error: 'Missing query parameter "q"' }, { status: 400 });
  }

  const collections = collectionsParam
    ? (collectionsParam.split(',') as ('Anatomy' | 'Exercise' | 'Section')[])
    : undefined;

  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  try {
    const results = await search(query, { collections, limit });
    return Response.json({ query, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('RAG search error:', message, error);
    return Response.json({ error: 'Search failed', details: message }, { status: 500 });
  }
}
