// prisma/migrations-data/fix-shoulders-guide.ts
// Run with: bun run prisma/migrations-data/fix-shoulders-guide.ts
//
// This script adds missing exercises and fixes the shoulder workout blocks
// WITHOUT touching the schema or resetting the database.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixShouldersGuide() {
  console.log('🔧 Fixing shoulders guide...');

  // 1. Add missing mobility exercises
  const missingExercises = [
    {
      id: 'pvc_pipe',
      name: 'PVC Pipe',
      type: 'mobility',
      movementPattern: 'sequence',
      equipment: ['pvc_pipe'],
      videoUrl: null,
      cueSummary:
        'PVC pipe pass-throughs and shoulder circles to open up overhead range and restore shoulder mobility.',
    },
    {
      id: 'wall_drags',
      name: 'Wall Drags',
      type: 'mobility',
      movementPattern: 'sequence',
      equipment: ['wall'],
      videoUrl: null,
      cueSummary:
        'Slide arms up and down against a wall to improve overhead mobility and scapular control.',
    },
    {
      id: 'full_body_mobility',
      name: 'Full Body Mobility',
      type: 'mobility',
      movementPattern: 'sequence',
      equipment: ['bodyweight'],
      videoUrl: null,
      cueSummary:
        'Full body mobility flow hitting shoulders, hips, and spine to restore movement quality.',
    },
    {
      id: 'overhead_barbell_press_holds',
      name: 'Overhead Barbell Press Holds',
      type: 'mobility',
      movementPattern: 'hold',
      equipment: ['barbell'],
      videoUrl: null,
      cueSummary:
        'Hold a barbell overhead in a locked position for time to build overhead stability and mobility.',
    },
    {
      id: 'overhead_squat_snatch_holds',
      name: 'Overhead Squat Snatch Holds',
      type: 'mobility',
      movementPattern: 'hold',
      equipment: ['barbell'],
      videoUrl: null,
      cueSummary:
        'Hold a barbell overhead while in a deep squat to build full-body stability and overhead mobility under load.',
    },
  ];

  for (const ex of missingExercises) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: {},
      create: {
        id: ex.id,
        name: ex.name,
        type: ex.type,
        movementPattern: ex.movementPattern,
        equipment: ex.equipment,
        videoUrl: ex.videoUrl,
        cueSummary: ex.cueSummary,
      },
    });
    console.log(`  ✓ Exercise: ${ex.name}`);

    // Link to rotator_cuff_group anatomy
    await prisma.exerciseAnatomy.upsert({
      where: {
        exerciseId_anatomyNodeId_role: {
          exerciseId: ex.id,
          anatomyNodeId: 'rotator_cuff_group',
          role: 'primary',
        },
      },
      update: {},
      create: {
        exerciseId: ex.id,
        anatomyNodeId: 'rotator_cuff_group',
        role: 'primary',
      },
    });
  }

  // 2. Fix Posterior Deltoid SuperSet - update setLabels
  const posteriorDeltSetA = [
    'high_elbow_cable_rows',
    'reverse_pec_dec_flyes',
    'behind_arse_cable_upright_rows',
    'behind_arse_upright_rows_bar',
  ];
  const posteriorDeltSetB = [
    'hip_huggers',
    'behind_ankle_barbell_raise',
    'face_pulls_back',
    'triple_rear_delt_delight',
  ];

  // Add missing exercises to block and set labels for SET A
  for (const exerciseId of posteriorDeltSetA) {
    try {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: 'shoulders-posterior-delt-superset-block',
            exerciseId,
          },
        },
        update: { setLabel: 'A' },
        create: {
          blockId: 'shoulders-posterior-delt-superset-block',
          exerciseId,
          kind: 'option',
          setLabel: 'A',
        },
      });
      console.log(`  ✓ Posterior Delt SET A: ${exerciseId}`);
    } catch (e) {
      console.log(`  ⚠ Skipped (exercise may not exist): ${exerciseId}`);
    }
  }

  // Set labels for SET B
  for (const exerciseId of posteriorDeltSetB) {
    try {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: 'shoulders-posterior-delt-superset-block',
            exerciseId,
          },
        },
        update: { setLabel: 'B' },
        create: {
          blockId: 'shoulders-posterior-delt-superset-block',
          exerciseId,
          kind: 'option',
          setLabel: 'B',
        },
      });
      console.log(`  ✓ Posterior Delt SET B: ${exerciseId}`);
    } catch (e) {
      console.log(`  ⚠ Skipped (exercise may not exist): ${exerciseId}`);
    }
  }

  // Remove exercises that shouldn't be in this block
  const toRemoveFromPosterior = ['behind_arse_bar_raise', 'powell_raises'];
  for (const exerciseId of toRemoveFromPosterior) {
    try {
      await prisma.workoutBlockExercise.deleteMany({
        where: {
          blockId: 'shoulders-posterior-delt-superset-block',
          exerciseId,
        },
      });
      console.log(`  ✓ Removed from Posterior Delt: ${exerciseId}`);
    } catch (e) {
      // Ignore if doesn't exist
    }
  }

  // 3. Fix Lateral Delt SuperSet - add lu_raises and set labels
  const lateralDeltSetA = [
    'modified_bradford_press',
    'seated_dumbbell_press',
    'behind_neck_press',
  ];
  const lateralDeltSetB = [
    'lateral_raises',
    'behind_ass_lateral_raises',
    'lu_raises',
    'single_arm_incline_lateral_raise',
    'chest_supported_lateral_raises',
  ];

  for (const exerciseId of lateralDeltSetA) {
    try {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: 'shoulders-lateral-delt-superset-block',
            exerciseId,
          },
        },
        update: { setLabel: 'A' },
        create: {
          blockId: 'shoulders-lateral-delt-superset-block',
          exerciseId,
          kind: 'option',
          setLabel: 'A',
        },
      });
      console.log(`  ✓ Lateral Delt SET A: ${exerciseId}`);
    } catch (e) {
      console.log(`  ⚠ Skipped (exercise may not exist): ${exerciseId}`);
    }
  }

  for (const exerciseId of lateralDeltSetB) {
    try {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: 'shoulders-lateral-delt-superset-block',
            exerciseId,
          },
        },
        update: { setLabel: 'B' },
        create: {
          blockId: 'shoulders-lateral-delt-superset-block',
          exerciseId,
          kind: 'option',
          setLabel: 'B',
        },
      });
      console.log(`  ✓ Lateral Delt SET B: ${exerciseId}`);
    } catch (e) {
      console.log(`  ⚠ Skipped (exercise may not exist): ${exerciseId}`);
    }
  }

  // 4. Add MOBILITY workout block
  await prisma.workoutBlock.upsert({
    where: { id: 'shoulders-mobility-block' },
    update: {},
    create: {
      id: 'shoulders-mobility-block',
      workoutId: 'snipers_shoulder_day',
      label: '6. Mobility',
      schemeStyle: 'circuit',
      schemeDesc:
        'Pick ANY OF THESE at random through the lift during your Rest Periods.',
      notes:
        'Use mobility work between sets to restore overhead range and keep shoulders moving like butter.',
    },
  });
  console.log('  ✓ Created MOBILITY workout block');

  // Add mobility exercises to the block
  const mobilityExercises = [
    'dead_hangs',
    'active_hangs',
    'pvc_pipe',
    'wall_drags',
    'full_body_mobility',
    'overhead_barbell_press_holds',
    'overhead_squat_snatch_holds',
  ];

  for (const exerciseId of mobilityExercises) {
    try {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: 'shoulders-mobility-block',
            exerciseId,
          },
        },
        update: {},
        create: {
          blockId: 'shoulders-mobility-block',
          exerciseId,
          kind: 'option',
        },
      });
      console.log(`  ✓ Added to MOBILITY block: ${exerciseId}`);
    } catch (e) {
      console.log(`  ⚠ Skipped (exercise may not exist): ${exerciseId}`);
    }
  }

  // Add anatomy target for mobility block
  await prisma.workoutBlockTarget.upsert({
    where: {
      blockId_anatomyNodeId: {
        blockId: 'shoulders-mobility-block',
        anatomyNodeId: 'rotator_cuff_group',
      },
    },
    update: {},
    create: {
      blockId: 'shoulders-mobility-block',
      anatomyNodeId: 'rotator_cuff_group',
    },
  });

  console.log('\n✅ Shoulders guide fixed successfully!');
}

fixShouldersGuide()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
