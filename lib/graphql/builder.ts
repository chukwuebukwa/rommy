// lib/graphql/builder.ts
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { Prisma } from '@prisma/client';
import type { GraphQLContext } from './context';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: GraphQLContext;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: (ctx) => ctx.prisma,
    dmmf: Prisma.dmmf,
    // Automatically resolve relations when they're queried
    filterConnectionTotalCount: true,
  },
});

// Initialize Query type (read-only API)
builder.queryType({
  description: 'Root query type for the Rommy fitness guide API',
});

