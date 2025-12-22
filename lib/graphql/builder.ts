// lib/graphql/builder.ts
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { Prisma } from '@prisma/client';
import type { GraphQLContext } from './context';
import { GraphQLScalarType } from 'graphql';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: GraphQLContext;
  Scalars: {
    JSON: {
      Input: unknown;
      Output: unknown;
    };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: (ctx) => ctx.prisma,
    dmmf: Prisma.dmmf,
    // Automatically resolve relations when they're queried
    filterConnectionTotalCount: true,
  },
});

// Add JSON scalar type
builder.addScalarType('JSON', new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON scalar type',
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (ast) => {
    if (ast.kind === 'StringValue') {
      try {
        return JSON.parse(ast.value);
      } catch {
        return ast.value;
      }
    }
    return null;
  },
}), {});

// Initialize Query type (read-only API)
builder.queryType({
  description: 'Root query type for the Rommy fitness guide API',
});

