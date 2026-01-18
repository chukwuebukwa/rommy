import { getWeaviateClient } from './weaviate';

export type SearchOptions = {
  collections?: ('Anatomy' | 'Exercise' | 'Section')[];
  limit?: number;
};

export type SearchResult = {
  sourceId: string;
  name: string;
  text: string;
  collection: 'Anatomy' | 'Exercise' | 'Section';
  similarity: number;
};

// Different collections have different fields
const COLLECTION_FIELDS: Record<string, string> = {
  Anatomy: 'sourceId name text _additional { certainty }',
  Exercise: 'sourceId name text _additional { certainty }',
  Section: 'sourceId title text _additional { certainty }',
};

export async function search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
  const client = getWeaviateClient();
  const collections = options?.collections ?? ['Anatomy', 'Exercise', 'Section'];
  const limit = options?.limit ?? 10;

  const results = await Promise.all(
    collections.map(async (className) => {
      const fields = COLLECTION_FIELDS[className] || 'sourceId text _additional { certainty }';

      const response = await client.graphql
        .get()
        .withClassName(className)
        .withNearText({ concepts: [query] })
        .withLimit(limit)
        .withFields(fields)
        .do();

      const items = response.data?.Get?.[className] || [];
      return items.map((item: any) => ({
        sourceId: item.sourceId,
        name: item.name || item.title || 'Unknown',  // Section uses title
        text: item.text,
        collection: className as 'Anatomy' | 'Exercise' | 'Section',
        similarity: item._additional?.certainty ?? 0,
      }));
    })
  );

  // Flatten and sort by similarity
  return results
    .flat()
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}
