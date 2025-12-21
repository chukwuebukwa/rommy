// lib/graphql/queries/formulas-workouts.ts
import { builder } from '../builder';

// ===== FORMULAS =====

// Get all formulas
builder.queryField('formulas', (t) =>
  t.prismaField({
    type: ['Formula'],
    description: 'Get all training formulas',
    resolve: async (query, _root, _args, ctx) => {
      return ctx.prisma.formula.findMany({
        ...query,
        orderBy: { name: 'asc' },
      });
    },
  })
);

// Get single formula by ID
builder.queryField('formula', (t) =>
  t.prismaField({
    type: 'Formula',
    nullable: true,
    description: 'Get a single formula by ID',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.formula.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  })
);

// ===== WORKOUTS =====

// Get all workouts
builder.queryField('workouts', (t) =>
  t.prismaField({
    type: ['Workout'],
    description: 'Get all workouts',
    resolve: async (query, _root, _args, ctx) => {
      return ctx.prisma.workout.findMany({
        ...query,
        orderBy: { name: 'asc' },
      });
    },
  })
);

// Get single workout by ID
builder.queryField('workout', (t) =>
  t.prismaField({
    type: 'Workout',
    nullable: true,
    description: 'Get a single workout by ID',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.workout.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  })
);

// Get workout by slug
builder.queryField('workoutBySlug', (t) =>
  t.prismaField({
    type: 'Workout',
    nullable: true,
    description: 'Get a workout by slug',
    args: {
      slug: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.workout.findUnique({
        ...query,
        where: { slug: args.slug },
      });
    },
  })
);

