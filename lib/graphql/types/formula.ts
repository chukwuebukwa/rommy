// lib/graphql/types/formula.ts
import { builder } from '../builder';

// Formula GraphQL Type
builder.prismaObject('Formula', {
  description: 'A training formula (e.g., supersets for specific muscle heads)',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    pattern: t.exposeString('pattern', { description: 'superset | straight_sets | drop_set, etc.' }),
    
    // Relations
    steps: t.relation('steps', {
      description: 'Ordered steps in this formula',
    }),
    
    targets: t.relation('targets', {
      description: 'Anatomy nodes this formula targets',
    }),
  }),
});

// FormulaStep GraphQL Type
builder.prismaObject('FormulaStep', {
  description: 'A single step in a formula',
  fields: (t) => ({
    id: t.exposeID('id'),
    order: t.exposeInt('order'),
    role: t.exposeString('role', { description: 'compound | isolation' }),
    notes: t.exposeString('notes', { nullable: true }),
    
    // Relations
    formula: t.relation('formula'),
    exercise: t.relation('exercise'),
  }),
});

// FormulaTarget join table type
builder.prismaObject('FormulaTarget', {
  fields: (t) => ({
    formula: t.relation('formula'),
    anatomy: t.relation('anatomy'),
  }),
});

