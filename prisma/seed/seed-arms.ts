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
      roleSummary: 'The young man muscles that fill out the sleeves and drive pressing/pulling strength.',
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
      description: 'Bicep-focused muscles (biceps brachii, brachialis) that flex the elbow.',
      roleSummary: 'Elbow flexion, forearm supination, and the classic front-arm look.',
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
      description: 'Forearm flexors and extensors; in this guide mainly the brachioradialis.',
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
      description: 'Sternal / mid fibers of the pec major that do most of the heavy pressing.',
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
      roleSummary: 'Assists pressing and overhead work; gives rounded front-shoulder look.',
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
        ],
        secondaryExerciseIds: ['cable_curl'],
        formulaIds: [],
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
        secondaryExerciseIds: ['barbell_ez_bar_curl', 'cable_curl'],
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
        secondaryExerciseIds: [],
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
        ],
        secondaryExerciseIds: ['single_arm_db_extensions'],
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
        ],
        secondaryExerciseIds: [],
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
        primaryExerciseIds: ['dips', 'triangle_pushdown'],
        secondaryExerciseIds: [],
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
...
Well the answer to your problems lay in the tricep.
I was naturally a guy with big arms but it wasn’t my biceps.
It was my triceps.
...`,
    },
    {
      id: 'mindset-arms',
      guideId: 'arms',
      kind: 'mindset',
      title: 'MINDSET – Arm Genetics & Work That Works',
      order: 2,
      content: `Genetically I was never "meant" to have arms like this.
...
Information is great …but information without execution is purely mental gymnastics and does absolutely nothing for you.
You now have all the information you need for Conceal & Carry Pythons. Now it’s your time to GRAB the results you’ve been craving your whole life.
...`,
    },
    {
      id: 'rules-natural-crusader',
      guideId: 'arms',
      kind: 'mindset',
      title: 'The Undeniable Standard: Becoming a Natural Crusader',
      order: 3,
      content: `What does it mean to be Undeniable?
To be undeniable is to be unshakable; unforgettable.
The type of presence that doesn’t merely exist but demands attention, even when silent.
...
RULES OF THE NATURAL CRUSADERS:
1. Lead with Heart, Die on Your Sword
2. Empty the Energy Clip Every Day
3. Never Go to Bed Hungry
...
14. Face Fear as a Challenge
...`,
    },
    {
      id: 'anatomy-overview-arms',
      guideId: 'arms',
      kind: 'anatomy',
      title: 'Anatomy – Conceal & Carry Pythons',
      order: 4,
      content: `In order for us to build the base of our body correct…we must have an understanding of the anatomy.
“Am I really getting a science lesson from Uncle Rommy?”
Yes you are…
Listen…I am not like your former professors and teachers.
Instead of giving you information that you find useless.
I am going to provide you with information about how to conceal & carry pythons.
Once you understand the anatomy of the shoulder and arms it's going to be 100x easier to:
1. Target the parts that will actually build & sculpt out your arms
2. Reduce risk of injury through strengthening key muscle groups
We have the Bicep & Tricep….BUT we also have the forearms.
Let’s start with the fan favorite: The Bicep
...`,
    },
    {
      id: 'anatomy-biceps',
      guideId: 'arms',
      kind: 'anatomy',
      title: 'Biceps – Long Head, Short Head & Brachialis MAXIMALISM',
      order: 5,
      content: `The Bicep Brachii has 2 separate heads:
