// lib/graphql/types/anatomy.ts
import { builder } from '../builder';

// AnatomyNode GraphQL Type
builder.prismaObject('AnatomyNode', {
  description: 'Anatomical node in the hierarchy (region, group, muscle, part)',
  fields: (t) => ({
    id: t.exposeID('id', { description: 'Unique identifier' }),
    kind: t.exposeString('kind', { description: 'Type: region | group | muscle | part' }),
    name: t.exposeString('name', { description: 'Display name' }),
    slug: t.exposeString('slug', { description: 'URL-friendly slug' }),
    description: t.exposeString('description', { nullable: true }),
    roleSummary: t.exposeString('roleSummary', { nullable: true }),
    
    // JSON fields - parse arrays
    primaryFunctions: t.field({
      type: ['String'],
      nullable: true,
      description: 'Array of primary functions',
      resolve: (node) => {
        if (!node.primaryFunctions) return null;
        try {
          return JSON.parse(node.primaryFunctions as string);
        } catch {
          return null;
        }
      },
    }),
    
    aestheticNotes: t.field({
      type: ['String'],
      nullable: true,
      description: 'Array of aesthetic notes',
      resolve: (node) => {
        if (!node.aestheticNotes) return null;
        try {
          return JSON.parse(node.aestheticNotes as string);
        } catch {
          return null;
        }
      },
    }),

    meta: t.field({
      type: 'JSON',
      nullable: true,
      description: 'Additional metadata (images, etc.)',
      resolve: (node) => node.meta,
    }),
    
    // Relations
    parent: t.relation('parent', {
      nullable: true,
      description: 'Parent node in hierarchy',
    }),
    
    children: t.relation('children', {
      description: 'Child nodes in hierarchy',
    }),
    
    primaryGuides: t.relation('primaryGuides', {
      description: 'Guides that focus on this anatomy',
    }),
    
    primaryWorkouts: t.relation('primaryWorkouts', {
      description: 'Workouts that focus on this anatomy',
    }),
    
    exerciseLinks: t.relation('exerciseLinks', {
      description: 'Exercises that target this anatomy part',
    }),
    
    sectionLinks: t.relation('sectionLinks', {
      description: 'Guide sections that reference this anatomy',
    }),
    
    formulaTargets: t.relation('formulaTargets', {
      description: 'Formulas that target this anatomy part',
    }),
    
    workoutTargets: t.relation('workoutTargets', {
      description: 'Workout blocks that target this anatomy part',
    }),
  }),
});

// SectionAnatomy join table type
builder.prismaObject('SectionAnatomy', {
  fields: (t) => ({
    section: t.relation('section'),
    anatomy: t.relation('anatomy'),
  }),
});

// ExerciseAnatomy join table type
builder.prismaObject('ExerciseAnatomy', {
  fields: (t) => ({
    exercise: t.relation('exercise'),
    anatomy: t.relation('anatomy'),
    role: t.exposeString('role', { description: 'primary | secondary' }),
  }),
});

