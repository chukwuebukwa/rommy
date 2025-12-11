// app/api/graphql/route.ts
import { createYoga } from 'graphql-yoga';
import { schema } from '@/lib/graphql/schema';

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  
  // Enable GraphiQL playground in development
  graphiql: process.env.NODE_ENV === 'development',
  
  // Use Next.js fetch API
  fetchAPI: { Response },
});

// Export handlers for Next.js App Router
export { yoga as GET, yoga as POST };

