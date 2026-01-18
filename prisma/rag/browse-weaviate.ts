import { getWeaviateClient } from '../../lib/weaviate';

async function getCollectionStats() {
  const client = getWeaviateClient();

  const collections = ['Anatomy', 'Exercise', 'Section'];

  console.log('=== Weaviate Collection Stats ===\n');

  for (const collection of collections) {
    try {
      const result = await client.graphql
        .aggregate()
        .withClassName(collection)
        .withFields('meta { count }')
        .do();

      const count = result.data?.Aggregate?.[collection]?.[0]?.meta?.count ?? 0;
      console.log(`${collection}: ${count} objects`);
    } catch (e: any) {
      console.log(`${collection}: Error - ${e.message}`);
    }
  }
}

async function sampleCollection(collection: string, limit = 5) {
  const client = getWeaviateClient();

  const fieldMap: Record<string, string> = {
    Anatomy: 'sourceId name kind text',
    Exercise: 'sourceId name type movementPattern text',
    Section: 'sourceId guideId title kind text',
  };

  console.log(`\n=== Sample ${collection} (${limit} items) ===\n`);

  try {
    const result = await client.graphql
      .get()
      .withClassName(collection)
      .withFields(fieldMap[collection] || 'sourceId text')
      .withLimit(limit)
      .do();

    const items = result.data?.Get?.[collection] || [];

    items.forEach((item: any, i: number) => {
      console.log(`--- ${i + 1}. ${item.name || item.title} ---`);
      console.log(`ID: ${item.sourceId}`);
      if (item.kind) console.log(`Kind: ${item.kind}`);
      if (item.type) console.log(`Type: ${item.type}`);
      if (item.guideId) console.log(`Guide ID: ${item.guideId}`);
      console.log(`Text: ${item.text?.slice(0, 200)}...`);
      console.log('');
    });
  } catch (e: any) {
    console.log(`Error: ${e.message}`);
  }
}

async function searchCollection(collection: string, query: string, limit = 5) {
  const client = getWeaviateClient();

  const fieldMap: Record<string, string> = {
    Anatomy: 'sourceId name kind text _additional { certainty }',
    Exercise: 'sourceId name type text _additional { certainty }',
    Section: 'sourceId title guideId text _additional { certainty }',
  };

  console.log(`\n=== Search "${query}" in ${collection} ===\n`);

  try {
    const result = await client.graphql
      .get()
      .withClassName(collection)
      .withFields(fieldMap[collection])
      .withNearText({ concepts: [query] })
      .withLimit(limit)
      .do();

    const items = result.data?.Get?.[collection] || [];

    items.forEach((item: any, i: number) => {
      const certainty = (item._additional?.certainty * 100).toFixed(1);
      console.log(`${i + 1}. [${certainty}%] ${item.name || item.title}`);
      console.log(`   ID: ${item.sourceId}`);
      console.log(`   ${item.text?.slice(0, 150)}...`);
      console.log('');
    });
  } catch (e: any) {
    console.log(`Error: ${e.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'stats') {
    await getCollectionStats();
  } else if (command === 'sample') {
    const collection = args[1] || 'Exercise';
    const limit = parseInt(args[2]) || 5;
    await sampleCollection(collection, limit);
  } else if (command === 'search') {
    const collection = args[1] || 'Exercise';
    const query = args[2] || 'tricep';
    const limit = parseInt(args[3]) || 5;
    await searchCollection(collection, query, limit);
  } else {
    console.log(`
Usage:
  bun run prisma/rag/browse-weaviate.ts stats              # Show collection counts
  bun run prisma/rag/browse-weaviate.ts sample Exercise 5  # Sample 5 exercises
  bun run prisma/rag/browse-weaviate.ts sample Section 5   # Sample 5 sections
  bun run prisma/rag/browse-weaviate.ts sample Anatomy 5   # Sample 5 anatomy
  bun run prisma/rag/browse-weaviate.ts search Exercise "tricep" 5  # Search exercises
  bun run prisma/rag/browse-weaviate.ts search Section "shoulder" 5 # Search sections
    `);
  }
}

main().catch(console.error);
