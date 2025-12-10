// prisma/seed-back.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBack() {
  // -----------------------------
  // 1) ANATOMY GRAPH – BACK
  // -----------------------------

  const anatomyNodes = [
    // Regions
    {
      id: 'back',
      kind: 'region',
      name: 'Back',
      slug: 'back',
      description:
        'Upper and mid‑back region including lats, traps, rhomboids, rotator cuff, and erector spinae.',
      roleSummary:
        'Posture, scapular control and pulling strength that gives you the King Kong, armor‑plated back.',
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
      description: 'Deltoid region (anterior, medial, posterior) plus deep rotator cuff.',
      roleSummary:
        'Overhead strength, shoulder stability and the capped shoulder look from every angle.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: null,
    },

    // Groups under back
    {
      id: 'traps_group',
      kind: 'group',
      name: 'Trapezius Group',
      slug: 'traps-group',
      description:
        'Upper, middle and lower fibers of the trapezius that tie the neck, shoulders and mid‑back together.',
      roleSummary:
        'Anchors the shoulder blades, supports posture and lets you brace hard for heavy pressing and pulling.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: 'back',
    },
    {
      id: 'lats_group',
      kind: 'group',
      name: 'Lats & Lat Complex',
      slug: 'lats-group',
      description:
        'Latissimus dorsi plus teres major/minor that create the “wings” and drive big pulling strength.',
      roleSummary:
        'Shoulder extension, adduction and internal rotation that power pull‑ups, rows and heavy carries.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: 'back',
    },
    {
      id: 'rhomboid_group',
      kind: 'group',
      name: 'Rhomboid Complex',
      slug: 'rhomboid-group',
      description:
        'Rhomboid major and minor sitting between the shoulder blades, responsible for retraction and scapular stability.',
      roleSummary:
        'Keeps your shoulders from collapsing forward and locks the scapula in place for strong pressing and rowing.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: 'back',
    },
    {
      id: 'erector_spinae_group',
      kind: 'group',
      name: 'Erector Spinae',
      slug: 'erector-spinae-group',
      description:
        'Vertical column of muscles running up the spine from the low back through the thoracic region.',
      roleSummary:
        'Maintains spinal extension, stiffness and resilience under heavy loads so your back doesn’t fold like a lawn chair.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: 'back',
    },
    {
      id: 'rotator_cuff_group',
      kind: 'group',
      name: 'Rotator Cuff',
      slug: 'rotator-cuff',
      description:
        'Deep four‑muscle cuff around the shoulder joint (supraspinatus, infraspinatus, teres minor, subscapularis).',
      roleSummary:
        'Centers the humeral head in the socket during pressing, pulling and overhead work so the shoulder doesn’t get chewed up.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: 'shoulders',
    },

    // --- Trapezius & parts ---
    {
      id: 'trapezius',
      kind: 'muscle',
      name: 'Trapezius (Traps)',
      slug: 'trapezius',
      description:
        'Large kite‑shaped muscle running from the base of the skull down through the mid‑back with upper, middle and lower fibers.',
      roleSummary:
        'Connects neck, shoulders and upper back; anchors the shoulder blades and keeps posture from collapsing.',
      primaryFunctions: JSON.stringify([
        'scapular elevation (upper fibers)',
        'scapular retraction (middle fibers)',
        'scapular depression and upward rotation (lower fibers)',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds thick “armor” to the upper back and neck.',
        'Makes the torso look powerful and three‑dimensional from every angle.',
      ]),
      meta: null,
      parentId: 'traps_group',
    },
    {
      id: 'upper_traps',
      kind: 'part',
      name: 'Upper Traps',
      slug: 'upper-traps',
      description:
        'Upper fibers of the trapezius that run from the neck to the shoulders.',
      roleSummary:
        'Supports the neck and helps elevate the shoulders, but should not be over‑abused without balancing the mid/lower traps.',
      primaryFunctions: JSON.stringify([
        'scapular elevation',
        'assists neck support in loaded positions',
      ]),
      aestheticNotes: JSON.stringify([
        'Gives that thick neck/upper‑back look when balanced with mid and lower traps.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['farmer_carries_shrugs'],
        secondaryExerciseIds: [
          'dead_hangs',
          'active_hangs',
        ],
        formulaIds: [],
      }),
      parentId: 'trapezius',
    },
    {
      id: 'middle_traps',
      kind: 'part',
      name: 'Middle Traps',
      slug: 'middle-traps',
      description:
        'Middle fibers of the trapezius spanning across the shoulder blades.',
      roleSummary:
        'Pulls the shoulder blades back and helps you extend the arms behind the body.',
      primaryFunctions: JSON.stringify([
        'scapular retraction',
        'assists shoulder extension behind the torso',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds width and density across the mid‑back, contributing to an “armor plate” look.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['standing_reverse_incline_flyes', 'chest_supported_shrugs'],
        secondaryExerciseIds: ['seated_reverse_incline_flyes', 'y_raises', 'face_pulls_back'],
        formulaIds: [],
      }),
      parentId: 'trapezius',
    },
    {
      id: 'lower_traps',
      kind: 'part',
      name: 'Lower Traps',
      slug: 'lower-traps',
      description:
        'Lower fibers of the trapezius running down the mid‑back.',
      roleSummary:
        'Pulls the shoulder blades down and back and helps “sink” them when you raise your arms overhead.',
      primaryFunctions: JSON.stringify([
        'scapular depression',
        'scapular retraction',
        'assists overhead stability by anchoring the scapula',
      ]),
      aestheticNotes: JSON.stringify([
        'Creates that deep groove and athletic trench through the mid‑back.',
        'Helps the shoulders sit low and powerful instead of shrugged and jammed.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['supermans', 'y_raises'],
        secondaryExerciseIds: ['face_pulls_back', 'turtle_raises'],
        formulaIds: [],
      }),
      parentId: 'trapezius',
    },

    // --- Rear delts / posterior shoulder ---
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
        'Finishes the capped‑shoulder look from the side.',
        'Helps your shoulders look round and 3D from the back.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'face_pulls_back',
          'reverse_incline_flyes',
          'reverse_pec_dec_flyes',
          'powell_raises',
        ],
        secondaryExerciseIds: ['y_raises', 'turtle_raises'],
        formulaIds: [],
      }),
      parentId: 'shoulders',
    },

    // --- Rhomboids ---
    {
      id: 'rhomboids',
      kind: 'muscle',
      name: 'Rhomboids (Major & Minor)',
      slug: 'rhomboids',
      description:
        'Deep upper‑back muscles that retract and stabilize the shoulder blades.',
      roleSummary:
        'Keeps your shoulders aligned, fights slouching / nerd neck and locks the scapula in for strong pressing and rowing.',
      primaryFunctions: JSON.stringify([
        'scapular retraction',
        'scapular stabilization',
        'assists shoulder rotation to maintain alignment',
      ]),
      aestheticNotes: JSON.stringify([
        'Prevents the rounded‑shoulder look.',
        'Gives the upper back a tight, athletic appearance between the shoulder blades.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['t_bar_rows', 'turtle_raises', 'chest_supported_rows'],
        secondaryExerciseIds: [
          'face_pulls_back',
          'standing_reverse_incline_flyes',
          'seated_reverse_incline_flyes',
        ],
        formulaIds: [],
      }),
      parentId: 'rhomboid_group',
    },

    // --- Erector Spinae ---
    {
      id: 'erector_spinae',
      kind: 'muscle',
      name: 'Erector Spinae (Spinal Erectors)',
      slug: 'erector-spinae',
      description:
        'Long column of muscles running along the spine from the low back up through the thoracic region.',
      roleSummary:
        'Maintains spinal extension and stiffness under load, keeps you from folding forward during hinges and heavy pulls.',
      primaryFunctions: JSON.stringify([
        'spinal extension',
        'spinal stabilization under load',
        'assists hip hinge pattern with the glutes and hamstrings',
      ]),
      aestheticNotes: JSON.stringify([
        'Gives the thick “railroad track” lines up the spine.',
        'Makes your back look powerful and bulletproof from behind.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: [
          'deadlifts',
          'rack_pulls',
          'seated_barbell_good_mornings',
          'barbell_good_mornings',
          'cable_good_mornings',
          'hyperextension_rows',
          'reverse_hyperextensions',
          'supermans',
        ],
        secondaryExerciseIds: ['dumbbell_deadlifts', 'good_mornings', 'hip_thrusts'],
        formulaIds: [],
      }),
      parentId: 'erector_spinae_group',
    },

    // --- Lats / teres ---
    {
      id: 'latissimus_dorsi',
      kind: 'muscle',
      name: 'Latissimus Dorsi (Lats)',
      slug: 'latissimus-dorsi',
      description:
        'Big “wing” muscles on the sides of the back that attach from the upper arm down to the low back and pelvis.',
      roleSummary:
        'Main driver of shoulder extension and adduction; the muscle that makes you look wide and lets you pull heavy.',
      primaryFunctions: JSON.stringify([
        'shoulder extension',
        'shoulder adduction',
        'shoulder internal rotation',
      ]),
      aestheticNotes: JSON.stringify([
        'Creates the wide “V‑taper” from shoulders to waist.',
        'Makes the torso look massive from the back and side.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['weighted_pull_ups', 'close_grip_pull_ups', 'lat_pull_ins', 'lat_pulldowns'],
        secondaryExerciseIds: [
          'regular_pull_ups',
          'wide_grip_pull_ups',
          'wide_neutral_grip_pull_ups',
          'neutral_grip_pulldown',
          'supinated_barbell_rows',
          'supinated_dumbbell_rows',
        ],
        formulaIds: [],
      }),
      parentId: 'lats_group',
    },
    {
      id: 'teres_major',
      kind: 'muscle',
      name: 'Teres Major',
      slug: 'teres-major',
      description:
        'Thick little muscle under the rear delt that works with the lats to pull the humerus down and back.',
      roleSummary:
        'Acts like a “mini lat” to help drive shoulder extension and adduction, especially in pull‑ups and rows.',
      primaryFunctions: JSON.stringify([
        'assists shoulder extension',
        'assists shoulder adduction',
        'assists internal rotation',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds thickness to the armpit/upper‑back junction.',
        'Helps fill out the back “shelf” under the rear delt.',
      ]),
      meta: JSON.stringify({
        primaryExerciseIds: ['weighted_pull_ups', 'supinated_barbell_rows', 'supinated_dumbbell_rows'],
        secondaryExerciseIds: ['lat_pulldowns', 'lat_pull_ins'],
        formulaIds: [],
      }),
      parentId: 'lats_group',
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
        primaryExerciseIds: ['regular_lat_pulldowns', 'dumbbell_shoulder_external_rotations'],
        secondaryExerciseIds: ['face_pulls_back', 'lu_raises'],
        formulaIds: [],
      }),
      parentId: 'rotator_cuff_group',
    },

    // --- Rotator cuff muscles ---
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
        secondaryExerciseIds: ['face_pulls_back', 'dead_hangs', 'active_hangs'],
        formulaIds: [],
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
        primaryExerciseIds: ['dumbbell_shoulder_external_rotations', 'cable_handle_external_rotation'],
        secondaryExerciseIds: ['face_pulls_back', 'lu_raises'],
        formulaIds: [],
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
        formulaIds: [],
      }),
      parentId: 'rotator_cuff_group',
    },

    // --- Utility / “support” nodes for rehab & mobility ---
    {
      id: 'scapular_control_complex',
      kind: 'group',
      name: 'Scapular Control Complex',
      slug: 'scapular-control',
      description:
        'Functional grouping of traps, rhomboids, rear delts, and rotator cuff that controls scapular motion.',
      roleSummary:
        'Keeps shoulder blades moving on good rails so the arms can press, pull and reach overhead safely.',
      primaryFunctions: JSON.stringify([
        'co‑ordinated scapular upward/downward rotation',
        'scapular retraction/depression',
        'dynamic shoulder stability',
      ]),
      aestheticNotes: JSON.stringify([
        'Creates the crisp, athletic lines of an upper back that doesn’t slump.',
      ]),
      meta: null,
      parentId: 'back',
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
  // 2) GUIDE: BACK
  // -----------------------------

  await prisma.guide.upsert({
    where: { id: 'back' },
    update: {},
    create: {
      id: 'back',
      slug: 'king-kong-back',
      title: 'KING KONG BACK (Back Guide)',
      author: 'Uncle Rommy',
      primaryRegionId: 'back',
    },
  });

  const sections = [
    {
      id: 'intro-back-king-kong',
      guideId: 'back',
      kind: 'intro',
      title: 'Why a KING KONG Back Changes Everything',
      order: 1,
      content:
        'Intro pages of the back guide. Rommy lays out why a thick, King Kong back is non‑negotiable: posture, presence, and strength. ' +
        'He talks about how a powerful back keeps shoulders safe, lets you press and pull big weights, and makes the whole frame look undeniable. ' +
        'These pages set the tone that this guide is about building an unbreakable, armor‑plated back – not just random rows.',
    },
    {
      id: 'mindset-back-natural-crusader',
      guideId: 'back',
      kind: 'mindset',
      title: 'The Undeniable Standard – Back Edition',
      order: 2,
      content:
        'This is the Natural Crusader mindset applied to back training. The pages go through Rommy’s “Undeniable” standard: ' +
        'showing up daily, refusing victim mentality about genetics, and understanding that a King Kong back is earned, not given. ' +
        'It ties the back work to being unshakeable in life – your upper back literally carries your standards. ' +
        'No new anatomy here, just ethos and rules of how you attack this program.',
    },
    {
      id: 'anatomy-overview-back',
      guideId: 'back',
      kind: 'anatomy',
      title: 'Back Anatomy Overview – What Actually Matters',
      order: 3,
      content:
        'Rommy breaks the back down into real, trainable chunks: Trapezius (upper/middle/lower), Posterior Deltoid, Teres Major, ' +
        'Teres Minor (plus the rest of the rotator cuff), Rhomboids, Erector Spinae, and Latissimus Dorsi. ' +
        'This section explains why simply “doing rows” is not enough – you must understand which parts control scapular position, which drive pulling power, ' +
        'and which keep the neck/shoulder joint healthy. It also frames lower traps, rhomboids and rotator cuff as the unsung heroes behind pain‑free pressing and pulling.',
    },
    {
      id: 'anatomy-traps',
      guideId: 'back',
      kind: 'anatomy',
      title: 'Traps – Upper, Middle & Lower',
      order: 4,
      content:
        'Here Rommy splits the Trapezius into upper, middle and lower traps. Upper traps are framed as “neck support” – important but easy to overdo. ' +
        'Middle traps are about pulling the shoulder blades back and keeping them tight during rows and presses. Lower traps are about pulling the blades down and back, ' +
        'especially important for overhead work and avoiding shoulder impingement. He emphasizes that most lifters overcook upper traps (shrugging everything) while ' +
        'completely neglecting the mid/lower fibers that actually bulletproof the neck and shoulders.',
    },
    {
      id: 'anatomy-posterior-delt-teres',
      guideId: 'back',
      kind: 'anatomy',
      title: 'Posterior Delts & Teres Major/Minor',
      order: 5,
      content:
        'This chunk covers the back side of the shoulder. Posterior delts round out the shoulder cap and balance all the pressing/front‑delt work. ' +
        'Teres Major is explained as the “mini lat” that adds thickness under the rear delt and helps with heavy pull‑ups/rows. ' +
        'Teres Minor is introduced as part of the rotator cuff – small but huge for externally rotating the shoulder and keeping the humeral head tracking properly. ' +
        'Rommy stresses that if you ignore this little complex, your pressing and pulling will eventually run into pain.',
    },
    {
      id: 'anatomy-rotator-cuff',
      guideId: 'back',
      kind: 'anatomy',
      title: 'Rotator Cuff – The Secret Shoulder Insurance',
      order: 6,
      content:
        'Infraspinatus, Supraspinatus, Teres Minor and Subscapularis get their shine here. The guide explains how they “suck” the humeral head into the socket ' +
        'and keep it from drifting forward or upward when you press and pull. Rommy lays out that a shredded looking back means nothing if the rotator cuff is weak and angry – ' +
        'this is where longevity comes from. He also introduces his “3 Exercises for Complete Rotator Cuff Work”: Face Pulls (Back‑focused), Dumbbell Shoulder External Rotations and LU Raises.',
    },
    {
      id: 'anatomy-rhomboids-erectors-lats',
      guideId: 'back',
      kind: 'anatomy',
      title: 'Rhomboids, Erector Spinae & Lats',
      order: 7,
      content:
        'Rhomboids are described as the muscles that keep your shoulder blades from drifting away from the spine – they fight slouching and nerd neck. ' +
        'Erector Spinae is painted as the spinal armor that keeps you upright in deadlifts, rows and everyday life. Latissimus Dorsi is the “King Kong” wing muscle: ' +
        'responsible for width, for pulling the bar down/to you in pull‑ups and rows, and for making T‑shirts fit like armor. ' +
        'Here Rommy also shows specific exercise examples for each: T‑Bar Rows and Turtle Raises for rhomboids, deadlift/good‑morning variants and hyperextension rows for erectors, ' +
        'and pull‑up/pulldown variants plus Lat Pull‑Ins for the lats.',
    },
    {
      id: 'strength-back',
      guideId: 'back',
      kind: 'strength',
      title: 'Strength – How We Load the Back',
      order: 8,
      content:
        'The Strength section explains why you need one brutally heavy back movement as the NUMBER 1 strength driver: weighted pull‑ups or heavy pulldowns. ' +
        'It defines how to use rep‑max drop sets and focused low‑rep work to build King Kong pulling numbers. ' +
        'He explains overlapping stimulation between lats, rhomboids and erectors, and how we organize the session so that the biggest neural work comes first.',
    },
    {
      id: 'muscle-growth-back',
      guideId: 'back',
      kind: 'program',
      title: 'Muscle Growth – Row & Pull Like a Madman (Smartly)',
      order: 9,
      content:
        'This section leans into hypertrophy: using higher‑rep rows, pulldowns and back extensions to pack meat onto the whole posterior chain. ' +
        'Rommy talks about rowing angles (elbows tucked vs flared) to bias lats vs upper back, how to use chest‑supported rows for cleaner hypertrophy sets, ' +
        'and why you shouldn’t ego‑row with half reps. It sets up the logic for the Back (Lat) SuperSet and Upper Back SuperSet later in the Sniper’s Back Day.',
    },
    {
      id: 'mobility-back',
      guideId: 'back',
      kind: 'mobility',
      title: 'Mobility – Unlocking the Back & Shoulders',
      order: 10,
      content:
        'Mobility pages cover Dead Hangs, Active Hangs, Wall Drags, PVC pipe drills, “Full Body Mobility Movement” and overhead position holds (barbell press holds, overhead squat/snatch holds). ' +
        'The goal is freeing up shoulder flexion and thoracic extension so the lats, traps and rotator cuff can actually do their job without impingement. ' +
        'Rommy frames mobility as performance‑focused – not yoga fluff – that lets you train heavier and recover better.',
    },
    {
      id: 'injury-resilience-back',
      guideId: 'back',
      kind: 'anatomy',
      title: 'Building Injury Resilience – Neck, Traps & Upper Back',
      order: 11,
      content:
        'This section ties together upper traps, middle/lower traps, rhomboids, rear delts and rotator cuff into a single “resilience system” around the neck and shoulders. ' +
        'He shows how Farmer Carries + Shrugs, chest‑supported shrugs, high‑elbow rows, neck bridges, back bridges, Supermans and various good‑morning variations ' +
        'all contribute to a back that can take abuse without crumbling. The philosophy: the stronger your upper‑back scaffolding, the safer and more dominant all your pressing and pulling becomes.',
    },
    {
      id: 'snipers-back-day',
      guideId: 'back',
      kind: 'program',
      title: 'THE SNIPER’S BACK DAY (THE BACK DAY FORMULA)',
      order: 12,
      content:
        'This is the actionable program. Rommy lays out the Back Day Formula in numbered blocks:\n' +
        '1. Strength – heavy weighted pull‑ups or pulldowns with a 3–4 rep‑max drop‑set scheme.\n' +
        '2. Horizontal Pulling Back SuperSet – compound row + another heavy back movement.\n' +
        '3. Back (Lat) SuperSet – compound vertical pull + lat‑focused isolation.\n' +
        '4. Upper Back SuperSet – rear‑delt and mid/lower‑trap emphasis.\n' +
        '5. Lower Back / Erector Spinae Exercise – hinges and back extensions.\n' +
        '6. Injury Resilience – upper back / neck / trap work.\n' +
        '7. Mobility – back and shoulder mobility sequence.\n' +
        '8. Shoulder Rehab Sequence – Dead Hangs, Shoulder Elixir, Face Pulls, external/internal rotation work.',
    },
    {
      id: 'shoulder-rehab-sequence',
      guideId: 'back',
      kind: 'mobility',
      title: 'Shoulder Rehab Sequence – Fixing the Angry Shoulder',
      order: 13,
      content:
        'Full sequence Rommy used to rehab his own shoulder and restore overhead strength. The sequence: Dead Hangs, Shoulder Elixir Potion, Face Pulls (Back‑focused), ' +
        'Cable Handle External Rotations, Cable Handle Internal Rotations. He gives set/rep prescriptions and explains how this is not just rehab but “prehab” to keep shoulders bulletproof.',
    },
    {
      id: 'back-shoulder-rehab-exercise-bank',
      guideId: 'back',
      kind: 'program',
      title: 'Back & Shoulder Rehab Exercise Bank',
      order: 14,
      content:
        'A dedicated bank of shoulder and back rehab tools with video links: Handstand Holds, Powell Raises, Overhead Barbell Press Holds, Overhead Squat Snatch Holds, ' +
        'Dumbbell Shoulder External Rotations, Seated Dumbbell Good Mornings, Barbell/EZ‑Bar Pullovers, Cable Good Mornings, Ring Around the Rommy’s, Active Hangs and more. ' +
        'This section acts as a menu to plug in support work when specific weak links show up.',
    },
    {
      id: 'bonus-back-exercise-library',
      guideId: 'back',
      kind: 'program',
      title: 'BONUS – Back Exercise Library',
      order: 15,
      content:
        'A full clickable library of back movements: all the pull‑up/pulldown variations, horizontal rows, high‑elbow rows, shrugs, hyperextension rows, reverse hypers, good‑morning variants, ' +
        'neck/back bridges, and the mobility/rehab drills. Use this as a rotation bank when you swap exercises without changing the intent of each program block.',
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
    // Overviews
    { sectionId: 'anatomy-overview-back', anatomyNodeId: 'trapezius' },
    { sectionId: 'anatomy-overview-back', anatomyNodeId: 'rear_delts' },
    { sectionId: 'anatomy-overview-back', anatomyNodeId: 'teres_major' },
    { sectionId: 'anatomy-overview-back', anatomyNodeId: 'teres_minor' },
    { sectionId: 'anatomy-overview-back', anatomyNodeId: 'rhomboids' },
    { sectionId: 'anatomy-overview-back', anatomyNodeId: 'erector_spinae' },
    { sectionId: 'anatomy-overview-back', anatomyNodeId: 'latissimus_dorsi' },
    { sectionId: 'anatomy-overview-back', anatomyNodeId: 'rotator_cuff_group' },

    // Specific anatomy sections
    { sectionId: 'anatomy-traps', anatomyNodeId: 'trapezius' },
    { sectionId: 'anatomy-traps', anatomyNodeId: 'upper_traps' },
    { sectionId: 'anatomy-traps', anatomyNodeId: 'middle_traps' },
    { sectionId: 'anatomy-traps', anatomyNodeId: 'lower_traps' },

    { sectionId: 'anatomy-posterior-delt-teres', anatomyNodeId: 'rear_delts' },
    { sectionId: 'anatomy-posterior-delt-teres', anatomyNodeId: 'teres_major' },
    { sectionId: 'anatomy-posterior-delt-teres', anatomyNodeId: 'teres_minor' },

    { sectionId: 'anatomy-rotator-cuff', anatomyNodeId: 'rotator_cuff_group' },
    { sectionId: 'anatomy-rotator-cuff', anatomyNodeId: 'supraspinatus' },
    { sectionId: 'anatomy-rotator-cuff', anatomyNodeId: 'infraspinatus' },
    { sectionId: 'anatomy-rotator-cuff', anatomyNodeId: 'subscapularis' },
    { sectionId: 'anatomy-rotator-cuff', anatomyNodeId: 'teres_minor' },

    { sectionId: 'anatomy-rhomboids-erectors-lats', anatomyNodeId: 'rhomboids' },
    { sectionId: 'anatomy-rhomboids-erectors-lats', anatomyNodeId: 'erector_spinae' },
    { sectionId: 'anatomy-rhomboids-erectors-lats', anatomyNodeId: 'latissimus_dorsi' },

    // Strength / growth / resilience
    { sectionId: 'strength-back', anatomyNodeId: 'latissimus_dorsi' },
    { sectionId: 'strength-back', anatomyNodeId: 'teres_major' },
    { sectionId: 'strength-back', anatomyNodeId: 'erector_spinae' },

    { sectionId: 'muscle-growth-back', anatomyNodeId: 'latissimus_dorsi' },
    { sectionId: 'muscle-growth-back', anatomyNodeId: 'rhomboids' },
    { sectionId: 'muscle-growth-back', anatomyNodeId: 'erector_spinae' },
    { sectionId: 'muscle-growth-back', anatomyNodeId: 'trapezius' },

    { sectionId: 'mobility-back', anatomyNodeId: 'trapezius' },
    { sectionId: 'mobility-back', anatomyNodeId: 'rotator_cuff_group' },
    { sectionId: 'mobility-back', anatomyNodeId: 'scapular_control_complex' },

    { sectionId: 'injury-resilience-back', anatomyNodeId: 'trapezius' },
    { sectionId: 'injury-resilience-back', anatomyNodeId: 'rhomboids' },
    { sectionId: 'injury-resilience-back', anatomyNodeId: 'rear_delts' },
    { sectionId: 'injury-resilience-back', anatomyNodeId: 'rotator_cuff_group' },
    { sectionId: 'injury-resilience-back', anatomyNodeId: 'erector_spinae' },

    { sectionId: 'snipers-back-day', anatomyNodeId: 'latissimus_dorsi' },
    { sectionId: 'snipers-back-day', anatomyNodeId: 'rhomboids' },
    { sectionId: 'snipers-back-day', anatomyNodeId: 'trapezius' },
    { sectionId: 'snipers-back-day', anatomyNodeId: 'erector_spinae' },
    { sectionId: 'snipers-back-day', anatomyNodeId: 'rotator_cuff_group' },

    { sectionId: 'shoulder-rehab-sequence', anatomyNodeId: 'rotator_cuff_group' },
    { sectionId: 'shoulder-rehab-sequence', anatomyNodeId: 'trapezius' },
    { sectionId: 'shoulder-rehab-sequence', anatomyNodeId: 'rear_delts' },

    { sectionId: 'back-shoulder-rehab-exercise-bank', anatomyNodeId: 'rotator_cuff_group' },
    { sectionId: 'back-shoulder-rehab-exercise-bank', anatomyNodeId: 'trapezius' },
    { sectionId: 'back-shoulder-rehab-exercise-bank', anatomyNodeId: 'erector_spinae' },

    { sectionId: 'bonus-back-exercise-library', anatomyNodeId: 'latissimus_dorsi' },
    { sectionId: 'bonus-back-exercise-library', anatomyNodeId: 'rhomboids' },
    { sectionId: 'bonus-back-exercise-library', anatomyNodeId: 'trapezius' },
    { sectionId: 'bonus-back-exercise-library', anatomyNodeId: 'erector_spinae' },
    { sectionId: 'bonus-back-exercise-library', anatomyNodeId: 'rear_delts' },
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
  // 3) EXERCISES – BACK
  // -----------------------------
  // NOTE: This list deliberately covers:
  // - All explicit “EXERCISE EXAMPLES FOR …” muscle sections
  // - All Back Day Formula slots (strength, supersets, erector, resilience, mobility, rehab)
  // - All the rehab/mobility drills that got their own video links in links_back.csv.

  const exercises = [
    // --- 1. Strength – heavy vertical pulling ---
    {
      id: 'weighted_pull_ups',
      name: 'Weighted Pull Ups',
      type: 'compound',
      movementPattern: 'pull_up',
      equipment: ['pullup_bar', 'weight_belt'],
      primaryMuscles: ['latissimus_dorsi', 'teres_major'],
      secondaryMuscles: ['rhomboids', 'erector_spinae'],
      videoUrl: 'https://youtube.com/shorts/6Wapj8CAsP0?feature=share',
      cueSummary:
        'Strap on weight, full hang at the bottom, pull chest to bar while keeping ribs down and lats locked in.',
      mentionedInSections: ['strength-back', 'snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'wide_grip_pull_ups',
      name: 'Wide Grip Pull Ups',
      type: 'compound',
      movementPattern: 'pull_up',
      equipment: ['pullup_bar'],
      primaryMuscles: ['latissimus_dorsi'],
      secondaryMuscles: ['teres_major', 'rhomboids'],
      videoUrl: 'https://youtube.com/shorts/rYs-DU1M5Bo?feature=share',
      cueSummary:
        'Wide grip on the bar, drive elbows down and in to light up the outer lats and upper back.',
      mentionedInSections: ['strength-back', 'snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'wide_neutral_grip_pull_ups',
      name: 'Wide Neutral Grip Pull Ups',
      type: 'compound',
      movementPattern: 'pull_up',
      equipment: ['pullup_bar'],
      primaryMuscles: ['latissimus_dorsi', 'teres_major'],
      secondaryMuscles: ['rhomboids'],
      videoUrl: 'https://youtube.com/shorts/lveIByummaI?feature=share',
      cueSummary:
        'Use a wide neutral grip attachment, think “elbows to ribs” to bias lower lats while keeping shoulders happier.',
      mentionedInSections: ['strength-back', 'snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'regular_pull_ups',
      name: 'Regular Pull Ups',
      type: 'compound',
      movementPattern: 'pull_up',
      equipment: ['pullup_bar'],
      primaryMuscles: ['latissimus_dorsi'],
      secondaryMuscles: ['teres_major', 'rhomboids'],
      videoUrl: 'https://youtube.com/shorts/rYs-DU1M5Bo?feature=share',
      cueSummary:
        'Shoulder‑width grip, full range of motion, no kipping – crisp reps building base vertical pulling strength.',
      mentionedInSections: ['strength-back', 'bonus-back-exercise-library'],
    },
    {
      id: 'close_grip_pull_ups',
      name: 'Close Grip Pull-Ups',
      type: 'compound',
      movementPattern: 'pull_up',
      equipment: ['pullup_bar'],
      primaryMuscles: ['latissimus_dorsi'],
      secondaryMuscles: ['teres_major', 'teres_minor'],
      videoUrl: 'https://youtube.com/shorts/lveIByummaI?feature=share',
      cueSummary:
        'Closer grip, think “drive elbows down in front of you” to emphasize lower lats and teres.',
      mentionedInSections: ['anatomy-rhomboids-erectors-lats', 'snipers-back-day'],
    },
    {
      id: 'lat_pulldowns',
      name: 'Lat Pulldowns',
      type: 'compound',
      movementPattern: 'pull_down',
      equipment: ['cable', 'lat_pulldown_machine'],
      primaryMuscles: ['latissimus_dorsi'],
      secondaryMuscles: ['teres_major', 'teres_minor'],
      videoUrl: 'https://youtube.com/shorts/m0L2srW6eAw?feature=share',
      cueSummary:
        'Sit tight, pull bar to upper chest, keep chest tall and lats tight. No half‑rep ego pulldowns.',
      mentionedInSections: ['anatomy-rhomboids-erectors-lats', 'bonus-back-exercise-library'],
    },
    {
      id: 'regular_lat_pulldowns',
      name: 'Regular Lat Pulldowns',
      type: 'compound',
      movementPattern: 'pull_down',
      equipment: ['cable', 'lat_pulldown_machine'],
      primaryMuscles: ['latissimus_dorsi'],
      secondaryMuscles: ['teres_minor'],
      videoUrl: 'https://youtube.com/shorts/m0L2srW6eAw?feature=share',
      cueSummary:
        'Standard pulldown variation used as a go‑to for both lats and teres minor stimulation.',
      mentionedInSections: ['anatomy-rotator-cuff', 'bonus-back-exercise-library'],
    },
    {
      id: 'neutral_grip_pulldown',
      name: 'Neutral Grip Pulldown',
      type: 'compound',
      movementPattern: 'pull_down',
      equipment: ['cable', 'lat_pulldown_machine'],
      primaryMuscles: ['latissimus_dorsi'],
      secondaryMuscles: ['teres_major', 'teres_minor'],
      videoUrl: 'https://youtube.com/shorts/m0L2srW6eAw?feature=share',
      cueSummary:
        'Neutral handle to keep shoulders comfortable while still hammering lats; think “squeeze armpits” at the bottom.',
      mentionedInSections: ['strength-back', 'bonus-back-exercise-library'],
    },
    {
      id: 'lat_pull_ins',
      name: 'Lat Pull Ins',
      type: 'isolation',
      movementPattern: 'pull_down',
      equipment: ['cable'],
      primaryMuscles: ['latissimus_dorsi'],
      secondaryMuscles: ['teres_major'],
      videoUrl: 'https://youtube.com/shorts/qJ7pR-sBeyk?feature=share',
      cueSummary:
        'Side‑leaned cable pulldown where you drive elbow into the hip – full stretch and brutal lat contraction.',
      mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
    },

    // --- 2. Horizontal pulling / rows ---
    {
      id: 't_bar_rows',
      name: 'T-Bar Rows',
      type: 'compound',
      movementPattern: 'row',
      equipment: ['t_bar_row'],
      primaryMuscles: ['rhomboids', 'latissimus_dorsi'],
      secondaryMuscles: ['erector_spinae', 'middle_traps'],
      videoUrl: 'https://youtube.com/shorts/ILNnGpZmvZA?feature=share',
      cueSummary:
        'Hinge over the T‑bar, pull handle to lower chest/upper abs, squeeze shoulder blades without bouncing.',
      mentionedInSections: ['anatomy-rhomboids-erectors-lats', 'snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'dead_rows',
      name: 'Dead Rows',
      type: 'compound',
      movementPattern: 'row',
      equipment: ['barbell'],
      primaryMuscles: ['rhomboids', 'latissimus_dorsi'],
      secondaryMuscles: ['erector_spinae'],
      videoUrl: 'https://youtube.com/shorts/ILNnGpZmvZA?feature=share',
      cueSummary:
        'Rowing from a dead‑stop each rep – bar comes to the floor or blocks, kill momentum and re‑pull every time.',
      mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'supinated_barbell_rows',
      name: 'Supinated Barbell Rows',
      type: 'compound',
      movementPattern: 'row',
      equipment: ['barbell'],
      primaryMuscles: ['latissimus_dorsi', 'teres_major'],
      secondaryMuscles: ['rhomboids'],
      videoUrl: 'https://youtube.com/shorts/PkQ5UXFyaqo?feature=share',
      cueSummary:
        'Underhand barbell rows pulling toward the lower abs to emphasize lats and teres major.',
      mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'supinated_dumbbell_rows',
      name: 'Supinated Dumbbell Rows',
      type: 'compound',
      movementPattern: 'row',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['latissimus_dorsi'],
      secondaryMuscles: ['teres_major', 'rhomboids'],
      videoUrl: 'https://youtube.com/shorts/PkQ5UXFyaqo?feature=share',
      cueSummary:
        'One‑arm underhand DB rows with a stretch at the bottom and elbow tracking close to the hip.',
      mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'neutral_grip_barbell_rows',
      name: 'Neutral Grip Barbell Rows',
      type: 'compound',
      movementPattern: 'row',
      equipment: ['barbell', 'neutral_handle'],
      primaryMuscles: ['latissimus_dorsi', 'rhomboids'],
      secondaryMuscles: ['erector_spinae'],
      videoUrl: 'https://youtube.com/shorts/PkQ5UXFyaqo?feature=share',
      cueSummary:
        'Neutral grip attachment on a bar or machine; pull toward mid‑torso with torso locked in place.',
      mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'neutral_grip_dumbbell_rows',
      name: 'Neutral Grip Dumbbell Rows',
      type: 'compound',
      movementPattern: 'row',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['latissimus_dorsi'],
      secondaryMuscles: ['rhomboids'],
      videoUrl: 'https://youtube.com/shorts/PkQ5UXFyaqo?feature=share',
      cueSummary:
        'Classic one‑arm DB row with a neutral grip – pull elbow back toward hip, no twisting.',
      mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'upper_back_barbell_rows',
      name: 'Upper Back Barbell Rows',
      type: 'compound',
      movementPattern: 'row',
      equipment: ['barbell'],
      primaryMuscles: ['rhomboids', 'middle_traps'],
      secondaryMuscles: ['rear_delts'],
      videoUrl: 'https://youtube.com/shorts/ZgS4xZnyMGo?feature=share',
      cueSummary:
        'Row higher toward the chest with flared elbows to bias upper‑back thickness over lats.',
      mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'upper_back_dumbbell_rows',
      name: 'Upper Back Dumbbell Rows',
      type: 'compound',
      movementPattern: 'row',
      equipment: ['dumbbell'],
      primaryMuscles: ['rhomboids', 'middle_traps'],
      secondaryMuscles: ['rear_delts'],
      videoUrl: 'https://youtube.com/shorts/ZgS4xZnyMGo?feature=share',
      cueSummary:
        'Higher‑angle DB rows focused on pulling with the upper back and rear delts rather than the lats.',
      mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'chest_supported_rows',
      name: 'Chest Supported Rows',
      type: 'compound',
      movementPattern: 'row',
      equipment: ['bench', 'dumbbell', 'machine'],
      primaryMuscles: ['rhomboids', 'middle_traps'],
      secondaryMuscles: ['latissimus_dorsi'],
      videoUrl: 'https://youtube.com/shorts/sZlrq9FgM7w?feature=share',
      cueSummary:
        'Lay on an incline bench, let arms hang, row with zero lower‑back cheating to hammer mid‑back.',
      mentionedInSections: ['anatomy-rhomboids-erectors-lats', 'snipers-back-day'],
    },

    // --- Upper back / traps / rear delt isolation ---
    {
      id: 'chest_supported_shrugs',
      name: 'Chest Supported Shrugs',
      type: 'isolation',
      movementPattern: 'shrug',
      equipment: ['bench', 'dumbbell', 'machine'],
      primaryMuscles: ['upper_traps', 'middle_traps'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/sZlrq9FgM7w?feature=share',
      cueSummary:
        'Chest on bench, shrug straight up and slightly back, hold the top to crush traps without wrecking your neck.',
      mentionedInSections: ['anatomy-traps', 'snipers-back-day', 'injury-resilience-back'],
    },
    {
      id: 'standing_reverse_incline_flyes',
      name: 'Standing Reverse Incline Flyes',
      type: 'isolation',
      movementPattern: 'fly',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['middle_traps', 'rear_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/6vrlwEdrkTA?feature=share',
      cueSummary:
        'Hinge over or use an incline bench, sweep the dumbbells out and back to squeeze mid‑traps and rear delts.',
      mentionedInSections: ['anatomy-traps', 'snipers-back-day', 'bonus-back-exercise-library'],
    },
    {
      id: 'seated_reverse_incline_flyes',
      name: 'Seated Reverse Incline Flyes',
      type: 'isolation',
      movementPattern: 'fly',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['middle_traps', 'rear_delts'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/6vrlwEdrkTA?feature=share',
      cueSummary:
        'Seated with chest on pad, perform reverse flyes to isolate upper‑back fibers and rear delts.',
      mentionedInSections: ['anatomy-traps', 'bonus-back-exercise-library'],
    },
    {
      id: 'y_raises',
      name: 'Y Raises',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['lower_traps', 'rear_delts'],
      secondaryMuscles: ['middle_traps'],
      videoUrl: 'https://youtube.com/shorts/6vrlwEdrkTA?feature=share',
      cueSummary:
        'Raise the arms in a “Y” pattern while keeping ribs down and shoulder blades depressed – pure lower traps and rear delts.',
      mentionedInSections: ['anatomy-traps', 'injury-resilience-back', 'snipers-back-day'],
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
        'anatomy-rotator-cuff',
        'injury-resilience-back',
        'shoulder-rehab-sequence',
        'snipers-back-day',
      ],
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
        'Think “anti‑slouch”: pull shoulders back and down while reaching long through the arms to hammer deep scapular muscles.',
      mentionedInSections: ['anatomy-rhomboids-erectors-lats', 'injury-resilience-back'],
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
      mentionedInSections: ['injury-resilience-back', 'bonus-back-exercise-library'],
    },
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
      mentionedInSections: ['injury-resilience-back', 'bonus-back-exercise-library'],
    },

    // --- Erector / lower back work ---
    {
      id: 'deadlifts',
      name: 'Deadlifts',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['barbell'],
      primaryMuscles: ['erector_spinae'],
      secondaryMuscles: [], // if you don’t have glutes/hamstrings nodes yet, leave these out
      videoUrl: 'https://youtube.com/shorts/rSPL_LYJB9M?feature=share',
      cueSummary:
        'Classic hinge from the hips, neutral spine, stand tall with the bar – King of erector loading.',
      mentionedInSections: ['anatomy-rhomboids-erectors-lats', 'snipers-back-day'],
    },
    {
      id: 'rack_pulls',
      name: 'Rack Pulls',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['barbell', 'rack'],
      primaryMuscles: ['erector_spinae'],
      secondaryMuscles: ['latissimus_dorsi'],
      videoUrl: 'https://youtube.com/shorts/rSPL_LYJB9M?feature=share',
      cueSummary:
        'Partial deadlift from pins or blocks to overload erectors and upper‑back without full ROM stress.',
      mentionedInSections: ['bonus-back-exercise-library'],
    },
    {
      id: 'seated_barbell_good_mornings',
      name: 'Seated Barbell Good Mornings',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['erector_spinae'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/yVktQUdY4zs?feature=share',
      cueSummary:
        'Seated on a bench with bar on back, hinge forward under control and extend to light up erectors.',
      mentionedInSections: ['anatomy-rhomboids-erectors-lats', 'back-shoulder-rehab-exercise-bank'],
    },
    {
      id: 'barbell_good_mornings',
      name: 'Barbell Good Mornings',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['barbell'],
      primaryMuscles: ['erector_spinae'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/yVktQUdY4zs?feature=share',
      cueSummary:
        'Classic hip hinge with bar on back – slow, controlled, with a strong brace.',
      mentionedInSections: ['anatomy-rhomboids-erectors-lats', 'bonus-back-exercise-library'],
    },
    {
      id: 'cable_good_mornings',
      name: 'Cable Good Mornings',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['cable'],
      primaryMuscles: ['erector_spinae'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/nyTvQRvkmss?feature=share',
      cueSummary:
        'Back to cable stack, rope behind neck or shoulders, hinge and extend with constant tension.',
      mentionedInSections: ['back-shoulder-rehab-exercise-bank'],
    },
    {
      id: 'hyperextension_rows',
      name: 'Hyperextension Rows',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['hyperextension_bench', 'dumbbell'],
      primaryMuscles: ['erector_spinae', 'rhomboids'],
      secondaryMuscles: ['latissimus_dorsi'],
      videoUrl: 'https://youtube.com/shorts/1k-Fe-LHj1I?feature=share',
      cueSummary:
        'On hyperextension bench, hold weight and row at the top of the back‑extension – nasty combo of erectors and mid‑back.',
      mentionedInSections: ['anatomy-rhomboids-erectors-lats', 'snipers-back-day'],
    },
    {
      id: 'reverse_hyperextensions',
      name: 'Reverse Hyperextensions',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['reverse_hyper_machine'],
      primaryMuscles: ['erector_spinae'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/SDv9cJ_KmGo?feature=share',
      cueSummary:
        'Lift legs behind you on reverse hyper to train low back with more hip contribution and less spinal compression.',
      mentionedInSections: ['back-shoulder-rehab-exercise-bank', 'bonus-back-exercise-library'],
    },
    {
      id: 'supermans',
      name: 'Supermans',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['bodyweight', 'floor'],
      primaryMuscles: ['lower_traps', 'erector_spinae'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/EnYm_Hz9xPU?feature=share',
      cueSummary:
        'On your stomach, simultaneously raise arms and legs slightly off floor, focusing on back and lower trap squeeze.',
      mentionedInSections: ['anatomy-traps', 'injury-resilience-back'],
    },

    // --- Resilience / neck / bridges ---
    {
      id: 'neck_bridges',
      name: 'Neck Bridges',
      type: 'isolation',
      movementPattern: 'bridge',
      equipment: ['bodyweight'],
      primaryMuscles: ['upper_traps'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/RZc7amGOI7E?feature=share',
      cueSummary:
        'Careful, controlled bridging on head/neck to build neck and trap resilience.',
      mentionedInSections: ['injury-resilience-back'],
    },
    {
      id: 'back_bridges',
      name: 'Back Bridges',
      type: 'isolation',
      movementPattern: 'bridge',
      equipment: ['bodyweight'],
      primaryMuscles: ['erector_spinae'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/RZc7amGOI7E?feature=share',
      cueSummary:
        'Full body bridge on hands and feet, chest high, to open shoulders and strengthen the entire posterior chain.',
      mentionedInSections: ['injury-resilience-back'],
    },

    // --- Mobility & shoulder rehab drills ---
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
      mentionedInSections: ['mobility-back', 'shoulder-rehab-sequence'],
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
      mentionedInSections: ['mobility-back', 'back-shoulder-rehab-exercise-bank'],
    },
    {
      id: 'wall_drags',
      name: 'Wall Drags',
      type: 'mobility',
      movementPattern: 'wall_slide',
      equipment: ['wall'],
      primaryMuscles: ['lower_traps', 'rotator_cuff_group'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/jCxyq3FUDgY?feature=share',
      cueSummary:
        'Back against the wall, forearms sliding up/down while keeping ribs down and shoulder blades glued.',
      mentionedInSections: ['mobility-back', 'back-shoulder-rehab-exercise-bank'],
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
        'Rommy’s shoulder potion – a sequence tying together hangs, rotations and pulls to restore shoulder function.',
      mentionedInSections: ['shoulder-rehab-sequence'],
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
      mentionedInSections: ['anatomy-rotator-cuff', 'shoulder-rehab-sequence'],
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
      mentionedInSections: ['anatomy-rotator-cuff', 'shoulder-rehab-sequence'],
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
        'Rear‑delt/cuff raise variant where you trace a “U” path, keeping tension on the shoulder the entire time.',
      mentionedInSections: ['anatomy-rotator-cuff', 'back-shoulder-rehab-exercise-bank'],
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
      mentionedInSections: ['back-shoulder-rehab-exercise-bank'],
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
      mentionedInSections: ['back-shoulder-rehab-exercise-bank'],
    },
    {
      id: 'overhead_barbell_press_holds',
      name: 'Overhead Barbell Press Holds',
      type: 'isolation',
      movementPattern: 'press_hold',
      equipment: ['barbell'],
      primaryMuscles: ['trapezius', 'rotator_cuff_group'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/x0W3FabFBGY?feature=share',
      cueSummary:
        'Lock a barbell overhead and hold – stack ribs over hips, keep scapula elevated and stable.',
      mentionedInSections: ['mobility-back', 'back-shoulder-rehab-exercise-bank'],
    },
    {
      id: 'overhead_squat_snatch_holds',
      name: 'Overhead Squat / Snatch Holds',
      type: 'compound',
      movementPattern: 'squat_hold',
      equipment: ['barbell'],
      primaryMuscles: ['trapezius', 'erector_spinae'],
      secondaryMuscles: ['rotator_cuff_group'],
      videoUrl: 'https://youtube.com/shorts/x0W3FabFBGY?feature=share',
      cueSummary:
        'Wide‑grip overhead squat or snatch catch positions held for time to challenge thoracic extension and scapular control.',
      mentionedInSections: ['mobility-back', 'back-shoulder-rehab-exercise-bank'],
    },
    {
      id: 'seated_dumbbell_good_mornings',
      name: 'Seated Dumbbell Good Mornings',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['dumbbell', 'bench'],
      primaryMuscles: ['erector_spinae'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/yVktQUdY4zs?feature=share',
      cueSummary:
        'Seated version with dumbbells – hinge forward keeping spine controlled, then extend.',
      mentionedInSections: ['back-shoulder-rehab-exercise-bank'],
    },
    {
      id: 'barbell_ezbar_pullovers',
      name: 'Barbell/EZ Bar Pullovers',
      type: 'compound',
      movementPattern: 'pullover',
      equipment: ['barbell', 'ez_bar', 'bench'],
      primaryMuscles: ['latissimus_dorsi'],
      secondaryMuscles: ['teres_major'],
      videoUrl: 'https://youtube.com/shorts/f1LjQ3rYeNg?feature=share',
      cueSummary:
        'On a bench, lower bar behind head for a big lat stretch then pull over using lats, not triceps.',
      mentionedInSections: ['back-shoulder-rehab-exercise-bank', 'bonus-back-exercise-library'],
    },
    {
      id: 'ring_around_the_rommy',
      name: 'Ring Around The Rommy’s',
      type: 'mobility',
      movementPattern: 'circle',
      equipment: ['gymnastic_rings'],
      primaryMuscles: ['trapezius', 'rotator_cuff_group'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/y37MSFyI5X4?feature=share',
      cueSummary:
        'Ring‑based shoulder and scapular circles to open up the entire shoulder girdle.',
      mentionedInSections: ['back-shoulder-rehab-exercise-bank'],
    },
    {
      id: 'full_body_mobility_movement',
      name: 'Full Body Mobility Movement',
      type: 'mobility',
      movementPattern: 'sequence',
      equipment: ['bodyweight'],
      primaryMuscles: ['scapular_control_complex'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/0H3Gj01Ww1s?feature=share',
      cueSummary:
        'Full‑body flow including deep squats, thoracic rotations and reaches to unlock the chain from hips to shoulders.',
      mentionedInSections: ['mobility-back'],
    },
    {
      id: 'pvc_pipe_shoulder_sequence',
      name: 'PVC Pipe Shoulder Sequence',
      type: 'mobility',
      movementPattern: 'car',
      equipment: ['pvc_pipe'],
      primaryMuscles: ['rotator_cuff_group', 'lower_traps'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/0H3Gj01Ww1s?feature=share',
      cueSummary:
        'Pass‑throughs, around‑the‑worlds and wall‑slide style drills done with PVC to open shoulders.',
      mentionedInSections: ['mobility-back', 'back-shoulder-rehab-exercise-bank'],
    },
    {
      id: 'weighted_plate_mobility',
      name: 'Weighted Plate Mobility',
      type: 'mobility',
      movementPattern: 'sequence',
      equipment: ['plate'],
      primaryMuscles: ['erector_spinae'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/39tCDbAQb5U?feature=share',
      cueSummary:
        'Plate‑loaded mobility flow (around‑the‑worlds, reaches, hinges) to grease the entire posterior chain.',
      mentionedInSections: ['back-shoulder-rehab-exercise-bank'],
    },
    {
      id: 'side_lying_leg_raises',
      name: 'Side-Lying Leg Raises',
      type: 'isolation',
      movementPattern: 'leg_raise',
      equipment: ['bodyweight'],
      primaryMuscles: [],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/brFIUlnUoUA?feature=share',
      cueSummary:
        'Side‑lying hip/leg abduction that shows up in the rehab bank as hip stability work to support low‑back function.',
      mentionedInSections: ['back-shoulder-rehab-exercise-bank'],
    },
    {
        id: 'dumbbell_shoulder_external_rotations',
        name: 'Dumbbell Shoulder External Rotations',
        type: 'isolation',
        movementPattern: 'rotation',
        equipment: ['dumbbell'],
        primaryMuscles: ['infraspinatus', 'teres_minor'],
        secondaryMuscles: [],
        videoUrl: 'https://youtube.com/shorts/SIdGGmExFfQ?feature=share',
        cueSummary:
          'Elbow pinned to your side, rotate the forearm outward with a light dumbbell to hammer the external rotators without cranking the shoulder.',
        mentionedInSections: [
          'anatomy-rotator-cuff',
          'shoulder-rehab-sequence',
          'back-shoulder-rehab-exercise-bank',
        ],
      },
  
      {
        id: 'high_elbow_hammer_strength_rows',
        name: 'High Elbow Hammer Strength Rows',
        type: 'compound',
        movementPattern: 'row',
        equipment: ['machine'],
        primaryMuscles: ['rhomboids', 'middle_traps'],
        secondaryMuscles: ['rear_delts', 'latissimus_dorsi'],
        videoUrl: 'https://youtube.com/shorts/RhFm-U5YYnA?feature=share',
        cueSummary:
          'Chest braced on the Hammer Strength machine, row with elbows flared high toward the chest to bias upper‑back thickness over lats.',
        mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
      },
  
      {
        id: 'high_elbow_rows',
        name: 'High Elbow Rows',
        type: 'compound',
        movementPattern: 'row',
        equipment: ['barbell'],
        primaryMuscles: ['rhomboids', 'middle_traps'],
        secondaryMuscles: ['rear_delts'],
        videoUrl: 'https://youtube.com/shorts/RhFm-U5YYnA?feature=share',
        cueSummary:
          'Barbell rows pulled higher toward the chest with flared elbows to light up the upper back rather than the lower lats.',
        mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
      },
  
      {
        id: 'high_to_low_cable_rows',
        name: 'High to Low Cable Rows',
        type: 'compound',
        movementPattern: 'row',
        equipment: ['cable'],
        primaryMuscles: ['latissimus_dorsi', 'teres_major'],
        secondaryMuscles: ['rhomboids'],
        videoUrl: 'https://youtube.com/shorts/Re20ZF4U1J8?feature=share',
        cueSummary:
          'From a high pulley, row the handle down and back toward the hip following a high‑to‑low path to smoke the lower lats.',
        mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
      },
  
      {
        id: 'inverted_raises',
        name: 'Inverted Raises',
        type: 'isolation',
        movementPattern: 'raise',
        equipment: ['barbell', 'rack'],
        primaryMuscles: ['trapezius'],
        secondaryMuscles: ['rhomboids', 'rear_delts'],
        videoUrl: 'https://youtube.com/shorts/x69X23j0dw0?feature=share',
        cueSummary:
          'Set a bar in a rack, position yourself underneath, then drive chest up and pull the shoulder blades back to raise the torso and crush the traps.',
        mentionedInSections: ['anatomy-traps', 'injury-resilience-back'],
      },
  
      {
        id: 'mobility_wall_routine',
        name: 'Mobility Wall Routine',
        type: 'mobility',
        movementPattern: 'sequence',
        equipment: ['wall'],
        primaryMuscles: ['scapular_control_complex', 'rotator_cuff_group'],
        secondaryMuscles: [],
        videoUrl: 'https://youtube.com/shorts/8O_Y6Kq7RmY?feature=share',
        cueSummary:
          'Wall‑based shoulder and scap drills (slides, reaches, rotations) to open posture and restore overhead and behind‑the‑back range.',
        mentionedInSections: ['mobility-back', 'back-shoulder-rehab-exercise-bank'],
      },
  
      {
        id: 'neutral_grip_hammer_strength_row',
        name: 'Neutral Grip Hammer Strength Row',
        type: 'compound',
        movementPattern: 'row',
        equipment: ['machine'],
        primaryMuscles: ['latissimus_dorsi', 'rhomboids'],
        secondaryMuscles: ['erector_spinae'],
        videoUrl: 'https://youtube.com/shorts/lcxvcfcXYHs?feature=share',
        cueSummary:
          'Neutral‑handle Hammer Strength rows pulling toward mid‑torso with a locked‑in torso for big lats and mid‑back thickness.',
        mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
      },
  
      {
        id: 'rope_attachment_upright_rows',
        name: 'Rope Attachment Upright Rows',
        type: 'isolation',
        movementPattern: 'shrug',
        equipment: ['cable', 'rope_attachment'],
        primaryMuscles: ['upper_traps', 'middle_traps'],
        secondaryMuscles: ['rear_delts'],
        videoUrl: 'https://youtube.com/shorts/x69X23j0dw0?feature=share',
        cueSummary:
          'Cable upright rows with a rope, pulling elbows high while keeping shoulders down to torch traps without jamming the shoulders.',
        mentionedInSections: ['anatomy-traps', 'snipers-back-day', 'injury-resilience-back'],
      },
  
      {
        id: 'single_arm_cable_rows',
        name: 'Single Arm Cable Row',
        type: 'compound',
        movementPattern: 'row',
        equipment: ['cable'],
        primaryMuscles: ['latissimus_dorsi'],
        secondaryMuscles: ['rhomboids'],
        videoUrl: 'https://youtube.com/shorts/K3vYp2lhgKE?feature=share',
        cueSummary:
          'Single‑arm cable rows with a big stretch at the front, then driving the elbow back toward the hip while the torso stays braced.',
        mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
      },
  
      {
        id: 'standing_good_mornings',
        name: 'Standing Good Mornings',
        type: 'compound',
        movementPattern: 'hinge',
        equipment: ['barbell'],
        primaryMuscles: ['erector_spinae'],
        secondaryMuscles: [],
        videoUrl: 'https://youtube.com/shorts/9cf-P4JVeU8?feature=share',
        cueSummary:
          'Bar on your back, soft knees, hinge from the hips under control and stand tall to build rock‑solid erectors.',
        mentionedInSections: ['anatomy-rhomboids-erectors-lats', 'bonus-back-exercise-library'],
      },
  
      {
        id: 'super_wide_pulldowns',
        name: 'Super Wide Pulldowns',
        type: 'compound',
        movementPattern: 'pull_down',
        equipment: ['cable', 'lat_pulldown_machine'],
        primaryMuscles: ['latissimus_dorsi', 'teres_minor'],
        secondaryMuscles: ['rhomboids'],
        videoUrl: 'https://youtube.com/shorts/K3vYp2lhgKE?feature=share',
        cueSummary:
          'Take an extra‑wide grip on the pulldown bar and pull to the upper chest to hammer upper lats and teres without swinging.',
        mentionedInSections: ['strength-back', 'bonus-back-exercise-library'],
      },
  
      {
        id: 't_raises',
        name: 'T Raises',
        type: 'isolation',
        movementPattern: 'raise',
        equipment: ['dumbbell', 'bench'],
        primaryMuscles: ['middle_traps', 'rear_delts'],
        secondaryMuscles: ['lower_traps'],
        videoUrl: 'https://youtube.com/shorts/flhz5dtmqo4?feature=share',
        cueSummary:
          'Prone on a bench, raise arms straight out to a “T” with thumbs up, squeezing shoulder blades together for pure mid‑trap and rear‑delt work.',
        mentionedInSections: ['anatomy-traps', 'injury-resilience-back', 'snipers-back-day'],
      },
  
      {
        id: 'underhand_pulldown',
        name: 'Underhand Pulldown',
        type: 'compound',
        movementPattern: 'pull_down',
        equipment: ['cable', 'lat_pulldown_machine'],
        primaryMuscles: ['latissimus_dorsi', 'teres_major'],
        secondaryMuscles: ['rhomboids'],
        videoUrl: 'https://youtube.com/shorts/Re20ZF4U1J8?feature=share',
        cueSummary:
          'Supinated‑grip pulldown with elbows tucked, pulling bar to upper chest to load lower lats and teres major.',
        mentionedInSections: ['strength-back', 'bonus-back-exercise-library'],
      },
  
      {
        id: 'upright_rows_bar',
        name: 'Upright Rows (Straight Bar/EZ Bar)',
        type: 'isolation',
        movementPattern: 'shrug',
        equipment: ['barbell', 'ez_bar'],
        primaryMuscles: ['upper_traps', 'middle_traps'],
        secondaryMuscles: ['rear_delts'],
        videoUrl: 'https://youtube.com/shorts/x69X23j0dw0?feature=share',
        cueSummary:
          'Classic barbell or EZ‑bar upright rows – pull elbows high along the body in a comfortable range to blow up traps safely.',
        mentionedInSections: ['anatomy-traps', 'snipers-back-day', 'injury-resilience-back'],
      },
  
      {
        id: 'wide_grip_hammer_strength_row',
        name: 'Wide Grip Hammer Strength Row',
        type: 'compound',
        movementPattern: 'row',
        equipment: ['machine'],
        primaryMuscles: ['rhomboids', 'latissimus_dorsi'],
        secondaryMuscles: ['middle_traps'],
        videoUrl: 'https://youtube.com/shorts/lcxvcfcXYHs?feature=share',
        cueSummary:
          'Wide‑grip Hammer Strength rows pulling toward upper torso to hit lats plus upper back without relying on lower‑back cheat.',
        mentionedInSections: ['snipers-back-day', 'bonus-back-exercise-library'],
      },
  
      {
        id: 'dumbbell_deadlifts',
        name: 'Dumbbell Deadlifts',
        type: 'compound',
        movementPattern: 'hinge',
        equipment: ['dumbbell'],
        primaryMuscles: ['erector_spinae'],
        secondaryMuscles: [],
        videoUrl: 'https://youtube.com/shorts/9cf-P4JVeU8?feature=share',
        cueSummary:
          'Hold dumbbells at your sides or in front, hinge back and stand tall like a deadlift with a slightly friendlier setup than a barbell.',
        mentionedInSections: ['anatomy-rhomboids-erectors-lats', 'back-shoulder-rehab-exercise-bank'],
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

    // Section ↔ Exercise links (where it’s mentioned conceptually)
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
  // 4) FORMULAS (Back supersets / examples)
  // -----------------------------

  const formulas = [
    {
      id: 'rotator_cuff_formula_1',
      name: 'Rotator Cuff – Face Pulls + External Rotation + LU Raises',
      description:
        'THE 3 EXERCISES FOR COMPLETE ROTATOR CUFF WORK: Face Pulls (Back), Dumbbell Shoulder External Rotations and LU Raises.',
      pattern: 'tri_set',
      targetMuscles: ['rotator_cuff_group', 'rear_delts'],
      steps: [
        {
          order: 1,
          exerciseId: 'face_pulls_back',
          role: 'activation',
          notes: 'High‑rep, clean form; think rear delts and scapular control.',
        },
        {
          order: 2,
          exerciseId: 'cable_handle_external_rotation',
          role: 'isolation',
          notes: 'Slow external rotation, elbow pinned to side.',
        },
        {
          order: 3,
          exerciseId: 'lu_raises',
          role: 'finisher',
          notes: 'Use as a burn‑out for posterior cuff and delts.',
        },
      ],
    },
    {
      id: 'rhomboids_formula_1',
      name: 'Rhomboids – T-Bar Rows + Turtle Raises',
      description:
        'EXERCISE EXAMPLE FOR THE RHOMBOIDS: T-Bar Rows (compound lift) followed by Turtle Raises (isolation exercise).',
      pattern: 'superset',
      targetMuscles: ['rhomboids'],
      steps: [
        {
          order: 1,
          exerciseId: 't_bar_rows',
          role: 'compound',
          notes: 'Heavy sets in the 5–9 rep zone, focus on scap retraction.',
        },
        {
          order: 2,
          exerciseId: 'turtle_raises',
          role: 'isolation',
          notes: 'Slow squeezes, think anti‑slouch posture.',
        },
      ],
    },
    {
      id: 'lats_formula_1',
      name: 'Lats – Close Grip Pull-Ups + Lat Pull Ins',
      description:
        'EXERCISE EXAMPLES FOR THE LATS: Close Grip Pull-Ups (Compound Movement) followed by Lat Pull Ins (Isolation Exercise).',
      pattern: 'superset',
      targetMuscles: ['latissimus_dorsi'],
      steps: [
        {
          order: 1,
          exerciseId: 'close_grip_pull_ups',
          role: 'compound',
          notes: 'Heavy lower‑rep sets to build raw vertical pulling strength.',
        },
        {
          order: 2,
          exerciseId: 'lat_pull_ins',
          role: 'isolation',
          notes: 'High tension, stretch + squeeze for pure lat meat.',
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

    // reset steps to avoid duplicates on re‑seed
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
  // 5) WORKOUT – THE SNIPER’S BACK DAY
  // -----------------------------

  await prisma.workout.upsert({
    where: { id: 'snipers_back_day' },
    update: {},
    create: {
      id: 'snipers_back_day',
      slug: 'snipers-back-day',
      name: 'THE SNIPER’S BACK DAY (THE BACK DAY FORMULA)',
      goal:
        'Back strength and hypertrophy across lats, upper back, erectors and shoulder‑stability system.',
      priorityRules:
        'READ: The muscle or weakness you want to prioritize is what you start the session with (usually heavy vertical pulling).',
      primaryRegionId: 'back',
    },
  });

  const workoutBlocks = [
    // 1. Strength – heavy vertical pulling
    {
      id: 'back-strength-block',
      workoutId: 'snipers_back_day',
      label: '1. Strength – NUMBER 1 Back Movement (Pick 1)',
      schemeStyle: 'drop_set',
      schemeDesc: `Set 1: 3–4 Rep Max
Set 2: Drop ~20% & set REP PR
Set 3: Drop another ~20% & set REP PR
Work up to a heavy 3–4 rep max, then run two back‑off drops as rep PRs.`,
      notes:
        'Pick ONE heavy vertical pull (weighted pull‑up or pulldown variation) and run the drop‑set strength scheme.',
      targetMuscles: ['latissimus_dorsi', 'teres_major', 'erector_spinae'],
      exerciseOptions: [
        'weighted_pull_ups',
        'wide_grip_pull_ups',
        'wide_neutral_grip_pull_ups',
        'lat_pulldowns',
        'neutral_grip_pulldown',
      ],
    },
    // 2. Horizontal pulling back superset
    {
      id: 'back-horizontal-superset-block',
      workoutId: 'snipers_back_day',
      label: '2. Horizontal Pulling Back SuperSet',
      schemeStyle: 'superset',
      schemeDesc:
        '2–3 sets. Compound row (fail 5–9 reps) paired with second heavy back movement (fail 5–9 reps).',
      notes:
        'Pick two heavy rowing options. One can be more lat‑biased (supinated/neutral) and one more upper‑back‑biased (high‑elbow).',
      targetMuscles: ['rhomboids', 'latissimus_dorsi', 'erector_spinae'],
      exerciseOptions: [
        't_bar_rows',
        'dead_rows',
        'supinated_barbell_rows',
        'supinated_dumbbell_rows',
        'neutral_grip_barbell_rows',
        'neutral_grip_dumbbell_rows',
      ],
    },
    // 3. Back (Lat) SuperSet
    {
      id: 'back-lat-superset-block',
      workoutId: 'snipers_back_day',
      label: '3. Back (Lat) SuperSet',
      schemeStyle: 'superset',
      schemeDesc:
        '2–3 sets. Compound vertical pull (5–9 reps) immediately into lat isolation (7–11 reps).',
      notes:
        'Think vertical lat overload followed by a lat isolation movement to leave nothing on the table.',
      targetMuscles: ['latissimus_dorsi', 'teres_major'],
      exerciseOptions: ['close_grip_pull_ups', 'lat_pulldowns', 'regular_lat_pulldowns', 'lat_pull_ins'],
    },
    // 4. Upper Back SuperSet
    {
      id: 'upper-back-superset-block',
      workoutId: 'snipers_back_day',
      label: '4. Upper Back SuperSet',
      schemeStyle: 'superset',
      schemeDesc:
        '2–3 sets. Heavy upper‑back row (5–9 reps) plus rear‑delt/upper‑trap isolation (10–15 reps).',
      notes:
        'Use this to blow up mid/lower traps, rhomboids and rear delts for that armor‑plated upper back.',
      targetMuscles: ['rhomboids', 'trapezius', 'rear_delts'],
      exerciseOptions: [
        'upper_back_barbell_rows',
        'upper_back_dumbbell_rows',
        'chest_supported_rows',
        'chest_supported_shrugs',
        'standing_reverse_incline_flyes',
        'seated_reverse_incline_flyes',
        'y_raises',
      ],
    },
    // 5. Lower Back / Erector
    {
      id: 'erectors-block',
      workoutId: 'snipers_back_day',
      label: '5. Lower Back / Erector Spinae Exercise',
      schemeStyle: 'straight_sets',
      schemeDesc: '2–3 sets of hinges/extensions, usually in the 6–10 rep range.',
      notes:
        'Pick ONE: deadlifts, rack pulls, hyperextension rows or good‑morning variants to build spinal armor.',
      targetMuscles: ['erector_spinae'],
      exerciseOptions: [
        'deadlifts',
        'rack_pulls',
        'seated_barbell_good_mornings',
        'barbell_good_mornings',
        'cable_good_mornings',
        'hyperextension_rows',
        'reverse_hyperextensions',
        'supermans',
      ],
    },
    // 6. Injury resilience – traps / neck / upper back
    {
      id: 'back-injury-resilience-block',
      workoutId: 'snipers_back_day',
      label: '6. Injury Resilience – Upper Back / Neck / Trap',
      schemeStyle: 'straight_sets',
      schemeDesc:
        '2–3 sets of 10–20 reps for resilience movements like shrugs, bridges and neck work.',
      notes:
        'Think long game: build the scaffolding around the neck and upper back so heavy training feels sustainable.',
      targetMuscles: ['trapezius', 'rhomboids', 'rear_delts', 'erector_spinae'],
      exerciseOptions: [
        'farmer_carries_shrugs',
        'chest_supported_shrugs',
        'neck_bridges',
        'back_bridges',
        'supermans',
        'turtle_raises',
      ],
    },
    // 7. Mobility – Back
    {
      id: 'back-mobility-block',
      workoutId: 'snipers_back_day',
      label: '7. Mobility – Back',
      schemeStyle: 'straight_sets',
      schemeDesc:
        'Pick 1–3 drills and perform 1–2 rounds each after the heavy work: hangs, wall drags, PVC work, overhead holds.',
      notes:
        'Use this to keep shoulders and thoracic spine from locking up as you push heavier strength blocks.',
      targetMuscles: ['scapular_control_complex', 'rotator_cuff_group', 'trapezius'],
      exerciseOptions: [
        'dead_hangs',
        'active_hangs',
        'wall_drags',
        'pvc_pipe_shoulder_sequence',
        'full_body_mobility_movement',
        'overhead_barbell_press_holds',
        'overhead_squat_snatch_holds',
      ],
    },
    // 8. Shoulder Rehab Sequence
    {
      id: 'shoulder-rehab-block',
      workoutId: 'snipers_back_day',
      label: '8. Shoulder Rehab Sequence',
      schemeStyle: 'sequence',
      schemeDesc:
        'Dead Hangs → Shoulder Elixir Potion → Face Pulls (Back) → Cable External Rotations → Cable Internal Rotations.',
      notes:
        'Run this as prescribed in the rehab section when your shoulders are pissed or as a weekly prehab circuit.',
      targetMuscles: ['rotator_cuff_group', 'rear_delts', 'trapezius'],
      exerciseOptions: [
        'dead_hangs',
        'shoulder_elixir_potion',
        'face_pulls_back',
        'cable_handle_external_rotation',
        'cable_handle_internal_rotation',
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

  console.log('✅ Back guide, anatomy, exercises, formulas, and Sniper’s Back Day seeded.');
}

seedBack()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });