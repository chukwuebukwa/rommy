import weaviate, { WeaviateClient } from 'weaviate-ts-client';

let client: WeaviateClient | null = null;

export function getWeaviateClient(): WeaviateClient {
  if (!client) {
    client = weaviate.client({
      scheme: 'https',
      host: process.env.WEAVIATE_HOST || 'weaviate-production-8fd8.up.railway.app',
    });
  }
  return client;
}
