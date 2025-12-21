// prisma/import-db.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importDatabase(filePath?: string) {
  console.log('🚀 Starting database import...');

  try {
    // Determine which file to import
    let importPath: string;
    
    if (filePath) {
      importPath = filePath;
    } else {
      // Find the most recent export file
      const exportDir = path.join(process.cwd(), 'prisma', 'exports');
      
      if (!fs.existsSync(exportDir)) {
        throw new Error('No exports directory found. Please run export first.');
      }
      
      const files = fs.readdirSync(exportDir)
        .filter(f => f.startsWith('db-export-') && f.endsWith('.json'))
        .sort()
        .reverse();
      
      if (files.length === 0) {
        throw new Error('No export files found in prisma/exports/');
      }
      
      importPath = path.join(exportDir, files[0]);
      console.log(`📂 Using most recent export: ${files[0]}`);
    }

    // Read the export file
    const fileContent = fs.readFileSync(importPath, 'utf-8');
    const exportData = JSON.parse(fileContent);

    console.log(`📅 Export date: ${exportData.exportDate}`);
    console.log(`🔖 Export version: ${exportData.version || '1.0'}`);
    if (exportData.schemaVersion) {
      console.log(`📋 Schema version: ${exportData.schemaVersion}`);
    }
    
    console.log('\n📊 Records to import:');
    Object.entries(exportData.counts).forEach(([key, count]) => {
      console.log(`   • ${key.padEnd(25)} ${count}`);
    });

    // Check for config files
    if (exportData.configFiles && Object.keys(exportData.configFiles).length > 0) {
      console.log('\n📄 Configuration files to restore:');
      Object.keys(exportData.configFiles).forEach(key => {
        console.log(`   • ${key}`);
      });
    }

    // Clear existing data (in reverse order of dependencies)
    console.log('\n🗑️  Clearing existing data...');
    await prisma.workoutBlockExercise.deleteMany();
    await prisma.workoutBlockTarget.deleteMany();
    await prisma.workoutBlock.deleteMany();
    await prisma.workout.deleteMany();
    
    await prisma.formulaTarget.deleteMany();
    await prisma.formulaStep.deleteMany();
    await prisma.formula.deleteMany();
    
    await prisma.exerciseAnatomy.deleteMany();
    await prisma.exercise.deleteMany();
    
    await prisma.sectionExercise.deleteMany();
    await prisma.sectionAnatomy.deleteMany();
    await prisma.section.deleteMany();
    await prisma.guide.deleteMany();
    
    await prisma.anatomyNode.deleteMany();

    // Import data (in order of dependencies)
    console.log('\n📥 Importing data...');
    const { data } = exportData;

    // 1. Anatomy nodes (base of hierarchy)
    console.log('   - Anatomy nodes...');
    for (const node of data.anatomyNodes) {
      await prisma.anatomyNode.create({ data: node });
    }

    // 2. Guides
    if (data.guides && data.guides.length > 0) {
      console.log('   - Guides...');
      for (const guide of data.guides) {
        await prisma.guide.create({ data: guide });
      }
    }

    // 3. Sections
    if (data.sections && data.sections.length > 0) {
      console.log('   - Sections...');
      for (const section of data.sections) {
        await prisma.section.create({ data: section });
      }
    }

    // 4. Section links
    if (data.sectionAnatomy && data.sectionAnatomy.length > 0) {
      console.log('   - Section anatomy links...');
      for (const link of data.sectionAnatomy) {
        await prisma.sectionAnatomy.create({ data: link });
      }
    }
    
    if (data.sectionExercise && data.sectionExercise.length > 0) {
      console.log('   - Section exercise links...');
      for (const link of data.sectionExercise) {
        await prisma.sectionExercise.create({ data: link });
      }
    }

    // 5. Exercises
    if (data.exercises && data.exercises.length > 0) {
      console.log('   - Exercises...');
      for (const exercise of data.exercises) {
        await prisma.exercise.create({ data: exercise });
      }
    }

    // 6. Exercise anatomy links
    if (data.exerciseAnatomy && data.exerciseAnatomy.length > 0) {
      console.log('   - Exercise anatomy links...');
      for (const link of data.exerciseAnatomy) {
        await prisma.exerciseAnatomy.create({ data: link });
      }
    }

    // 7. Formulas
    if (data.formulas && data.formulas.length > 0) {
      console.log('   - Formulas...');
      for (const formula of data.formulas) {
        await prisma.formula.create({ data: formula });
      }
    }

    // 8. Formula steps and targets
    if (data.formulaSteps && data.formulaSteps.length > 0) {
      console.log('   - Formula steps...');
      for (const step of data.formulaSteps) {
        await prisma.formulaStep.create({ data: step });
      }
    }
    
    if (data.formulaTargets && data.formulaTargets.length > 0) {
      console.log('   - Formula targets...');
      for (const target of data.formulaTargets) {
        await prisma.formulaTarget.create({ data: target });
      }
    }

    // 9. Workouts
    if (data.workouts && data.workouts.length > 0) {
      console.log('   - Workouts...');
      for (const workout of data.workouts) {
        await prisma.workout.create({ data: workout });
      }
    }

    // 10. Workout blocks
    if (data.workoutBlocks && data.workoutBlocks.length > 0) {
      console.log('   - Workout blocks...');
      for (const block of data.workoutBlocks) {
        await prisma.workoutBlock.create({ data: block });
      }
    }

    // 11. Workout block links
    if (data.workoutBlockTargets && data.workoutBlockTargets.length > 0) {
      console.log('   - Workout block targets...');
      for (const target of data.workoutBlockTargets) {
        await prisma.workoutBlockTarget.create({ data: target });
      }
    }
    
    if (data.workoutBlockExercises && data.workoutBlockExercises.length > 0) {
      console.log('   - Workout block exercises...');
      for (const exercise of data.workoutBlockExercises) {
        await prisma.workoutBlockExercise.create({ data: exercise });
      }
    }

    // Restore configuration files
    if (exportData.configFiles && Object.keys(exportData.configFiles).length > 0) {
      console.log('\n📄 Restoring configuration files...');
      
      if (exportData.configFiles.learnPageConfig) {
        const configPath = path.join(process.cwd(), 'lib', 'learn-page-config.json');
        fs.writeFileSync(configPath, JSON.stringify(exportData.configFiles.learnPageConfig, null, 2), 'utf-8');
        console.log('   ✓ learn-page-config.json restored');
      }
    }

    console.log('\n✅ Import complete! Database and configuration files restored.');
    console.log('💡 Run the dev server to verify: bun run dev');
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  const filePath = process.argv[2]; // Optional: pass file path as argument
  
  importDatabase(filePath)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default importDatabase;

