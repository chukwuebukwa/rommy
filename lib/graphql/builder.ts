// lib/graphql/builder.ts
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { prisma } from '@/lib/prisma';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    // Automatically resolve relations when they're queried
    filterConnectionTotalCount: true,
  },
});

// Initialize Query type (read-only API)
builder.queryType({
  description: 'Root query type for the Rommy fitness guide API',
});

