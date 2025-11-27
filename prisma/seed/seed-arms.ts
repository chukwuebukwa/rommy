// prisma/seed-arms.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedArms() {
  // -----------------------------
  // 1) ANATOMY GRAPH (ARMS + minimal chest/shoulders placeholders)
  // -----------------------------

  const anatomyNodes = [
    // Regions
    {
      id: 'arms',
      kind: 'region',
      name: 'Arms',
      slug: 'arms',
      description: 'Arm region: biceps, triceps and forearms.',
      roleSummary:
        'The young man muscles that fill out the sleeves and drive pressing/pulling strength.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: null,
    },
    {
      id: 'chest',
      kind: 'region',
      name: 'Chest',
      slug: 'chest',
      description: 'Chest region (upper, mid / sternocostal, lower).',
      roleSummary: 'Pressing power and the armor-plated look.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: null,
    },
    {
      id: 'shoulders',
      kind: 'region',
      name: 'Shoulders',
      slug: 'shoulders',
      description: 'Deltoid region: anterior, medial, posterior delts.',
      roleSummary: 'Overhead strength and the capped-shoulder silhouette.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: null,
    },

    // Groups under arms
    {
      id: 'biceps_group',
      kind: 'group',
      name: 'Biceps',
      slug: 'biceps',
      description:
        'Bicep-focused muscles (biceps brachii, brachialis) that flex the elbow.',
      roleSummary:
        'Elbow flexion, forearm supination, and the classic front-arm look.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: 'arms',
    },
    {
      id: 'triceps_group',
      kind: 'group',
      name: 'Triceps',
      slug: 'triceps',
      description: 'Tricep heads that extend the elbow and give the arm its mass.',
      roleSummary: 'Primary elbow extensors and ~2/3 of total arm size.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: 'arms',
    },
    {
      id: 'forearms_group',
      kind: 'group',
      name: 'Forearms',
      slug: 'forearms',
      description:
        'Forearm flexors and extensors; in this guide mainly the brachioradialis and grip-focused musculature.',
      roleSummary: 'Grip strength, elbow flexion support, and thick forearm look.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: 'arms',
    },

    // Chest / shoulder parts that show up as secondary muscles in arm exercises
    {
      id: 'chest_sternocostal_head',
      kind: 'part',
      name: 'Mid Chest (Sternocostal Head)',
      slug: 'chest-sternocostal-head',
      description:
        'Sternal / mid fibers of the pec major that do most of the heavy pressing.',
      roleSummary: 'Drives horizontal pressing strength and mid-chest thickness.',
      primaryFunctions: JSON.stringify(['horizontal adduction', 'assists shoulder flexion']),
      aestheticNotes: JSON.stringify(['Adds fullness to the center of the chest.']),
      meta: null,
      parentId: 'chest',
    },
    {
      id: 'upper_chest_clavicular',
      kind: 'part',
      name: 'Upper Chest (Clavicular Head)',
      slug: 'upper-chest-clavicular',
      description: 'Upper pec fibers attaching near the clavicle.',
      roleSummary: 'Contributes to upper chest shelf and incline pressing strength.',
      primaryFunctions: JSON.stringify(['assists shoulder flexion', 'diagonal / incline pressing']),
      aestheticNotes: JSON.stringify(['Creates the armor-plated upper chest shelf.']),
      meta: null,
      parentId: 'chest',
    },
    {
      id: 'front_delts',
      kind: 'muscle',
      name: 'Front Delts (Anterior Deltoid)',
      slug: 'front-delts',
      description: 'Front head of the deltoids that works heavily in pressing.',
      roleSummary:
        'Assists pressing and overhead work; gives rounded front-shoulder look.',
      primaryFunctions: JSON.stringify(['shoulder flexion', 'assists pressing movements']),
      aestheticNotes: JSON.stringify(['Adds roundness to the front of the shoulder.']),
      meta: null,
      parentId: 'shoulders',
    },

    // --- Biceps complex ---
    {
      id: 'biceps_brachii',
      kind: 'muscle',
      name: 'Biceps Brachii',
      slug: 'biceps-brachii',
      description: 'Primary elbow flexor with two heads (long and short).',
      roleSummary:
        'Primary elbow flexor with two heads (long and short) that contribute to peak, width, and shoulder stability.',
      primaryFunctions: JSON.stringify([
        'elbow flexion',
        'forearm supination',
        'assists shoulder stability',
      ]),
      aestheticNotes: JSON.stringify([
        'Classic bicep ball when flexed.',
        'Visible from the front and side when lean.',
      ]),
      meta: null,
      parentId: 'biceps_group',
    },
    {
      id: 'biceps_long_head',
      kind: 'part',
      name: 'Long Head (Outer Portion of the Bicep)',
      slug: 'biceps-long-head',
      description:
        'Located on the outer part of the bicep & responsible for the peak when you hit a nasty bicep flex. Due to the long head crossing over into the shoulder joint, it strengthens and stabilizes the shoulder during overhead & other pressing movements.',
      roleSummary: 'Outer bicep head that creates peak and adds shoulder stability.',
      primaryFunctions: JSON.stringify([
        'elbow flexion',
        'assists shoulder stability',
        'assists overhead pressing movements',
      ]),
      aestheticNotes: JSON.stringify([
        'Creates the visible bicep peak.',
        'Adds fullness and width when viewed from the side.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['incline_dumbbell_curl', 'barbell_ez_bar_curl'],
        secondaryExerciseIds: [
          'cable_curl',
          'preacher_curl_machine',
          'preacher_bar_curl',
          'drag_curl',
          'close_grip_bar_curl',
        ],
        formulaIds: ['biceps_long_head_formula_1'],
      }),
      parentId: 'biceps_brachii',
    },
    {
      id: 'biceps_short_head',
      kind: 'part',
      name: 'Short Head (Inner Portion of the Bicep)',
      slug: 'biceps-short-head',
      description:
        'Inner portion of the bicep, contributes to thickness and stability through the elbow joint during pulling and curling movements.',
      roleSummary: 'Inner head that adds inner arm thickness and stability.',
      primaryFunctions: JSON.stringify([
        'elbow flexion',
        'supports elbow joint in pulling movements',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds thickness to the inner arm, helping fill the front view.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'barbell_ez_bar_curl',
          'preacher_curl_machine',
          'preacher_bar_curl',
          'wide_dumbbell_curl',
          'wide_grip_barbell_curl',
        ],
        secondaryExerciseIds: ['cable_curl', 'waiter_curl', 'uncle_rommy_curl'],
        formulaIds: ['biceps_short_head_formula_1'],
      }),
      parentId: 'biceps_brachii',
    },

    // Brachialis
    {
      id: 'brachialis',
      kind: 'muscle',
      name: 'Brachialis',
      slug: 'brachialis',
      description:
        'Key elbow flexor sitting underneath the biceps that adds serious arm thickness, grip strength and joint resilience.',
      roleSummary:
        'Key elbow flexor sitting underneath the biceps that adds serious arm thickness, grip strength and joint resilience.',
      primaryFunctions: JSON.stringify([
        'elbow flexion, especially in neutral or pronated grip',
        'supports pulling strength in rows, pull-ups and deadlifts',
        'supports elbow joint stability',
      ]),
      aestheticNotes: JSON.stringify([
        'A large brachialis pushes your biceps higher, giving your arms both a thicker & more rounded look.',
        'Key to thicker-looking arms from the side.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['reverse_dumbbell_curl'],
        secondaryExerciseIds: [
          'barbell_ez_bar_curl',
          'cable_curl',
          'double_hammer_curl',
          'single_arm_hammer_curl',
          'preacher_machine_hammer_curl',
          'single_arm_brachialis_cable_curl',
        ],
        formulaIds: ['brachialis_formula_1'],
      }),
      parentId: 'biceps_group',
    },

    // Brachioradialis (forearm)
    {
      id: 'brachioradialis',
      kind: 'muscle',
      name: 'Brachioradialis',
      slug: 'brachioradialis',
      description:
        'Forearm flexor that works with the brachialis to drive pulling strength and thick forearms.',
      roleSummary:
        'Forearm flexor that works with the brachialis to drive pulling strength and thick forearms.',
      primaryFunctions: JSON.stringify([
        'elbow flexion in neutral/pronated grip',
        'contributes heavily to grip strength',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds width and density to the forearms.',
        'Makes the entire arm look thicker when viewed from the side.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['reverse_dumbbell_curl'],
        secondaryExerciseIds: [
          'double_hammer_curl',
          'single_arm_hammer_curl',
          'preacher_machine_hammer_curl',
          'single_arm_brachialis_cable_curl',
          'forearm_dumbbell_circuit',
          'forearm_sledgehammer_sequence',
        ],
        formulaIds: ['brachialis_formula_1'],
      }),
      parentId: 'forearms_group',
    },

    // --- Triceps complex ---
    {
      id: 'triceps_brachii',
      kind: 'muscle',
      name: 'Triceps Brachii',
      slug: 'triceps-brachii',
      description:
        'Three-headed muscle on the back of the arm that makes up roughly 2/3rds of arm size.',
      roleSummary:
        'Makes up roughly 2/3rds of the arm. Primary elbow extensor with three heads that drive pressing strength and horseshoe shape.',
      primaryFunctions: JSON.stringify([
        'elbow extension',
        'assists shoulder extension',
      ]),
      aestheticNotes: JSON.stringify([
        'Creates the thick “python” look hanging off the back of the arm.',
        'Critical for the horseshoe silhouette.',
      ]),
      meta: null,
      parentId: 'triceps_group',
    },
    {
      id: 'triceps_long_head',
      kind: 'part',
      name: 'Long Head',
      slug: 'triceps-long-head',
      description:
        'The LARGEST head in the tricep located on the inner part of the arm. Huge player with strength and mass on the arms. Helps you straighten the arm (elbow extension) & is involved in bringing the arm down or back (shoulder extension).',
      roleSummary:
        'Largest tricep head, dominant for mass and overall pressing strength.',
      primaryFunctions: JSON.stringify([
        'elbow extension',
        'assists shoulder extension',
        'supports shoulder and elbow joint resilience',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds serious depth and hanging size to the back of the arm.',
        'When developed, creates that heavy, dense look from behind.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'skull_crushers',
          'close_grip_bench_press',
          'incline_close_grip_bench_press',
          'jm_press',
          'dumbbell_jm_press',
          'single_arm_tricep_extensions',
        ],
        secondaryExerciseIds: [
          'weighted_dips_upright',
          'dips',
          'upright_dips_tricep',
          'dumbbell_tricep_extensions',
          'dumbbell_kickbacks',
          'incline_dumbbell_power_bomb',
        ],
        formulaIds: ['triceps_long_head_formula_1'],
      }),
      parentId: 'triceps_brachii',
    },
    {
      id: 'triceps_medial_head',
      kind: 'part',
      name: 'Medial Head',
      slug: 'triceps-medial-head',
      description:
        'Deep head that sits underneath the other two, contributing to lockout strength and elbow stability.',
      roleSummary:
        'Deep stabilizing head that supports lockout and heavy pressing.',
      primaryFunctions: JSON.stringify([
        'assists elbow extension',
        'supports elbow stability under heavy loads',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds density around the elbow and bottom of the tricep.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'close_grip_bench_press',
          'reverse_grip_pushdown',
          'dips',
          'upright_dips_tricep',
        ],
        secondaryExerciseIds: [
          'triangle_pushdown',
          'rope_attachment_tricep_superset',
          'criss_cross_cable_pushdown',
          'hammer_strength_tricep_extension',
        ],
        formulaIds: ['triceps_medial_head_formula_1'],
      }),
      parentId: 'triceps_brachii',
    },
    {
      id: 'triceps_lateral_head',
      kind: 'part',
      name: 'Lateral Head (Horseshoe)',
      slug: 'triceps-lateral-head',
      description:
        'Outer head of the tricep that creates the visible “horseshoe”.',
      roleSummary: 'Outer head that pops the visible horseshoe.',
      primaryFunctions: JSON.stringify([
        'elbow extension, especially in locked-out press positions',
      ]),
      aestheticNotes: JSON.stringify([
        'The horseshoe look popping through the skin when flexed.',
        'Big driver of the “arm from the side” wow factor.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'dips',
          'weighted_dips_upright',
          'upright_dips_tricep',
          'triangle_pushdown',
          'criss_cross_cable_pushdown',
        ],
        secondaryExerciseIds: ['rope_attachment_tricep_superset'],
        formulaIds: ['triceps_lateral_head_formula_1'],
      }),
      parentId: 'triceps_brachii',
    },
  ];

  for (const node of anatomyNodes) {
    await prisma.anatomyNode.upsert({
      where: { id: node.id },
      update: {},
      create: node,
    });
  }

  // -----------------------------
  // 2) GUIDE: ARMS
  // -----------------------------

  await prisma.guide.upsert({
    where: { id: 'arms' },
    update: {},
    create: {
      id: 'arms',
      slug: 'conceal-and-carry-pythons',
      title: 'Conceal & Carry Pythons (Arm Guide)',
      author: 'Uncle Rommy',
      primaryRegionId: 'arms',
    },
  });

  const sections = [
    {
      id: 'intro-young-man-muscle',
      guideId: 'arms',
      kind: 'intro',
      title: 'The Young Man Muscle',
      order: 1,
      content: `The young man muscle.
Lets not lie to ourselves… the coolest muscle on the body.
Especially when the pump is hellacious.
The bicep is basically socket with a tennis ball to flex on the haters.
The Tricep has a horseshoe that pops out through the skin.
This intro frames why arms are the “young man muscle” and why your triceps are actually the main size driver for pythons.`,
    },
    {
      id: 'mindset-arms',
      guideId: 'arms',
      kind: 'mindset',
      title: 'MINDSET – Arm Genetics & Work That Works',
      order: 2,
      content: `Genetically I was never "meant" to have arms like this.
You get the standard Uncle Rommy rant about genetics, work, and execution.
Information is great …but information without execution is purely mental gymnastics and does absolutely nothing for you.
You now have all the information you need for Conceal & Carry Pythons. Now it’s your time to GRAB the results you’ve been craving your whole life.`,
    },
    {
      id: 'rules-natural-crusader',
      guideId: 'arms',
      kind: 'mindset',
      title: 'The Undeniable Standard: Becoming a Natural Crusader',
      order: 3,
      content: `“Undeniable” is the standard: unshakable, unforgettable presence.
Here Rommy lays out the RULES OF THE NATURAL CRUSADERS (1–14), covering things like:
1. Lead with Heart, Die on Your Sword
2. Empty the Energy Clip Every Day
3. Never Go to Bed Hungry
...
14. Face Fear as a Challenge
This section is mostly ethos and life rules, not programming.`,
    },
    {
      id: 'anatomy-overview-arms',
      guideId: 'arms',
      kind: 'anatomy',
      title: 'Anatomy – Conceal & Carry Pythons',
      order: 4,
      content: `To build the base of your body correctly, you need an understanding of anatomy.
We break down the arm into:
- Biceps (biceps brachii + brachialis)
- Triceps (3 heads)
- Forearms (brachioradialis + grip musculature)
Key goals:
1. Target the exact parts that will build & sculpt the arms
2. Reduce risk of injury by strengthening key stabilizers (especially around the shoulder and elbow).`,
    },
    {
      id: 'anatomy-biceps',
      guideId: 'arms',
      kind: 'anatomy',
      title: 'Biceps – Long Head, Short Head & Brachialis MAXIMALISM',
      order: 5,
      content: `BICEPS:
The Bicep Brachii has 2 separate heads:
- Long Head (Outer Portion of the Bicep)
- Short Head (Inner Portion of the Bicep)

LONG HEAD:
Responsible for that nasty peak when you flex. Crosses the shoulder joint, so it contributes to shoulder stability and overhead pressing.
You must train both heads for balanced performance in all pulling movements.

BRACHIALIS MAXIMALISM:
Rommy’s “secret sauce”. Brachialis sits underneath the biceps and when it grows it physically pushes the biceps up, making your arms look much thicker from the side.
Benefits:
1. Increased arm strength
2. Thicker arms
3. Better grip strength
4. Injury resilience (elbow-friendly)

Brachialis + brachioradialis are treated as “bicep-adjacent” because they massively enhance both strength numbers and aesthetics.`,
    },
    {
      id: 'anatomy-triceps',
      guideId: 'arms',
      kind: 'anatomy',
      title: 'Triceps – Long, Medial & Lateral Head',
      order: 6,
      content: `TRICEPS:
The tricep makes up roughly 2/3 of total arm mass.
It has 3 heads:
- Long Head (largest, inner portion)
- Lateral Head (outer “horseshoe”)
- Medial Head (deep head under both)

LONG HEAD:
Largest head, located on inner arm.
Drives elbow extension and assists shoulder extension.
Huge for strength AND for stacked, thick arms.
Also a big player in injury resilience by offloading shoulder and elbow joints.

MEDIAL HEAD:
Deep stabilizer on the lower part of the triceps.
Adds density and depth around the elbow and bottom portion of the tricep.
Primary stabilizer during pressing and pushing, especially for those with elbow tendinitis.

LATERAL HEAD:
Outer “horseshoe” on the tricep.
Key for explosive movements, speed, and force generation.
Aesthetic head that provides carved definition and width. Helps protect against hyperextension and reduces strain on the elbow joint.`,
    },
    {
      id: 'strength-arms',
      guideId: 'arms',
      kind: 'strength',
      title: 'Strength – How We Load the Arms',
      order: 7,
      content: `We’re not just moving weight for the sake of it.
We put your arms in positions to move heavy weight while keeping joints safe.
Key points:
- Use heavy compound pressing/curling as the NUMBER 1 strength work (close grip bench, incline close grip, upright dips, heavy curls).
- Understand there is a ton of overlap between movements (especially in triceps).
- Use structured loading patterns (drop sets, low-rep strength work, etc.) to drive performance and growth.`,
    },
    {
      id: 'formulas-arms',
      guideId: 'arms',
      kind: 'program',
      title: 'Bicep & Tricep Formula Examples (Supersets)',
      order: 8,
      content: `SUPERSETS:
Compound lift, supersetted with an isolation exercise on the SAME muscle head.
We use this to laser-focus stimulus with almost zero chance to miss the target.

Tricep Formula EXAMPLES:
- LONG HEAD:
  Skull Crushers (Compound) + Single Arm DB Extensions (Isolation)
- MEDIAL HEAD:
  Close Grip Bench (Compound) + Reverse Grip Pushdowns (Isolation)
- LATERAL HEAD:
  Dips (Compound) + Triangle Attachment Pushdowns (Isolation)

Bicep Formula EXAMPLES:
- LONG HEAD:
  Incline Dumbbell Curls (Compound) + Cable Curls (Isolation)
- SHORT HEAD:
  Preacher Curls (Compound) + Wide Dumbbell Curls (Isolation)

Brachialis MAXIMALISM:
- Reverse Dumbbell Curls for heavy brachialis + brachioradialis work.`,
    },
    {
      id: 'snipers-arm-day',
      guideId: 'arms',
      kind: 'program',
      title: 'THE SNIPER’S ARM DAY (THE ARM DAY FORMULA)',
      order: 9,
      content: `You now have all the information you need for Conceal & Carry Pythons.
THE ARM DAY FORMULA (SNIPER’S ARM DAY):

READ: The muscle you want to PRIORITIZE (the one you care about more) is the one to START with. You can start with TRICEPS or BICEPS, but Rommy recommends TRICEPS.

1. Triceps – NUMBER 1 Strength (Pick 1 heavy press variation)
2. Biceps – NUMBER 1 Strength (Pick 1 heavy curl variation)
3. Long Head Tricep SuperSet (compound + isolation)
4. Long Head Bicep SuperSet (compound + isolation)
5. Tricep SuperSet (Triangle + Rope attachment pushdowns)
6. Bicep SuperSet (Brachialis-focused superset)
7. OPTIONAL: Arm Superset (Tricep + Bicep)
8. FOREARMS: Dumbbell Forearm Circuit + Sledgehammer Forearm Sequence.`,
    },
    {
      id: 'anatomy-forearms',
      guideId: 'arms',
      kind: 'anatomy',
      title: 'Forearms, Grip & Forearm Sequences',
      order: 10,
      content: `THE ONLY FOREARM WORKOUTS YOU NEED:
- Sledgehammer Forearm Sequence
- Dumbbell Circuit

Accessory forearm / grip exercises:
- Dead Hangs
- Farmer Carries + Shrugs
- Single Arm Farmer Carries

These build:
- Grip strength for all pressing/pulling
- Forearm thickness
- Extra resilience at the wrist and elbow.`,
    },
    {
      id: 'bonus-arm-exercise-library',
      guideId: 'arms',
      kind: 'program',
      title: 'BONUS #2 – Arm Exercise Library (Biceps, Triceps & Forearms)',
      order: 11,
      content: `Because you trusted Rommy in a world full of fake naturals, you get a full clickable library.

BICEPS:
- Double Hammer Curls
- Single Arm Brachialis Cable Curls
- Barbell/EZ Bar Curl
- Preacher Curl Machine
- Incline Dumbbell Curls
- Drag Curls
- Cable Curls
- Close Grip Bar Curl
- Preacher Machine Hammer Curl
- Single arm Hammer Curls
- Reverse Dumbbell Curls
- Reverse Barbell Curls
- Reverse Plate Curls
- Preacher Bar Curls
- Waiter Curls
- Wide Dumbbell Curls
- Wide Grip Barbell Curl
- Uncle Rommy Curls

TRICEPS:
- Dumbbell Tricep Lying Extensions with Twist
- Skull Crushers
- JM Press
- Incline Close Grip Bench
- Upright Dips (Tricep Dips)
- Close Grip Bench Press
- Dips (Triceps)
- Triangle Attachment Tricep Superset
- Rope Attachment Tricep Superset
- Criss Cross Cable Pushdowns
- Hammer Strength Tricep Extensions
- Dumbbell Tricep Extensions
- Dumbbell JM Press
- Single Arm Tricep Extensions
- Dumbbell Kickbacks
- Incline Dumbbell Power Bombs

FOREARMS:
- Dumbbell Circuit
- Sledgehammer Forearm Sequence

All of these have video links in the PDF and are represented as Exercises here.`,
    },
  ];

  for (const s of sections) {
    await prisma.section.upsert({
      where: { id: s.id },
      update: {},
      create: s,
    });
  }

  // Section → Anatomy links (focus muscles per section)
  const sectionAnatomyLinks = [
    // intro-young-man-muscle
    { sectionId: 'intro-young-man-muscle', anatomyNodeId: 'biceps_brachii' },
    { sectionId: 'intro-young-man-muscle', anatomyNodeId: 'triceps_brachii' },

    // anatomy-overview-arms
    { sectionId: 'anatomy-overview-arms', anatomyNodeId: 'biceps_brachii' },
    { sectionId: 'anatomy-overview-arms', anatomyNodeId: 'biceps_long_head' },
    { sectionId: 'anatomy-overview-arms', anatomyNodeId: 'biceps_short_head' },
    { sectionId: 'anatomy-overview-arms', anatomyNodeId: 'brachialis' },
    { sectionId: 'anatomy-overview-arms', anatomyNodeId: 'brachioradialis' },
    { sectionId: 'anatomy-overview-arms', anatomyNodeId: 'triceps_brachii' },
    { sectionId: 'anatomy-overview-arms', anatomyNodeId: 'triceps_long_head' },
    { sectionId: 'anatomy-overview-arms', anatomyNodeId: 'triceps_medial_head' },
    { sectionId: 'anatomy-overview-arms', anatomyNodeId: 'triceps_lateral_head' },

    // anatomy-biceps
    { sectionId: 'anatomy-biceps', anatomyNodeId: 'biceps_brachii' },
    { sectionId: 'anatomy-biceps', anatomyNodeId: 'biceps_long_head' },
    { sectionId: 'anatomy-biceps', anatomyNodeId: 'biceps_short_head' },
    { sectionId: 'anatomy-biceps', anatomyNodeId: 'brachialis' },
    { sectionId: 'anatomy-biceps', anatomyNodeId: 'brachioradialis' },

    // anatomy-triceps
    { sectionId: 'anatomy-triceps', anatomyNodeId: 'triceps_brachii' },
    { sectionId: 'anatomy-triceps', anatomyNodeId: 'triceps_long_head' },
    { sectionId: 'anatomy-triceps', anatomyNodeId: 'triceps_medial_head' },
    { sectionId: 'anatomy-triceps', anatomyNodeId: 'triceps_lateral_head' },

    // strength-arms
    { sectionId: 'strength-arms', anatomyNodeId: 'biceps_brachii' },
    { sectionId: 'strength-arms', anatomyNodeId: 'triceps_brachii' },
    { sectionId: 'strength-arms', anatomyNodeId: 'brachialis' },
    { sectionId: 'strength-arms', anatomyNodeId: 'brachioradialis' },

    // formulas-arms
    { sectionId: 'formulas-arms', anatomyNodeId: 'triceps_long_head' },
    { sectionId: 'formulas-arms', anatomyNodeId: 'triceps_medial_head' },
    { sectionId: 'formulas-arms', anatomyNodeId: 'triceps_lateral_head' },
    { sectionId: 'formulas-arms', anatomyNodeId: 'biceps_long_head' },
    { sectionId: 'formulas-arms', anatomyNodeId: 'biceps_short_head' },
    { sectionId: 'formulas-arms', anatomyNodeId: 'brachialis' },

    // snipers-arm-day
    { sectionId: 'snipers-arm-day', anatomyNodeId: 'triceps_brachii' },
    { sectionId: 'snipers-arm-day', anatomyNodeId: 'biceps_brachii' },
    { sectionId: 'snipers-arm-day', anatomyNodeId: 'brachialis' },
    { sectionId: 'snipers-arm-day', anatomyNodeId: 'brachioradialis' },

    // anatomy-forearms
    { sectionId: 'anatomy-forearms', anatomyNodeId: 'brachioradialis' },
    { sectionId: 'anatomy-forearms', anatomyNodeId: 'brachialis' },

    // bonus library
    { sectionId: 'bonus-arm-exercise-library', anatomyNodeId: 'biceps_brachii' },
    { sectionId: 'bonus-arm-exercise-library', anatomyNodeId: 'triceps_brachii' },
    { sectionId: 'bonus-arm-exercise-library', anatomyNodeId: 'brachialis' },
    { sectionId: 'bonus-arm-exercise-library', anatomyNodeId: 'brachioradialis' },
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
  // All arm / forearm exercises from structured_data.json + links.csv

  const exercises = [
    // --- Big tricep presses / strength ----
    {
      id: 'close_grip_bench_press',
      name: 'Close Grip Bench Press',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['triceps_long_head', 'triceps_medial_head'],
      secondaryMuscles: ['chest_sternocostal_head'],
      videoUrl: 'https://youtube.com/shorts/-Ge7BvFFGls?feature=share',
      cueSummary:
        'Grip just inside shoulder width, tuck elbows, lower to mid-chest, drive up with triceps.',
      mentionedInSections: ['strength-arms', 'formulas-arms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'incline_close_grip_bench_press',
      name: 'Incline Close Grip Bench Press',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['triceps_long_head', 'triceps_medial_head'],
      secondaryMuscles: ['upper_chest_clavicular'],
      videoUrl: 'https://youtube.com/shorts/Xvl5q-PHPhk?si=zVC66iBQq3EtVMGR',
      cueSummary:
        'On an incline bench with a close grip, lower to upper chest and press, keeping tension on triceps.',
      mentionedInSections: ['strength-arms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'weighted_dips_upright',
      name: 'Weighted Dips (Upright)',
      type: 'compound',
      movementPattern: 'dip',
      equipment: ['dip_bars', 'weight_belt'],
      primaryMuscles: ['triceps_long_head', 'triceps_lateral_head'],
      secondaryMuscles: ['chest_sternocostal_head', 'front_delts'],
      videoUrl: 'https://youtube.com/shorts/gfmALylWNv4?si=yektKPnPxfj8ZI4A',
      cueSummary:
        'Stay more upright, tuck elbows, dip to a comfortable depth and lock out hard to hammer triceps.',
      mentionedInSections: ['strength-arms', 'snipers-arm-day'],
    },

    // --- Dips variants & tricep pressing isolation ---
    {
      id: 'dips',
      name: 'Dips (Triceps)',
      type: 'compound',
      movementPattern: 'dip',
      equipment: ['dip_bars'],
      primaryMuscles: ['triceps_lateral_head', 'triceps_long_head'],
      secondaryMuscles: ['chest_sternocostal_head'],
      videoUrl: 'https://youtube.com/shorts/0f0dhThWz9w?feature=share',
      cueSummary:
        'Use parallel bars, keep a slight forward lean or stay upright, hit a strong lockout each rep.',
      mentionedInSections: ['formulas-arms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'upright_dips_tricep',
      name: 'Upright Dips (Tricep Dips)',
      type: 'compound',
      movementPattern: 'dip',
      equipment: ['dip_bars'],
      primaryMuscles: ['triceps_long_head', 'triceps_lateral_head'],
      secondaryMuscles: ['chest_sternocostal_head', 'front_delts'],
      videoUrl: 'https://youtube.com/shorts/gfmALylWNv4?si=yektKPnPxfj8ZI4A',
      cueSummary: 'Stay upright, elbows close, focus on pure tricep lockout.',
      mentionedInSections: ['bonus-arm-exercise-library'],
    },

    // --- Skull crushers / JM presses / lying tricep work ---
    {
      id: 'skull_crushers',
      name: 'Skull Crushers',
      type: 'compound',
      movementPattern: 'extension',
      equipment: ['barbell', 'ez_bar', 'bench'],
      primaryMuscles: ['triceps_long_head'],
      secondaryMuscles: ['triceps_medial_head'],
      videoUrl: 'https://youtube.com/shorts/wN5h__DYRwg?si=cBZrFOUhf-KAMSTJ',
      cueSummary:
        'Lower the bar behind the head for a deep stretch, extend without flaring elbows.',
      mentionedInSections: ['formulas-arms', 'anatomy-triceps', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'jm_press',
      name: 'JM Press',
      type: 'compound',
      movementPattern: 'extension',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['triceps_long_head', 'triceps_medial_head'],
      secondaryMuscles: ['chest_sternocostal_head'],
      videoUrl: 'https://youtube.com/shorts/Pda9ygvDdRE?si=0iiTR4f8B-onWlLl',
      cueSummary:
        'Hybrid between close-grip bench and skull crusher; lower toward face and press back up, loading triceps heavily.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'dumbbell_jm_press',
      name: 'Dumbbell JM Press',
      type: 'compound',
      movementPattern: 'extension',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['triceps_long_head', 'triceps_medial_head'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/vILUhXIM9rc?si=0tk5k_RZiqQMKirT',
      cueSummary:
        'Dumbbell version of JM press; elbows tucked, lower toward face and extend without losing tension.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'dumbbell_tricep_lying_extension',
      name: 'Dumbbell Tricep Lying Extensions',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['triceps_long_head'],
      secondaryMuscles: ['triceps_medial_head'],
      videoUrl: 'https://youtube.com/shorts/h24fKMGfy_I?feature=share',
      cueSummary:
        'Lying on a bench, lower dumbbells behind head for a stretch and extend to full lockout.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'dumbbell_tricep_lying_extension_twist',
      name: 'Dumbbell Tricep Lying Extensions with Twist',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['triceps_long_head'],
      secondaryMuscles: ['triceps_medial_head'],
      videoUrl: 'https://youtube.com/shorts/5LzZQSRwIU4?si=YeqzpjwoiaKrBCi1',
      cueSummary:
        'Same as lying extensions but twist at the top for extra squeeze in the tricep.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },

    // --- Tricep extensions / pushdowns / machines ---
    {
      id: 'single_arm_tricep_extensions',
      name: 'Single Arm Tricep Extensions (DB Overhead)',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['dumbbell'],
      primaryMuscles: ['triceps_long_head'],
      secondaryMuscles: ['triceps_medial_head'],
      videoUrl: 'https://youtube.com/shorts/7v1BO026F8I?si=nxRSReWPXhkNgzMC',
      cueSummary:
        'Overhead or lying, extend fully and squeeze the back of the arm one side at a time.',
      mentionedInSections: ['formulas-arms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'reverse_grip_pushdown',
      name: 'Reverse Grip Pushdowns',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['cable'],
      primaryMuscles: ['triceps_medial_head'],
      secondaryMuscles: [],
      videoUrl: null, // no direct explicit link in links.csv
      cueSummary:
        'Underhand grip on cable, elbows pinned, extend and lock out under control for medial head emphasis.',
      mentionedInSections: ['formulas-arms'],
    },
    {
      id: 'triangle_pushdown',
      name: 'Triangle Attachment Tricep Superset',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['cable'],
      primaryMuscles: ['triceps_lateral_head'],
      secondaryMuscles: ['triceps_medial_head'],
      videoUrl: 'https://youtube.com/shorts/wyfPk15nOwE?feature=share',
      cueSummary:
        'Use triangle handle, lean slightly forward, drive down and lock out hard for the horseshoe.',
      mentionedInSections: ['formulas-arms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'rope_attachment_tricep_superset',
      name: 'Rope Attachment Tricep Superset',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['cable'],
      primaryMuscles: ['triceps_lateral_head'],
      secondaryMuscles: ['triceps_medial_head'],
      videoUrl: 'https://youtube.com/shorts/uyOy0-JxTuU?feature=share',
      cueSummary:
        'Use rope, spread at the bottom and lock out hard to torch the outer head.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'criss_cross_cable_pushdown',
      name: 'Criss Cross Cable Pushdowns',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['cable'],
      primaryMuscles: ['triceps_lateral_head'],
      secondaryMuscles: ['triceps_medial_head'],
      videoUrl: 'https://youtube.com/shorts/LLHEFZHVkdg?feature=share',
      cueSummary:
        'Cross cables and press down, focusing on peak contraction in the outer head.',
      mentionedInSections: ['formulas-arms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'hammer_strength_tricep_extension',
      name: 'Hammer Strength Tricep Extensions',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['machine'],
      primaryMuscles: ['triceps_long_head'],
      secondaryMuscles: ['triceps_medial_head', 'triceps_lateral_head'],
      videoUrl: 'https://youtube.com/shorts/FS1ujjPynzE?feature=share',
      cueSummary:
        'Use the Hammer Strength plate-loaded tricep machine, drive through full ROM with strong lockout.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'dumbbell_tricep_extensions',
      name: 'Dumbbell Tricep Extensions',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['dumbbell'],
      primaryMuscles: ['triceps_long_head'],
      secondaryMuscles: ['triceps_medial_head'],
      videoUrl: 'https://youtube.com/shorts/h24fKMGfy_I?feature=share',
      cueSummary:
        'Overhead or lying, extend the dumbbells and squeeze the triceps at the top.',
      mentionedInSections: ['bonus-arm-exercise-library'],
    },
    {
      id: 'dumbbell_kickbacks',
      name: 'Dumbbell Kickbacks',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['dumbbell'],
      primaryMuscles: ['triceps_lateral_head'],
      secondaryMuscles: ['triceps_long_head'],
      videoUrl: 'https://youtube.com/shorts/6KIn4mRX9rU?si=HKje21tyy2sB2R-k',
      cueSummary:
        'Hinge over, upper arm fixed, extend the dumbbell back and squeeze at lockout.',
      mentionedInSections: ['bonus-arm-exercise-library'],
    },
    {
      id: 'incline_dumbbell_power_bomb',
      name: 'Incline Dumbbell Power Bombs',
      type: 'compound',
      movementPattern: 'extension',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['triceps_long_head'],
      secondaryMuscles: ['triceps_medial_head'],
      videoUrl: 'https://youtube.com/shorts/f8bmnveIrZE?si=ataBkVqbWj5joAK9',
      cueSummary:
        'On an incline bench, use a deep stretch and powerful extension to “power bomb” the triceps.',
      mentionedInSections: ['bonus-arm-exercise-library'],
    },

    // --- Biceps heavy curls / strength ---
    {
      id: 'barbell_ez_bar_curl',
      name: 'Barbell/EZ Bar Curl',
      type: 'compound',
      movementPattern: 'curl',
      equipment: ['barbell', 'ez_bar'],
      primaryMuscles: ['biceps_long_head', 'biceps_short_head'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://youtube.com/shorts/b-npw5oLoJA?feature=share',
      cueSummary:
        'Stand tall, no swinging, curl from full stretch to a hard squeeze with an EZ or straight bar.',
      mentionedInSections: ['strength-arms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'preacher_curl_machine',
      name: 'Preacher Curl Machine',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['machine'],
      primaryMuscles: ['biceps_short_head'],
      secondaryMuscles: ['biceps_long_head'],
      videoUrl: 'https://youtube.com/shorts/4Lo3M3pTim8?feature=share',
      cueSummary:
        'Let the pad lock your upper arm, curl through full ROM emphasizing the inner head.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'preacher_bar_curl',
      name: 'Preacher Bar Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['barbell', 'ez_bar', 'preacher_bench'],
      primaryMuscles: ['biceps_short_head'],
      secondaryMuscles: ['biceps_long_head'],
      videoUrl: 'https://youtube.com/shorts/eJKDjoBZk1E?feature=share',
      cueSummary:
        'Use a bar on a preacher bench; control the bottom stretch and squeeze the short head.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },

    // --- Long-head biceps + cable curls / drag / close grip ---
    {
      id: 'incline_dumbbell_curl',
      name: 'Incline Dumbbell Curls',
      type: 'compound',
      movementPattern: 'curl',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['biceps_long_head'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://youtube.com/shorts/_F0vp8sOE1A?feature=share',
      cueSummary:
        'Sit back on an incline, let arms hang, curl without swinging to stretch and load the long head.',
      mentionedInSections: ['formulas-arms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'cable_curl',
      name: 'Cable Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['cable'],
      primaryMuscles: ['biceps_long_head', 'biceps_short_head'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://youtube.com/shorts/UH3uES0MAgg?feature=share',
      cueSummary:
        'Keep constant tension with the cable, curl and squeeze hard at the top.',
      mentionedInSections: ['formulas-arms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'drag_curl',
      name: 'Drag Curls',
      type: 'compound',
      movementPattern: 'curl',
      equipment: ['barbell', 'ez_bar'],
      primaryMuscles: ['biceps_long_head'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://youtube.com/shorts/sPkpBMjFHC0?feature=share',
      cueSummary:
        'Drag the bar up your torso, keeping elbows back to emphasize long head and brachialis.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'close_grip_bar_curl',
      name: 'Close Grip Bar Curl',
      type: 'compound',
      movementPattern: 'curl',
      equipment: ['barbell', 'ez_bar'],
      primaryMuscles: ['biceps_long_head'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://youtube.com/shorts/rOxWlfKEoiU?feature=share',
      cueSummary:
        'Use a closer grip to bias long head and keep elbows fixed at your sides.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },

    // --- Brachialis / hammer / reverse curl variations ---
    {
      id: 'reverse_dumbbell_curl',
      name: 'Reverse Dumbbell Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['dumbbell'],
      primaryMuscles: ['brachialis', 'brachioradialis'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/VEb1Uz0IJ1w?feature=share',
      cueSummary:
        'Use a pronated grip, curl without swinging to blow up brachialis and forearms.',
      mentionedInSections: ['anatomy-biceps', 'formulas-arms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'double_hammer_curl',
      name: 'Double Hammer Curls',
      type: 'compound',
      movementPattern: 'curl',
      equipment: ['dumbbell'],
      primaryMuscles: ['brachialis', 'brachioradialis'],
      secondaryMuscles: ['biceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/9Yyw_N4o2sM?si=fYZ2XK5_VWYavvx2',
      cueSummary:
        'Neutral grip dumbbell curls with both arms to hammer brachialis and brachioradialis.',
      mentionedInSections: ['bonus-arm-exercise-library'],
    },
    {
      id: 'single_arm_hammer_curl',
      name: 'Single Arm Hammer Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['dumbbell'],
      primaryMuscles: ['brachialis', 'brachioradialis'],
      secondaryMuscles: ['biceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/TTp-IS3K_6I?feature=share',
      cueSummary:
        'One arm at a time, neutral grip, strict form hammer curls for brachialis focus.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'preacher_machine_hammer_curl',
      name: 'Preacher Machine Hammer Curl',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['machine'],
      primaryMuscles: ['brachialis', 'biceps_short_head'],
      secondaryMuscles: ['brachioradialis'],
      videoUrl: 'https://youtube.com/shorts/QKrgoScwcEE?feature=share',
      cueSummary:
        'Hammer-grip preacher machine curl to lock in position and torch brachialis.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'single_arm_brachialis_cable_curl',
      name: 'Single Arm Brachialis Cable Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['cable'],
      primaryMuscles: ['brachialis'],
      secondaryMuscles: ['brachioradialis'],
      videoUrl: 'https://youtube.com/shorts/EDC6SAo7AT8?si=koyLYBPizetE1hNM',
      cueSummary:
        'Cable single-arm curl with neutral/hammer grip to bias brachialis hard.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'reverse_barbell_curl',
      name: 'Reverse Barbell Curls',
      type: 'compound',
      movementPattern: 'curl',
      equipment: ['barbell', 'ez_bar'],
      primaryMuscles: ['brachialis', 'brachioradialis'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/cw9Apa2v0KU?feature=share',
      cueSummary:
        'Pronated grip bar curls to smash brachialis and forearms.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'reverse_plate_curl',
      name: 'Reverse Plate Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['plate'],
      primaryMuscles: ['brachialis', 'brachioradialis'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/Fwu50HYNlXM?feature=share',
      cueSummary:
        'Hold a plate with a pronated grip and curl, keeping wrists strong.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },

    // --- Short-head / “pretty” curls ---
    {
      id: 'waiter_curl',
      name: 'Waiter Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['dumbbell', 'plate'],
      primaryMuscles: ['biceps_brachii'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://youtube.com/shorts/PqnI097tCns?feature=share',
      cueSummary:
        'Hold a single dumbbell/plate like a tray, curl up and squeeze for peak and inner head.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'wide_dumbbell_curl',
      name: 'Wide Dumbbell Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['dumbbell'],
      primaryMuscles: ['biceps_short_head'],
      secondaryMuscles: ['biceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/Yj9CqMOIkEc?feature=share',
      cueSummary:
        'Hold dumbbells with a wider grip and curl to emphasize inner/short head.',
      mentionedInSections: ['formulas-arms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'wide_grip_barbell_curl',
      name: 'Wide Grip Barbell Curl',
      type: 'compound',
      movementPattern: 'curl',
      equipment: ['barbell', 'ez_bar'],
      primaryMuscles: ['biceps_short_head'],
      secondaryMuscles: ['biceps_brachii'],
      videoUrl: 'https://youtube.com/shorts/QnePbE2Knc0?feature=share',
      cueSummary:
        'Wider grip on the bar shifts emphasis to inner biceps and creates that thick frontal look.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'uncle_rommy_curl',
      name: 'Uncle Rommy Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['dumbbell'],
      primaryMuscles: ['biceps_long_head', 'biceps_short_head'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://www.youtube.com/shorts/B3f7JKCbe7Y',
      cueSummary:
        'Rommy’s signature curl variation to build a nasty pump and fuller biceps.',
      mentionedInSections: ['snipers-arm-day', 'bonus-arm-exercise-library'],
    },

    // --- FOREARMS / GRIP ---
    {
      id: 'forearm_dumbbell_circuit',
      name: 'Dumbbell Forearm Circuit',
      type: 'compound',
      movementPattern: 'forearm_circuit',
      equipment: ['dumbbell'],
      primaryMuscles: ['brachioradialis'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://youtube.com/shorts/infDnTE_LSw?feature=share',
      cueSummary:
        'Forearm circuit with dumbbells to blow up grip, pump and endurance.',
      mentionedInSections: ['anatomy-forearms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'forearm_sledgehammer_sequence',
      name: 'Sledgehammer Forearm Sequence',
      type: 'compound',
      movementPattern: 'forearm_circuit',
      equipment: ['sledgehammer'],
      primaryMuscles: ['brachioradialis'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://youtu.be/38C1yg-oDl4?si=outOAc7brItrOBxr',
      cueSummary:
        'Sledgehammer swings/lever work to build insane forearm density and grip.',
      mentionedInSections: ['anatomy-forearms', 'snipers-arm-day', 'bonus-arm-exercise-library'],
    },
    {
      id: 'dead_hang',
      name: 'Dead Hangs',
      type: 'compound',
      movementPattern: 'hang',
      equipment: ['pullup_bar'],
      primaryMuscles: ['brachioradialis'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://youtube.com/shorts/QSy3l2Omekw?feature=share',
      cueSummary:
        'Hang from a bar for time to build grip resilience and shoulder traction.',
      mentionedInSections: ['anatomy-forearms'],
    },
    {
      id: 'farmer_carries_shrugs',
      name: 'Farmer Carries + Shrugs',
      type: 'compound',
      movementPattern: 'carry',
      equipment: ['dumbbell', 'trap_bar'],
      primaryMuscles: ['brachioradialis'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://youtube.com/shorts/P6ZJcShe0dI?feature=share',
      cueSummary:
        'Heavy carries with integrated shrugs to train grip, traps and overall arm support.',
      mentionedInSections: ['anatomy-forearms'],
    },
    {
      id: 'single_arm_farmer_carry',
      name: 'Single Arm Farmer Carries',
      type: 'compound',
      movementPattern: 'carry',
      equipment: ['dumbbell', 'kettlebell'],
      primaryMuscles: ['brachioradialis'],
      secondaryMuscles: ['brachialis'],
      videoUrl: 'https://youtube.com/shorts/o6QeAALMWeA?si=pr-yTMidMNBpiPv6',
      cueSummary:
        'One-sided carries to challenge grip and core stability; brutal for forearm thickness.',
      mentionedInSections: ['anatomy-forearms'],
    },
  ];

  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: {},
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

    // Section ↔ Exercise links (where it’s mentioned)
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
      id: 'triceps_long_head_formula_1',
      name: 'Long Head – Skull Crushers + Single Arm DB Extensions',
      description:
        'EXAMPLE FOR THE LONG HEAD: Skull Crushers (Compound Lift) followed by Single Arm DB Extensions (isolation exercise).',
      pattern: 'superset',
      targetMuscles: ['triceps_long_head'],
      steps: [
        {
          order: 1,
          exerciseId: 'skull_crushers',
          role: 'compound',
          notes: 'Heavy but controlled sets with deep stretch.',
        },
        {
          order: 2,
          exerciseId: 'single_arm_tricep_extensions',
          role: 'isolation',
          notes: 'Chase a nasty pump in the long head, moderate-to-high reps.',
        },
      ],
    },
    {
      id: 'triceps_medial_head_formula_1',
      name: 'Medial Head – Close Grip Bench + Reverse Grip Pushdowns',
      description:
        'EXAMPLE FOR THE MEDIAL HEAD: Close Grip Bench (Compound Lift) followed by Reverse Grip Pushdowns (isolation exercise).',
      pattern: 'superset',
      targetMuscles: ['triceps_medial_head'],
      steps: [
        {
          order: 1,
          exerciseId: 'close_grip_bench_press',
          role: 'compound',
          notes: null,
        },
        {
          order: 2,
          exerciseId: 'reverse_grip_pushdown',
          role: 'isolation',
          notes: null,
        },
      ],
    },
    {
      id: 'triceps_lateral_head_formula_1',
      name: 'Lateral Head – Dips + Triangle Attachment Pushdowns',
      description:
        'EXAMPLE FOR THE LATERAL HEAD: Dips (Compound Lift) followed by Triangle Attachment Pushdowns (Isolation exercise).',
      pattern: 'superset',
      targetMuscles: ['triceps_lateral_head'],
      steps: [
        {
          order: 1,
          exerciseId: 'dips',
          role: 'compound',
          notes: null,
        },
        {
          order: 2,
          exerciseId: 'triangle_pushdown',
          role: 'isolation',
          notes: null,
        },
      ],
    },
    {
      id: 'biceps_long_head_formula_1',
      name: 'Long Head – Incline DB Curls + Cable Curls',
      description:
        'EXAMPLE FOR THE LONG HEAD: Incline Dumbbell Curls (Compound Lift) followed by Cable Curls (isolation exercise).',
      pattern: 'superset',
      targetMuscles: ['biceps_long_head'],
      steps: [
        {
          order: 1,
          exerciseId: 'incline_dumbbell_curl',
          role: 'compound',
          notes: null,
        },
        {
          order: 2,
          exerciseId: 'cable_curl',
          role: 'isolation',
          notes: null,
        },
      ],
    },
    {
      id: 'biceps_short_head_formula_1',
      name: 'Short Head – Preacher Curls + Wide Dumbbell Curls',
      description:
        'EXAMPLE FOR THE SHORT HEAD: Preacher Curls (Compound/anchored) followed by Wide Dumbbell Curls (isolation).',
      pattern: 'superset',
      targetMuscles: ['biceps_short_head'],
      steps: [
        {
          order: 1,
          exerciseId: 'preacher_bar_curl',
          role: 'compound',
          notes: null,
        },
        {
          order: 2,
          exerciseId: 'wide_dumbbell_curl',
          role: 'isolation',
          notes: null,
        },
      ],
    },
    {
      id: 'brachialis_formula_1',
      name: 'Brachialis MAXIMALISM – Reverse Dumbbell Curls',
      description:
        'EXERCISE EXAMPLE FOR THE BRACHIALIS: Reverse Dumbbell Curls. This simultaneously hits brachialis and brachioradialis, making your arms look THICK and boosting grip strength.',
      pattern: 'straight_sets',
      targetMuscles: ['brachialis', 'brachioradialis'],
      steps: [
        {
          order: 1,
          exerciseId: 'reverse_dumbbell_curl',
          role: 'compound',
          notes: 'Moderate to high reps with strict form.',
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

    // clear & recreate steps each run to avoid duplicates
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
  // 5) WORKOUT – THE SNIPER’S ARM DAY
  // -----------------------------

  await prisma.workout.upsert({
    where: { id: 'snipers_arm_day' },
    update: {},
    create: {
      id: 'snipers_arm_day',
      slug: 'snipers-arm-day',
      name: 'THE SNIPER’S ARM DAY (THE ARM DAY FORMULA)',
      goal:
        'Arm strength and hypertrophy focused on the muscle you prioritize first.',
      priorityRules:
        'READ: The muscle you want to PRIORITIZE (the one you care about more) is the one to START off with. You can start with Triceps or Biceps (but my recommendation is Triceps).',
      primaryRegionId: 'arms',
    },
  });

  const workoutBlocks = [
    // 1. Triceps strength
    {
      id: 'triceps-strength-block',
      workoutId: 'snipers_arm_day',
      label: '1. Triceps – NUMBER 1 Strength (Pick 1)',
      schemeStyle: 'drop_set',
      schemeDesc: `Set 1: 3–4 Rep Max
Set 2: Drop 20% & set REP PR
Set 3: Drop another 20% & set REP PR
Explanation: Work up to a 3–4 Rep Max for 1 set. Take a 3–4 minute break. Then drop the weight by 20% and set a REP PR. Take another 3–4 minute break. Then drop the weight by another 20% and set another REP PR.`,
      notes:
        'Pick ONE of these pressing variations and follow the drop-set strength scheme.',
      targetMuscles: [
        'triceps_brachii',
        'triceps_long_head',
        'triceps_medial_head',
        'triceps_lateral_head',
      ],
      exerciseOptions: [
        'close_grip_bench_press',
        'incline_close_grip_bench_press',
        'weighted_dips_upright',
      ],
    },
    // 2. Biceps strength
    {
      id: 'biceps-strength-block',
      workoutId: 'snipers_arm_day',
      label: '2. Biceps – NUMBER 1 Strength (Pick 1)',
      schemeStyle: 'straight_sets',
      schemeDesc: '3 sets failing between 4–7 reps.',
      notes: 'Heavy curls in a low-ish rep range to build bicep strength.',
      targetMuscles: [
        'biceps_brachii',
        'biceps_long_head',
        'biceps_short_head',
      ],
      exerciseOptions: [
        'barbell_ez_bar_curl',
        'preacher_curl_machine',
        'preacher_bar_curl',
      ],
    },
    // 3. Long Head Tricep Superset
    {
      id: 'triceps-long-head-superset-block',
      workoutId: 'snipers_arm_day',
      label: '3. Long Head Tricep SuperSet',
      schemeStyle: 'superset',
      schemeDesc:
        '2–3 sets. Compound movement: fail between 5–9 reps (pick 1), then superset isolation: fail between 7–11 reps (pick 1).',
      notes:
        'Pick ONE compound (Skull Crushers or JM Press) and ONE isolation (Single Arm DB Extensions / DB JM Press / DB Lying Extensions).',
      targetMuscles: ['triceps_long_head', 'triceps_brachii', 'triceps_medial_head'],
      exerciseOptions: [
        'skull_crushers',
        'jm_press',
        'single_arm_tricep_extensions',
        'dumbbell_jm_press',
        'dumbbell_tricep_lying_extension',
        'dumbbell_tricep_lying_extension_twist',
      ],
    },
    // 4. Long Head Bicep Superset
    {
      id: 'biceps-long-head-superset-block',
      workoutId: 'snipers_arm_day',
      label: '4. Long Head Bicep SuperSet',
      schemeStyle: 'superset',
      schemeDesc:
        '2–3 sets. Compound movement: fail between 5–9 reps (pick 1), then superset isolation: fail between 7–11 reps (pick 1).',
      notes:
        'Pick ONE compound (Incline DB Curl or Cable Curl) and ONE isolation (Drag Curls or Close Grip Bar Curl).',
      targetMuscles: ['biceps_long_head', 'biceps_brachii', 'brachialis'],
      exerciseOptions: [
        'incline_dumbbell_curl',
        'cable_curl',
        'drag_curl',
        'close_grip_bar_curl',
      ],
    },
    // 5. Tricep Superset
    {
      id: 'triceps-superset-block',
      workoutId: 'snipers_arm_day',
      label: '5. Tricep SuperSet',
      schemeStyle: 'superset',
      schemeDesc:
        '2–3 sets x failure between 6–9 reps both ways using attachment supersets.',
      notes: 'Triangle Attachment Tricep Superset + Rope Attachment Tricep Superset.',
      targetMuscles: ['triceps_lateral_head', 'triceps_medial_head'],
      exerciseOptions: ['triangle_pushdown', 'rope_attachment_tricep_superset'],
    },
    // 6. Bicep (Brachialis) Superset
    {
      id: 'biceps-brachialis-superset-block',
      workoutId: 'snipers_arm_day',
      label: '6. Bicep SuperSet (Brachialis Focus)',
      schemeStyle: 'superset',
      schemeDesc:
        '2–3 sets. Brachialis-oriented movement: fail between 6–9 reps (pick 1), then superset movement: fail between 6–9 reps (pick 1).',
      notes:
        'Pick ONE hammer/reverse variant, then ONE reverse curl variant to torch brachialis and brachioradialis.',
      targetMuscles: ['brachialis', 'brachioradialis'],
      exerciseOptions: [
        'preacher_machine_hammer_curl',
        'reverse_barbell_curl',
        'double_hammer_curl',
        'single_arm_hammer_curl',
        'reverse_dumbbell_curl',
        'reverse_plate_curl',
        'single_arm_brachialis_cable_curl',
      ],
    },
    // 7. Optional Arm Superset (Tricep + Bicep)
    {
      id: 'optional-arm-superset-block',
      workoutId: 'snipers_arm_day',
      label: '7. OPTIONAL: Arm Superset (Bicep & Tricep)',
      schemeStyle: 'superset',
      schemeDesc:
        '2–3 sets. Tricep: fail between 7–11 reps (pick 1). Bicep: fail between 6–9 reps (pick 1).',
      notes:
        'Tricep options: Criss Cross Cable Pushdowns, Hammer Strength Tricep Extensions, Upright Dips.\nBicep options: Preacher Bar Curls, Waiter Curls, Wide Dumbbell Curls, Wide Grip Barbell Curl, Uncle Rommy Curls.',
      targetMuscles: ['triceps_brachii', 'biceps_brachii'],
      exerciseOptions: [
        'criss_cross_cable_pushdown',
        'hammer_strength_tricep_extension',
        'upright_dips_tricep',
        'preacher_bar_curl',
        'waiter_curl',
        'wide_dumbbell_curl',
        'wide_grip_barbell_curl',
        'uncle_rommy_curl',
      ],
    },
    // 8. Forearms
    {
      id: 'forearms-block',
      workoutId: 'snipers_arm_day',
      label: '8. FOREARMS',
      schemeStyle: 'straight_sets',
      schemeDesc:
        'DUMBBELL Forearm Circuit + Sledgehammer Forearm Sequence. Optionally add Dead Hangs and Farmer Carries as accessories.',
      notes:
        'These sequences blow up grip strength and forearm size while supporting all your pressing and pulling.',
      targetMuscles: ['brachioradialis', 'brachialis'],
      exerciseOptions: [
        'forearm_dumbbell_circuit',
        'forearm_sledgehammer_sequence',
        'dead_hang',
        'farmer_carries_shrugs',
        'single_arm_farmer_carry',
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

  console.log('✅ Arms guide, anatomy, exercises, formulas, and full Sniper’s Arm Day seeded.');
}

seedArms()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });