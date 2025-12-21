// lib/graphql/types/exercise.ts
import { builder } from '../builder';

// Exercise GraphQL Type
builder.prismaObject('Exercise', {
  description: 'A specific exercise (e.g., barbell curl, skull crushers)',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    type: t.exposeString('type', { description: 'compound | isolation' }),
    movementPattern: t.exposeString('movementPattern', { description: 'press | curl | extension | dip, etc.' }),
    videoUrl: t.exposeString('videoUrl', { nullable: true, description: 'YouTube shorts URL' }),
    cdnVideoUrl: t.exposeString('cdnVideoUrl', { nullable: true, description: 'CDN video URL (preferred over YouTube)' }),
    cueSummary: t.exposeString('cueSummary', { nullable: true, description: 'Exercise cues and tips' }),
    
    // Equipment - parse JSON array
    equipment: t.field({
      type: ['String'],
      nullable: true,
      description: 'Required equipment (e.g., barbell, bench, cables)',
      resolve: (exercise) => {
        if (!exercise.equipment) return null;
        try {
          return JSON.parse(exercise.equipment as string);
        } catch {
          return null;
        }
      },
    }),
    
    // Relations
    anatomyLinks: t.relation('anatomyLinks', {
      description: 'Muscles targeted by this exercise',
    }),
    
    mentionedIn: t.relation('mentionedIn', {
      description: 'Sections where this exercise is mentioned',
    }),
  }),
});

