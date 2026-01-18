import { getWeaviateClient } from '../../lib/weaviate';

const collections = [
  {
    class: 'Anatomy',
    vectorizer: 'text2vec-openai',
    moduleConfig: {
      'text2vec-openai': {
        model: 'text-embedding-3-small',
        dimensions: 1536,
        type: 'text',
      },
    },
    properties: [
      { name: 'sourceId', dataType: ['text'], moduleConfig: { 'text2vec-openai': { skip: true } } },
      { name: 'name', dataType: ['text'] },
      { name: 'kind', dataType: ['text'], moduleConfig: { 'text2vec-openai': { skip: true } } },
      { name: 'region', dataType: ['text'] },
      { name: 'text', dataType: ['text'] },
    ],
  },
  {
    class: 'Exercise',
    vectorizer: 'text2vec-openai',
    moduleConfig: {
      'text2vec-openai': {
        model: 'text-embedding-3-small',
        dimensions: 1536,
        type: 'text',
      },
    },
    properties: [
      { name: 'sourceId', dataType: ['text'], moduleConfig: { 'text2vec-openai': { skip: true } } },
      { name: 'name', dataType: ['text'] },
      { name: 'type', dataType: ['text'], moduleConfig: { 'text2vec-openai': { skip: true } } },
      { name: 'movementPattern', dataType: ['text'] },
      { name: 'text', dataType: ['text'] },
    ],
  },
  {
    class: 'Section',
    vectorizer: 'text2vec-openai',
    moduleConfig: {
      'text2vec-openai': {
        model: 'text-embedding-3-small',
        dimensions: 1536,
        type: 'text',
      },
    },
    properties: [
      { name: 'sourceId', dataType: ['text'], moduleConfig: { 'text2vec-openai': { skip: true } } },
      { name: 'guideId', dataType: ['text'], moduleConfig: { 'text2vec-openai': { skip: true } } },
      { name: 'title', dataType: ['text'] },
      { name: 'kind', dataType: ['text'], moduleConfig: { 'text2vec-openai': { skip: true } } },
      { name: 'text', dataType: ['text'] },
    ],
  },
];

async function main() {
  const client = getWeaviateClient();

  console.log('Setting up Weaviate schema...\n');

  for (const collection of collections) {
    try {
      await client.schema.classGetter().withClassName(collection.class).do();
      console.log(`✓ Collection ${collection.class} already exists`);
    } catch {
      await client.schema.classCreator().withClass(collection).do();
      console.log(`✓ Created collection: ${collection.class}`);
    }
  }

  console.log('\nSchema setup complete!');
}

main().catch(console.error);
