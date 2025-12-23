// app/api/graphql/route.ts
import { createYoga } from 'graphql-yoga';
import { schema } from '@/lib/graphql/schema';
import { createContext } from '@/lib/graphql/context';

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  context: createContext,
  
  // Enable GraphiQL playground in development
  graphiql: process.env.NODE_ENV === 'development',
  
  // Use Next.js fetch API
  fetchAPI: { Response },
});

// Export handlers for Next.js App Router
export async function GET(request: Request) {
  return yoga.fetch(request);
}

export async function POST(request: Request) {
  return yoga.fetch(request);
}