Long Head (Outer Portion of the bicep)
Short Head (Inner Portion of the Bicep)
...
LONG HEAD:
The Long Head is located on the outer part of the bicep & is responsible for the peak when you hit a nasty bicep flex.
But besides the peak development for aesthetic advantages…it provides shoulder stability.
Due to the long head crossing over into the shoulder joint, it strengthens and stabilizes the shoulder during overhead & other pressing movements.
...
Overview: You must train both heads because it’s essential for balanced & peak performance regardless of what pulling movements you are implementing.
...
But there is more to the Bicep than these two heads.
There are people that consider the following 2 muscles technically “a part of the forearm”:
Brachialis
Brachioradialis
Why do I consider those two muscles a part of the bicep?
Because these will make your biceps look MUCH THICKER and increase the amount of weight you can pull.
Increasing your strength numbers SIGNIFICANTLY.
Those muscles take your aesthetic and strength to ANOTHER LEVEL.
And good news by shifting your attention to just ONE of these 2 muscles…the other one gets proper attention in the process.
Brachialis MAXIMALISM
...
BRACHIALIS:
If you are familiar with my work you know that I am a Brachialis Supremacist.
It’s not for no reason…this is the secret sauce of the bicep.
But why is it worth focusing on?
1. Increase Arm Strength
2. Makes your Arms look THICK
3. Improves Grip Strength
4. Injury Resilience (Helps Prevent Injuries)
...
People know about long head & short head of the bicep but they fail to focus their attention on the IMPERATIVE MUSCLE that is the Brachialis.
Not many people understand that this is where a TON of extra gains are made.
...`,
    },
    {
      id: 'anatomy-triceps',
      guideId: 'arms',
      kind: 'anatomy',
      title: 'Triceps – Long, Medial & Lateral Head',
      order: 6,
      content: `Now…we have the LARGER part of the equation & is the muscle that makes up 2/3rds of the arm.
You guessed it…
The Tricep:
The Tricep has 3 separate heads:
Long Head (largest portion of the tricep)
Lateral Head (HorseShoe)
Medial Head (underneath both)
LONG HEAD:
The Long Head is the LARGEST head in the tricep that is located on the inner part of the arm.
That means if you want bigger & stronger triceps then you’d be smart to allocate your energy towards the long head of the tricep.
Biomechanically it helps you straighten the arm (elbow extension) & is involved in bringing the arm down or back (shoulder extension).
This is the huge player with strength but more obviously when it comes to putting MASS onto your arms.
Acquiring yourself MUCH THICKER pythons while adding serious depth & shape in the process.
And when it comes to building injury resilience… this is where the elbows and shoulder joints come into play.
This will alleviate unnecessary load onto both your shoulder and elbow joints.
...`,
    },
    {
      id: 'strength-arms',
      guideId: 'arms',
      kind: 'strength',
      title: 'Strength – How We Load the Arms',
      order: 7,
      content: `We are not just moving weight for the sake of it.
We are putting your arms in positions to move heavy weight while keeping the joints safe.
Footnote… there is a ton of layover in the exercises that target the biceps & triceps but more so the tricep.
...`,
    },
    {
      id: 'formulas-arms',
      guideId: 'arms',
      kind: 'program',
      title: 'Bicep & Tricep Formula Examples',
      order: 8,
      content: `Footnote…. there is a ton of layover in the exercises that target the biceps & triceps but more so the tricep.

Tricep Formula EXAMPLES:
EXAMPLE FOR THE LONG HEAD: Skull Crushers (Compound Lift) followed by Single Arm DB Extensions (isolation exercise)
EXAMPLE FOR THE MEDIAL HEAD: Close Grip Bench (Compound Lift) followed by Reverse Grip Pushdowns (isolation exercise)
EXAMPLE FOR THE LATERAL HEAD: Dips (Compound Lift) followed by Triangle Attachment Pushdowns (Isolation exercise)

Bicep Formula EXAMPLES:
EXAMPLE FOR THE LONG HEAD: Incline Dumbbell Curls (Compound Lift) followed by Cable Curls (isolation exercise)
...`,
    },
    {
      id: 'snipers-arm-day',
      guideId: 'arms',
      kind: 'program',
      title: 'THE SNIPER’S ARM DAY (THE ARM DAY FORMULA)',
      order: 9,
      content: `You now have all the information you need for Conceal & Carry Pythons.
