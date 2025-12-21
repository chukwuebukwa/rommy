// lib/graphql/queries/guides.ts
import { builder } from '../builder';
import { Prisma } from '@prisma/client';

// Get all guides
builder.queryField('guides', (t) =>
  t.prismaField({
    type: ['Guide'],
    description: 'Get all training guides',
    resolve: async (query, _root, _args, ctx) => {
      return ctx.prisma.guide.findMany({
        ...query,
        orderBy: { title: 'asc' },
      });
    },
  })
);

// Get single guide by ID
builder.queryField('guide', (t) =>
  t.prismaField({
    type: 'Guide',
    nullable: true,
    description: 'Get a single guide by ID (e.g., "arms", "back")',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.guide.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  })
);

// Get guide by slug
builder.queryField('guideBySlug', (t) =>
  t.prismaField({
    type: 'Guide',
    nullable: true,
    description: 'Get a guide by slug (e.g., "conceal-and-carry-pythons")',
    args: {
      slug: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.guide.findUnique({
        ...query,
        where: { slug: args.slug },
      });
    },
  })
);

// Get single section by ID
builder.queryField('section', (t) =>
  t.prismaField({
    type: 'Section',
    nullable: true,
    description: 'Get a single section by ID',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.section.findUnique({
        ...query,
        where: { id: args.id },
      });
    },
  })
);

// Get sections with images
builder.queryField('sectionsWithImages', (t) =>
  t.prismaField({
    type: ['Section'],
    description: 'Get all sections that have images',
    resolve: async (query, _root, _args, ctx) => {
      return ctx.prisma.section.findMany({
        ...query,
        where: {
          images: {
            not: Prisma.DbNull,
          },
        },
        orderBy: [
          { guideId: 'asc' },
          { order: 'asc' },
        ],
      });
    },
  })
);

