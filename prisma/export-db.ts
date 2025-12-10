// prisma/export-db.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportDatabase() {
  console.log('🚀 Starting database export...');

  try {
    // Fetch all data from all models
    const data = {
      anatomyNodes: await prisma.anatomyNode.findMany({
        orderBy: { id: 'asc' }
      }),
      guides: await prisma.guide.findMany({
        orderBy: { id: 'asc' }
      }),
      sections: await prisma.section.findMany({
        orderBy: [{ guideId: 'asc' }, { order: 'asc' }]
      }),
      sectionAnatomy: await prisma.sectionAnatomy.findMany(),
      sectionExercise: await prisma.sectionExercise.findMany(),
      exercises: await prisma.exercise.findMany({
        orderBy: { id: 'asc' }
      }),
      exerciseAnatomy: await prisma.exerciseAnatomy.findMany(),
      formulas: await prisma.formula.findMany({
        orderBy: { id: 'asc' }
      }),
      formulaSteps: await prisma.formulaStep.findMany({
        orderBy: [{ formulaId: 'asc' }, { order: 'asc' }]
      }),
      formulaTargets: await prisma.formulaTarget.findMany(),
      workouts: await prisma.workout.findMany({
        orderBy: { id: 'asc' }
      }),
      workoutBlocks: await prisma.workoutBlock.findMany(),
      workoutBlockTargets: await prisma.workoutBlockTarget.findMany(),
      workoutBlockExercises: await prisma.workoutBlockExercise.findMany(),
    };

    // Add metadata
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      counts: {
        anatomyNodes: data.anatomyNodes.length,
        guides: data.guides.length,
        sections: data.sections.length,
        sectionAnatomy: data.sectionAnatomy.length,
        sectionExercise: data.sectionExercise.length,
        exercises: data.exercises.length,
        exerciseAnatomy: data.exerciseAnatomy.length,
        formulas: data.formulas.length,
        formulaSteps: data.formulaSteps.length,
        formulaTargets: data.formulaTargets.length,
        workouts: data.workouts.length,
        workoutBlocks: data.workoutBlocks.length,
        workoutBlockTargets: data.workoutBlockTargets.length,
        workoutBlockExercises: data.workoutBlockExercises.length,
      },
      data,
    };

    // Create export directory if it doesn't exist
    const exportDir = path.join(process.cwd(), 'prisma', 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = path.join(exportDir, `db-export-${timestamp}.json`);

    // Write to file
    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2), 'utf-8');

    console.log('✅ Export complete!');
    console.log(`📁 Saved to: ${filename}`);
    console.log('\n📊 Export summary:');
    Object.entries(exportData.counts).forEach(([key, count]) => {
      console.log(`   ${key}: ${count}`);
    });

    return filename;
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  exportDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default exportDatabase;

