// lib/graphql/types/guide.ts
import { builder } from '../builder';

// Guide GraphQL Type
builder.prismaObject('Guide', {
  description: 'A complete training guide (arms, back, shoulders, etc.)',
  fields: (t) => ({
    id: t.exposeID('id'),
    slug: t.exposeString('slug', { description: 'URL-friendly slug' }),
    title: t.exposeString('title'),
    author: t.exposeString('author', { nullable: true }),
    
    // Relations
    primaryRegion: t.relation('primaryRegion', {
      nullable: true,
      description: 'Main anatomical region this guide focuses on',
    }),
    
    sections: t.relation('sections', {
      description: 'All sections in this guide',
    }),
  }),
});

// Section GraphQL Type
builder.prismaObject('Section', {
  description: 'A section within a guide',
  fields: (t) => ({
    id: t.exposeID('id'),
    kind: t.exposeString('kind', { description: 'intro | mindset | anatomy | strength | program' }),
    title: t.exposeString('title'),
    order: t.exposeInt('order', { description: 'Display order within the guide' }),
    content: t.exposeString('content', { description: 'Full text content' }),
    parentId: t.exposeString('parentId', { nullable: true, description: 'ID of parent section for hierarchical navigation' }),
    
    // ✨ Images field - parse JSON array to return string[]
    images: t.field({
      type: ['String'],
      nullable: true,
      description: 'Array of image paths like ["arms/page9_img1.jpeg"]',
      resolve: (section) => {
        if (!section.images) return null;
        // Handle both cases: Prisma may return parsed JSON (array) or raw string
        if (Array.isArray(section.images)) {
          return section.images as string[];
        }
        try {
          const parsed = JSON.parse(section.images as string);
          return Array.isArray(parsed) ? parsed : null;
        } catch {
          return null;
        }
      },
    }),
    
    // Computed field - count images
    imageCount: t.int({
      description: 'Number of images in this section',
      resolve: (section) => {
        if (!section.images) return 0;
        // Handle both cases: Prisma may return parsed JSON (array) or raw string
        if (Array.isArray(section.images)) {
          return section.images.length;
        }
        try {
          const images = JSON.parse(section.images as string);
          return Array.isArray(images) ? images.length : 0;
        } catch {
          return 0;
        }
      },
    }),
    
    // Relations
    guide: t.relation('guide', {
      description: 'The guide this section belongs to',
    }),
    
    focusAnatomyLinks: t.relation('focusAnatomyLinks', {
      description: 'Anatomy nodes focused on in this section',
    }),
    
    exerciseLinks: t.relation('exerciseLinks', {
      description: 'Exercises mentioned in this section',
    }),
    
    // Hierarchical structure for subpages
    parent: t.relation('parent', {
      nullable: true,
      description: 'Parent section (for subpages/subsections)',
    }),
    
    children: t.relation('children', {
      description: 'Child sections (subpages)',
    }),
  }),
});

// SectionExercise join table type
builder.prismaObject('SectionExercise', {
  fields: (t) => ({
    section: t.relation('section'),
    exercise: t.relation('exercise'),
  }),
});

