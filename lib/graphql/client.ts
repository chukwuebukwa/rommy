// lib/graphql/client.ts
/**
 * GraphQL client helper for server-side queries in Next.js
 */

import { graphql } from 'graphql';
import { schema } from './schema';
import { createContext } from './context';

export async function graphqlQuery(query: string, variables?: any) {
  // Execute GraphQL query directly against the schema (server-side only)
  // This avoids HTTP requests and works reliably in all environments
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

