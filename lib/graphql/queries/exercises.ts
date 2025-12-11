// lib/graphql/queries/exercises.ts
import { builder } from '../builder';
import { prisma } from '@/lib/prisma';

// Get all exercises
builder.queryField('exercises', (t) =>
  t.prismaField({
    type: ['Exercise'],
    description: 'Get all exercises with optional filtering',
    args: {
      type: t.arg.string({ required: false, description: 'Filter by type (compound | isolation)' }),
      movementPattern: t.arg.string({ required: false, description: 'Filter by movement pattern (press, curl, etc.)' }),
    },
    resolve: async (query, _root, args) => {
      const where: any = {};
      
      if (args.type) where.type = args.type;
      if (args.movementPattern) where.movementPattern = args.movementPattern;
      
      return prisma.exercise.findMany({
        ...query,
        where: Object.keys(where).length > 0 ? where : undefined,
        orderBy: { name: 'asc' },
      });
    },
  })
);

// Get single exercise by ID
builder.queryField('exercise', (t) =>
  t.prismaField({
    type: 'Exercise',
    nullable: true,
    description: 'Get a single exercise by ID',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args) => {
      return prisma.exercise.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  })
);

// Search exercises by name
builder.queryField('searchExercises', (t) =>
  t.prismaField({
    type: ['Exercise'],
    description: 'Search exercises by name (case insensitive)',
    args: {
      query: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args) => {
      return prisma.exercise.findMany({
        ...query,
        where: {
          name: {
            contains: args.query,
            mode: 'insensitive',
          },
        },
        orderBy: { name: 'asc' },
      });
    },
  })
);

