// prisma/seed-shoulders.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedShoulders() {
  //-----------------------------
  // 1) ANATOMY – SHOULDERS
  //-----------------------------

  const anatomyNodes = [
    // --- Region root ---
    {
      id: 'shoulders',
      kind: 'region',
      name: 'Shoulders (Deltoid & Cuff Complex)',
      slug: 'shoulders',
      description:
        'Deltoids plus deep rotator cuff and supporting scapular system that create big 3D, pain‑free shoulders.',
      roleSummary:
        'Drives overhead strength, arm abduction and pressing while the cuff and upper‑back musculature keep the joint centered and safe.',
      primaryFunctions: JSON.stringify([
        'shoulder flexion and abduction',
        'overhead pressing strength',
        'dynamic shoulder joint stability',
      ]),
      aestheticNotes: JSON.stringify([
        'Capped, round 3D shoulders from every angle.',
        'Separates the neck, shoulders and arms visually when lean.',
      ]),
      meta: JSON.stringify({
        guideIds: ['shoulders'],
        primaryExerciseIds: [
          'standing_barbell_press',
          'single_arm_dumbbell_press',
          'seated_dumbbell_press',
          'seated_barbell_press',
          'hammer_strength_shoulder_press',
        ],
        secondaryExerciseIds: [
          'modified_bradford_press',
          'lateral_raises',
          'chest_supported_lateral_raises',
          'behind_ass_lateral_raises',
          'single_arm_incline_lateral_raise',
        ],
        formulaIds: [
          'shoulder_strength_standard',
          'posterior_delt_superset',
          'lateral_delt_superset',
          'rotator_cuff_tri_set',
        ],
      }),
      parentId: null,
    },

    // --- Deltoid heads ---
    {
      id: 'front_delts',
      kind: 'muscle',
      name: 'Front Delts (Anterior Deltoid)',
      slug: 'front-delts',
      description:
        'Front head of the shoulder that raises the arm forward and contributes heavily to pressing strength.',
      roleSummary:
        'Primary driver of shoulder flexion and a major contributor to overhead and horizontal pressing strength.',
      primaryFunctions: JSON.stringify([
        'shoulder flexion',
        'assists horizontal adduction in pressing',
      ]),
      aestheticNotes: JSON.stringify([
        'Gives the “front cap” look from the front and side.',
        'Helps connect chest and shoulder mass into one thick block of muscle.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'standing_barbell_press',
          'single_arm_dumbbell_press',
          'seated_dumbbell_press',
          'seated_barbell_press',
          'hammer_strength_shoulder_press',
          'arnold_press',
          'reverse_grip_barbell_press',
          'front_plate_raise',
        ],
        secondaryExerciseIds: [
          'front_dumbbell_raise_incline',
          'front_dumbbell_raise_standing',
          'front_dumbbell_raise_seated',
          'front_dumbbell_raises_to_the_sky',
        ],
        formulaIds: ['shoulder_strength_standard', 'lateral_delt_superset'],
      }),
      parentId: 'shoulders',
    },
    {
      id: 'side_delts',
      kind: 'muscle',
      name: 'Side Delts (Lateral Deltoid)',
      slug: 'side-delts',
      description:
        'Lateral head of the deltoid that abducts the arm and is largely responsible for shoulder width and that “3D” look.',
      roleSummary:
        'Raises the arm out to the side and gives you wide, round shoulders when trained hard.',
      primaryFunctions: JSON.stringify([
        'shoulder abduction',
        'helps stabilize the humeral head during overhead work',
      ]),
      aestheticNotes: JSON.stringify([
        'Main contributor to shoulder width from the front.',
        'Massively impacts the “3D shoulder” look when combined with rear delts.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'lateral_raises',
          'chest_supported_lateral_raises',
          'behind_ass_lateral_raises',
          'single_arm_incline_lateral_raise',
          'modified_bradford_press',
        ],
        secondaryExerciseIds: [
          'upright_rows_ez_bar',
          'behind_arse_upright_rows_bar',
          'rope_attachment_upright_rows',
          'inverted_raises',
        ],
        formulaIds: ['lateral_delt_superset'],
      }),
      parentId: 'shoulders',
    },
    {
      id: 'rear_delts',
      kind: 'muscle',
      name: 'Rear Delts (Posterior Deltoid)',
      slug: 'rear-delts',
      description:
        'Back head of the shoulder that most people treat as an afterthought but is critical for pressing, pulling and shoulder health.',
      roleSummary:
        'Controls shoulder extension and horizontal abduction, balances the front/side delt work and keeps the shoulders from collapsing forward.',
      primaryFunctions: JSON.stringify([
        'shoulder horizontal abduction',
        'shoulder extension',
        'assists external rotation and scapular control',
      ]),
      aestheticNotes: JSON.stringify([
        'Finishes the “capped” shoulder look from the side.',
        'Helps your shoulders look round instead of flat from the back.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'high_elbow_cable_rows',
          'reverse_pec_dec_flyes',
          'hip_huggers',
          'behind_ankle_barbell_raise',
          'triple_rear_delt_delight',
          'powell_raises',
          'face_pulls_back',
        ],
        secondaryExerciseIds: [
          'turtle_raises',
          'reverse_incline_flyes',
          'chest_supported_rows',
        ],
        formulaIds: ['posterior_delt_superset', 'rotator_cuff_tri_set'],
      }),
      parentId: 'shoulders',
    },

    // --- Rotator cuff group (re-using from arms/back but enriched for shoulders) ---
    {
      id: 'rotator_cuff_group',
      kind: 'group',
      name: 'Rotator Cuff',
      slug: 'rotator-cuff',
      description:
        'Deep four‑muscle cuff around the shoulder joint (supraspinatus, infraspinatus, teres minor, subscapularis).',
      roleSummary:
        'Centers the humeral head in the socket during presses, pulls and overhead work so the shoulder doesn’t get chewed up.',
      primaryFunctions: JSON.stringify([
        'shoulder external rotation',
        'shoulder internal rotation',
        'dynamic shoulder joint stability',
      ]),
      aestheticNotes: JSON.stringify([
        'Invisible on stage, but the real foundation for strong, pain‑free shoulders.',
        'Strong cuff = bigger lifts, fewer impingements, fewer “mystery” pains.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'dumbbell_shoulder_external_rotations',
          'cable_handle_external_rotation',
          'cable_handle_internal_rotation',
          'shoulder_elixir_potion',
        ],
        secondaryExerciseIds: [
          'dead_hangs',
          'active_hangs',
          'face_pulls_back',
          'lu_raises',
          'handstand_holds',
        ],
        formulaIds: ['rotator_cuff_tri_set'],
      }),
      parentId: 'shoulders',
    },
    {
      id: 'supraspinatus',
      kind: 'muscle',
      name: 'Supraspinatus',
      slug: 'supraspinatus',
      description:
        'Small rotator cuff muscle above the spine of the scapula that initiates shoulder abduction.',
      roleSummary:
        'Starts the first degrees of shoulder abduction and helps keep the humeral head centered in the socket.',
      primaryFunctions: JSON.stringify([
        'initiates shoulder abduction',
        'stabilizes humeral head in the glenoid',
      ]),
      aestheticNotes: JSON.stringify([
        'Invisible, but massive for shoulder longevity.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['shoulder_elixir_potion'],
        secondaryExerciseIds: ['dead_hangs', 'active_hangs', 'lateral_raises'],
        formulaIds: ['rotator_cuff_tri_set'],
      }),
      parentId: 'rotator_cuff_group',
    },
    {
      id: 'infraspinatus',
      kind: 'muscle',
      name: 'Infraspinatus',
      slug: 'infraspinatus',
      description:
        'Rotator cuff muscle on the back of the shoulder that externally rotates the humerus.',
      roleSummary:
        'Primary external rotator of the shoulder, crucial for decelerating presses and keeping the joint happy.',
      primaryFunctions: JSON.stringify([
        'shoulder external rotation',
        'dynamic shoulder stability during pressing/pulling',
      ]),
      aestheticNotes: JSON.stringify([
        'Again, not a big visible muscle, but the difference between pain‑free training and chronic shoulder anger.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'dumbbell_shoulder_external_rotations',
          'cable_handle_external_rotation',
        ],
        secondaryExerciseIds: [
          'face_pulls_back',
          'lu_raises',
          'powell_raises',
        ],
        formulaIds: ['rotator_cuff_tri_set'],
      }),
      parentId: 'rotator_cuff_group',
    },
    {
      id: 'teres_minor',
      kind: 'muscle',
      name: 'Teres Minor',
      slug: 'teres-minor',
      description:
        'Small rotator cuff muscle on the back of the shoulder that externally rotates and stabilizes the humeral head.',
      roleSummary:
        'Works with the infraspinatus to externally rotate and stabilize the shoulder during pulls and presses.',
      primaryFunctions: JSON.stringify([
        'shoulder external rotation',
        'dynamic shoulder joint stability',
      ]),
      aestheticNotes: JSON.stringify([
        'Not a show muscle, but essential for smooth, pain‑free pulling and pressing.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['dumbbell_shoulder_external_rotations'],
        secondaryExerciseIds: ['face_pulls_back', 'lu_raises'],
        formulaIds: ['rotator_cuff_tri_set'],
      }),
      parentId: 'rotator_cuff_group',
    },
    {
      id: 'subscapularis',
      kind: 'muscle',
      name: 'Subscapularis',
      slug: 'subscapularis',
      description:
        'Rotator cuff muscle on the front of the scapula that internally rotates the humerus.',
      roleSummary:
        'Main internal rotator of the shoulder and an important stabilizer in pressing movements.',
      primaryFunctions: JSON.stringify([
        'shoulder internal rotation',
        'anterior shoulder stability',
      ]),
      aestheticNotes: JSON.stringify([
        'Deep stabilizer, not a show muscle, but critical for keeping presses pain‑free.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['cable_handle_internal_rotation'],
        secondaryExerciseIds: ['shoulder_elixir_potion'],
        formulaIds: ['rotator_cuff_tri_set'],
      }),
      parentId: 'rotator_cuff_group',
    },
  ];

  for (const node of anatomyNodes) {
    await prisma.anatomyNode.upsert({
      where: { slug: node.slug },
      update: {
        name: node.name,
        description: node.description,
        roleSummary: node.roleSummary,
        primaryFunctions: node.primaryFunctions,
        aestheticNotes: node.aestheticNotes,
        meta: node.meta,
        parentId: node.parentId,
        kind: node.kind,
      },
      create: node,
    });
  }

  //-----------------------------
  // 2) GUIDE: SHOULDERS
  //-----------------------------

  await prisma.guide.upsert({
    where: { id: 'shoulders' },
    update: {},
    create: {
      id: 'shoulders',
      slug: '3d-shoulder-sniper',
      title: "THE NATURAL CRUSADER'S SHOULDERS GUIDE",
      author: 'Uncle Rommy',
      primaryRegionId: 'shoulders',
    },
  });

  const sections = [
    {
      id: 'shoulders-intro',
      guideId: 'shoulders',
      title: 'Why 3D Shoulders Matter',
      kind: 'intro',
      order: 1,
      content:
        'Sets the mission: build big, strong, healthy shoulders that look 3D from every angle and can survive heavy training. Lays out how tiny, flat or injured shoulders limit aesthetics, performance and quality of life, and positions this guide as the blueprint to rebuild them and remove fear around the joint.',
    },
    {
      id: 'shoulders-standard-natural-crusader',
      guideId: 'shoulders',
      title: 'The Undeniable Standard – Natural Crusader Shoulders',
      kind: 'mindset',
      order: 2,
      content:
        'Defines the Natural Crusader standard for shoulders: pain‑free pressing, strong overhead strength, 3D caps from all angles, and a support system (upper back, traps, rotator cuff) that never lets the joint down. Frames shoulder training as building a defense system so you can stop playing life on “injury defense mode” and move with full confidence.',
    },
    {
      id: 'anatomy-shoulders-overview',
      guideId: 'shoulders',
      title: 'Anatomy – 3 Heads + Cuff System',
      kind: 'anatomy',
      order: 3,
      content:
        'Breaks the deltoid into three heads: front (anterior), side (lateral) and rear (posterior), plus the deeper four‑muscle rotator cuff complex. Explains how front delts drive pressing, side delts widen the frame, rear delts control posture and balance the front, and how the cuff muscles keep the humeral head centered and protect the joint under load. Emphasizes that neglecting any piece, especially rear delts and cuff, eventually shows up as pain or stagnation.',
    },
    {
      id: 'anatomy-rear-delt-supremacist',
      guideId: 'shoulders',
      title: 'Rear Delt Supremacist',
      kind: 'anatomy',
      order: 4,
      content:
        'Zooms in on the rear delts as the “forgotten” head most lifters toss in at the end of a workout. Explains that the rear deltoid moves the arm backward, assists pulling and stabilizes the shoulder during back work. When trained hard, rear delts fix posture, prevent shoulders from rolling forward, balance the much more dominant front delts and massively boost bench, overhead press and back strength. Argues that prioritizing rear delts is the secret to round, capped shoulders without wrecking joints.',
    },
    {
      id: 'anatomy-side-and-front-delts',
      guideId: 'shoulders',
      title: 'Side + Front Delts: 3D Caps and Powerhouse',
      kind: 'anatomy',
      order: 5,
      content:
        'Explains how side delts handle abduction and are the main driver of shoulder width and that 3D, “boulder shoulder” silhouette, while front delts are the powerhouse of pressing and forward arm movement. Warns against relying only on pressing for front delts and only doing a couple of lateral raises at the end for sides – both heads need focused strength and hypertrophy work to keep up with rear delts and chest/back volume.',
    },
    {
      id: 'anatomy-rotator-cuff-shoulders',
      guideId: 'shoulders',
      title: 'Rotator Cuff – Built‑In Support System',
      kind: 'anatomy',
      order: 6,
      content:
        'Breaks down the four rotator cuff muscles: supraspinatus (initiates lateral raises and first degrees of abduction), infraspinatus and teres minor (external rotation and keeping the shoulders from rolling forward) and subscapularis (internal rotation and balancing the other two). Explains that most modern shoulder issues come from too much internal rotation and weak external rotators, which leads to impingements, tendonitis and tears. The cuff is presented as the foundation of shoulder strength, aesthetics and resilience.',
    },
    {
      id: 'strength-shoulders',
      guideId: 'shoulders',
      title: 'Strength – Overhead Pressing Standard',
      kind: 'strength',
      order: 7,
      content:
        'Details the strength standard built around four heavy overhead pressing options (standing barbell press, standing single‑arm dumbbell press, seated dumbbell press, seated barbell press). Uses a 3–4 rep max with two 20% drops as a recurring strength test and progression tool. Encourages running this heavy scheme for short phases, then living mostly in the 4–7 rep range to build strength while staying safe. Stresses that pressing is only half of the equation – the back‑side support system must match it.',
    },
    {
      id: 'muscle-growth-shoulders',
      guideId: 'shoulders',
      title: 'Muscle Growth – From 2D to 3D Caps',
      kind: 'muscle',
      order: 8,
      content:
        'Covers hypertrophy principles for shoulders: high intensity, training near or to failure, and strategic use of drop sets, supersets, and mechanics‑based sequences. Emphasizes metabolic stress and continuous tension for side and rear delts, and explains why “pressing only” leaves shoulders flat and front‑heavy. The path from flat shoulders to 3D caps is laid out as: strong heavy presses for load, followed by brutal rear and side delt finishers to fill out all angles.',
    },
    {
      id: 'injury-resilience-shoulders',
      guideId: 'shoulders',
      title: 'Injury Resilience – Building the Support System',
      kind: 'resilience',
      order: 9,
      content:
        'Frames injury resilience as building a support system behind the shoulder joint: rear delts, rhomboids, traps and the rotator cuff. Connects real‑world stories of people living in “handcuffs” because of shoulder injuries and shows how a strong cuff and upper‑back armor let you stop playing defense all the time. Outlines how targeted work on these tissues lets you throw caution to the wind again without worrying that every press or throw might be the one that tears something.',
    },
    {
      id: 'mobility-shoulders',
      guideId: 'shoulders',
      title: 'Mobility – Hanging, Wall Work & Overhead Positions',
      kind: 'mobility',
      order: 10,
      content:
        'Describes a mobility toolkit to restore overhead range and scapular control: dead hangs and active hangs from a bar, PVC or dowel pass‑throughs, wall drags, full‑body mobility flows, overhead barbell press holds and overhead squat/snatch holds. Emphasizes doing these between sets or as short mini‑blocks so you can move like butter while still building the power of an animal.',
    },
    {
      id: 'healing-tears-shoulders',
      guideId: 'shoulders',
      title: 'Healing Previous Tears & Eliminating Pain',
      kind: 'resilience',
      order: 11,
      content:
        'Outlines the logic for training shoulders that already have pain, tendonitis or old tears. Prioritizes rear delt work first, then side delts, then more moderate front‑delt and pressing work, with trap and cuff work supporting everything. Clarifies that “healing” is not gentle fluff but smart, progressive overload on the right tissues while respecting pain signals. The goal is to get back to the version of you that moved without fear while making the joint more bulletproof than before.',
    },
    {
      id: 'snipers-shoulder-day',
      guideId: 'shoulders',
      title: "THE SNIPER'S SHOULDER DAY (THE SHOULDER DAY FORMULA)",
      kind: 'formula',
      order: 12,
      content:
        'Presents the Sniper’s Shoulder Day session: 1) one heavy overhead pressing movement run with the strength drop‑set scheme, 2) a posterior deltoid superset (compound rear‑delt row + second rear‑delt isolation), 3) a lateral delt superset (compound shoulder movement + lateral raise isolation), 4) front‑delt and trap finisher options, and 5) optional rotator cuff / rehab work. Gives instructions on picking movements based on your weakest link (rear delts, side delts, pressing strength or pain) and how to progress week to week.',
    },
    {
      id: 'shoulder-rehab-sequence-shoulders',
      guideId: 'shoulders',
      title: 'Shoulder Rehab & Elixir Sequence',
      kind: 'resilience',
      order: 13,
      content:
        'Details a repeatable “shoulder elixir” sequence using hangs, cuff rotations, face pulls and rear‑delt raises to rebuild cranky shoulders. Shows how to plug this in before or after pressing days, and how to use higher‑rep pump work on cuff and rear‑delt movements to drive blood flow, rebuild tendon capacity and restore confidence without re‑aggravating old injuries.',
    },
    {
      id: 'bonus-shoulders-exercise-library',
      guideId: 'shoulders',
      title: 'BONUS #3 – Shoulder, Trap, Rhomboid & Rehab Library',
      kind: 'bonus',
      order: 14,
      content:
        'Curated video library of shoulder, trap, rhomboid and rehab movements: multiple pressing variations (seated/standing, dumbbell/barbell, Arnold, hammer strength, reverse‑grip), front raise variations, lateral raise variations (standard, behind‑ass, incline, chest‑supported), rear‑delt finishers (high‑elbow rows, face pulls, 21’s, rear‑delt triple delight, behind‑ankle barbell raises), trap and upper‑back builders (chest supported shrugs, upright rows, rope upright rows, inverted raises, T raises, turtle raises, Y raises), plus cuff and mobility staples (dumbbell shoulder external rotations, front cable raises, behind‑the‑arse cable uprights).',
    },
  ];

  for (const section of sections) {
    await prisma.section.upsert({
      where: { id: section.id },
      update: {
        title: section.title,
        kind: section.kind,
        order: section.order,
        content: section.content,
      },
      create: section,
    });
  }

  //-----------------------------
  // 2b) SECTION ↔ ANATOMY LINKS
  //-----------------------------

  const sectionAnatomyLinks = [
    {
      sectionId: 'anatomy-shoulders-overview',
      anatomyNodeId: 'shoulders',
    },
    {
      sectionId: 'anatomy-shoulders-overview',
      anatomyNodeId: 'front_delts',
    },
    {
      sectionId: 'anatomy-shoulders-overview',
      anatomyNodeId: 'side_delts',
    },
    {
      sectionId: 'anatomy-shoulders-overview',
      anatomyNodeId: 'rear_delts',
    },
    {
      sectionId: 'anatomy-rear-delt-supremacist',
      anatomyNodeId: 'rear_delts',
    },
    {
      sectionId: 'anatomy-rear-delt-supremacist',
      anatomyNodeId: 'rhomboid_group',
    },
    {
      sectionId: 'anatomy-side-and-front-delts',
      anatomyNodeId: 'front_delts',
    },
    {
      sectionId: 'anatomy-side-and-front-delts',
      anatomyNodeId: 'side_delts',
    },
    {
      sectionId: 'anatomy-rotator-cuff-shoulders',
      anatomyNodeId: 'rotator_cuff_group',
    },
    {
      sectionId: 'anatomy-rotator-cuff-shoulders',
      anatomyNodeId: 'supraspinatus',
    },
    {
      sectionId: 'anatomy-rotator-cuff-shoulders',
      anatomyNodeId: 'infraspinatus',
    },
    {
      sectionId: 'anatomy-rotator-cuff-shoulders',
      anatomyNodeId: 'teres_minor',
    },
    {
      sectionId: 'anatomy-rotator-cuff-shoulders',
      anatomyNodeId: 'subscapularis',
    },
    {
      sectionId: 'injury-resilience-shoulders',
      anatomyNodeId: 'rear_delts',
    },
    {
      sectionId: 'injury-resilience-shoulders',
      anatomyNodeId: 'rotator_cuff_group',
    },
    {
      sectionId: 'injury-resilience-shoulders',
      anatomyNodeId: 'rhomboid_group',
    },
    {
      sectionId: 'injury-resilience-shoulders',
      anatomyNodeId: 'trapezius',
    },
    {
      sectionId: 'mobility-shoulders',
      anatomyNodeId: 'rotator_cuff_group',
    },
    {
      sectionId: 'mobility-shoulders',
      anatomyNodeId: 'trapezius',
    },
    {
      sectionId: 'healing-tears-shoulders',
      anatomyNodeId: 'rear_delts',
    },
    {
      sectionId: 'healing-tears-shoulders',
      anatomyNodeId: 'side_delts',
    },
    {
      sectionId: 'healing-tears-shoulders',
      anatomyNodeId: 'front_delts',
    },
    {
      sectionId: 'healing-tears-shoulders',
      anatomyNodeId: 'rotator_cuff_group',
    },
    {
      sectionId: 'snipers-shoulder-day',
      anatomyNodeId: 'shoulders',
    },
    {
      sectionId: 'snipers-shoulder-day',
      anatomyNodeId: 'front_delts',
    },
    {
      sectionId: 'snipers-shoulder-day',
      anatomyNodeId: 'side_delts',
    },
    {
      sectionId: 'snipers-shoulder-day',
      anatomyNodeId: 'rear_delts',
    },
    {
      sectionId: 'shoulder-rehab-sequence-shoulders',
      anatomyNodeId: 'rotator_cuff_group',
    },
    {
      sectionId: 'shoulder-rehab-sequence-shoulders',
      anatomyNodeId: 'rear_delts',
    },
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

  //-----------------------------
  // 3) EXERCISES – SHOULDERS
  //-----------------------------

  const exercises = [
    // --- Overhead pressing strength standard ---
    {
      id: 'standing_barbell_press',
      name: 'Standing Barbell Press',
      type: 'compound',
      movementPattern: 'overhead_press',
      equipment: ['barbell'],
      primaryMuscles: ['front_delts', 'side_delts'],
      secondaryMuscles: ['trapezius', 'rotator_cuff_group'],
      videoUrl: 'https://youtube.com/shorts/H9il_PZegSE?feature=share',
      cueSummary:
        'Stand tall, brace the mid‑section, press the bar overhead while locking ribs down and pushing your body under the bar at the top.',
      mentionedInSections: ['strength-shoulders', 'snipers-shoulder-day'],
    },
    {
      id: 'seated_dumbbell_press',
      name: 'Seated Dumbbell Press',
      type: 'compound',
      movementPattern: 'overhead_press',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['front_delts', 'side_delts'],
      secondaryMuscles: ['trapezius'],
      videoUrl: 'https://youtube.com/shorts/2weOCT4hyEY',
      cueSummary:
        'Seated with back supported, press dumbbells overhead in a slight arc while keeping wrists stacked and elbows under the bells.',
      mentionedInSections: ['strength-shoulders', 'snipers-shoulder-day'],
    },
    {
      id: 'seated_barbell_press',
      name: 'Seated Barbell Press',
      type: 'compound',
      movementPattern: 'overhead_press',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['front_delts', 'side_delts'],
      secondaryMuscles: ['trapezius'],
      videoUrl: 'https://youtube.com/shorts/p9dO0Gy6n7M?feature=share',
      cueSummary:
        'Similar to standing press but seated; push the bar overhead without letting the lower back arch off the bench.',
      mentionedInSections: ['strength-shoulders', 'snipers-shoulder-day'],
    },
    {
      id: 'hammer_strength_shoulder_press',
      name: 'Hammer Strength Shoulder Press',
      type: 'compound',
      movementPattern: 'overhead_press',
      equipment: ['machine'],
      primaryMuscles: ['front_delts', 'side_delts'],
      secondaryMuscles: ['trapezius'],
      videoUrl: 'https://youtube.com/shorts/sPj5pOY61dY?feature=share',
      cueSummary:
        'Machine shoulder press variation to hammer the delts with stability – lock in and drive hard through the handles.',
      mentionedInSections: ['strength-shoulders', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'single_arm_dumbbell_press',
      name: 'Single Arm Dumbbell Press (Standing Overhead)',
      type: 'compound',
      movementPattern: 'overhead_press',
      equipment: ['dumbbell'],
      primaryMuscles: ['front_delts', 'side_delts'],
      secondaryMuscles: ['trapezius', 'rotator_cuff_group'],
      videoUrl: 'https://youtube.com/shorts/jV3UFht-WfI?si=BJXR5nwjikHOTog5',
      cueSummary:
        'Unilateral overhead press to identify and fix strength imbalances; press one dumbbell overhead while bracing hard through the core.',
      mentionedInSections: ['strength-shoulders', 'snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'arnold_press',
      name: 'Arnold Press',
      type: 'compound',
      movementPattern: 'overhead_press',
      equipment: ['dumbbell'],
      primaryMuscles: ['front_delts', 'side_delts'],
      secondaryMuscles: ['trapezius'],
      videoUrl: 'https://www.youtube.com/shorts/QUhUm-TfzGw',
      cueSummary:
        'Start palms facing you, elbows in; rotate and press up so palms face forward at the top to hit all three heads of the delt.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'reverse_grip_barbell_press',
      name: 'Reverse Grip Barbell Press',
      type: 'compound',
      movementPattern: 'overhead_press',
      equipment: ['barbell'],
      primaryMuscles: ['front_delts'],
      secondaryMuscles: ['upper_traps'],
      videoUrl: 'https://youtube.com/shorts/Cjb0oK1lbHA?feature=share',
      cueSummary:
        'Use a supinated grip to bias upper chest and front delts; keep wrists straight and control the bar path.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'modified_bradford_press',
      name: 'Modified Bradford Press',
      type: 'compound',
      movementPattern: 'overhead_press',
      equipment: ['barbell'],
      primaryMuscles: ['front_delts', 'side_delts'],
      secondaryMuscles: ['trapezius'],
      videoUrl: 'https://youtube.com/shorts/dNiKylHg47c?feature=share',
      cueSummary:
        'Press the bar just over the top of the head, moving it from in front to behind the head without fully locking out, keeping constant tension on the delts.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'behind_neck_press',
      name: 'Behind Neck Press',
      type: 'compound',
      movementPattern: 'overhead_press',
      equipment: ['barbell'],
      primaryMuscles: ['side_delts', 'rear_delts'],
      secondaryMuscles: ['trapezius'],
      videoUrl: 'https://youtube.com/shorts/ax2tv9la8MQ?feature=share',
      cueSummary:
        'Carefully lower the bar behind the head with control and press back up, staying in a comfortable, pain‑free range.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },

    // --- Front raise variations ---
    {
      id: 'front_dumbbell_raise_incline',
      name: 'Front Dumbbell Raises (Incline)',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['front_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/DgawquVeFvA?feature=share',
      cueSummary:
        'Lying back on an incline bench, raise dumbbells in front of you with straight arms to bias front delts with stability.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'front_dumbbell_raise_standing',
      name: 'Front Dumbbell Raises (Standing)',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['dumbbell'],
      primaryMuscles: ['front_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/9kq6SZ6jFyc?feature=share',
      cueSummary:
        'Stand tall and raise dumbbells in front of you to about eye level, controlling the negative and not swinging.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'front_dumbbell_raise_seated',
      name: 'Front Dumbbell Raises (Seated)',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['front_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/4nWiV0DqUXM?feature=share',
      cueSummary:
        'Seated to remove leg drive, raise dumbbells straight in front of you with a slight elbow bend and focus on front‑delt tension.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'front_plate_raise',
      name: 'Front Plate Raise',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['plate'],
      primaryMuscles: ['front_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/POnayHGGaiU?feature=share',
      cueSummary:
        'Hold a plate at the bottom, raise it to eye or forehead level, keeping arms slightly bent and core braced.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'front_dumbbell_raises_to_the_sky',
      name: 'Front Dumbbell Raises to the Sky',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['dumbbell'],
      primaryMuscles: ['front_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/3tIt08v5O7U?si=HfR4_aJ3X-CC-njD',
      cueSummary:
        'Long‑range front raise variation driving the bells up and slightly in, focusing on a strong squeeze at the top.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },

    // --- Lateral raise cluster ---
    {
      id: 'lateral_raises',
      name: 'Lateral Raises',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['dumbbell'],
      primaryMuscles: ['side_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/cPt2OMDmwps?feature=share',
      cueSummary:
        'Classic side raise – slight elbow bend, raise dumbbells out to the side no higher than shoulder level, leading with elbows.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'chest_supported_lateral_raises',
      name: 'Chest Supported Lateral Raises',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['side_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/ysoFfDGK_Ks?feature=share',
      cueSummary:
        'Lean chest‑down on an incline bench and perform lateral raises to remove body english and torch side delts.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'behind_ass_lateral_raises',
      name: 'Behind Ass Lateral Raises',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['dumbbell'],
      primaryMuscles: ['side_delts'],
      secondaryMuscles: ['rear_delts'],
      videoUrl: 'https://youtube.com/shorts/Q2M9M4Ya6wg?feature=share',
      cueSummary:
        'Start dumbbells slightly behind the hips and sweep out to the side to bias the mid‑delt through a different angle.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'single_arm_incline_lateral_raise',
      name: 'Single Arm Incline Lateral Raise',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['side_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/7e-h45-uYGM?feature=share',
      cueSummary:
        'Lean on an incline bench and perform single‑arm laterals to focus entirely on one side delt at a time.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },

    // --- Posterior delt / rear cluster unique to shoulders guide ---
    {
      id: 'high_elbow_cable_rows',
      name: 'High Elbow Cable Rows',
      type: 'compound',
      movementPattern: 'row',
      equipment: ['cable'],
      primaryMuscles: ['rear_delts', 'rhomboids'],
      secondaryMuscles: ['middle_traps'],
      videoUrl: 'https://youtube.com/shorts/nlZPbnBAjEA?feature=share',
      cueSummary:
        'Row with elbows high and wide to slam rear delts and upper back; think about driving elbows back, not hands.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'hip_huggers',
      name: 'Hip Huggers',
      type: 'compound',
      movementPattern: 'raise',
      equipment: ['barbell', 'dumbbell'],
      primaryMuscles: ['rear_delts'],
      secondaryMuscles: ['rhomboids'],
      videoUrl: 'https://youtube.com/shorts/GcTF8Dvgcuw?feature=share',
      cueSummary:
        'Drag the weight up along the sides of your body, “hugging” your hips and driving elbows back to light up rear delts.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'behind_ankle_barbell_raise',
      name: 'Behind the Ankle Barbell Raise',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['barbell'],
      primaryMuscles: ['rear_delts'],
      secondaryMuscles: ['trapezius'],
      videoUrl: 'https://youtube.com/shorts/i1uyE4sLRuQ?si=iofn6DLHiH3IRdWy',
      cueSummary:
        'Hold the bar behind your ankles and raise it slightly by squeezing rear delts and upper back – tiny ROM, huge burn.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'behind_arse_bar_raise',
      name: 'Behind the Arse Bar Raise',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['barbell'],
      primaryMuscles: ['rear_delts'],
      secondaryMuscles: ['upper_traps'],
      videoUrl: 'https://youtube.com/shorts/0d3zYwcuXlo?si=bhs3o-2c2S8_MloF',
      cueSummary:
        'Bar held behind the glutes, slight hinge and raise to hit rear delts and upper traps together.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },

    // --- Upright rows + cables (side/rear/traps) ---
    {
      id: 'upright_rows_ez_bar',
      name: 'Upright Rows (Straight Bar / EZ Bar)',
      type: 'compound',
      movementPattern: 'upright_row',
      equipment: ['barbell'],
      primaryMuscles: ['side_delts', 'upper_traps'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/uK8Jq33MyZY?si=2LWIeZpj7UOe2AiT',
      cueSummary:
        'Pull bar up close to the body with elbows traveling high and out, stopping around lower chest height.',
      mentionedInSections: ['injury-resilience-shoulders', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'behind_arse_upright_rows_bar',
      name: 'Behind the Arse Upright Rows (Straight Bar / EZ Bar)',
      type: 'compound',
      movementPattern: 'upright_row',
      equipment: ['barbell'],
      primaryMuscles: ['side_delts', 'upper_traps'],
      secondaryMuscles: ['rear_delts'],
      videoUrl: 'https://youtube.com/shorts/ghzIOkl_11k?si=ghx36tWXZGX5p70z',
      cueSummary:
        'Perform upright rows with the bar behind the body to change the line of pull and hammer side delts and traps.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'front_cable_raises',
      name: 'Front Cable Raises',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['cable'],
      primaryMuscles: ['front_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/3MCe-np6VoM?si=TLilOBPAuMYZXUYK',
      cueSummary:
        'With a cable attachment set low, raise straight in front of you, keeping constant tension on the front delts.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'behind_arse_cable_upright_rows',
      name: 'Behind the Arse Cable Upright Rows (Straight Bar Attachment)',
      type: 'compound',
      movementPattern: 'upright_row',
      equipment: ['cable'],
      primaryMuscles: ['side_delts', 'upper_traps'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/3MCe-np6VoM?si=TLilOBPAuMYZXUYK',
      cueSummary:
        'Cable upright rows performed behind the body, keeping elbows high to light up mid delts and traps with continuous tension.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },

    // --- “21’s” and mid-delt drop-set (intensity methods) ---
    {
      id: 'shoulder_21s',
      name: '21’s (Shoulder)',
      type: 'intensity_technique',
      movementPattern: 'raise',
      equipment: ['dumbbell'],
      primaryMuscles: ['side_delts', 'front_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/YnxTOnuEwUw?feature=share',
      cueSummary:
        'Partial‑range reps broken into segments (bottom/mid/top) to rack up 21 total reps and annihilate the delts.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'mid_delt_drop_set',
      name: 'Mid Delt Drop Set',
      type: 'intensity_technique',
      movementPattern: 'raise',
      equipment: ['dumbbell'],
      primaryMuscles: ['side_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtu.be/mIwEKj10UIg',
      cueSummary:
        'Run successive weight drops on lateral raises with minimal rest to push the mid delts well past failure.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'inverted_raises',
      name: 'Inverted Raises',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['bodyweight'],
      primaryMuscles: ['side_delts', 'rear_delts'],
      secondaryMuscles: ['upper_traps'],
      videoUrl: 'https://youtube.com/shorts/LPIC4MCFJJ4?si=zjKrYVz-m63_OzLV',
      cueSummary:
        'Bodyweight inverted position where you “raise” your body relative to the arms to crush delts and traps.',
      mentionedInSections: ['injury-resilience-shoulders', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'rope_attachment_upright_rows',
      name: 'Rope Attachment Upright Rows',
      type: 'compound',
      movementPattern: 'upright_row',
      equipment: ['cable'],
      primaryMuscles: ['side_delts', 'upper_traps'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/TqpyZEO-V9w?si=T6g-Kk-p3LGh3MEU',
      cueSummary:
        'Use a rope on a cable station, pulling elbows high and out; rope allows wrist freedom and shoulder‑friendly mechanics.',
      mentionedInSections: ['injury-resilience-shoulders', 'bonus-shoulders-exercise-library'],
    },

    // --- Rear delt isolation and compound movements ---
    {
      id: 'reverse_pec_dec_flyes',
      name: 'Reverse Pec Dec Flyes',
      type: 'isolation',
      movementPattern: 'fly',
      equipment: ['machine'],
      primaryMuscles: ['rear_delts'],
      secondaryMuscles: ['middle_traps'],
      videoUrl: 'https://youtube.com/shorts/6vrlwEdrkTA?feature=share',
      cueSummary:
        'Chest on pad, pull handles out and back in a wide arc, owning the squeeze on each rep.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'powell_raises',
      name: 'Powell Raises',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['rear_delts', 'rotator_cuff_group'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/fKt12-9JioA?si=Ol2OsDahz2qFxWEY',
      cueSummary:
        'Side‑lying rear‑delt raise focused on external rotation and posterior shoulder activation.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'triple_rear_delt_delight',
      name: 'Triple Rear Delt Delight',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['cable', 'dumbbell', 'bench'],
      primaryMuscles: ['rear_delts'],
      secondaryMuscles: ['middle_traps'],
      videoUrl: 'https://youtube.com/shorts/1Dacowkc5cM?feature=share',
      cueSummary:
        'Three rear‑delt variations chained together to torch the back of the shoulder.',
      mentionedInSections: ['snipers-shoulder-day', 'bonus-shoulders-exercise-library'],
    },
    {
      id: 'turtle_raises',
      name: 'Turtle Raises',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['cable'],
      primaryMuscles: ['rhomboids'],
      secondaryMuscles: ['lower_traps', 'rear_delts'],
      videoUrl: 'https://youtube.com/shorts/dhrvlvqRbV4?feature=share',
      cueSummary:
        'Think "anti‑slouch": pull shoulders back and down while reaching long through the arms to hammer deep scapular muscles.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'reverse_incline_flyes',
      name: 'Reverse Incline Flyes',
      type: 'isolation',
      movementPattern: 'fly',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['rear_delts', 'middle_traps'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/6vrlwEdrkTA?feature=share',
      cueSummary:
        'Chest on incline bench, sweep arms out in a big arc; squeeze rear delts and mid‑traps at peak.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'face_pulls_back',
      name: 'Face Pulls (Back-Focused)',
      type: 'isolation',
      movementPattern: 'row',
      equipment: ['cable', 'rope_attachment'],
      primaryMuscles: ['rear_delts', 'rhomboids'],
      secondaryMuscles: ['middle_traps', 'lower_traps'],
      videoUrl: 'https://youtube.com/shorts/qXR3IXqvrWw?feature=share',
      cueSummary:
        'Pull rope to forehead/eye level, thumbs back, elbows high and wide – drive from rear delts and upper back, not biceps.',
      mentionedInSections: [
        'snipers-shoulder-day',
        'shoulder-rehab-sequence-shoulders',
        'bonus-shoulders-exercise-library',
      ],
    },

    // --- Rotator cuff and shoulder rehab exercises ---
    {
      id: 'dumbbell_shoulder_external_rotations',
      name: 'Dumbbell Shoulder External Rotations',
      type: 'isolation',
      movementPattern: 'rotation',
      equipment: ['dumbbell'],
      primaryMuscles: ['infraspinatus', 'teres_minor'],
      secondaryMuscles: ['rotator_cuff_group'],
      videoUrl: 'https://youtube.com/shorts/cRHi3xXcfww?si=2zqR5g6PZ6qjy2GW',
      cueSummary:
        'Lying on side or standing, rotate dumbbell away from body with elbow pinned at 90 degrees to strengthen external rotators.',
      mentionedInSections: [
        'shoulder-rehab-sequence-shoulders',
        'bonus-shoulders-exercise-library',
      ],
    },
    {
      id: 'cable_handle_external_rotation',
      name: 'Cable Handle External Rotations',
      type: 'isolation',
      movementPattern: 'rotation',
      equipment: ['cable'],
      primaryMuscles: ['infraspinatus', 'teres_minor'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/QSy3l2Omekw?feature=share',
      cueSummary:
        'Elbow pinned, rotate forearm away from body with cable resistance, slow and controlled.',
      mentionedInSections: [
        'shoulder-rehab-sequence-shoulders',
        'bonus-shoulders-exercise-library',
      ],
    },
    {
      id: 'cable_handle_internal_rotation',
      name: 'Cable Handle Internal Rotations',
      type: 'isolation',
      movementPattern: 'rotation',
      equipment: ['cable'],
      primaryMuscles: ['subscapularis'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/QSy3l2Omekw?feature=share',
      cueSummary:
        'Elbow pinned, rotate forearm toward body to hit internal rotators and front of the cuff.',
      mentionedInSections: [
        'shoulder-rehab-sequence-shoulders',
        'bonus-shoulders-exercise-library',
      ],
    },
    {
      id: 'lu_raises',
      name: 'LU Raises',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['dumbbell'],
      primaryMuscles: ['rotator_cuff_group', 'rear_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/rXVE0rJA-5E?feature=share',
      cueSummary:
        'Rear‑delt/cuff raise variant where you trace a "U" path, keeping tension on the shoulder the entire time.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'shoulder_elixir_potion',
      name: 'Shoulder Elixir Potion',
      type: 'mobility',
      movementPattern: 'sequence',
      equipment: ['dumbbell', 'cable'],
      primaryMuscles: ['rotator_cuff_group', 'rear_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/QSy3l2Omekw?feature=share',
      cueSummary:
        'Rommy\'s shoulder potion – a sequence tying together hangs, rotations and pulls to restore shoulder function.',
      mentionedInSections: [
        'shoulder-rehab-sequence-shoulders',
        'bonus-shoulders-exercise-library',
      ],
    },

    // --- Mobility and hanging work ---
    {
      id: 'dead_hangs',
      name: 'Dead Hangs',
      type: 'isolation',
      movementPattern: 'hang',
      equipment: ['pullup_bar'],
      primaryMuscles: ['latissimus_dorsi'],
      secondaryMuscles: ['rotator_cuff_group', 'upper_traps'],
      videoUrl: 'https://youtube.com/shorts/QSy3l2Omekw?feature=share',
      cueSummary:
        'Hang from a bar for time; relax into the stretch and let the shoulders decompress.',
      mentionedInSections: [
        'mobility-shoulders',
        'shoulder-rehab-sequence-shoulders',
        'bonus-shoulders-exercise-library',
      ],
    },
    {
      id: 'active_hangs',
      name: 'Active Hangs',
      type: 'isolation',
      movementPattern: 'hang',
      equipment: ['pullup_bar'],
      primaryMuscles: ['latissimus_dorsi', 'lower_traps'],
      secondaryMuscles: ['rotator_cuff_group'],
      videoUrl: 'https://youtube.com/shorts/QSy3l2Omekw?feature=share',
      cueSummary:
        'Same hang but actively pull shoulder blades down and in; hold with control to build scapular stability.',
      mentionedInSections: [
        'mobility-shoulders',
        'shoulder-rehab-sequence-shoulders',
        'bonus-shoulders-exercise-library',
      ],
    },
    {
      id: 'handstand_holds',
      name: 'Handstand Holds',
      type: 'isolation',
      movementPattern: 'hold',
      equipment: ['bodyweight', 'wall'],
      primaryMuscles: ['trapezius', 'rotator_cuff_group'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/fWg0cMDTpyY?feature=share',
      cueSummary:
        'Supported or freestanding handstand holds to load shoulders in a stacked overhead position.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'handstand_push_ups',
      name: 'Handstand Push-Ups',
      type: 'compound',
      movementPattern: 'overhead_press',
      equipment: ['bodyweight', 'wall'],
      primaryMuscles: ['front_delts', 'side_delts'],
      secondaryMuscles: ['trapezius', 'rotator_cuff_group'],
      videoUrl: 'https://youtube.com/shorts/xjjuSHZHhQg?feature=share',
      cueSummary:
        'Advanced bodyweight shoulder press – kick up into handstand and perform push-ups for serious overhead strength.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
    },
    {
      id: 'double_trouble',
      name: 'Double Trouble',
      type: 'intensity_technique',
      movementPattern: 'raise',
      equipment: ['dumbbell'],
      primaryMuscles: ['side_delts', 'front_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/2lCF--L4XLM?si=H3T6l-2oqPsvzePB',
      cueSummary:
        'Brutal shoulder finisher combining two delt-destroying movements back-to-back to push past failure.',
      mentionedInSections: ['bonus-shoulders-exercise-library'],
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

    // Section ↔ Exercise links (where it's mentioned)
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

  //-----------------------------
  // 4) FORMULAS – SHOULDERS
  //-----------------------------

  const formulas = [
    {
      id: 'shoulder_strength_standard',
      name: 'Overhead Press Strength Drop‑Set Standard',
      description:
        'Pick ONE heavy overhead press and run a 3–4RM followed by two ~20% drops where you set rep PRs. Core benchmark for shoulder strength phases.',
      pattern: 'drop_set',
      targetMuscles: ['front_delts', 'side_delts', 'rotator_cuff_group'],
      steps: [
        {
          order: 1,
          exerciseId: 'standing_barbell_press',
          role: 'primary',
          notes:
            'Set 1: Work up to a true 3–4 rep max (heavy but technically clean).',
        },
        {
          order: 2,
          exerciseId: 'standing_barbell_press',
          role: 'primary',
          notes:
            'Set 2: Drop the load ~20%, hit as many clean reps as possible, set a rep PR.',
        },
        {
          order: 3,
          exerciseId: 'standing_barbell_press',
          role: 'primary',
          notes:
            'Set 3: Drop another ~20%, again go for a rep PR. Track these over time.',
        },
      ],
    },
    {
      id: 'posterior_delt_superset',
      name: 'Posterior Deltoid SuperSet',
      description:
        'Rear‑delt focused superset: one heavy rear‑delt compound row plus a second rear‑delt isolation to failure.',
      pattern: 'superset',
      targetMuscles: ['rear_delts', 'rhomboids', 'trapezius'],
      steps: [
        {
          order: 1,
          exerciseId: 'high_elbow_cable_rows',
          role: 'primary',
          notes:
            '2–3 sets x 8–12 reps – high‑elbow rows to load rear delts and upper back.',
        },
        {
          order: 2,
          exerciseId: 'behind_ankle_barbell_raise',
          role: 'secondary',
          notes:
            'Immediately into 12–20 reps for a deep rear‑delt burn. Use strict form, tiny ROM, and constant tension.',
        },
      ],
    },
    {
      id: 'lateral_delt_superset',
      name: 'Lateral Delt SuperSet',
      description:
        'Shoulder compound press paired with brutal lateral raise isolation to blow up the mid‑delts.',
      pattern: 'superset',
      targetMuscles: ['side_delts', 'front_delts'],
      steps: [
        {
          order: 1,
          exerciseId: 'modified_bradford_press',
          role: 'primary',
          notes:
            '2–3 sets x 6–10 reps – short ROM, constant tension pressing to load front and side delts.',
        },
        {
          order: 2,
          exerciseId: 'chest_supported_lateral_raises',
          role: 'secondary',
          notes:
            'Immediately into 10–15 reps, slow negative, slight pause at top. Push near or to muscular failure.',
        },
      ],
    },
    {
      id: 'rotator_cuff_tri_set',
      name: 'Rotator Cuff Tri‑Set',
      description:
        'Three‑exercise tri‑set using external rotations, internal rotations and rear‑delt/cuff raises to build a bulletproof cuff.',
      pattern: 'tri_set',
      targetMuscles: ['rotator_cuff_group', 'rear_delts'],
      steps: [
        {
          order: 1,
          exerciseId: 'dumbbell_shoulder_external_rotations',
          role: 'primary',
          notes:
            '2–3 sets x 12–20 reps per side, strict form and smooth rotation.',
        },
        {
          order: 2,
          exerciseId: 'cable_handle_external_rotation',
          role: 'secondary',
          notes:
            '2–3 sets x 12–20 reps per side, stepping out just enough to keep constant tension.',
        },
        {
          order: 3,
          exerciseId: 'cable_handle_internal_rotation',
          role: 'secondary',
          notes:
            '2–3 sets x 12–20 reps per side to hit the internal rotators and balance the cuff.',
        },
      ],
    },
  ];

  for (const formula of formulas) {
    await prisma.formula.upsert({
      where: { id: formula.id },
      update: {
        name: formula.name,
        description: formula.description,
        pattern: formula.pattern,
      },
      create: {
        id: formula.id,
        name: formula.name,
        description: formula.description,
        pattern: formula.pattern,
      },
    });

    // clear & recreate steps each run to avoid duplicates
    await prisma.formulaStep.deleteMany({ where: { formulaId: formula.id } });

    for (const step of formula.steps) {
      await prisma.formulaStep.create({
        data: {
          formulaId: formula.id,
          order: step.order,
          exerciseId: step.exerciseId,
          role: step.role,
          notes: step.notes,
        },
      });
    }

    // formula targets
    for (const muscle of formula.targetMuscles) {
      await prisma.formulaTarget.upsert({
        where: {
          formulaId_anatomyNodeId: {
            formulaId: formula.id,
            anatomyNodeId: muscle,
          },
        },
        update: {},
        create: {
          formulaId: formula.id,
          anatomyNodeId: muscle,
        },
      });
    }
  }

  //-----------------------------
  // 5) SNIPER’S SHOULDER DAY WORKOUT
  //-----------------------------

  await prisma.workout.upsert({
    where: { id: 'snipers_shoulder_day' },
    update: {},
    create: {
      id: 'snipers_shoulder_day',
      slug: 'snipers-shoulder-day',
      name: 'THE SNIPER’S SHOULDER DAY (THE SHOULDER DAY FORMULA)',
      goal:
        '3D shoulder hypertrophy and pressing strength while building a resilient cuff and upper‑back support system.',
      priorityRules:
        'The weakness you want to fix (pressing strength, rear delts, side delts or shoulder pain) determines which block gets your freshest effort.',
      primaryRegionId: 'shoulders',
    },
  });

  const workoutBlocks = [
    // 1. Strength – heavy overhead press
    {
      id: 'shoulders-strength-block',
      workoutId: 'snipers_shoulder_day',
      label: '1. Strength – NUMBER 1 Shoulder Movement (Pick 1)',
      schemeStyle: 'drop_set',
      schemeDesc: `Set 1: 3–4 Rep Max
Set 2: Drop ~20% & set REP PR
Set 3: Drop another ~20% & set REP PR
Use one heavy overhead press as your benchmark strength lift.`,
      notes:
        'Pick ONE overhead press and ride it for a mesocycle. Focus on clean, explosive reps and logbook progression.',
      targetMuscles: ['front_delts', 'side_delts', 'rotator_cuff_group'],
      exerciseOptions: [
        'standing_barbell_press',
        'single_arm_dumbbell_press',
        'seated_dumbbell_press',
        'seated_barbell_press',
        'hammer_strength_shoulder_press',
      ],
    },
    // 2. Posterior delt superset
    {
      id: 'shoulders-posterior-delt-superset-block',
      workoutId: 'snipers_shoulder_day',
      label: '2. Posterior Deltoid SuperSet',
      schemeStyle: 'superset',
      schemeDesc:
        '2–3 sets. Heavy rear‑delt row immediately into a smaller rear‑delt isolation. Aim for AMRAP within a hard but controlled rep range.',
      notes:
        'Use this to finally treat rear delts like the main event instead of a throw‑away finisher.',
      targetMuscles: ['rear_delts', 'rhomboids', 'trapezius'],
      exerciseOptions: [
        'high_elbow_cable_rows',
        'reverse_pec_dec_flyes',
        'hip_huggers',
        'behind_ankle_barbell_raise',
        'behind_arse_bar_raise',
        'powell_raises',
        'triple_rear_delt_delight',
      ],
    },
    // 3. Lateral delt superset
    {
      id: 'shoulders-lateral-delt-superset-block',
      workoutId: 'snipers_shoulder_day',
      label: '3. Lateral Delt SuperSet',
      schemeStyle: 'superset',
      schemeDesc:
        '2–3 sets. Compound shoulder movement (6–10 reps) into lateral raise isolation (7–12+ reps).',
      notes:
        'Pick one press/compound and one lateral variant. Push both near failure to inflate the mid delts.',
      targetMuscles: ['side_delts', 'front_delts'],
      exerciseOptions: [
        'modified_bradford_press',
        'seated_dumbbell_press',
        'behind_neck_press',
        'lateral_raises',
        'behind_ass_lateral_raises',
        'single_arm_incline_lateral_raise',
        'chest_supported_lateral_raises',
      ],
    },
    // 4. Front delt / trap finisher
    {
      id: 'shoulders-front-trap-finisher-block',
      workoutId: 'snipers_shoulder_day',
      label: '4. Front Delt & Trap Finisher',
      schemeStyle: 'giant_set',
      schemeDesc:
        '1–3 rounds of 2–4 movements chained together (front raises, upright rows, intensity techniques).',
      notes:
        'Use 21’s, mid‑delt drop sets, front raises and upright row variants here. This is where you empty the tank without wrecking your joints.',
      targetMuscles: ['front_delts', 'side_delts', 'trapezius'],
      exerciseOptions: [
        'front_dumbbell_raises_to_the_sky',
        'front_dumbbell_raise_standing',
        'front_plate_raise',
        'upright_rows_ez_bar',
        'behind_arse_upright_rows_bar',
        'inverted_raises',
        'rope_attachment_upright_rows',
        'shoulder_21s',
        'mid_delt_drop_set',
      ],
    },
    // 5. Optional rehab / cuff block
    {
      id: 'shoulder-rehab-block-shoulders',
      workoutId: 'snipers_shoulder_day',
      label: '5. OPTIONAL – Shoulder Elixir / Rehab Block',
      schemeStyle: 'circuit',
      schemeDesc:
        '2–3 circuits of cuff and mobility work using hangs, rotations and face pulls.',
      notes:
        'Run this if your shoulders are cranky, or as prehab during heavy pressing cycles.',
      targetMuscles: ['rotator_cuff_group', 'rear_delts', 'trapezius'],
      exerciseOptions: [
        'dead_hangs',
        'active_hangs',
        'shoulder_elixir_potion',
        'dumbbell_shoulder_external_rotations',
        'cable_handle_external_rotation',
        'cable_handle_internal_rotation',
        'face_pulls_back',
      ],
    },
  ];

  for (const block of workoutBlocks) {
    await prisma.workoutBlock.upsert({
      where: { id: block.id },
      update: {
        workoutId: block.workoutId,
        label: block.label,
        schemeStyle: block.schemeStyle,
        schemeDesc: block.schemeDesc,
        notes: block.notes,
      },
      create: {
        id: block.id,
        workoutId: block.workoutId,
        label: block.label,
        schemeStyle: block.schemeStyle,
        schemeDesc: block.schemeDesc,
        notes: block.notes,
      },
    });

    for (const muscle of block.targetMuscles) {
      await prisma.workoutBlockTarget.upsert({
        where: {
          blockId_anatomyNodeId: {
            blockId: block.id,
            anatomyNodeId: muscle,
          },
        },
        update: {},
        create: {
          blockId: block.id,
          anatomyNodeId: muscle,
        },
      });
    }

    for (const exerciseId of block.exerciseOptions) {
      await prisma.workoutBlockExercise.upsert({
        where: {
          blockId_exerciseId: {
            blockId: block.id,
            exerciseId,
          },
        },
        update: {},
        create: {
          blockId: block.id,
          exerciseId,
          kind: 'option',
        },
      });
    }
  }

  console.log(
    '✅ Shoulders guide, anatomy, exercises, formulas, and Sniper’s Shoulder Day seeded.',
  );
}

seedShoulders()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