Now it’s your time to GRAB the results you’ve been craving your whole life.
Information is great …but information without execution is purely mental gymnastics and does absolutely nothing for you.
The gold mine is yours.
“But Uncle Rommy… how do we put it together?”
I’ll do you this favor, I present to you “THE ARM DAY FORMULA” (CLICK EACH EXERCISE FOR A VIDEO TUTORIAL)
READ: The muscle you want to PRIORITIZE (the one you care about more) is the one to START off with.
...`,
    },
  ];

  for (const s of sections) {
    await prisma.section.upsert({
      where: { id: s.id },
      update: {},
      create: s,
    });
  }

  // Section → Anatomy links from focusMuscles in your JSON
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

    // snipers-arm-day
    { sectionId: 'snipers-arm-day', anatomyNodeId: 'triceps_brachii' },
    { sectionId: 'snipers-arm-day', anatomyNodeId: 'biceps_brachii' },
    { sectionId: 'snipers-arm-day', anatomyNodeId: 'brachialis' },
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
    {
      id: 'close_grip_bench_press',
      name: 'Close Grip Bench Press',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['triceps_long_head', 'triceps_medial_head'],
      secondaryMuscles: ['chest_sternocostal_head'],
      videoUrl:
        'https://youtube.com/shorts/Xvl5q-PHPhk?si=zVC66iBQq3EtVMGR',
      cueSummary:
        'Grip just inside shoulder width, tuck elbows, drive up with triceps.',
      mentionedInSections: ['formulas-arms', 'snipers-arm-day'],
    },
    {
      id: 'incline_close_grip_bench_press',
      name: 'Incline Close Grip Bench Press',
      type: 'compound',
      movementPattern: 'press',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['triceps_long_head', 'triceps_medial_head'],
      secondaryMuscles: ['upper_chest_clavicular'],
      videoUrl:
        'https://youtube.com/shorts/-Ge7BvFFGls?feature=share',
      cueSummary:
        'Use a closer grip on an incline bench to load upper chest and triceps.',
      mentionedInSections: ['snipers-arm-day'],
    },
    {
      id: 'weighted_dips_upright',
      name: 'Weighted Dips (Upright)',
      type: 'compound',
      movementPattern: 'dip',
      equipment: ['dip_bars', 'weight_belt'],
      primaryMuscles: ['triceps_lateral_head', 'triceps_long_head'],
      secondaryMuscles: ['chest_sternocostal_head', 'front_delts'],
      videoUrl:
        'https://youtube.com/shorts/0f0dhThWz9w?feature=share',
      cueSummary:
        'Stay more upright and lock out hard to hammer triceps.',
      mentionedInSections: ['snipers-arm-day', 'formulas-arms'],
    },
    {
      id: 'skull_crushers',
      name: 'Skull Crushers',
      type: 'compound',
      movementPattern: 'extension',
      equipment: ['barbell', 'ez_bar', 'bench'],
      primaryMuscles: ['triceps_long_head'],
      secondaryMuscles: ['triceps_medial_head'],
      videoUrl:
        'https://youtube.com/shorts/wN5h__DYRwg?si=cBZrFOUhf-KAMSTJ',
      cueSummary:
        'Lower the bar behind the head to stretch the long head, extend without flaring elbows.',
      mentionedInSections: ['formulas-arms', 'anatomy-triceps'],
    },
    {
      id: 'single_arm_db_extensions',
      name: 'Single Arm DB Extensions',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['dumbbell'],
      primaryMuscles: ['triceps_long_head'],
      secondaryMuscles: [],
      videoUrl: null,
      cueSummary:
        'Overhead or lying, extend fully and squeeze the back of the arm.',
      mentionedInSections: ['formulas-arms'],
    },
    {
      id: 'reverse_grip_pushdown',
      name: 'Reverse Grip Pushdowns',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['cable'],
      primaryMuscles: ['triceps_medial_head'],
      secondaryMuscles: [],
      videoUrl: null,
      cueSummary:
        'Underhand grip, elbows pinned, extend and lock out under control.',
      mentionedInSections: ['formulas-arms'],
    },
    {
      id: 'triangle_pushdown',
      name: 'Triangle Attachment Pushdowns',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['cable'],
      primaryMuscles: ['triceps_lateral_head'],
      secondaryMuscles: ['triceps_medial_head'],
      videoUrl: null,
      cueSummary:
        'Use triangle handle, lean slightly forward, drive down and lock out.',
      mentionedInSections: ['formulas-arms'],
    },
    {
      id: 'dips',
      name: 'Dips',
      type: 'compound',
      movementPattern: 'dip',
      equipment: ['dip_bars'],
      primaryMuscles: ['triceps_lateral_head', 'triceps_long_head'],
      secondaryMuscles: ['chest_sternocostal_head'],
      videoUrl: null,
      cueSummary:
        'Lean slightly forward or stay upright depending on emphasis; hit full lockout.',
      mentionedInSections: ['formulas-arms'],
    },
    {
      id: 'incline_dumbbell_curl',
      name: 'Incline Dumbbell Curls',
      type: 'compound',
      movementPattern: 'curl',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['biceps_long_head'],
      secondaryMuscles: ['brachialis'],
      videoUrl: null,
      cueSummary:
        'Sit back on an incline, let arms hang, curl without swinging, stretch the long head.',
      mentionedInSections: ['formulas-arms'],
    },
    {
      id: 'cable_curl',
      name: 'Cable Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['cable'],
      primaryMuscles: ['biceps_long_head', 'biceps_short_head'],
      secondaryMuscles: ['brachialis'],
      videoUrl: null,
      cueSummary:
        'Keep constant tension with the cable, squeeze at the top.',
      mentionedInSections: ['formulas-arms'],
    },
    {
      id: 'barbell_ez_bar_curl',
      name: 'Barbell/EZ Bar Curl',
      type: 'compound',
      movementPattern: 'curl',
      equipment: ['barbell', 'ez_bar'],
      primaryMuscles: ['biceps_long_head', 'biceps_short_head'],
      secondaryMuscles: ['brachialis'],
      videoUrl: null,
      cueSummary:
        'Stand tall, no swinging, curl from a full stretch to a hard squeeze.',
      mentionedInSections: ['snipers-arm-day'],
    },
    {
      id: 'preacher_curl_machine',
      name: 'Preacher Curl Machine',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['machine'],
      primaryMuscles: ['biceps_short_head'],
      secondaryMuscles: [],
      videoUrl: null,
      cueSummary:
        'Let the pad lock your upper arm, curl through a full ROM.',
      mentionedInSections: ['snipers-arm-day'],
    },
    {
      id: 'preacher_bar_curl',
      name: 'Preacher Bar Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['barbell', 'ez_bar', 'preacher_bench'],
      primaryMuscles: ['biceps_short_head'],
      secondaryMuscles: [],
      videoUrl: null,
      cueSummary:
        'Similar to machine but with free weight; control the bottom stretch.',
      mentionedInSections: ['snipers-arm-day'],
    },
    {
      id: 'reverse_dumbbell_curl',
      name: 'Reverse Dumbbell Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['dumbbell'],
      primaryMuscles: ['brachialis', 'brachioradialis'],
      secondaryMuscles: [],
      videoUrl:
        'https://youtube.com/shorts/VEb1Uz0IJ1w?feature=share',
      cueSummary:
        'Use a pronated grip, curl without swinging to blow up brachialis and forearms.',
      mentionedInSections: ['anatomy-biceps', 'formulas-arms'],
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
          exerciseId: 'single_arm_db_extensions',
          role: 'isolation',
          notes: 'Chase a nasty pump in the long head, high reps.',
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
        'Pick ONE of these pressing variations and follow the drop-set scheme.',
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

  console.log('✅ Arms guide, anatomy, exercises, formulas, and workout seeded.');
}

seedArms()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });