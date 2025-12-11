// lib/graphql/types/workout.ts
import { builder } from '../builder';

// Workout GraphQL Type
builder.prismaObject('Workout', {
  description: 'A complete workout (e.g., Sniper\'s Arm Day)',
  fields: (t) => ({
    id: t.exposeID('id'),
    slug: t.exposeString('slug'),
    name: t.exposeString('name'),
    goal: t.exposeString('goal', { nullable: true }),
    priorityRules: t.exposeString('priorityRules', { nullable: true }),
    
    // Relations
    primaryRegion: t.relation('primaryRegion', {
      nullable: true,
      description: 'Main anatomical region this workout targets',
    }),
    
    blocks: t.relation('blocks', {
      description: 'Training blocks in this workout',
    }),
  }),
});

// WorkoutBlock GraphQL Type
builder.prismaObject('WorkoutBlock', {
  description: 'A block within a workout (e.g., strength block, superset block)',
  fields: (t) => ({
    id: t.exposeID('id'),
    label: t.exposeString('label'),
    schemeStyle: t.exposeString('schemeStyle', { description: 'drop_set | straight_sets | superset, etc.' }),
    schemeDesc: t.exposeString('schemeDesc', { description: 'Detailed scheme description' }),
    notes: t.exposeString('notes', { nullable: true }),
    
    // Relations
    workout: t.relation('workout'),
    targets: t.relation('targets', {
      description: 'Anatomy nodes targeted by this block',
    }),
    exercises: t.relation('exercises', {
      description: 'Exercise options for this block',
    }),
  }),
});

// WorkoutBlockTarget join table type
builder.prismaObject('WorkoutBlockTarget', {
  fields: (t) => ({
    block: t.relation('block'),
    anatomy: t.relation('anatomy'),
  }),
});

// WorkoutBlockExercise join table type
builder.prismaObject('WorkoutBlockExercise', {
  fields: (t) => ({
    block: t.relation('block'),
    exercise: t.relation('exercise'),
    kind: t.exposeString('kind', { description: 'option | required' }),
  }),
});

