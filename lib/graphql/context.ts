// lib/graphql/context.ts
import { prisma } from '@/lib/prisma';

export interface GraphQLContext {
  prisma: typeof prisma;
}

export async function createContext(): Promise<GraphQLContext> {
  return {
    prisma,
  };
}

