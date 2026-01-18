// prisma/migrations-data/fix-chest-guide.ts
// Run with: bun run prisma/migrations-data/fix-chest-guide.ts
//
// This script fixes the chest workout blocks setLabels
// WITHOUT touching the schema or resetting the database.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixChestGuide() {
  console.log('🔧 Fixing chest guide...');

  // 1. Add missing exercise: barbell_ezbar_pullovers
  await prisma.exercise.upsert({
    where: { id: 'barbell_ezbar_pullovers' },
    update: {},
    create: {
      id: 'barbell_ezbar_pullovers',
      name: 'Barbell/EZ Bar Pullovers',
      type: 'compound',
      movementPattern: 'pullover',
      equipment: ['barbell'],
      videoUrl: null,
      cueSummary:
        'Lie across bench, lower barbell/EZ bar behind head with slight elbow bend, pull back over chest.',
    },
  });
  console.log('  ✓ Added exercise: Barbell/EZ Bar Pullovers');

  // Link to anatomy
  await prisma.exerciseAnatomy.upsert({
    where: {
      exerciseId_anatomyNodeId_role: {
        exerciseId: 'barbell_ezbar_pullovers',
        anatomyNodeId: 'pectoralis_minor',
        role: 'primary',
      },
    },
    update: {},
    create: {
      exerciseId: 'barbell_ezbar_pullovers',
      anatomyNodeId: 'pectoralis_minor',
      role: 'primary',
    },
  });

  // 2. Fix Upper Chest SuperSet (Block 2)
  // SET A (5-9 reps, 1st movement): Incline presses
  const upperChestSetA = [
    'incline_barbell_press',
    'incline_dumbbell_press',
    'incline_press_hammer_strength',
    'reverse_grip_bench',
  ];
  // SET B (8-13 reps, 2nd movement): Push-ups, flyes, landmine
  const upperChestSetB = [
    'feet_elevated_push_ups',
    'feet_elevated_plate_push_ups',
    'cable_upper_chest_flyes',
    'landmine_chest_press',
  ];

  console.log('\n  Fixing Upper Chest SuperSet...');
  for (const exerciseId of upperChestSetA) {
    try {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: 'chest-upper-superset-block',
            exerciseId,
          },
        },
        update: { setLabel: 'A' },
        create: {
          blockId: 'chest-upper-superset-block',
          exerciseId,
          kind: 'option',
          setLabel: 'A',
        },
      });
      console.log(`    ✓ SET A: ${exerciseId}`);
    } catch (e) {
      console.log(`    ⚠ Skipped: ${exerciseId}`);
    }
  }

  for (const exerciseId of upperChestSetB) {
    try {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: 'chest-upper-superset-block',
            exerciseId,
          },
        },
        update: { setLabel: 'B' },
        create: {
          blockId: 'chest-upper-superset-block',
          exerciseId,
          kind: 'option',
          setLabel: 'B',
        },
      });
      console.log(`    ✓ SET B: ${exerciseId}`);
    } catch (e) {
      console.log(`    ⚠ Skipped: ${exerciseId}`);
    }
  }

  // 3. Fix Middle Chest SuperSet (Block 3)
  // SET A (5-9 reps, 1st movement): Flat presses
  const midChestSetA = [
    'flat_barbell_bench',
    'flat_dumbbell_press',
    'flat_press_hammer_strength',
    'reverse_grip_bench',
    'floor_press',
  ];
  // SET B (8-13 reps, 2nd movement): Push-ups, flyes, pullovers
  const midChestSetB = [
    'push_ups',
    'flat_cable_flyes',
    'pec_deck_flyes',
    'dumbbell_pullovers',
    'floor_flyes',
  ];

  console.log('\n  Fixing Middle Chest SuperSet...');
  for (const exerciseId of midChestSetA) {
    try {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: 'chest-mid-superset-block',
            exerciseId,
          },
        },
        update: { setLabel: 'A' },
        create: {
          blockId: 'chest-mid-superset-block',
          exerciseId,
          kind: 'option',
          setLabel: 'A',
        },
      });
      console.log(`    ✓ SET A: ${exerciseId}`);
    } catch (e) {
      console.log(`    ⚠ Skipped: ${exerciseId}`);
    }
  }

  for (const exerciseId of midChestSetB) {
    try {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: 'chest-mid-superset-block',
            exerciseId,
          },
        },
        update: { setLabel: 'B' },
        create: {
          blockId: 'chest-mid-superset-block',
          exerciseId,
          kind: 'option',
          setLabel: 'B',
        },
      });
      console.log(`    ✓ SET B: ${exerciseId}`);
    } catch (e) {
      console.log(`    ⚠ Skipped: ${exerciseId}`);
    }
  }

  // 4. Fix Lower Chest SuperSet (Block 4)
  // SET A (5-9 reps, 1st movement): Dips and decline presses
  const lowerChestSetA = [
    'chest_dips',
    'decline_dumbbell_press',
    'banded_decline_dumbbell_press',
    'the_double_dip',
  ];
  // SET B (8-13 reps, 2nd movement): Push-ups, crossovers, cables
  const lowerChestSetB = [
    'flat_plate_push_ups',
    'decline_cable_crossovers',
    'dog_pounds',
    'single_arm_decline_cable_press',
  ];

  console.log('\n  Fixing Lower Chest SuperSet...');
  for (const exerciseId of lowerChestSetA) {
    try {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: 'chest-lower-superset-block',
            exerciseId,
          },
        },
        update: { setLabel: 'A' },
        create: {
          blockId: 'chest-lower-superset-block',
          exerciseId,
          kind: 'option',
          setLabel: 'A',
        },
      });
      console.log(`    ✓ SET A: ${exerciseId}`);
    } catch (e) {
      console.log(`    ⚠ Skipped: ${exerciseId}`);
    }
  }

  for (const exerciseId of lowerChestSetB) {
    try {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: 'chest-lower-superset-block',
            exerciseId,
          },
        },
        update: { setLabel: 'B' },
        create: {
          blockId: 'chest-lower-superset-block',
          exerciseId,
          kind: 'option',
          setLabel: 'B',
        },
      });
      console.log(`    ✓ SET B: ${exerciseId}`);
    } catch (e) {
      console.log(`    ⚠ Skipped: ${exerciseId}`);
    }
  }

  // 5. Add pvc_pipe to Shoulder Mobility block (if it exists from shoulders fix)
  console.log('\n  Fixing Shoulder Mobility block...');
  try {
    await prisma.workoutBlockExercise.upsert({
      where: {
        blockId_exerciseId: {
          blockId: 'chest-shoulder-mobility-block',
          exerciseId: 'pvc_pipe',
        },
      },
      update: {},
      create: {
        blockId: 'chest-shoulder-mobility-block',
        exerciseId: 'pvc_pipe',
        kind: 'option',
      },
    });
    console.log('    ✓ Added pvc_pipe to Shoulder Mobility');
  } catch (e) {
    console.log('    ⚠ pvc_pipe not found - run fix-shoulders-guide.ts first');
  }

  // Make sure barbell_ezbar_pullovers is in the mobility block
  try {
    await prisma.workoutBlockExercise.upsert({
      where: {
        blockId_exerciseId: {
          blockId: 'chest-shoulder-mobility-block',
          exerciseId: 'barbell_ezbar_pullovers',
        },
      },
      update: {},
      create: {
        blockId: 'chest-shoulder-mobility-block',
        exerciseId: 'barbell_ezbar_pullovers',
        kind: 'option',
      },
    });
    console.log('    ✓ Added barbell_ezbar_pullovers to Shoulder Mobility');
  } catch (e) {
    console.log('    ⚠ Skipped barbell_ezbar_pullovers');
  }

  console.log('\n✅ Chest guide fixed successfully!');
}

fixChestGuide()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
