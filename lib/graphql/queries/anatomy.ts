// lib/graphql/queries/anatomy.ts
import { builder } from '../builder';
import { prisma } from '@/lib/prisma';

// Get all anatomy nodes
builder.queryField('anatomyNodes', (t) =>
  t.prismaField({
    type: ['AnatomyNode'],
    description: 'Get all anatomy nodes with optional filtering',
    args: {
      kind: t.arg.string({ required: false, description: 'Filter by kind (region, group, muscle, part)' }),
    },
    resolve: async (query, _root, args) => {
      return prisma.anatomyNode.findMany({
        ...query,
        where: args.kind ? { kind: args.kind } : undefined,
        orderBy: { name: 'asc' },
      });
    },
  })
);

// Get single anatomy node by ID
builder.queryField('anatomyNode', (t) =>
  t.prismaField({
    type: 'AnatomyNode',
    nullable: true,
    description: 'Get a single anatomy node by ID',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args) => {
      return prisma.anatomyNode.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  })
);

// Get anatomy tree (hierarchy)
builder.queryField('anatomyTree', (t) =>
  t.prismaField({
    type: ['AnatomyNode'],
    description: 'Get anatomy nodes in tree structure (only regions at root level)',
    resolve: async (query) => {
      return prisma.anatomyNode.findMany({
        ...query,
        where: { parentId: null }, // Only root nodes (regions)
        orderBy: { name: 'asc' },
      });
    },
  })
);

