// lib/graphql/client.ts
/**
 * GraphQL client helper for server-side queries in Next.js
 */

export async function graphqlQuery(query: string, variables?: any) {
  const response = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store', // or 'force-cache' for static builds
  });

  const result = await response.json();

  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(result.errors[0]?.message || 'GraphQL query failed');
  }

  return result.data;
}

