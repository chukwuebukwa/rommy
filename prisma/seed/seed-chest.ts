// prisma/seed-chest.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedChest() {
  // -----------------------------
  // 1) ANATOMY GRAPH – CHEST
  // -----------------------------

  const anatomyNodes = [
    // Pectoralis Minor (the foundation muscle)
    {
      id: 'pectoralis_minor',
      kind: 'muscle',
      name: 'Pectoralis Minor',
      slug: 'pectoralis-minor',
      description:
        'Smaller, yet crucial muscle located underneath the pectoralis major. Supports shoulder mobility and stability by drawing shoulder blades down and forward.',
      roleSummary:
        'The foundation of chest that allows SUPERIOR results. If your Pec Minor is weak, your posture will be poor, shoulder pain will flare up, and movement will be restricted.',
      primaryFunctions: JSON.stringify([
        'shoulder blade depression',
        'shoulder blade protraction',
        'assists in forced inspiration',
        'supports shoulder stability',
      ]),
      aestheticNotes: JSON.stringify([
        'Does NOT contribute to much size or shape of your chest.',
        'When STRONG, your chest looks broader and shoulders sit back and down.',
        'Reduces risk of shoulder injury in pressing movements SIGNIFICANTLY.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['dumbbell_pullovers', 'barbell_ezbar_pullovers'],
        secondaryExerciseIds: [],
        formulaIds: [],
      }),
      parentId: 'chest',
    },

    // Pectoralis Major (the main chest muscle)
    {
      id: 'pectoralis_major',
      kind: 'muscle',
      name: 'Pectoralis Major',
      slug: 'pectoralis-major',
      description:
        'Large, fan-shaped muscle covering the upper front of the chest. Made up of three separate heads: Clavicular (Upper), Sternocostal (Mid), and Abdominal (Lower).',
      roleSummary:
        'When it comes to SUPERIOR Chest Growth, the pectoralis major takes center stage. The main driver of pressing strength and chest size.',
      primaryFunctions: JSON.stringify([
        'shoulder adduction',
        'shoulder flexion',
        'shoulder internal rotation',
        'horizontal adduction',
      ]),
      aestheticNotes: JSON.stringify([
        'Creates the thick, armor-plated chest look.',
        'Complete development of all 3 heads gives a full, squared, 3D pec appearance.',
      ]),
      meta: JSON.stringify({
        guideIds: ['chest'],
      }),
      parentId: 'chest',
    },

    // Update existing Clavicular Head with richer data
    {
      id: 'upper_chest_clavicular',
      kind: 'part',
      name: 'Upper Chest (Clavicular Head)',
      slug: 'upper-chest-clavicular',
      description:
        'Upper pec fibers attaching near the clavicle. The foundation of UPPER CHEST SUPREMACIST training. If you get the Upper Chest DIALED IN, EVERYTHING falls into place with EASE.',
      roleSummary:
        'Building the clavicular head gives your chest a fuller appearance, wider appearance, and adds proper strength. The upper chest popping through the shirt.',
      primaryFunctions: JSON.stringify([
        'shoulder flexion',
        'diagonal/incline pressing',
        'assists horizontal adduction',
      ]),
      aestheticNotes: JSON.stringify([
        'Creates the armor-plated upper chest shelf.',
        'Filling out the area near your collarbone.',
        'If you stop disrespecting this portion... ALL your pressing numbers will increase.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'incline_dumbbell_press',
          'incline_barbell_press',
          'incline_press_hammer_strength',
          'cable_upper_chest_flyes',
        ],
        secondaryExerciseIds: [
          'feet_elevated_push_ups',
          'feet_elevated_plate_push_ups',
          'landmine_chest_press',
          'banded_incline_dumbbell_press',
        ],
        formulaIds: ['chest_upper_superset'],
      }),
      parentId: 'pectoralis_major',
    },

    // Sternocostal Head (Mid Chest) - update existing with richer data
    {
      id: 'chest_sternocostal_head',
      kind: 'part',
      name: 'Mid Chest (Sternocostal Head)',
      slug: 'chest-sternocostal-head',
      description:
        'The largest section of the Pecs. Sternal/mid fibers that handle most of the pushing power when executing flat pressing movements. Main driver of overall size of the chest.',
      roleSummary:
        'Because it is the largest head on the pecs, it is the main driver of overall size. Build this head CORRECT and you will have more chest mass and strength for your big lifts.',
      primaryFunctions: JSON.stringify([
        'horizontal adduction',
        'assists shoulder flexion',
        'primary flat pressing power',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds fullness to the center of the chest.',
        'Main contributor to overall chest thickness.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'flat_dumbbell_press',
          'flat_barbell_bench',
          'flat_press_hammer_strength',
        ],
        secondaryExerciseIds: [
          'flat_cable_flyes',
          'pec_deck_flyes',
          'push_ups',
          'dumbbell_pullovers',
        ],
        formulaIds: ['chest_mid_superset'],
      }),
      parentId: 'pectoralis_major',
    },

    // Abdominal Head (Lower Chest) - NEW
    {
      id: 'chest_abdominal_head',
      kind: 'part',
      name: 'Lower Chest (Abdominal Head)',
      slug: 'chest-abdominal-head',
      description:
        'The abdominal head portion of the chest allows you to bring your arms down and inward. This is where people struggle - where it looks blobby and flabby.',
      roleSummary:
        'By training the abdominal head you will have a COMPLETE look in your chest development. Provides the FULL, Squared chest aesthetic with that cool scoop.',
      primaryFunctions: JSON.stringify([
        'shoulder extension',
        'shoulder adduction (arms down and inward)',
        'stabilizing chest during heavy movements',
      ]),
      aestheticNotes: JSON.stringify([
        'Creates the full, squared chest aesthetic.',
        'Lower chest tightens with that cool scoop.',
        'Cherry on top - stabilizes chest during heavy movements.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'chest_dips',
          'decline_dumbbell_press',
          'weighted_dips',
        ],
        secondaryExerciseIds: [
          'decline_cable_crossovers',
          'dog_pounds',
          'single_arm_decline_cable_press',
          'the_double_dip',
        ],
        formulaIds: ['chest_lower_superset'],
      }),
      parentId: 'pectoralis_major',
    },
  ];

  for (const node of anatomyNodes) {
    await prisma.anatomyNode.upsert({
      where: { slug: node.slug },
      update: node,
      create: node,
    });
  }

  // -----------------------------
  // 2) GUIDE: CHEST
  // -----------------------------

  await prisma.guide.upsert({
    where: { id: 'chest' },
    update: {
      title: 'CHEST - The Chesticles Guide',
      author: 'Uncle Rommy',
      primaryRegionId: 'chest',
    },
    create: {
      id: 'chest',
      slug: 'chest-plate-armored',
      title: 'CHEST - The Chesticles Guide',
      author: 'Uncle Rommy',
      primaryRegionId: 'chest',
    },
  });

  const sections = [
    {
      id: 'chest-intro',
      guideId: 'chest',
      kind: 'intro',
      title: 'NO WORDS LEFT UNSAID...THIS WILL BE THE ONLY GUIDE YOU EVER NEED ON THE CHEST!',
      order: 1,
      content: `Now before we get into the ACTION PACKED INFORMATION. You are probably here because you have a:
1. Small Chest
2. Weak Chest

Could suffer from one... Could suffer from both...
Either way NO BUENO and we do not accept status-quo results.

Because in this guide...we will fix both regardless.

This is for you IF you CAN'T grow your chest despite:
- Being able to bench high numbers
- Ridiculously high volume training
- Low volume and high intensity training
- Working out for years with little to no results to show for it
- Having "Bad" Chest Genetics

THIS AREA OF THE BODY IS WHAT SEPARATES THE BOYS FROM THE MEN. THE GUILTY PLEASURE & OUR FIRST LOVE. THIS IS THE TWIST IN THE PUNCH TO YOUR PHYSIQUE STAND OUT.`,
    },
    {
      id: 'chest-mindset',
      guideId: 'chest',
      kind: 'mindset',
      title: 'The Undeniable Standard: Becoming a Natural Crusader',
      order: 2,
      content: `"Undeniable" is the standard: unshakable, unforgettable presence.

RULES OF THE NATURAL CRUSADERS:
1. Lead with Heart, Die on Your Sword
2. Empty the Energy Clip Every Day
3. Never Go to Bed Hungry
4. Make Every Decision from Strength
5. Food is Fuel, Not Entertainment
6. Burn the Past
7. No Counting, Just Consuming
8. Master Desire (Dangle the Donut)
9. Walk Into the Storm
10. Ignore Your Own Hype
11. Live By Your Standard
12. Reject All Shortcuts
13. Wear Your Scars Proudly
14. Face Fear as a Challenge

This path isn't for the faint of heart... it's for the man who knows that true power comes from within, who's ready to claim his place in the world.`,
    },
    {
      id: 'chest-anatomy-overview',
      guideId: 'chest',
      kind: 'anatomy',
      title: 'Anatomy – Understanding the Chest',
      order: 3,
      content: `In order for us to build the CHEST correctly... we must have an understanding of the anatomy.

Unlike your current or former professors, I am only going to give you information that helps better facilitate you LOOKING STACKED.

Once you understand the anatomy of the chest it's going to be 100x easier to deliver targeted stress to your pecs that will both sculpt & build your chest after all this time.

ON THE OTHER SIDE OF THIS "BORING" INFORMATION IS EVERYTHING YOU'VE WANTED THE ANSWERS TO...

The Chest is made up of two parts:
- Pectoralis Minor
- Pectoralis Major

KEY CONCEPT: If we really want to hit your chest like a SNIPER, you've got to follow the fibers. It's all about getting your body to move the way the muscle is built to work. When you follow the fibers, every rep becomes MULTIPLES Times more effective, locking into the contraction and maximizing the load on your chest.

This is PRECISION training... no wasted effort, we don't miss our target.`,
    },
    {
      id: 'chest-anatomy-pec-minor',
      guideId: 'chest',
      kind: 'anatomy',
      title: 'Pec Minor – The Foundation',
      order: 4,
      content: `PEC MINOR

The pectoralis minor is a smaller, yet crucial muscle located underneath the pectoralis major.

It's crucial because it SUPPORTS shoulder mobility & stability by drawing our shoulder blades down & forward.

However the Pec Minor does NOT contribute to much size or shape of your chest.

But this is the BIGGEST issue I see among gym participaters... the focus is all about the "Show Muscles".

If your Pec Minor is lagging... you will hurt yourself. It is a ticking time bomb.

If your pec minor is weak... your posture will likely be poor, shoulder pain will flare up, and your movement will be restricted with your bench.

If your Pec Minor is STRONG... it'll only help to keep your shoulder aligned and posture in check.

And when that happens... your chest looks broader & shoulders sit back and down.

The Pec Minor is the foundation of chest that allows us to get SUPERIOR results.

EXERCISE EXAMPLE FOR THE PECTORALIS MINOR:
- Dumbbell Pullovers`,
    },
    {
      id: 'chest-anatomy-pec-major',
      guideId: 'chest',
      kind: 'anatomy',
      title: 'Pec Major – The 3 Heads',
      order: 5,
      content: `PECTORALIS MAJOR

When it comes to SUPERIOR Chest Growth... the pectoralis major takes center stage.

Together all 3 of these heads make up the Pectoralis Major. What most people don't know is that the pectoralis major has 3 separate heads:
- Clavicular Head (Upper Chest)
- Sternal Head (Middle Chest)
- Abdominal Head (Lower Chest)

1. CLAVICULAR HEAD (Upper Chest)
We start this show off with the clavicular head because we are UPPER CHEST SUPREMACIST.
This is the foundation of my chest training.
If you get the Upper Chest DIALED IN, EVERYTHING falls into place with EASE.
Building the clavicular head will give your chest a fuller appearance, wider appearance, & adds proper strength.

2. STERNOCOSTAL HEAD (Mid Chest)
This is the largest section of the Pecs.
The sternocostal head handles most of the pushing power when executing flat pressing movements.
Because it is the largest head... it is the main driver of overall size of the chest.

3. ABDOMINAL HEAD (Lower Chest)
The abdominal head portion of the chest is what people struggle with - where it looks blobby & flabby.
By training the abdominal head you will have a COMPLETE look in your chest development.
It'll provide you the FULL, Squared chest aesthetic.`,
    },
    {
      id: 'chest-biomechanics',
      guideId: 'chest',
      kind: 'anatomy',
      title: 'Biomechanics – Every Movement is PURELY ROTATION!',
      order: 6,
      content: `Second, and MOST IMPORTANT... every movement you are executing is PURELY ROTATION!

When you truly get a solid grasp on this basic lesson you will be able to execute each lift with pristine form leading to incredible muscle growth, strength gains, and avoiding injuries.

With every lift there are two parts and both are equally as important as the other:

1. The eccentric/lengthening/negative portion of a rep (The Stretch)
   On this portion of the Press your muscles are externally rotating (External Rotation).

2. The concentric/shortening/positive portion of a rep (The Contraction)
   During the process of getting the bench up your muscles are internally rotating (Internal Rotation).

This is why people have issues with their rotator cuff - they are so focused on the internal rotation portion of the rep and barely focus on the other half.

Improved range of motion through external rotation is so damn important but we don't need to do boring ass exercises.

A lot of rotator cuff issues are simply solved from doing extra focused work on the upper back, rhomboids, and mid-lower trap work.

WORKAROUND: If you have rotator cuff pain when you press, replace Regular Grip Flat Press with Reverse Grip Bench Press. Your shoulders rotate EXTERNALLY, taking stress off the joint.`,
    },
    {
      id: 'chest-injury-resilience',
      guideId: 'chest',
      kind: 'anatomy',
      title: 'Building Injury Resilience – Traps, Rhomboids & Rear Delts',
      order: 7,
      content: `If you want injury resilient shoulders for your pressing, you need to focus on these "weird" muscles:

RHOMBOIDS:
Deep upper-back muscles that retract and stabilize the shoulder blades. Keeps your shoulders aligned and fights slouching/nerd neck.
Exercise Examples: Turtle Raises, Seated Cable Rows, Face Pulls, Chest Supported Rows

REAR DELTS:
Most prioritize the front and side head of the shoulder but not many understand how important the posterior head is. You think it's an "afterthought"... Mistake.
If you did your rear delt work properly, your bench, shoulder press, and back lifts would BLOW TF UP.
Exercise Examples: Triple Rear Delt Delight, Reverse Pec Dec Flyes

MIDDLE TRAPS:
This area of the muscle sits just below the upper trapezius. Responsible for helping you pull your shoulders back.
Exercise Examples: Reverse Incline Flyes

LOWER TRAPS:
The biggest of them all. Responsible for pulling the shoulder blades down and back to help sink them as you raise your arm overhead.
Exercise Examples: Face Pulls, Y Raises, Superman's

They can be done on your back or shoulder days (or both). You can throw these before your chest day if you feel discomfort pressing.`,
    },
    {
      id: 'chest-shoulder-rehab',
      guideId: 'chest',
      kind: 'program',
      title: 'BONUS: Shoulder Rehab Sequence',
      order: 8,
      content: `SHOULDER REHAB SEQUENCE

THIS WAS THE EXACT SEQUENCE I used to heal my shoulder in 4 days from thinking I tore it.

This is simply about getting you in the habit of doing these randomly on Shoulder Days - External Rotation and Internal Rotations for shoulder health:

- Dead Hangs: 2-3 sets as long as possible
- Shoulder Elixir Potion: 2 sets (HEAVY FOCUS ON RANGE OF MOTION)
- Face Pulls (Back): 2 sets (HEAVY FOCUS ON RANGE OF MOTION)
- Cable Handle External Rotation: 2 sets (HEAVY FOCUS ON RANGE OF MOTION)
- Cable Handle Internal Rotation: 2 sets (HEAVY FOCUS ON RANGE OF MOTION)

ADVANCED MOBILITY WORK:
- Dead Hangs
- Active Hangs
- PVC Pipe Wall Drags
- Full Body Mobility Movement
- Overhead Barbell Press Holds
- Overhead Squat Snatch Holds`,
    },
    {
      id: 'chest-snipers-chest-day',
      guideId: 'chest',
      kind: 'program',
      title: 'THE SNIPER\'S CHEST DAY (The Chest Day Formula)',
      order: 9,
      content: `Now all this information is for you to ABUSE and get the results you've been craving your entire life.

Information is great... but information without execution is purely mental gymnastics and does absolutely nothing for you.

THE CHEST DAY FORMULA:

1. STRENGTH: Pick 1
   - Incline Dumbbell Press
   - Incline Barbell Press
   - Weighted Dips
   Set 1: 3-4 Rep Max
   Set 2: Drop 20% & Set REP PR
   Set 3: Drop another 20% & Set REP PR

2. UPPER CHEST SUPERSET: 2-3 Sets
   1st Chest Movement (Fail between 5-9 Reps): Incline Barbell Bench, Incline Dumbbell Bench, Incline Press Hammer Strength, or Reverse Grip Bench
   2nd Chest Movement (Fail between 8-13 Reps): Feet Elevated Plate Push-Ups, Feet Elevated Push-Ups, Cable Upper Chest Flyes, or Landmine Chest Press

3. MIDDLE CHEST SUPERSET: 2-3 Sets
   1st Chest Movement (Fail between 5-9 Reps): Flat Barbell Bench, Flat Dumbbell Bench, Flat Press Hammer Strength (or Reverse Grip/Floor Press if rotator cuff pain)
   2nd Chest Movement (Fail between 8-13 Reps): Push-Ups, Flat Cable Flyes, Pec Dec Flyes, Dumbbell Pullovers (or Floor Flyes if rotator cuff pain)

4. LOWER CHEST SUPERSET: 2-3 Sets
   1st Chest Movement (Fail between 5-9 Reps): Chest Dips, Decline Dumbbell Bench, Banded Decline Dumbbell Presses, The Double Dip
   2nd Chest Movement (Fail between 8-13 Reps): Flat Plate Push-Ups, Decline Cable Crossovers, Dog Pounds, Single Arm Decline Cable Presses

5. SHOULDER MOBILITY: 2-3 Sets (Pick 1)
   - PVC Pipe (in between Sets)
   - Dumbbell Pullovers (Fail between 8-13 Reps)
   - Barbell/EZ Bar Pullovers (Fail between 8-13 Reps)`,
    },
    {
      id: 'chest-exercise-library',
      guideId: 'chest',
      kind: 'program',
      title: 'BONUS: Chest Exercise Library',
      order: 10,
      content: `Because you trusted Rommy in a world full of fake naturals, you get a full clickable library.

PRESSING EXERCISES:
- Floor Flyes
- Feet Elevated Push Ups
- Feet Elevated Plate Push Ups
- Flat Plate Push Ups
- Flat Push Ups
- Barbell/EZ Bar Pullovers
- Floor Press
- Landmine Chest Press
- Reverse Grip Bench
- Single Arm Decline Cable Presses
- Chest Dips
- The Double Dip
- Incline Dumbbell Press
- Incline Barbell Press
- Flat Press Hammer Strength
- Flat Dumbbell Press
- Decline Dumbbell Press
- Incline Press Hammer Strength

FLYES & ISOLATION:
- Decline Cables Crossovers
- Dog Pounds
- Cable Upper Chest Flyes
- Pec Deck Flyes
- DB Pullovers
- Flat Cable Flyes
- Push Up Circuit

BANDED VARIATIONS:
- Banded INCLINE Dumbbell Presses
- Banded FLAT Dumbbell Presses
- Banded DECLINE Dumbbell Presses

SHOULDER REHAB WORK:
- Dead Hangs
- Shoulder Elixir Potion
- Face Pulls (Back)
- Cable Handle External Rotation
- Cable Handle Internal Rotation
- Handstand Holds
- Powell Raises
- Dumbbell Shoulder External Rotations
- Active Hangs
- Full Body Mobility Movement
- PVC Pipe`,
    },
  ];

  for (const s of sections) {
    await prisma.section.upsert({
      where: { id: s.id },
      update: {},
      create: s,
    });
  }

  // Section → Anatomy links
  const sectionAnatomyLinks = [
    // intro
    { sectionId: 'chest-intro', anatomyNodeId: 'chest' },
    { sectionId: 'chest-intro', anatomyNodeId: 'pectoralis_major' },

    // anatomy overview
    { sectionId: 'chest-anatomy-overview', anatomyNodeId: 'chest' },
    { sectionId: 'chest-anatomy-overview', anatomyNodeId: 'pectoralis_minor' },
    { sectionId: 'chest-anatomy-overview', anatomyNodeId: 'pectoralis_major' },

    // pec minor
    { sectionId: 'chest-anatomy-pec-minor', anatomyNodeId: 'pectoralis_minor' },

    // pec major heads
    { sectionId: 'chest-anatomy-pec-major', anatomyNodeId: 'pectoralis_major' },
    { sectionId: 'chest-anatomy-pec-major', anatomyNodeId: 'upper_chest_clavicular' },
    { sectionId: 'chest-anatomy-pec-major', anatomyNodeId: 'chest_sternocostal_head' },
    { sectionId: 'chest-anatomy-pec-major', anatomyNodeId: 'chest_abdominal_head' },

    // biomechanics
    { sectionId: 'chest-biomechanics', anatomyNodeId: 'pectoralis_major' },
    { sectionId: 'chest-biomechanics', anatomyNodeId: 'rotator_cuff_group' },

    // injury resilience
    { sectionId: 'chest-injury-resilience', anatomyNodeId: 'rhomboids' },
    { sectionId: 'chest-injury-resilience', anatomyNodeId: 'rear_delts' },
    { sectionId: 'chest-injury-resilience', anatomyNodeId: 'middle_traps' },
    { sectionId: 'chest-injury-resilience', anatomyNodeId: 'lower_traps' },

    // sniper's chest day
    { sectionId: 'chest-snipers-chest-day', anatomyNodeId: 'pectoralis_major' },
    { sectionId: 'chest-snipers-chest-day', anatomyNodeId: 'upper_chest_clavicular' },
    { sectionId: 'chest-snipers-chest-day', anatomyNodeId: 'chest_sternocostal_head' },
    { sectionId: 'chest-snipers-chest-day', anatomyNodeId: 'chest_abdominal_head' },

    // exercise library
    { sectionId: 'chest-exercise-library', anatomyNodeId: 'pectoralis_major' },
    { sectionId: 'chest-exercise-library', anatomyNodeId: 'pectoralis_minor' },
    { sectionId: 'chest-exercise-library', anatomyNodeId: 'upper_chest_clavicular' },
    { sectionId: 'chest-exercise-library', anatomyNodeId: 'chest_sternocostal_head' },
    { sectionId: 'chest-exercise-library', anatomyNodeId: 'chest_abdominal_head' },
  ];

  for (const link of sectionAnatomyLinks) {
    await prisma.sectionAnatomy.upsert({
      where: {
        sectionId_anatomyNodeId: {
          sectionId: link.sectionId,
          anatomyNodeId: link.anatomyNodeId,
        },
      },
      update: {},
      create: link,
    });
  }

  // -----------------------------
  // 3) EXERCISES
  // -----------------------------

  const exercises = [
    // === UPPER CHEST (Clavicular Head) ===
    {
      id: 'incline_dumbbell_press',
      name: 'Incline Dumbbell Press',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['upper_chest_clavicular'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/DlsOPvM7Q_4?feature=share',
      cueSummary:
        'Set bench to 30-45 degrees, press up following the muscle fibers of the upper chest.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'incline_barbell_press',
      name: 'Incline Barbell Press',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['upper_chest_clavicular'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/d0Q2ghuoHkg?feature=share',
      cueSummary:
        'Incline bench at 30-45 degrees, lower to upper chest, press following fiber direction.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'incline_press_hammer_strength',
      name: 'Incline Press Hammer Strength',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['machine'],
      primaryMuscles: ['upper_chest_clavicular'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/NInV2N5h8I4?feature=share',
      cueSummary:
        'Machine incline press, focus on squeezing upper chest at the top.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'cable_upper_chest_flyes',
      name: 'Cable Upper Chest Flyes',
      type: 'isolation',
      movementPattern: 'fly',
      equipment: ['cable'],
      primaryMuscles: ['upper_chest_clavicular'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/Kioq8pm52xI?feature=share',
      cueSummary:
        'Set cables low, fly upward to target upper chest fibers.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'feet_elevated_push_ups',
      name: 'Feet Elevated Push-Ups',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['bodyweight'],
      primaryMuscles: ['upper_chest_clavicular'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/HDGOD--peyA?si=-np0s9oeWSTCU9E5',
      cueSummary:
        'Elevate feet on bench or box, perform push-ups to emphasize upper chest.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'feet_elevated_plate_push_ups',
      name: 'Feet Elevated Plate Push-Ups',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['bodyweight', 'plate'],
      primaryMuscles: ['upper_chest_clavicular'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/6bZF6GuUdQo?si=wZosC2OYcvHDDrMG',
      cueSummary:
        'Feet elevated with hands on weight plates for extra ROM and upper chest emphasis.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'landmine_chest_press',
      name: 'Landmine Chest Press',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['barbell', 'landmine'],
      primaryMuscles: ['upper_chest_clavicular'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/_tVGQnZjcAY?si=984ftJaRRNg1tvnH',
      cueSummary:
        'Press the landmine attachment upward and inward for upper chest activation.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'banded_incline_dumbbell_press',
      name: 'Banded INCLINE Dumbbell Presses',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['dumbbell', 'bench', 'resistance_band'],
      primaryMuscles: ['upper_chest_clavicular'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/N_dsJ1fFLW4?si=fRA-MTB2_8JhsZl_',
      cueSummary:
        'Incline dumbbell press with band resistance for increased tension at lockout.',
      mentionedInSections: ['chest-exercise-library'],
    },

    // === MID CHEST (Sternocostal Head) ===
    {
      id: 'flat_dumbbell_press',
      name: 'Flat Dumbbell Press',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['chest_sternocostal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/HnaRTqq5CXQ?feature=share',
      cueSummary:
        'Flat bench, press dumbbells up and slightly inward following mid chest fibers.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library', 'chest-anatomy-pec-major'],
    },
    {
      id: 'flat_barbell_bench',
      name: 'Flat Barbell Bench',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['chest_sternocostal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: null,
      cueSummary:
        'Classic flat bench press, lower to mid-chest and press up.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'flat_press_hammer_strength',
      name: 'Flat Press Hammer Strength',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['machine'],
      primaryMuscles: ['chest_sternocostal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/TJQHhpqk59w?feature=share',
      cueSummary:
        'Hammer Strength flat press machine for controlled mid-chest work.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'flat_cable_flyes',
      name: 'Flat Cable Flyes',
      type: 'isolation',
      movementPattern: 'fly',
      equipment: ['cable'],
      primaryMuscles: ['chest_sternocostal_head'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/J155ev7VvHk?feature=share',
      cueSummary:
        'Cables at chest height, fly and squeeze at the center.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'pec_deck_flyes',
      name: 'Pec Dec Flyes',
      type: 'isolation',
      movementPattern: 'fly',
      equipment: ['machine'],
      primaryMuscles: ['chest_sternocostal_head'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/5wSOaPOBDfM?feature=share',
      cueSummary:
        'Use pec deck machine, squeeze hard at the center.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'push_ups',
      name: 'Push-Ups',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['bodyweight'],
      primaryMuscles: ['chest_sternocostal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/Ue4DVm_zU68?si=rRI99tSSuam4XopR',
      cueSummary:
        'Classic push-up, hands shoulder width, full ROM.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'flat_plate_push_ups',
      name: 'Flat Plate Push-Ups',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['bodyweight', 'plate'],
      primaryMuscles: ['chest_sternocostal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/oWAbF5J2Gqc?si=4j3A6tork4_GQWLp',
      cueSummary:
        'Hands on weight plates for extra depth and ROM.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'floor_flyes',
      name: 'Floor Flyes',
      type: 'isolation',
      movementPattern: 'fly',
      equipment: ['dumbbell'],
      primaryMuscles: ['chest_sternocostal_head'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/27k1B0jILBs?si=_K-_4eeJTiZDEOyh',
      cueSummary:
        'Dumbbell flyes on the floor - floor limits ROM to protect shoulders.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'floor_press',
      name: 'Floor Press',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['barbell'],
      primaryMuscles: ['chest_sternocostal_head'],
      secondaryMuscles: ['triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/GPJuH0fmYA4?si=dS1ypjExtfie3pFd',
      cueSummary:
        'Barbell press from the floor - limited ROM protects rotator cuff.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'reverse_grip_bench',
      name: 'Reverse Grip Bench',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['upper_chest_clavicular', 'chest_sternocostal_head'],
      secondaryMuscles: ['triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/jKFsR1gGAG8?si=DSwZhSXQgn1uoUlG',
      cueSummary:
        'Underhand grip bench press - externally rotates shoulders to protect rotator cuff.',
      mentionedInSections: ['chest-biomechanics', 'chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'dumbbell_pullovers',
      name: 'Dumbbell Pullovers',
      type: 'compound',
      movementPattern: 'pullover',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['pectoralis_minor', 'chest_sternocostal_head'],
      secondaryMuscles: ['lats_group'],
      videoUrl: 'https://youtube.com/shorts/wiCDZcTc2ro?feature=share',
      cueSummary:
        'Lie across bench, lower dumbbell behind head with slight elbow bend, pull back over.',
      mentionedInSections: ['chest-anatomy-pec-minor', 'chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'banded_flat_dumbbell_press',
      name: 'Banded FLAT Dumbbell Presses',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['dumbbell', 'bench', 'resistance_band'],
      primaryMuscles: ['chest_sternocostal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/0wBU7fA0oPo?si=m2oBrHQI3g_UT8oP',
      cueSummary:
        'Flat dumbbell press with band resistance for accommodating resistance.',
      mentionedInSections: ['chest-exercise-library'],
    },
    {
      id: 'push_up_circuit',
      name: 'Push-Up Circuit',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['bodyweight'],
      primaryMuscles: ['chest_sternocostal_head'],
      secondaryMuscles: ['upper_chest_clavicular', 'chest_abdominal_head', 'triceps_brachii'],
      videoUrl: 'https://youtu.be/DuVNS59K360',
      cueSummary:
        'Multiple push-up variations strung together for complete chest activation.',
      mentionedInSections: ['chest-exercise-library'],
    },

    // === LOWER CHEST (Abdominal Head) ===
    {
      id: 'chest_dips',
      name: 'Chest Dips',
      type: 'compound',
      movementPattern: 'dip',
      equipment: ['dip_bars'],
      primaryMuscles: ['chest_abdominal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/UrTyzEd50Ho?si=zZ4HoDdFllX8d0yo',
      cueSummary:
        'Lean forward, flare elbows slightly, dip deep for lower chest emphasis.',
      mentionedInSections: ['chest-anatomy-pec-major', 'chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'weighted_dips',
      name: 'Weighted Dips',
      type: 'compound',
      movementPattern: 'dip',
      equipment: ['dip_bars', 'weight_belt'],
      primaryMuscles: ['chest_abdominal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/UrTyzEd50Ho?si=zZ4HoDdFllX8d0yo',
      cueSummary:
        'Add weight with belt or dumbbell between legs, lean forward for chest emphasis.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'decline_dumbbell_press',
      name: 'Decline Dumbbell Press',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['chest_abdominal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/9m4hBSXq0RI?feature=share',
      cueSummary:
        'Decline bench angle, press dumbbells up following lower chest fiber direction.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'the_double_dip',
      name: 'The Double Dip',
      type: 'compound',
      movementPattern: 'dip',
      equipment: ['dip_bars'],
      primaryMuscles: ['chest_abdominal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/iUtIyymFDyc?si=skqo2Ue0q3vy5mih',
      cueSummary:
        'Two-part dip movement for extra lower chest activation.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'decline_cable_crossovers',
      name: 'Decline Cable Crossovers',
      type: 'isolation',
      movementPattern: 'fly',
      equipment: ['cable'],
      primaryMuscles: ['chest_abdominal_head'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/CSi1IExbssc?feature=share',
      cueSummary:
        'Set cables high, bring handles down and across for lower chest.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'dog_pounds',
      name: 'Dog Pounds',
      type: 'isolation',
      movementPattern: 'fly',
      equipment: ['cable'],
      primaryMuscles: ['chest_abdominal_head'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/fESHMWvXGgE?feature=share',
      cueSummary:
        'Cable movement for lower chest isolation, bring handles down forcefully.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'single_arm_decline_cable_press',
      name: 'Single Arm Decline Cable Presses',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['cable'],
      primaryMuscles: ['chest_abdominal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/GgFOzfgLQgw?si=O6jh2U3o3EA7dJZ9',
      cueSummary:
        'Single arm cable press targeting lower chest with downward angle.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
    {
      id: 'banded_decline_dumbbell_press',
      name: 'Banded DECLINE Dumbbell Presses',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['dumbbell', 'bench', 'resistance_band'],
      primaryMuscles: ['chest_abdominal_head'],
      secondaryMuscles: ['front_delts', 'triceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/_fuZrAsTiHY?feature=share',
      cueSummary:
        'Decline dumbbell press with band resistance.',
      mentionedInSections: ['chest-snipers-chest-day', 'chest-exercise-library'],
    },
  ];

  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: {
        videoUrl: ex.videoUrl || null,
      },
      create: {
        id: ex.id,
        name: ex.name,
        type: ex.type,
        movementPattern: ex.movementPattern,
        equipment: ex.equipment,
        videoUrl: ex.videoUrl || null,
        cueSummary: ex.cueSummary,
      },
    });

    // primary / secondary anatomy links
    for (const m of ex.primaryMuscles) {
      await prisma.exerciseAnatomy.upsert({
        where: {
          exerciseId_anatomyNodeId_role: {
            exerciseId: ex.id,
            anatomyNodeId: m,
            role: 'primary',
          },
        },
        update: {},
        create: {
          exerciseId: ex.id,
          anatomyNodeId: m,
          role: 'primary',
        },
      });
    }
    for (const m of ex.secondaryMuscles) {
      await prisma.exerciseAnatomy.upsert({
        where: {
          exerciseId_anatomyNodeId_role: {
            exerciseId: ex.id,
            anatomyNodeId: m,
            role: 'secondary',
          },
        },
        update: {},
        create: {
          exerciseId: ex.id,
          anatomyNodeId: m,
          role: 'secondary',
        },
      });
    }

    // Section ↔ Exercise links
    for (const sectionId of ex.mentionedInSections) {
      await prisma.sectionExercise.upsert({
        where: {
          sectionId_exerciseId: {
            sectionId,
            exerciseId: ex.id,
          },
        },
        update: {},
        create: {
          sectionId,
          exerciseId: ex.id,
        },
      });
    }
  }

  // -----------------------------
  // 4) FORMULAS
  // -----------------------------

  const formulas = [
    {
      id: 'chest_upper_superset',
      name: 'Upper Chest SuperSet',
      description:
        'Compound upper chest movement (5-9 reps) supersetted with isolation movement (8-13 reps) to laser-focus stimulus on the clavicular head.',
      pattern: 'superset',
      targetMuscles: ['upper_chest_clavicular'],
      steps: [
        {
          order: 1,
          exerciseId: 'incline_dumbbell_press',
          role: 'compound',
          notes: 'Fail between 5-9 reps',
        },
        {
          order: 2,
          exerciseId: 'cable_upper_chest_flyes',
          role: 'isolation',
          notes: 'Fail between 8-13 reps',
        },
      ],
    },
    {
      id: 'chest_mid_superset',
      name: 'Middle Chest SuperSet',
      description:
        'Compound mid chest movement (5-9 reps) supersetted with isolation movement (8-13 reps) for sternocostal head.',
      pattern: 'superset',
      targetMuscles: ['chest_sternocostal_head'],
      steps: [
        {
          order: 1,
          exerciseId: 'flat_dumbbell_press',
          role: 'compound',
          notes: 'Fail between 5-9 reps',
        },
        {
          order: 2,
          exerciseId: 'flat_cable_flyes',
          role: 'isolation',
          notes: 'Fail between 8-13 reps',
        },
      ],
    },
    {
      id: 'chest_lower_superset',
      name: 'Lower Chest SuperSet',
      description:
        'Compound lower chest movement (5-9 reps) supersetted with isolation movement (8-13 reps) for abdominal head.',
      pattern: 'superset',
      targetMuscles: ['chest_abdominal_head'],
      steps: [
        {
          order: 1,
          exerciseId: 'chest_dips',
          role: 'compound',
          notes: 'Fail between 5-9 reps',
        },
        {
          order: 2,
          exerciseId: 'decline_cable_crossovers',
          role: 'isolation',
          notes: 'Fail between 8-13 reps',
        },
      ],
    },
  ];

  for (const f of formulas) {
    await prisma.formula.upsert({
      where: { id: f.id },
      update: {},
      create: {
        id: f.id,
        name: f.name,
        description: f.description,
        pattern: f.pattern,
      },
    });

    // clear & recreate steps each run
    await prisma.formulaStep.deleteMany({ where: { formulaId: f.id } });

    for (const m of f.targetMuscles) {
      await prisma.formulaTarget.upsert({
        where: {
          formulaId_anatomyNodeId: {
            formulaId: f.id,
            anatomyNodeId: m,
          },
        },
        update: {},
        create: {
          formulaId: f.id,
          anatomyNodeId: m,
        },
      });
    }

    for (const step of f.steps) {
      await prisma.formulaStep.create({
        data: {
          formulaId: f.id,
          order: step.order,
          exerciseId: step.exerciseId,
          role: step.role,
          notes: step.notes,
        },
      });
    }
  }

  // -----------------------------
  // 5) WORKOUT – THE SNIPER'S CHEST DAY
  // -----------------------------

  await prisma.workout.upsert({
    where: { id: 'snipers_chest_day' },
    update: {},
    create: {
      id: 'snipers_chest_day',
      slug: 'snipers-chest-day',
      name: "THE SNIPER'S CHEST DAY (THE CHEST DAY FORMULA)",
      goal:
        'Complete chest development targeting all 3 heads of the pectoralis major plus foundation work for pec minor.',
      priorityRules:
        'Start with STRENGTH block using upper chest movements (Upper Chest Supremacist approach), then work through all heads with supersets.',
      primaryRegionId: 'chest',
    },
  });

  const workoutBlocks = [
    // 1. Strength
    {
      id: 'chest-strength-block',
      workoutId: 'snipers_chest_day',
      label: '1. Strength (Pick 1)',
      schemeStyle: 'drop_set',
      schemeDesc: `Set 1: 3-4 Rep Max
Set 2: Drop 20% & Set REP PR
Set 3: Drop another 20% & Set REP PR
Explanation: Work up to a 3-4 Rep Max for 1 set. Take a 3-4 minute break. Then drop the weight by 20% and set a REP PR. Take another 3-4 minute break. Then drop the weight by another 20% and set another REP PR.`,
      notes:
        'Pick ONE of these pressing variations. Upper chest focused for the Upper Chest Supremacist approach.',
      targetMuscles: ['upper_chest_clavicular', 'pectoralis_major'],
      exerciseOptions: [
        'incline_dumbbell_press',
        'incline_barbell_press',
        'weighted_dips',
      ],
    },
    // 2. Upper Chest SuperSet
    {
      id: 'chest-upper-superset-block',
      workoutId: 'snipers_chest_day',
      label: '2. Upper Chest SuperSet (2-3 Sets)',
      schemeStyle: 'superset',
      schemeDesc:
        '1st Chest Movement: Fail between 5-9 Reps (Pick 1), then superset 2nd Chest Movement: Fail between 8-13 Reps (Pick 1).',
      notes:
        'Compound options: Incline Barbell/Dumbbell Bench, Incline Hammer Strength, Reverse Grip Bench. Isolation options: Feet Elevated Push-Ups, Cable Upper Chest Flyes, Landmine Press.',
      targetMuscles: ['upper_chest_clavicular'],
      exerciseOptions: [
        'incline_barbell_press',
        'incline_dumbbell_press',
        'incline_press_hammer_strength',
        'reverse_grip_bench',
        'feet_elevated_push_ups',
        'feet_elevated_plate_push_ups',
        'cable_upper_chest_flyes',
        'landmine_chest_press',
      ],
    },
    // 3. Middle Chest SuperSet
    {
      id: 'chest-mid-superset-block',
      workoutId: 'snipers_chest_day',
      label: '3. Middle Chest SuperSet (2-3 Sets)',
      schemeStyle: 'superset',
      schemeDesc:
        '1st Chest Movement: Fail between 5-9 Reps (Pick 1), then superset 2nd Chest Movement: Fail between 8-13 Reps (Pick 1).',
      notes:
        'Compound options: Flat Barbell/Dumbbell Bench, Hammer Strength, Reverse Grip/Floor Press (if rotator cuff pain). Isolation options: Push-Ups, Flat Cable Flyes, Pec Dec Flyes, Pullovers, Floor Flyes.',
      targetMuscles: ['chest_sternocostal_head'],
      exerciseOptions: [
        'flat_barbell_bench',
        'flat_dumbbell_press',
        'flat_press_hammer_strength',
        'reverse_grip_bench',
        'floor_press',
        'push_ups',
        'flat_cable_flyes',
        'pec_deck_flyes',
        'dumbbell_pullovers',
        'floor_flyes',
      ],
    },
    // 4. Lower Chest SuperSet
    {
      id: 'chest-lower-superset-block',
      workoutId: 'snipers_chest_day',
      label: '4. Lower Chest SuperSet (2-3 Sets)',
      schemeStyle: 'superset',
      schemeDesc:
        '1st Chest Movement: Fail between 5-9 Reps (Pick 1), then superset 2nd Chest Movement: Fail between 8-13 Reps (Pick 1).',
      notes:
        'Compound options: Chest Dips, Decline Dumbbell Bench, Banded Decline DB Press, The Double Dip. Isolation options: Flat Plate Push-Ups, Decline Cable Crossovers, Dog Pounds, Single Arm Decline Cable Press.',
      targetMuscles: ['chest_abdominal_head'],
      exerciseOptions: [
        'chest_dips',
        'decline_dumbbell_press',
        'banded_decline_dumbbell_press',
        'the_double_dip',
        'flat_plate_push_ups',
        'decline_cable_crossovers',
        'dog_pounds',
        'single_arm_decline_cable_press',
      ],
    },
    // 5. Shoulder Mobility
    {
      id: 'chest-shoulder-mobility-block',
      workoutId: 'snipers_chest_day',
      label: '5. Shoulder Mobility (2-3 Sets, Pick 1)',
      schemeStyle: 'straight_sets',
      schemeDesc:
        'Pullovers: Fail between 8-13 Reps. Or PVC Pipe work in between sets.',
      notes:
        'Maintains shoulder health and adds extra pec minor work. Can be done between sets of other exercises.',
      targetMuscles: ['pectoralis_minor'],
      exerciseOptions: [
        'dumbbell_pullovers',
        'barbell_ezbar_pullovers',
      ],
    },
  ];

  for (const block of workoutBlocks) {
    await prisma.workoutBlock.upsert({
      where: { id: block.id },
      update: {},
      create: {
        id: block.id,
        workoutId: block.workoutId,
        label: block.label,
        schemeStyle: block.schemeStyle,
        schemeDesc: block.schemeDesc,
        notes: block.notes,
      },
    });

    for (const m of block.targetMuscles) {
      await prisma.workoutBlockTarget.upsert({
        where: {
          blockId_anatomyNodeId: {
            blockId: block.id,
            anatomyNodeId: m,
          },
        },
        update: {},
        create: {
          blockId: block.id,
          anatomyNodeId: m,
        },
      });
    }

    for (const exId of block.exerciseOptions) {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: block.id,
            exerciseId: exId,
          },
        },
        update: {},
        create: {
          blockId: block.id,
          exerciseId: exId,
          kind: 'option',
        },
      });
    }
  }

  console.log("✅ Chest guide, anatomy, exercises, formulas, and full Sniper's Chest Day seeded.");
}

seedChest()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

