// prisma/export-db.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportDatabase() {
  console.log('🚀 Starting comprehensive database export...');
  console.log('📦 This includes all database models + configuration files\n');

  try {
    // Fetch all data from all models (in order of dependencies)
    console.log('📊 Fetching data from database...');
    
    const data = {
      // Core anatomy hierarchy
      anatomyNodes: await prisma.anatomyNode.findMany({
        orderBy: { id: 'asc' }
      }),
      
      // Guides & Sections
      guides: await prisma.guide.findMany({
        orderBy: { id: 'asc' }
      }),
      sections: await prisma.section.findMany({
        orderBy: [{ guideId: 'asc' }, { order: 'asc' }]
      }),
      sectionAnatomy: await prisma.sectionAnatomy.findMany(),
      sectionExercise: await prisma.sectionExercise.findMany(),
      
      // Exercises (includes videoUrl AND cdnVideoUrl)
      exercises: await prisma.exercise.findMany({
        orderBy: { id: 'asc' }
      }),
      exerciseAnatomy: await prisma.exerciseAnatomy.findMany(),
      
      // Formulas (supersets, etc.)
      formulas: await prisma.formula.findMany({
        orderBy: { id: 'asc' }
      }),
      formulaSteps: await prisma.formulaStep.findMany({
        orderBy: [{ formulaId: 'asc' }, { order: 'asc' }]
      }),
      formulaTargets: await prisma.formulaTarget.findMany(),
      
      // Workouts & Blocks
      workouts: await prisma.workout.findMany({
        orderBy: { id: 'asc' }
      }),
      workoutBlocks: await prisma.workoutBlock.findMany(),
      workoutBlockTargets: await prisma.workoutBlockTarget.findMany(),
      workoutBlockExercises: await prisma.workoutBlockExercise.findMany(),
    };

    // Load configuration files (not in database)
    console.log('📄 Loading configuration files...');
    const configFiles: Record<string, any> = {};
    
    const learnConfigPath = path.join(process.cwd(), 'lib', 'learn-page-config.json');
    if (fs.existsSync(learnConfigPath)) {
      configFiles.learnPageConfig = JSON.parse(fs.readFileSync(learnConfigPath, 'utf-8'));
      console.log('   ✓ learn-page-config.json');
    }

    // Verify new schema fields are present
    console.log('\n🔍 Verifying schema integrity...');
    const exercisesWithCdn = data.exercises.filter((e: any) => e.cdnVideoUrl).length;
    const exercisesWithVideo = data.exercises.filter((e: any) => e.videoUrl).length;
    console.log(`   ✓ Exercises with cdnVideoUrl: ${exercisesWithCdn}/${data.exercises.length}`);
    console.log(`   ✓ Exercises with videoUrl: ${exercisesWithVideo}/${data.exercises.length}`);

    // Add metadata
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '2.0',  // Bumped version to include config files
      schemaVersion: 'with_cdn_video_url',  // Track schema state
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
      configFiles,
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
    console.log('\n💾 Writing export file...');
    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2), 'utf-8');
    
    const fileSizeKB = (fs.statSync(filename).size / 1024).toFixed(2);

    console.log('\n✅ Export complete!');
    console.log(`📁 File: ${filename}`);
    console.log(`📦 Size: ${fileSizeKB} KB`);
    console.log(`📅 Date: ${exportData.exportDate}`);
    console.log(`🔖 Version: ${exportData.version} (${exportData.schemaVersion})`);
    console.log('\n📊 Database Records Exported:');
    Object.entries(exportData.counts).forEach(([key, count]) => {
      console.log(`   • ${key.padEnd(25)} ${count}`);
    });
    
    if (Object.keys(exportData.configFiles).length > 0) {
      console.log('\n📄 Configuration Files Included:');
      Object.keys(exportData.configFiles).forEach(key => {
        console.log(`   • ${key}`);
      });
    }

    console.log('\n💡 To import this backup, run:');
    console.log(`   bun run db:import`);
    console.log(`   bun run db:import ${filename}`);

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

