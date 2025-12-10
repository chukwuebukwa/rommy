// prisma/seed-legs.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedLegs() {
  // -----------------------------
  // 1) ANATOMY GRAPH – LEGS
  // -----------------------------

  const anatomyNodes = [
    // Region
    {
      id: 'legs',
      kind: 'region',
      name: 'Legs',
      slug: 'legs',
      description:
        'Hip, thigh and lower‑leg region: glutes, hamstrings, quads, adductors, abductors, calves and shin muscles.',
      roleSummary:
        'The engine of your lower‑body power, size and athleticism. No more toothpick legs or top‑heavy physiques.',
      primaryFunctions: null,
      aestheticNotes: null,
      meta: null,
      parentId: null,
    },

    // Groups
    {
      id: 'glutes_group',
      kind: 'group',
      name: 'Glute Complex',
      slug: 'glutes-group',
      description:
        'Gluteus maximus, medius and minimus – the powerhouse of hip extension, rotation and pelvic stability.',
      roleSummary:
        'Drives sprinting, jumping and heavy hinges while keeping the pelvis stable so the knees and back stop getting wrecked.',
      primaryFunctions: JSON.stringify([
        'hip extension',
        'hip abduction',
        'hip external rotation',
        'pelvic stabilization in single‑leg stance',
      ]),
      aestheticNotes: JSON.stringify([
        'Builds the “shelf” from the side and the rounded look from the back.',
        'Makes pants fit like an athlete instead of hanging off flat glutes.',
      ]),
      meta: null,
      parentId: 'legs',
    },
    {
      id: 'hamstrings_group',
      kind: 'group',
      name: 'Hamstring Complex',
      slug: 'hamstrings-group',
      description:
        'Posterior thigh muscles that cross the hip and/or knee: biceps femoris, semitendinosus and semimembranosus.',
      roleSummary:
        'Control hip hinge patterns, decelerate the knee and protect the hamstrings when you sprint, jump or change direction.',
      primaryFunctions: JSON.stringify([
        'hip extension (especially from the bottom of a hinge)',
        'knee flexion',
        'eccentric control during sprinting and deceleration',
      ]),
      aestheticNotes: JSON.stringify([
        'Give you the hamstring “drop” and back‑of‑the‑leg sweep.',
        'Fill out the back of shorts instead of looking flat from behind.',
      ]),
      meta: null,
      parentId: 'legs',
    },
    {
      id: 'quads_group',
      kind: 'group',
      name: 'Quadriceps',
      slug: 'quads-group',
      description:
        'Four‑muscle group on the front of the thigh: rectus femoris, vastus lateralis, vastus medialis and vastus intermedius.',
      roleSummary:
        'Extend the knee, help flex the hip and keep the patella tracking so your knees survive heavy squats and lunges.',
      primaryFunctions: JSON.stringify([
        'knee extension',
        'assisting hip flexion (rectus femoris)',
        'patellar tracking and knee stability',
      ]),
      aestheticNotes: JSON.stringify([
        'Creates the side sweep and the “teardrop” above the knee.',
        'Turns stick legs into real wheels – thick thighs, no gap.',
      ]),
      meta: null,
      parentId: 'legs',
    },
    {
      id: 'calves_group',
      kind: 'group',
      name: 'Calves & Achilles Complex',
      slug: 'calves-group',
      description:
        'Gastrocnemius, soleus, tibialis anterior and the Achilles tendon that ties them into the heel.',
      roleSummary:
        'Drive plantarflexion and ankle stiffness for jumping and sprinting, while the tibialis controls foot strike and shin health.',
      primaryFunctions: JSON.stringify([
        'plantarflexion (pointing the foot)',
        'dorsiflexion (tibialis anterior pulling toes up)',
        'force transfer at the ankle via the Achilles tendon',
      ]),
      aestheticNotes: JSON.stringify([
        'Thick calves make the lower leg match big quads and hamstrings.',
        'Strong tibialis and calves prevent the “skinny ankle” look.',
      ]),
      meta: null,
      parentId: 'legs',
    },
    {
      id: 'hip_adductors_group',
      kind: 'group',
      name: 'Hip Adductors & Groin',
      slug: 'hip-adductors-group',
      description:
        'Adductor magnus, longus, brevis and gracilis running along the inner thigh – the groin complex.',
      roleSummary:
        'Control side‑to‑side stability, lock the femur into the hip socket and protect the groin during hard cuts and lateral work.',
      primaryFunctions: JSON.stringify([
        'hip adduction',
        'assisting hip extension (adductor magnus)',
        'stabilizing the pelvis during lateral movement',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds inner‑thigh meat for a thicker leg from the front.',
        'Prevents the “X‑frame up top, empty between the legs” look.',
      ]),
      meta: null,
      parentId: 'legs',
    },
    {
      id: 'hip_abductors_group',
      kind: 'group',
      name: 'Hip Abductors & TFL',
      slug: 'hip-abductors-group',
      description:
        'Glute med/min and tensor fasciae latae (TFL) on the side of the hip.',
      roleSummary:
        'Keep knees from caving in, control hip rotation and keep you stacked over your feet in squats, lunges and running.',
      primaryFunctions: JSON.stringify([
        'hip abduction',
        'hip rotation control',
        'pelvic stabilization in single‑leg stance',
      ]),
      aestheticNotes: JSON.stringify([
        'Builds side‑hip thickness that flows into the glute shelf.',
        'Makes side and 3/4 leg shots look athletic instead of flat.',
      ]),
      meta: null,
      parentId: 'legs',
    },
    {
      id: 'hip_flexors_group',
      kind: 'group',
      name: 'Hip Flexors (Psoas & Iliacus)',
      slug: 'hip-flexors-group',
      description:
        'Deep front‑of‑hip muscles (psoas major and iliacus) that connect spine and pelvis to the femur.',
      roleSummary:
        'Lift the thigh, stabilize the lumbar spine from the front and control the bottom position of squats and lunges.',
      primaryFunctions: JSON.stringify([
        'hip flexion',
        'lumbar spine stabilization from the front',
        'controlling hip position in deep flexion',
      ]),
      aestheticNotes: JSON.stringify([
        'Give the lower‑ab / hip crease that sharp athletic cut.',
      ]),
      meta: null,
      parentId: 'legs',
    },
    {
      id: 'anterior_shin_group',
      kind: 'group',
      name: 'Anterior Shin',
      slug: 'anterior-shin-group',
      description:
        'Tibialis anterior and supporting structures on the front of the shin.',
      roleSummary:
        'Control foot strike and deceleration so your knees stop eating every impact.',
      primaryFunctions: JSON.stringify([
        'dorsiflexion of the ankle',
        'eccentric control during heel strike when walking or running',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds visible muscle along the shin instead of “just bone”.',
      ]),
      meta: null,
      parentId: 'legs',
    },

    // Glutes
    {
      id: 'gluteus_maximus',
      kind: 'muscle',
      name: 'Gluteus Maximus',
      slug: 'gluteus-maximus',
      description:
        'The largest glute muscle, driving hip extension and powering sprints, jumps and heavy hip hinges.',
      roleSummary:
        'Primary engine of posterior‑chain power – if this is weak, you are leaving a ton of performance on the table.',
      primaryFunctions: JSON.stringify([
        'hip extension',
        'external rotation of the hip',
      ]),
      aestheticNotes: JSON.stringify([
        'Main driver of the round, muscular glute shape from the side and back.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'barbell_hip_thrusts',
        examplePage: 22,
      }),
      parentId: 'glutes_group',
    },
    {
      id: 'gluteus_medius',
      kind: 'muscle',
      name: 'Gluteus Medius',
      slug: 'gluteus-medius',
      description:
        'Fan‑shaped muscle on the outer hip that abducts and stabilizes the pelvis.',
      roleSummary:
        'Prevents knee cave and keeps hips level on single‑leg work and running.',
      primaryFunctions: JSON.stringify([
        'hip abduction',
        'pelvic stability in single‑leg stance',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds width and contour to the upper outer glute/hip.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'sumo_deadlift',
        examplePage: 23,
      }),
      parentId: 'glutes_group',
    },
    {
      id: 'gluteus_minimus',
      kind: 'muscle',
      name: 'Gluteus Minimus',
      slug: 'gluteus-minimus',
      description:
        'Deepest glute muscle, working with glute med and TFL to stabilize the hip.',
      roleSummary:
        'Fine‑tunes hip position and stability in deep flexion and lateral work.',
      primaryFunctions: JSON.stringify([
        'hip abduction',
        'internal rotation assistance',
      ]),
      aestheticNotes: JSON.stringify([
        'Helps “fill in” the side of the hip so there is no hollow gap above the greater trochanter.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'side_lying_leg_lift',
        examplePage: 23,
      }),
      parentId: 'glutes_group',
    },

    // Adductors & groin
    {
      id: 'adductor_group',
      kind: 'muscle',
      name: 'Adductor Complex',
      slug: 'adductor-group',
      description:
        'Inner‑thigh muscles (adductor magnus, longus, brevis) that pull the leg toward midline and assist hip extension.',
      roleSummary:
        'Stabilize the pelvis in lateral movement and help lock out heavy hip hinges and squats.',
      primaryFunctions: JSON.stringify([
        'hip adduction',
        'assisting hip extension',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds inner‑thigh fullness and eliminates the “gap” look.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'copenhagen_planks',
        examplePage: 25,
      }),
      parentId: 'hip_adductors_group',
    },
    {
      id: 'gracilis',
      kind: 'muscle',
      name: 'Gracilis',
      slug: 'gracilis',
      description:
        'Long, thin adductor that runs down the inner thigh and helps with hip adduction and knee flexion.',
      roleSummary:
        'Helps control the knee and groin area in cutting and deep knee flexion.',
      primaryFunctions: JSON.stringify([
        'hip adduction',
        'assists knee flexion',
      ]),
      aestheticNotes: JSON.stringify([
        'Contributes to inner‑thigh density along with the main adductor group.',
      ]),
      meta: null,
      parentId: 'hip_adductors_group',
    },

    // Abductors & TFL
    {
      id: 'tensor_fasciae_latae',
      kind: 'muscle',
      name: 'Tensor Fasciae Latae (TFL)',
      slug: 'tensor-fasciae-latae',
      description:
        'Small muscle on the front/side of the hip that connects into the IT band.',
      roleSummary:
        'Helps abduct and internally rotate the hip, while playing a big role in knee tracking and lateral stability.',
      primaryFunctions: JSON.stringify([
        'hip abduction',
        'hip internal rotation',
      ]),
      aestheticNotes: JSON.stringify([
        'Gives shape to the front‑side hip and ties into outer‑quad lines.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'side_lying_leg_raises',
        examplePage: 26,
      }),
      parentId: 'hip_abductors_group',
    },

    // Hamstrings
    {
      id: 'biceps_femoris_long_head',
      kind: 'muscle',
      name: 'Biceps Femoris (Long Head)',
      slug: 'biceps-femoris-long-head',
      description:
        'Long head of the biceps femoris crossing both the hip and knee, sitting on the outer posterior thigh.',
      roleSummary:
        'Major hip extensor and knee flexor that drives sprinting power and protects the hamstring from tearing.',
      primaryFunctions: JSON.stringify([
        'hip extension',
        'knee flexion',
      ]),
      aestheticNotes: JSON.stringify([
        'Creates the outer “hamstring sweep” from the back.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'romanian_deadlift',
        examplePage: 29,
      }),
      parentId: 'hamstrings_group',
    },
    {
      id: 'biceps_femoris_short_head',
      kind: 'muscle',
      name: 'Biceps Femoris (Short Head)',
      slug: 'biceps-femoris-short-head',
      description:
        'Short head of the biceps femoris crossing only the knee joint.',
      roleSummary:
        'Contributes to pure knee flexion strength and stability.',
      primaryFunctions: JSON.stringify([
        'knee flexion',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds extra density to the outer hamstring near the knee.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'leg_curls',
        examplePage: 30,
      }),
      parentId: 'hamstrings_group',
    },
    {
      id: 'semitendinosus',
      kind: 'muscle',
      name: 'Semitendinosus',
      slug: 'semitendinosus',
      description:
        'Long hamstring muscle running down the middle of the posterior thigh.',
      roleSummary:
        'Works with the other hamstrings to extend the hip and flex the knee, especially in stretched positions.',
      primaryFunctions: JSON.stringify([
        'hip extension',
        'knee flexion',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds thickness through the mid‑hamstring region.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'seated_barbell_good_mornings',
        examplePage: 28,
      }),
      parentId: 'hamstrings_group',
    },
    {
      id: 'semimembranosus',
      kind: 'muscle',
      name: 'Semimembranosus',
      slug: 'semimembranosus',
      description:
        'Broad hamstring muscle deep to semitendinosus on the inner back of the thigh.',
      roleSummary:
        'Assists hip extension and knee flexion, especially in deep hinge and bridge positions.',
      primaryFunctions: JSON.stringify([
        'hip extension',
        'knee flexion',
      ]),
      aestheticNotes: JSON.stringify([
        'Helps create a rounded inner‑hamstring look under the glutes.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'glute_bridge_feet_elevated',
        examplePage: 28,
      }),
      parentId: 'hamstrings_group',
    },

    // Quads
    {
      id: 'rectus_femoris',
      kind: 'muscle',
      name: 'Rectus Femoris',
      slug: 'rectus-femoris',
      description:
        'Bi‑articular quad muscle that crosses both the hip and knee on the front of the thigh.',
      roleSummary:
        'Helps flex the hip and extend the knee, especially in long‑range quad work.',
      primaryFunctions: JSON.stringify([
        'knee extension',
        'hip flexion assistance',
      ]),
      aestheticNotes: JSON.stringify([
        'Sits front‑and‑center on the thigh and makes the quad look full from the front.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'reverse_nordics',
        examplePage: 37,
      }),
      parentId: 'quads_group',
    },
    {
      id: 'vastus_lateralis',
      kind: 'muscle',
      name: 'Vastus Lateralis',
      slug: 'vastus-lateralis',
      description:
        'Outer quad muscle forming the lateral sweep of the thigh.',
      roleSummary:
        'Huge contributor to knee extension strength and lateral knee stability.',
      primaryFunctions: JSON.stringify([
        'knee extension',
      ]),
      aestheticNotes: JSON.stringify([
        'Main driver of visible quad sweep from the side.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'cossack_dumbbell_squat',
        examplePage: 37,
      }),
      parentId: 'quads_group',
    },
    {
      id: 'vastus_medialis',
      kind: 'muscle',
      name: 'Vastus Medialis',
      slug: 'vastus-medialis',
      description:
        'Inner quad muscle including the famous VMO fibers near the knee.',
      roleSummary:
        'Helps keep the patella tracking correctly and protects the knee in deep flexion.',
      primaryFunctions: JSON.stringify([
        'knee extension',
        'patellar tracking and medial knee stability',
      ]),
      aestheticNotes: JSON.stringify([
        'Creates the teardrop above the inside of the knee.',
      ]),
      meta: null,
      parentId: 'quads_group',
    },
    {
      id: 'vmo',
      kind: 'part',
      name: 'Vastus Medialis Oblique (VMO)',
      slug: 'vastus-medialis-oblique',
      description:
        'Oblique fibers of the vastus medialis that attach near the inner knee.',
      roleSummary:
        'Key to controlling knee tracking and avoiding “knees collapsing inward” under load.',
      primaryFunctions: JSON.stringify([
        'final degrees of knee extension',
        'patellar tracking',
      ]),
      aestheticNotes: JSON.stringify([
        'The sharp teardrop muscle that screams “my knees are bulletproof”.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'front_squats',
        examplePage: 38,
      }),
      parentId: 'quads_group',
    },
    {
      id: 'vastus_intermedius',
      kind: 'muscle',
      name: 'Vastus Intermedius',
      slug: 'vastus-intermedius',
      description:
        'Deep quad muscle sitting underneath rectus femoris.',
      roleSummary:
        'Supports overall quad size and strength through the full ROM.',
      primaryFunctions: JSON.stringify([
        'knee extension',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds thickness through the mid‑thigh when fully developed.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'leg_extensions',
        examplePage: 39,
      }),
      parentId: 'quads_group',
    },

    // Calves & shin
    {
      id: 'gastrocnemius',
      kind: 'muscle',
      name: 'Gastrocnemius',
      slug: 'gastrocnemius',
      description:
        'Two‑headed calf muscle crossing the knee and ankle, visible as the upper calf bump.',
      roleSummary:
        'Helps plantarflex the ankle and assists with knee flexion in dynamic movements.',
      primaryFunctions: JSON.stringify([
        'plantarflexion',
        'assists knee flexion',
      ]),
      aestheticNotes: JSON.stringify([
        'The main “ball” of the calf that pops from the side and back.',
      ]),
      meta: null,
      parentId: 'calves_group',
    },
    {
      id: 'soleus',
      kind: 'muscle',
      name: 'Soleus',
      slug: 'soleus',
      description:
        'Deep calf muscle that sits under the gastroc and attaches strongly to the Achilles.',
      roleSummary:
        'Provides endurance‑based plantarflexion strength and helps keep ankles stable.',
      primaryFunctions: JSON.stringify([
        'plantarflexion, especially with bent knee',
      ]),
      aestheticNotes: JSON.stringify([
        'Adds thickness lower on the calf and into the Achilles.',
      ]),
      meta: null,
      parentId: 'calves_group',
    },
    {
      id: 'tibialis_anterior',
      kind: 'muscle',
      name: 'Tibialis Anterior',
      slug: 'tibialis-anterior',
      description:
        'Shin muscle on the front of the lower leg that pulls the toes up toward the shin.',
      roleSummary:
        'Controls heel strike and deceleration and helps keep the knees happy when you walk or run.',
      primaryFunctions: JSON.stringify([
        'dorsiflexion of the ankle',
        'eccentric control in gait',
      ]),
      aestheticNotes: JSON.stringify([
        'Puts visible meat on the shin instead of just bone.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'kettlebell_toe_raises',
        examplePage: 40,
      }),
      parentId: 'anterior_shin_group',
    },

    // Hip flexors
    {
      id: 'psoas',
      kind: 'muscle',
      name: 'Psoas',
      slug: 'psoas',
      description:
        'Deep hip flexor running from the lumbar spine to the femur.',
      roleSummary:
        'Helps lift the thigh, stabilize the spine from the front and control deep hip flexion.',
      primaryFunctions: JSON.stringify([
        'hip flexion',
        'lumbar spine stabilization',
      ]),
      aestheticNotes: JSON.stringify([
        'When trained, tightens the lower‑ab/hip region instead of leaving it soft.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'reverse_squats',
        examplePage: 42,
      }),
      parentId: 'hip_flexors_group',
    },
    {
      id: 'iliacus',
      kind: 'muscle',
      name: 'Iliacus',
      slug: 'iliacus',
      description:
        'Fan‑shaped hip flexor lining the inside of the pelvis, joining with the psoas.',
      roleSummary:
        'Works with psoas to flex the hip and stabilize the pelvis in single‑leg stance.',
      primaryFunctions: JSON.stringify([
        'hip flexion',
        'pelvic stabilization',
      ]),
      aestheticNotes: JSON.stringify([
        'Supports athletic, “pulled in” look at the hip crease.',
      ]),
      meta: JSON.stringify({
        exampleExerciseId: 'reverse_lunges',
        examplePage: 43,
      }),
      parentId: 'hip_flexors_group',
    },

    // Tendon
    {
      id: 'achilles_tendon',
      kind: 'tendon',
      name: 'Achilles Tendon',
      slug: 'achilles-tendon',
      description:
        'Strongest tendon in the human body, connecting the calf muscles to the heel bone.',
      roleSummary:
        'Stores and releases elastic energy with every step and jump, and absorbs impact at the ankle.',
      primaryFunctions: JSON.stringify([
        'force transfer from calf to foot',
        'elastic recoil in running and jumping',
      ]),
      aestheticNotes: JSON.stringify([
        'Visible thick Achilles plus strong calves = athletic lower leg.',
      ]),
      meta: null,
      parentId: 'calves_group',
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
  // 2) GUIDE: LEGS
  // -----------------------------

  await prisma.guide.upsert({
    where: { id: 'legs' },
    update: {},
    create: {
      id: 'legs',
      slug: 'no-skipped-leg-days',
      title: 'No Skipped Leg Days (Leg Guide)',
      author: 'Uncle Rommy',
      primaryRegionId: 'legs',
    },
  });

  const sections = [
    {
      id: 'intro-never-skip-leg-day',
      guideId: 'legs',
      kind: 'intro',
      title: 'Why You Can’t Skip Leg Day',
      order: 1,
      content: `The opening pages call out the classic disaster: great upper body, TOOTHPICK LEGS.
Unproportional, awkward, & injury‑prone. Your boys roast your twig legs every chance they get.
Rommy admits he skipped legs for years and was operating at 50–60% capacity as a man.

He ties legs directly to:
- Posture (how you stand in a room)
- Pain (knees, hips, low back)
- Presence (whether your frame actually looks complete)

The message: a big torso on small legs is not impressive, it’s unfinished.
This guide exists so your lower body finally matches the upper body you’ve built.`,
    },
    {
      id: 'mindset-legs-natural-crusader',
      guideId: 'legs',
      kind: 'mindset',
      title: 'The Undeniable Standard – Legs Edition',
      order: 2,
      content: `The MINDSET section applies the Natural Crusader standard specifically to leg training.
No more “my legs are already big enough bro” or “I walk all day so that’s my leg day”.
Those rationalizations are framed as self‑sabotage.

Key ideas:
- Undeniable = you look powerful from every angle, not just from the front in a pump.
- Legs are the ultimate “no hiding” test; clothes can’t fake wheels.
- Discipline over ego: you train the hard, unsexy patterns (deep squats, hinges, mobility) weekly.
- You accept that your weak links (knees, hips, ankles) must be attacked, not avoided.

The Natural Crusader doesn’t cherry‑pick bodyparts. He builds total, undeniable structure – starting from the feet up.`,
    },
    {
      id: 'anatomy-overview-legs',
      guideId: 'legs',
      kind: 'anatomy',
      title: 'Leg Anatomy Overview – Posterior Chain First',
      order: 3,
      content: `Rommy breaks the legs into real, trainable chunks instead of random leg exercises.

He emphasizes the POSTERIOR CHAIN as the foundation:
- Erector Spinae (back of the spine)
- Glutes
- Hamstrings
- Calves
These are where your power and athletic prowess come from.

Then he layers in:
- Quads (front of the thigh) for strength, “wheels” and knee control.
- Hip Adductors (groin) for cuts, lateral power, and not tearing your groin.
- Hip Abductors & TFL for knee tracking and anti‑valgus (no knees caving in).
- Hip Flexors (psoas/iliacus) for spine and hip stability.
- Tibialis / shin + Achilles for impact control and strong ankles.

The point: when you understand these chunks, every exercise has a purpose.
You’re not just “doing leg day”; you’re training the entire lower‑body system.`,
    },
    {
      id: 'anatomy-glutes',
      guideId: 'legs',
      kind: 'anatomy',
      title: 'Glutes – Maximus, Medius, Minimus',
      order: 4,
      content: `Glutes get a dedicated breakdown.

Gluteus Maximus:
- Largest of the three glute muscles.
- Powers most movements like sprinting, jumping, hip thrusting and heavy RDLs.
- Example exercise: Barbell Hip Thrusts.

Gluteus Medius:
- Sits on the side of the hip.
- Stops your knees from diving inward and keeps your pelvis level on single‑leg work.
- Example exercise: Sumo Deadlift (hits glutes + adductors + medius hard).

Gluteus Minimus:
- Deepest of the glutes.
- Works with medius and TFL to stabilize the hip capsule.
- Example exercise: Side‑Lying Leg Lift.

The takeaway:
If your glutes are weak, you’re leaving a ton of strength, speed and posture on the table.
If they are strong, everything – squats, hinges, sprinting, walking – feels easier.`,
    },
    {
      id: 'anatomy-hip-adductors',
      guideId: 'legs',
      kind: 'anatomy',
      title: 'Adductors & Groin – The Inner Thigh Engine',
      order: 5,
      content: `Adductors are not just “groin muscles you tear playing rec‑league soccer”.
They are a massive strength and stability engine.

Main points:
- Adductors help with hip adduction but also assist hip extension (especially in deep squats and sumo pulls).
- A strong adductor complex keeps you glued to the floor during heavy squats and deadlifts.
- They play a huge role in lateral cuts, change of direction, and sprint mechanics.

Example exercise:
- Copenhagen Planks – brutal inner‑thigh isometrics that also challenge the obliques.
These are highlighted as a go‑to for groin resilience and adductor hypertrophy.`,
    },
    {
      id: 'anatomy-hip-abductors',
      guideId: 'legs',
      kind: 'anatomy',
      title: 'Abductors & TFL – Anti‑Valgus Guardians',
      order: 6,
      content: `This section zooms in on glute med, glute min and the TFL on the side of the hip.

Big ideas:
- These muscles keep your knees tracking over your toes instead of caving in.
- They stabilize the pelvis on single‑leg work and during running.
- When they’re weak, your knees suffer and your stride looks sloppy.

Example exercise:
- Side‑Lying Leg Raises (especially for the TFL and glute min).
You’re instructed to own long ranges of motion here – not ego weight – to bring control back to your hips.`,
    },
    {
      id: 'anatomy-hamstrings',
      guideId: 'legs',
      kind: 'anatomy',
      title: 'Hamstrings – Long Head, Short Head & Friends',
      order: 7,
      content: `Hamstrings are broken down into their key pieces:

- Biceps Femoris (long head): crosses hip and knee, main sprinting and hip‑hinge engine.
- Biceps Femoris (short head): crosses only the knee; pure knee‑flexion strength.
- Semitendinosus / Semimembranosus: inner hamstrings that support both hip and knee.

Example exercises:
- Nordic Curls for Biceps Femoris (insane eccentric hamstring strength).
- Seated Barbell Good Mornings for Semitendinosus.
- Glute Bridge (feet elevated) for deep hamstring + glute work.
- Romanian Deadlift for the long head and full posterior chain.
- Leg Curls for the short head.

Rommy stresses:
If you sprint, jump or play sports, eccentric hamstring strength is non‑negotiable.
Nordics + hinges + curls give you that armour.`,
    },
    {
      id: 'anatomy-quads',
      guideId: 'legs',
      kind: 'anatomy',
      title: 'Quads – Rectus, Sweep, VMO & Knee Health',
      order: 8,
      content: `Quadriceps get split into what matters for strength and knee health:

- Rectus Femoris: crosses hip and knee. Reverse Nordics torch this muscle through a long range.
- Vastus Lateralis: outer quad sweep. Cossack Dumbbell Squats hammer it in lateral and deep positions.
- Vastus Medialis & the VMO: inner quad and teardrop near the knee. Huge for patellar tracking.
- Vastus Intermedius: deep quad that supports full thigh thickness.

Example exercises:
- Reverse Nordics (rectus femoris + quad tendon strength).
- Cossack Dumbbell Squats (outer‑quad and lateral mobility).
- Front Squats – FULL range with a pause at the bottom to light up the VMO.
- Leg Extensions – used intelligently to target vastus intermedius and finish the quads.

Message:
We aren’t just training “quads” for pump – we’re building a knee that can handle deep flexion for decades.`,
    },
    {
      id: 'anatomy-calves-shin',
      guideId: 'legs',
      kind: 'anatomy',
      title: 'Calves, Tibialis & Achilles – Ankles of Steel',
      order: 9,
      content: `This section ties together the calf muscles, tibialis anterior and Achilles tendon.

Key points:
- Gastrocnemius + Soleus = powerful plantarflexion and spring for running and jumping.
- Tibialis Anterior = controls heel strike, deceleration and shin health.
- Achilles Tendon = the strongest tendon in the body, connecting calf to heel and acting as an elastic spring.

Example exercises:
- Kettlebell Toe Raises – a direct tibialis movement for bulletproof shins.
- Standing Calf Raises – “the only thing you need to know about growing the calf” done properly.

Most people live with weak ankles and calves, which wrecks knees and posture.
This program makes the ankle complex an actual training priority.`,
    },
    {
      id: 'strength-legs',
      guideId: 'legs',
      kind: 'strength',
      title: 'Strength – How We Load the Legs',
      order: 10,
      content: `The STRENGTH section explains how to make one brutal lower‑body strength driver the centerpiece.

Principles:
- Start with ONE heavy compound: Front Squats, Deficit Deadlifts, Full ROM Back Squats, Wide Stance Box Squats or Zercher Squats.
- Use Rommy’s drop‑set style:
  • Set 1: 3–4 rep max  
  • Set 2: drop ~20% and set a REP PR  
  • Set 3: drop another ~20% and set another REP PR
- Posterior chain is the priority – glutes and hamstrings get first crack at heavy weight.

This is your “number 1” strength slot of the week for legs.
You don’t chase 10 different PRs; you crush one big movement then move to focused hypertrophy and resilience work.`,
    },
    {
      id: 'muscle-growth-legs',
      guideId: 'legs',
      kind: 'program',
      title: 'Muscle Growth – Building Real Wheels',
      order: 11,
      content: `Here Rommy leans into hypertrophy.

He shows how to:
- Use single‑leg quad work (Reverse Lunges, Barbell Split Squats, Bulgarian Split Squats) to add clean size without wrecking your back.
- Pair heavy hamstring movements with high‑rep finishers:
  • RDLs / Zercher RDLs into Leg Curls, Reverse Hyperextensions or Glute Bridges.
- Use deep‑range squats and lunges to get more muscle fiber recruitment, not just heavier partials.

He also ties in the Extra Mobility work:
Cossack Squats, Reverse Nordics and Standing Good Mornings make your long‑range strength crazy – so muscle growth happens through a huge ROM instead of tiny, ego‑based ranges.`,
    },
    {
      id: 'injury-resilience-legs',
      guideId: 'legs',
      kind: 'anatomy',
      title: 'Injury Resilience – Knees, Hips & Ankles',
      order: 12,
      content: `This section connects all the “problem zones” most lifters complain about:

- Knees: supported by VMO, quads, tibialis and calf strength (Reverse Nordics, Leg Extensions, Kettlebell Toe Raises, Calf Raises).
- Hips: protected by strong adductors/abductors, glutes and hip flexors (Copenhagen Planks, Side‑Lying Leg Raises, Reverse Lunges).
- Ankles/Achilles: built up with calf work and backward walking on the treadmill.

Rommy’s philosophy:
REHAB = STRENGTHENING.

The very exercises that fix your pain – Nordics, Copenhagen’s, Reverse Squats, tibialis work – are baked into the main programming so you aren’t doing rehab “on the side”.
You just lift in a way that heals old tears and prevents new ones.`,
    },
    {
      id: 'extra-mobility-legs',
      guideId: 'legs',
      kind: 'mobility',
      title: 'Extra Mobility / Injury Resilience Exercises',
      order: 13,
      content: `Mobility is already baked into exercise selection, but this section gives you an “extra credit” menu.

Highlighted drills:
- Weighted Plate Mobility flow – plate‑loaded squat + hinge + ankle work.
- Cossack Barbell/Dumbbell Squats – lateral mobility plus brutal adductor/quad work.
- Reverse Nordics – long‑range quad and tendon strength.
- Standing Good Mornings – hamstring and back‑line mobility under load.
- Nordic Curls – long‑range hamstring strength/resilience.
- Backwards walking on the treadmill – knee‑friendly volume for knees and calves.
- Tibialis raises – shin armour.

Do these a few times per week and you’ll feel the “hurts so good” relief Rommy talks about: pain decreased, range increased, and legs that finally move like an athlete’s.`,
    },
    {
      id: 'snipers-leg-day',
      guideId: 'legs',
      kind: 'program',
      title: 'THE SNIPER’S LEG DAY (THE LEG DAY FORMULA)',
      order: 14,
      content: `This is the full plug‑and‑play Leg Day Formula.

The structure:
1) Warm‑Up (2 rounds)
   - Weighted Plate Mobility flow to open ankles, knees and hips.

2) Strength – NUMBER 1 Movement (Pick 1)
   - Front Squats
   - Deficit Deadlifts
   - Full ROM Back Squats
   - Wide Stance Box Squats
   - Zercher Squats
   Run the 3–set drop‑set strength scheme here.

3) Posterior Chain / Hamstring Power
   - Standing Good Mornings
   - RDL / Zercher RDL’s
   - Nordic Curls
   - Barbell Hip Thrusts or Glute Bridges
   Focus on controlled heavy sets, then pump‑style back‑off work.

4) Single‑Leg Quad Work (Pick 1)
   - Reverse Lunges  
   - Barbell Split Squats  
   - Bulgarian Split Squats  
   3 sets failing between ~8–12 reps per leg.

5) Hamstring SUPERSET
   1st Move (8–12 reps): Leg Curls / Deadlifts / Zercher Deadlifts / Zercher RDL’s / Nordic Curls  
   2nd Move: high‑rep hamstring finisher (Glute Bridges, Reverse Hypers, etc.) to complete failure.

6) Knee/VMO / Tibialis Block
   - Leg Extensions, Sissy Squats, Reverse Nordics, Kettlebell Toe Raises, Backwards Treadmill Walking.

7) Injury Resilience / Finisher
   - Side‑Lying Leg Raises, Copenhagen’s, extra calf work and optional pistol/hindu squats for bodyweight mastery.

The idea:
You walk in with a map – pick from the listed options and follow the schemes.
No more “random leg day” – just a deadly, repeatable formula.`,
    },
    {
      id: 'bonus-leg-exercise-library',
      guideId: 'legs',
      kind: 'program',
      title: 'BONUS – Leg Exercise Library (Clickable Tutorials)',
      order: 15,
      content: `Because you trusted Rommy in a world full of fake naturals, you get a full clickable Leg exercise library.

The pages list:
- All the big posterior‑chain lifts (Sumo Deadlift, Zercher Deadlifts, Zercher RDL’s, Barbell/DB RDL’s, Standing Good Mornings, Hyperextension Rows, Reverse Hypers).
- Single‑leg monsters (Reverse Lunges, Barbell Split Squats, Bulgarian Split Squats, Single‑Leg DB RDLs, Pistol Squats).
- Quad tools (Front Squats, Cossack Squats, Leg Press, Leg Extensions, Sissy Squats, Reverse Nordics, Heel‑Elevated Squats).
- Hip/groin tools (Copenhagen’s, Side‑Lying Leg Raises).
- Calf and tibialis work (Kettlebell Toe Raises, Standing Calf Raises).
- Mobility flows (Weighted Plate Mobility and friends).

Think of this as your menu when you rotate exercises without changing the intent of the program.
CLICK each exercise in the app to watch Rommy demo how to do it properly.`,
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
    { sectionId: 'intro-never-skip-leg-day', anatomyNodeId: 'legs' },
    { sectionId: 'intro-never-skip-leg-day', anatomyNodeId: 'glutes_group' },
    { sectionId: 'intro-never-skip-leg-day', anatomyNodeId: 'quads_group' },
    { sectionId: 'intro-never-skip-leg-day', anatomyNodeId: 'hamstrings_group' },
    { sectionId: 'intro-never-skip-leg-day', anatomyNodeId: 'calves_group' },

    // mindset
    { sectionId: 'mindset-legs-natural-crusader', anatomyNodeId: 'legs' },

    // overview
    { sectionId: 'anatomy-overview-legs', anatomyNodeId: 'glutes_group' },
    { sectionId: 'anatomy-overview-legs', anatomyNodeId: 'hamstrings_group' },
    { sectionId: 'anatomy-overview-legs', anatomyNodeId: 'quads_group' },
    { sectionId: 'anatomy-overview-legs', anatomyNodeId: 'calves_group' },
    { sectionId: 'anatomy-overview-legs', anatomyNodeId: 'hip_adductors_group' },
    { sectionId: 'anatomy-overview-legs', anatomyNodeId: 'hip_abductors_group' },
    { sectionId: 'anatomy-overview-legs', anatomyNodeId: 'hip_flexors_group' },
    { sectionId: 'anatomy-overview-legs', anatomyNodeId: 'anterior_shin_group' },
    { sectionId: 'anatomy-overview-legs', anatomyNodeId: 'achilles_tendon' },

    // glutes
    { sectionId: 'anatomy-glutes', anatomyNodeId: 'glutes_group' },
    { sectionId: 'anatomy-glutes', anatomyNodeId: 'gluteus_maximus' },
    { sectionId: 'anatomy-glutes', anatomyNodeId: 'gluteus_medius' },
    { sectionId: 'anatomy-glutes', anatomyNodeId: 'gluteus_minimus' },

    // adductors
    { sectionId: 'anatomy-hip-adductors', anatomyNodeId: 'hip_adductors_group' },
    { sectionId: 'anatomy-hip-adductors', anatomyNodeId: 'adductor_group' },
    { sectionId: 'anatomy-hip-adductors', anatomyNodeId: 'gracilis' },

    // abductors / TFL
    { sectionId: 'anatomy-hip-abductors', anatomyNodeId: 'hip_abductors_group' },
    { sectionId: 'anatomy-hip-abductors', anatomyNodeId: 'tensor_fasciae_latae' },
    { sectionId: 'anatomy-hip-abductors', anatomyNodeId: 'gluteus_medius' },
    { sectionId: 'anatomy-hip-abductors', anatomyNodeId: 'gluteus_minimus' },

    // hamstrings
    { sectionId: 'anatomy-hamstrings', anatomyNodeId: 'hamstrings_group' },
    { sectionId: 'anatomy-hamstrings', anatomyNodeId: 'biceps_femoris_long_head' },
    { sectionId: 'anatomy-hamstrings', anatomyNodeId: 'biceps_femoris_short_head' },
    { sectionId: 'anatomy-hamstrings', anatomyNodeId: 'semitendinosus' },
    { sectionId: 'anatomy-hamstrings', anatomyNodeId: 'semimembranosus' },

    // quads
    { sectionId: 'anatomy-quads', anatomyNodeId: 'quads_group' },
    { sectionId: 'anatomy-quads', anatomyNodeId: 'rectus_femoris' },
    { sectionId: 'anatomy-quads', anatomyNodeId: 'vastus_lateralis' },
    { sectionId: 'anatomy-quads', anatomyNodeId: 'vastus_medialis' },
    { sectionId: 'anatomy-quads', anatomyNodeId: 'vmo' },
    { sectionId: 'anatomy-quads', anatomyNodeId: 'vastus_intermedius' },

    // calves / shin
    { sectionId: 'anatomy-calves-shin', anatomyNodeId: 'calves_group' },
    { sectionId: 'anatomy-calves-shin', anatomyNodeId: 'gastrocnemius' },
    { sectionId: 'anatomy-calves-shin', anatomyNodeId: 'soleus' },
    { sectionId: 'anatomy-calves-shin', anatomyNodeId: 'tibialis_anterior' },
    { sectionId: 'anatomy-calves-shin', anatomyNodeId: 'achilles_tendon' },

    // strength & programming
    { sectionId: 'strength-legs', anatomyNodeId: 'glutes_group' },
    { sectionId: 'strength-legs', anatomyNodeId: 'hamstrings_group' },
    { sectionId: 'strength-legs', anatomyNodeId: 'quads_group' },
    { sectionId: 'strength-legs', anatomyNodeId: 'calves_group' },

    { sectionId: 'muscle-growth-legs', anatomyNodeId: 'glutes_group' },
    { sectionId: 'muscle-growth-legs', anatomyNodeId: 'hamstrings_group' },
    { sectionId: 'muscle-growth-legs', anatomyNodeId: 'quads_group' },
    { sectionId: 'muscle-growth-legs', anatomyNodeId: 'hip_adductors_group' },
    { sectionId: 'muscle-growth-legs', anatomyNodeId: 'hip_abductors_group' },

    // injury resilience & mobility
    { sectionId: 'injury-resilience-legs', anatomyNodeId: 'quads_group' },
    { sectionId: 'injury-resilience-legs', anatomyNodeId: 'vmo' },
    { sectionId: 'injury-resilience-legs', anatomyNodeId: 'hamstrings_group' },
    { sectionId: 'injury-resilience-legs', anatomyNodeId: 'hip_adductors_group' },
    { sectionId: 'injury-resilience-legs', anatomyNodeId: 'hip_abductors_group' },
    { sectionId: 'injury-resilience-legs', anatomyNodeId: 'anterior_shin_group' },
    { sectionId: 'injury-resilience-legs', anatomyNodeId: 'calves_group' },
    { sectionId: 'injury-resilience-legs', anatomyNodeId: 'achilles_tendon' },

    { sectionId: 'extra-mobility-legs', anatomyNodeId: 'quads_group' },
    { sectionId: 'extra-mobility-legs', anatomyNodeId: 'hamstrings_group' },
    { sectionId: 'extra-mobility-legs', anatomyNodeId: 'hip_adductors_group' },
    { sectionId: 'extra-mobility-legs', anatomyNodeId: 'hip_abductors_group' },
    { sectionId: 'extra-mobility-legs', anatomyNodeId: 'anterior_shin_group' },
    { sectionId: 'extra-mobility-legs', anatomyNodeId: 'calves_group' },

    // formula & workout overview
    { sectionId: 'snipers-leg-day', anatomyNodeId: 'legs' },
    { sectionId: 'snipers-leg-day', anatomyNodeId: 'glutes_group' },
    { sectionId: 'snipers-leg-day', anatomyNodeId: 'hamstrings_group' },
    { sectionId: 'snipers-leg-day', anatomyNodeId: 'quads_group' },
    { sectionId: 'snipers-leg-day', anatomyNodeId: 'calves_group' },

    { sectionId: 'bonus-leg-exercise-library', anatomyNodeId: 'legs' },
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
  // 3) EXERCISES – LEGS
  // -----------------------------

  const exercises = [
    // --- Warm‑up & mobility ---
    {
      id: 'weighted_plate_mobility',
      name: 'Weighted Plate Mobility',
      type: 'mobility',
      movementPattern: 'sequence',
      equipment: ['weight_plate'],
      primaryMuscles: ['quads_group', 'glutes_group', 'hip_flexors_group'],
      secondaryMuscles: ['hamstrings_group', 'calves_group'],
      videoUrl: 'https://youtube.com/shorts/YF638a7sx5g?si=L2pbm61lgVEm2heJ',
      cueSummary:
        'Hold a light plate and cycle through deep squats, hinges and ankle rocks to open hips, knees and ankles.',
      mentionedInSections: ['extra-mobility-legs', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'cossack_dumbbell_squat',
      name: 'Cossack Dumbbell Squat',
      type: 'mobility',
      movementPattern: 'squat',
      equipment: ['dumbbell'],
      primaryMuscles: ['vastus_lateralis', 'adductor_group'],
      secondaryMuscles: ['gluteus_medius', 'gluteus_minimus'],
      videoUrl: 'https://youtube.com/shorts/ZPRa8nvNNqo?si=dT-NRqdYa2wVO4FE',
      cueSummary:
        'Step wide, sit deeply over one heel while keeping the other leg straight, chest tall and heel rooted.',
      mentionedInSections: ['anatomy-quads', 'extra-mobility-legs', 'bonus-leg-exercise-library'],
    },
    {
      id: 'cossack_barbell_squats',
      name: 'Cossack Barbell Squats',
      type: 'mobility',
      movementPattern: 'squat',
      equipment: ['barbell'],
      primaryMuscles: ['vastus_lateralis', 'adductor_group', 'quads_group'],
      secondaryMuscles: ['gluteus_medius', 'gluteus_minimus'],
      videoUrl: 'https://youtube.com/shorts/ZPRa8nvNNqo?si=dT-NRqdYa2wVO4FE',
      cueSummary:
        'Barbell version of Cossack squats – step wide, shift side to side into deep single-leg positions while the bar stays centered over your base.',
      mentionedInSections: ['anatomy-quads', 'extra-mobility-legs', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'full_body_mobility_movement',
      name: 'Full Body Mobility Movement',
      type: 'mobility',
      movementPattern: 'sequence',
      equipment: ['bodyweight'],
      primaryMuscles: ['quads_group', 'hamstrings_group', 'hip_flexors_group'],
      secondaryMuscles: ['glutes_group', 'calves_group'],
      videoUrl: null,
      cueSummary:
        'Dynamic mobility flow combining hip openers, hamstring stretches, and ankle work to prepare the entire lower body for training.',
      mentionedInSections: ['extra-mobility-legs', 'bonus-leg-exercise-library'],
    },

    // --- Big strength compounds ---
    {
      id: 'front_squats',
      name: 'Front Squats',
      type: 'compound',
      movementPattern: 'squat',
      equipment: ['barbell', 'squat_rack'],
      primaryMuscles: ['quads_group', 'vmo', 'rectus_femoris'],
      secondaryMuscles: ['gluteus_maximus', 'erector_spinae'],
      videoUrl: 'https://youtube.com/shorts/_kr_7Ls-hxo?si=kWKP--2KHC8USX9c',
      cueSummary:
        'Bar on the front rack, elbows high, full depth with knees tracking over toes, pause at the bottom then drive up.',
      mentionedInSections: ['anatomy-quads', 'strength-legs', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'deficit_deadlifts',
      name: 'Deficit Deadlifts',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['barbell'],
      primaryMuscles: ['hamstrings_group', 'gluteus_maximus'],
      secondaryMuscles: ['erector_spinae', 'adductor_group'],
      videoUrl: null,
      cueSummary:
        'Stand on a small plate or block, push hips back, keep shins close to the bar and pull from a deeper starting position.',
      mentionedInSections: ['strength-legs', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'full_rom_back_squats',
      name: 'Full ROM Back Squats',
      type: 'compound',
      movementPattern: 'squat',
      equipment: ['barbell', 'squat_rack'],
      primaryMuscles: ['quads_group', 'gluteus_maximus'],
      secondaryMuscles: ['hamstrings_group', 'calves_group'],
      videoUrl: 'https://youtube.com/shorts/zL8Zjx6jmt0?si=J27wiUlYWuUhgMvV',
      cueSummary:
        'Bar on the upper back, brace hard and sit into a controlled full‑depth squat before driving back up.',
      mentionedInSections: ['strength-legs', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'wide_stance_box_squats',
      name: 'Wide Stance Box Squats',
      type: 'compound',
      movementPattern: 'squat',
      equipment: ['barbell', 'box', 'squat_rack'],
      primaryMuscles: ['gluteus_maximus', 'hamstrings_group', 'adductor_group'],
      secondaryMuscles: ['quads_group'],
      videoUrl: 'https://youtube.com/shorts/vAmZHum9FFo?feature=share',
      cueSummary:
        'Take a wide stance, sit back to a box under control, pause lightly then drive up through heels and hips.',
      mentionedInSections: ['strength-legs', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'zercher_squats',
      name: 'Zercher Squats',
      type: 'compound',
      movementPattern: 'squat',
      equipment: ['barbell'],
      primaryMuscles: ['quads_group', 'gluteus_maximus'],
      secondaryMuscles: ['erector_spinae', 'hip_flexors_group'],
      videoUrl: 'https://youtube.com/shorts/AuyDBP63LEY?si=sgVDH1wASj1vAPZt',
      cueSummary:
        'Cradle the bar in your elbows, stay upright and sit between your hips with full control before standing tall.',
      mentionedInSections: ['strength-legs', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },

    // --- Posterior chain compounds & hamstring work ---
    {
      id: 'sumo_deadlift',
      name: 'Sumo Deadlift',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['barbell'],
      primaryMuscles: ['gluteus_maximus', 'gluteus_medius', 'adductor_group'],
      secondaryMuscles: ['hamstrings_group', 'erector_spinae'],
      videoUrl: 'https://youtube.com/shorts/9L__IsQ0HD0?si=Y3_9istOESLf6cu6',
      cueSummary:
        'Wide stance, toes out, push knees out and drive through the floor keeping the bar close and hips in line with shoulders.',
      mentionedInSections: [
        'anatomy-glutes',
        'strength-legs',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },
    {
      id: 'barbell_hip_thrusts',
      name: 'Barbell Hip Thrusts',
      type: 'compound',
      movementPattern: 'bridge',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['gluteus_maximus'],
      secondaryMuscles: ['hamstrings_group'],
      videoUrl: 'https://youtube.com/shorts/d0wZXa55gIc?feature=share',
      cueSummary:
        'Upper back on bench, shins vertical at the top, drive hips up and squeeze glutes hard with a brief pause each rep.',
      mentionedInSections: [
        'anatomy-glutes',
        'strength-legs',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },
    {
      id: 'romanian_deadlift',
      name: 'Romanian Deadlift',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['barbell'],
      primaryMuscles: ['biceps_femoris_long_head', 'semitendinosus', 'semimembranosus'],
      secondaryMuscles: ['gluteus_maximus', 'erector_spinae'],
      videoUrl: 'https://youtube.com/shorts/HB9wcnBwrKs?si=VuEw23dvnYNSTT0T',
      cueSummary:
        'Soft knees, slide the bar down your thighs while pushing hips back, feel the stretch, then snap hips forward.',
      mentionedInSections: [
        'anatomy-hamstrings',
        'strength-legs',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },
    {
      id: 'seated_barbell_good_mornings',
      name: 'Seated Barbell Good Mornings',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['barbell', 'bench'],
      primaryMuscles: ['semitendinosus', 'semimembranosus', 'erector_spinae'],
      secondaryMuscles: ['gluteus_maximus'],
      videoUrl: 'https://youtube.com/shorts/pZ4Cf3mZT80?si=Hex5SJIKIqNPM2-7',
      cueSummary:
        'Sit on a bench with bar on your back, hinge forward from the hips keeping a flat back, then return upright.',
      mentionedInSections: ['anatomy-hamstrings', 'extra-mobility-legs', 'bonus-leg-exercise-library'],
    },
    {
      id: 'standing_good_mornings',
      name: 'Standing Good Mornings',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['barbell'],
      primaryMuscles: ['hamstrings_group', 'erector_spinae', 'gluteus_maximus'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/_VCcyoM5x0M?feature=share',
      cueSummary:
        'Bar on back, hinge at the hips while keeping a neutral spine, push hips back and feel the hamstring stretch, then drive hips forward to stand.',
      mentionedInSections: ['extra-mobility-legs', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'glute_bridge_feet_elevated',
      name: 'Glute Bridge (Feet Elevated)',
      type: 'compound',
      movementPattern: 'bridge',
      equipment: ['bench'],
      primaryMuscles: ['semimembranosus', 'gluteus_maximus'],
      secondaryMuscles: ['hamstrings_group'],
      videoUrl: 'https://youtube.com/shorts/90WIwJDkKb8?si=yVwYGoWEFJ_9LLyd',
      cueSummary:
        'Feet on a bench or box, drive hips up by squeezing hamstrings and glutes, control the eccentric down.',
      mentionedInSections: ['anatomy-hamstrings', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'hyperextension_rows',
      name: 'Hyperextension Rows',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['hyperextension_bench', 'dumbbell'],
      primaryMuscles: ['erector_spinae', 'gluteus_maximus'],
      secondaryMuscles: ['hamstrings_group'],
      videoUrl: 'https://www.youtube.com/shorts/AXbpcPCz_DE',
      cueSummary:
        'On a hyper bench, hinge down then extend your back while rowing the weight to your torso, squeezing glutes and mid‑back.',
      mentionedInSections: [
        'anatomy-hamstrings',
        'anatomy-overview-legs',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },

    {
      id: 'nordic_curls',
      name: 'Nordic Curls',
      type: 'isolation',
      movementPattern: 'hinge',
      equipment: ['bodyweight'],
      primaryMuscles: ['biceps_femoris_long_head', 'semitendinosus', 'semimembranosus'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/_VCcyoM5x0M?feature=share',
      cueSummary:
        'Anchor your heels, lower your body under control like a falling plank, then push off the floor as needed to return.',
      mentionedInSections: [
        'anatomy-hamstrings',
        'extra-mobility-legs',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },
    {
      id: 'leg_curls',
      name: 'Leg Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['machine'],
      primaryMuscles: ['biceps_femoris_short_head', 'hamstrings_group'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/vYtA61hKcMc',
      cueSummary:
        'Lock your hips down, curl the pad toward your glutes with control and squeeze at the top before lowering slowly.',
      mentionedInSections: ['anatomy-hamstrings', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'cable_hamstring_curls',
      name: 'Cable Hamstring Curls',
      type: 'isolation',
      movementPattern: 'curl',
      equipment: ['cable'],
      primaryMuscles: ['hamstrings_group'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/ctgmcE6dFqY?si=B_GanDYlheWJR3Vv',
      cueSummary:
        'With an ankle strap on a low cable, curl your heel toward your glute under full control, one leg at a time.',
      mentionedInSections: ['snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'reverse_hyperextensions',
      name: 'Reverse Hyperextensions',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['machine'],
      primaryMuscles: ['gluteus_maximus', 'hamstrings_group'],
      secondaryMuscles: ['erector_spinae'],
      videoUrl: 'https://youtube.com/shorts/pvRph-y7JWE?si=Ozb6WYbFKPBjRbS-',
      cueSummary:
        'On a reverse hyper, swing legs up by squeezing glutes and hamstrings, then control the swing down.',
      mentionedInSections: ['snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'zercher_deadlifts',
      name: 'Zercher Deadlifts',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['barbell'],
      primaryMuscles: ['gluteus_maximus', 'hamstrings_group', 'quads_group'],
      secondaryMuscles: ['erector_spinae'],
      videoUrl: null,
      cueSummary:
        'Cradle the bar in your elbows, hinge and squat down to the bar, then stand tall keeping the core braced.',
      mentionedInSections: ['snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'zercher_rdls',
      name: 'Zercher RDLs',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['barbell'],
      primaryMuscles: ['hamstrings_group', 'gluteus_maximus'],
      secondaryMuscles: ['erector_spinae'],
      videoUrl: null,
      cueSummary:
        'Hold bar in the elbows like a Zercher squat, push hips back into a hinge while maintaining a strong brace.',
      mentionedInSections: ['snipers-leg-day', 'bonus-leg-exercise-library'],
    },

    // --- Single‑leg quad & hip work ---
    {
      id: 'reverse_lunges',
      name: 'Reverse Lunges',
      type: 'compound',
      movementPattern: 'lunge',
      equipment: ['barbell'],
      primaryMuscles: ['gluteus_maximus', 'quads_group'],
      secondaryMuscles: ['hamstrings_group', 'iliacus'],
      videoUrl: 'https://youtube.com/shorts/blQOb3eFwlo?si=zfeXWIdTHepXJ1Qg',
      cueSummary:
        'Step back into a lunge, keep front knee over mid‑foot and drive through the front heel to stand.',
      mentionedInSections: [
        'anatomy-quads',
        'injury-resilience-legs',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },
    {
      id: 'barbell_split_squats',
      name: 'Barbell Split Squats',
      type: 'compound',
      movementPattern: 'lunge',
      equipment: ['barbell'],
      primaryMuscles: ['quads_group', 'gluteus_maximus'],
      secondaryMuscles: ['hamstrings_group', 'hip_abductors_group'],
      videoUrl: 'https://youtube.com/shorts/CczP0LkqDWk?si=tb_p1DYOHPyVfFD3',
      cueSummary:
        'Set up in a long split stance, drop back knee toward the floor and drive up through the front leg.',
      mentionedInSections: ['muscle-growth-legs', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'bulgarian_split_squats',
      name: 'Bulgarian Split Squats',
      type: 'compound',
      movementPattern: 'lunge',
      equipment: ['bench', 'dumbbell'],
      primaryMuscles: ['quads_group', 'gluteus_maximus'],
      secondaryMuscles: ['hamstrings_group'],
      videoUrl: 'https://youtube.com/shorts/vAmZHum9FFo?feature=share',
      cueSummary:
        'Back foot on a bench, sink into the front leg and keep torso slightly forward, pushing through the mid‑foot.',
      mentionedInSections: ['muscle-growth-legs', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'heel_elevated_squats',
      name: 'Heel Elevated Squats',
      type: 'compound',
      movementPattern: 'squat',
      equipment: ['barbell', 'plates'],
      primaryMuscles: ['vmo', 'vastus_medialis', 'quads_group'],
      secondaryMuscles: ['gluteus_maximus'],
      videoUrl: 'https://youtube.com/shorts/AuyDBP63LEY?si=sgVDH1wASj1vAPZt',
      cueSummary:
        'Elevate your heels on plates, stay upright and sit knees forward over toes to bias quads and VMO.',
      mentionedInSections: ['anatomy-quads', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'sissy_squats',
      name: 'Sissy Squats',
      type: 'isolation',
      movementPattern: 'squat',
      equipment: ['bodyweight'],
      primaryMuscles: ['rectus_femoris', 'vastus_intermedius', 'vmo'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/iNM906nuOQM?feature=share',
      cueSummary:
        'Hold onto support, push knees far over toes and lean back, lowering under control then driving back up.',
      mentionedInSections: ['anatomy-quads', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'reverse_nordics',
      name: 'Reverse Nordics',
      type: 'mobility',
      movementPattern: 'squat',
      equipment: ['bodyweight'],
      primaryMuscles: ['rectus_femoris', 'vastus_intermedius'],
      secondaryMuscles: ['vmo'],
      videoUrl: 'https://youtube.com/shorts/wbxSxWOn9Eg?si=JSO-9nNArsdhTqde',
      cueSummary:
        'Kneel tall, squeeze glutes and slowly lean back keeping a straight line from knees to shoulders, then return.',
      mentionedInSections: [
        'anatomy-quads',
        'injury-resilience-legs',
        'extra-mobility-legs',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },
    {
      id: 'leg_press_machine',
      name: 'Leg Press Machine',
      type: 'compound',
      movementPattern: 'squat',
      equipment: ['machine'],
      primaryMuscles: ['quads_group', 'gluteus_maximus'],
      secondaryMuscles: ['hamstrings_group'],
      videoUrl: null,
      cueSummary:
        'Feet on platform, control the lowering to deep flexion then drive the sled away without locking knees violently.',
      mentionedInSections: ['muscle-growth-legs', 'bonus-leg-exercise-library'],
    },
    {
      id: 'leg_extensions',
      name: 'Leg Extensions',
      type: 'isolation',
      movementPattern: 'extension',
      equipment: ['machine'],
      primaryMuscles: ['vastus_intermedius', 'vastus_medialis', 'vmo'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/vYtA61hKcMc?feature=share',
      cueSummary:
        'Lock hips down, extend knees fully with control, hold the top squeeze before lowering under tension.',
      mentionedInSections: [
        'anatomy-quads',
        'injury-resilience-legs',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },

    // --- Hip abductors/adductors / side chain ---
    {
      id: 'side_lying_leg_lift',
      name: 'Side‑Lying Leg Lift',
      type: 'isolation',
      movementPattern: 'leg_raise',
      equipment: ['bodyweight'],
      primaryMuscles: ['gluteus_minimus', 'gluteus_medius'],
      secondaryMuscles: ['tensor_fasciae_latae'],
      videoUrl: 'https://youtube.com/shorts/pKn8ST8oudM?si=7RhEZkTnwPZGoXcg',
      cueSummary:
        'Lying on your side, raise the top leg in line with your body, toes slightly down, and squeeze the side hip.',
      mentionedInSections: ['anatomy-glutes', 'injury-resilience-legs', 'bonus-leg-exercise-library'],
    },
    {
      id: 'side_lying_leg_raises',
      name: 'Side‑Lying Leg Raises',
      type: 'isolation',
      movementPattern: 'leg_raise',
      equipment: ['bodyweight'],
      primaryMuscles: ['tensor_fasciae_latae', 'gluteus_minimus'],
      secondaryMuscles: ['gluteus_medius'],
      videoUrl: 'https://youtube.com/shorts/pKn8ST8oudM?si=7RhEZkTnwPZGoXcg',
      cueSummary:
        'Similar to the leg lift, but focus on long range and high reps to pump the TFL and side hip.',
      mentionedInSections: [
        'anatomy-hip-abductors',
        'injury-resilience-legs',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },
    {
      id: 'copenhagen_planks',
      name: 'Copenhagen Planks',
      type: 'mobility',
      movementPattern: 'hold',
      equipment: ['bench'],
      primaryMuscles: ['adductor_group'],
      secondaryMuscles: ['gracilis'],
      videoUrl: 'https://youtube.com/shorts/JMD4sZEBePk?si=QPDAWJ6IkjkTN7tf',
      cueSummary:
        'Top leg on a bench, body in a side‑plank line, squeeze inner thigh to hold position and own the burn.',
      mentionedInSections: [
        'anatomy-hip-adductors',
        'injury-resilience-legs',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },

    // --- Hip flexors & core connection ---
    {
      id: 'reverse_squats',
      name: 'Reverse Squats',
      type: 'isolation',
      movementPattern: 'leg_raise',
      equipment: ['cable'],
      primaryMuscles: ['psoas'],
      secondaryMuscles: ['iliacus', 'rectus_femoris'],
      videoUrl: 'https://youtube.com/shorts/HWu3LfM1zq8?feature=share',
      cueSummary:
        'With a belt or strap around your hips on a low cable, sit back and let the weight pull you into flexion, then drive hips through.',
      mentionedInSections: [
        'anatomy-quads',
        'injury-resilience-legs',
        'extra-mobility-legs',
        'bonus-leg-exercise-library',
      ],
    },

    // --- Calves & tibialis ---
    {
      id: 'kettlebell_toe_raises',
      name: 'Kettlebell Toe Raises',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['kettlebell'],
      primaryMuscles: ['tibialis_anterior'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/bgcBRv6fC64?si=-xrBaCPWwB1r7ZHS',
      cueSummary:
        'Hold a kettlebell over your toes and repeatedly pull the front of your foot up toward your shin.',
      mentionedInSections: [
        'anatomy-calves-shin',
        'injury-resilience-legs',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },
    {
      id: 'standing_calf_raises',
      name: 'Standing Calf Raises',
      type: 'isolation',
      movementPattern: 'raise',
      equipment: ['machine'],
      primaryMuscles: ['gastrocnemius', 'soleus'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/_gp4zLx00U8?feature=share',
      cueSummary:
        'Stand tall, rise onto the balls of your feet, squeeze the calves hard and lower under full control.',
      mentionedInSections: [
        'anatomy-calves-shin',
        'snipers-leg-day',
        'bonus-leg-exercise-library',
      ],
    },
    {
      id: 'backward_treadmill_walk',
      name: 'Backward Walking on the Treadmill',
      type: 'mobility',
      movementPattern: 'walk',
      equipment: ['treadmill'],
      primaryMuscles: ['quads_group', 'tibialis_anterior', 'calves_group'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/ybtXXzTnj4w?feature=share',
      cueSummary:
        'Walk slowly backward on a slight incline, staying tall and letting quads and shins handle the deceleration.',
      mentionedInSections: ['injury-resilience-legs', 'snipers-leg-day', 'bonus-leg-exercise-library'],
    },

    // --- Extra tools / library items ---
    {
      id: 'single_leg_db_rdls',
      name: 'Single‑Leg DB RDLs',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['dumbbell'],
      primaryMuscles: ['hamstrings_group', 'gluteus_maximus'],
      secondaryMuscles: ['gluteus_medius'],
      videoUrl: 'https://youtube.com/shorts/vYtA61hKcMc',
      cueSummary:
        'Balance on one leg, hinge at the hip while the dumbbell drops toward the floor, then snap back up by driving the hip through.',
      mentionedInSections: ['muscle-growth-legs', 'bonus-leg-exercise-library'],
    },
    {
      id: 'db_rdls',
      name: 'DB RDLs',
      type: 'compound',
      movementPattern: 'hinge',
      equipment: ['dumbbell'],
      primaryMuscles: ['hamstrings_group', 'gluteus_maximus'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/G_sJEDd6R1I?si=PP3gBWYITeBl4nNI',
      cueSummary:
        'With dumbbells in hand, push hips back and keep the bells close to your thighs, then drive up with hamstrings and glutes.',
      mentionedInSections: ['muscle-growth-legs', 'bonus-leg-exercise-library'],
    },
    {
      id: 'pistol_squats',
      name: 'Pistol Squats',
      type: 'compound',
      movementPattern: 'squat',
      equipment: ['bodyweight'],
      primaryMuscles: ['quads_group', 'gluteus_maximus'],
      secondaryMuscles: ['hamstrings_group', 'hip_abductors_group'],
      videoUrl: 'https://youtube.com/shorts/zL8Zjx6jmt0?si=J27wiUlYWuUhgMvV',
      cueSummary:
        'On one leg, sit as low as control allows while the other leg stays in front, then stand without collapsing inward.',
      mentionedInSections: ['snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'hindu_squats',
      name: 'Hindu Squats',
      type: 'compound',
      movementPattern: 'squat',
      equipment: ['bodyweight'],
      primaryMuscles: ['quads_group', 'calves_group'],
      secondaryMuscles: [],
      videoUrl: 'https://youtube.com/shorts/iWZy2Iww2i8?feature=share',
      cueSummary:
        'Bodyweight squats with heels up, big knee travel and a flowing rhythm to pump quads and calves.',
      mentionedInSections: ['snipers-leg-day', 'bonus-leg-exercise-library'],
    },
    {
      id: 'hip_adduction_machine',
      name: 'Hip Adduction Machine',
      type: 'isolation',
      movementPattern: 'hold',
      equipment: ['machine'],
      primaryMuscles: ['adductor_group'],
      secondaryMuscles: [],
      videoUrl: null,
      cueSummary:
        'Drive knees together against the pads, hold a squeeze and control the eccentric to hammer the groin safely.',
      mentionedInSections: ['extra-mobility-legs', 'injury-resilience-legs', 'bonus-leg-exercise-library'],
    },
    {
      id: 'hip_abduction_machine',
      name: 'Hip Abduction Machine',
      type: 'isolation',
      movementPattern: 'hold',
      equipment: ['machine'],
      primaryMuscles: ['hip_abductors_group'],
      secondaryMuscles: ['tensor_fasciae_latae'],
      videoUrl: null,
      cueSummary:
        'Push knees out against the pads, keeping the pelvis still and focusing on side‑hip contraction.',
      mentionedInSections: ['extra-mobility-legs', 'injury-resilience-legs', 'bonus-leg-exercise-library'],
    },
  ];

  const additionalExercises: typeof exercises = [];

  // Merge additional exercises into main exercises array (kept for parity with other seeds)
  exercises.push(...additionalExercises);

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
  // 4) FORMULAS – LEGS
  // -----------------------------

  const formulas = [
    {
      id: 'glute_max_hip_thrust_formula',
      name: 'Glute Max – RDL + Barbell Hip Thrusts',
      description:
        'Use a heavy hinge followed by a pure glute lockout to light up the whole posterior chain.',
      pattern: 'superset',
      targetMuscles: ['gluteus_maximus', 'hamstrings_group'],
      steps: [
        {
          order: 1,
          exerciseId: 'romanian_deadlift',
          role: 'compound',
          notes: 'Heavy 5–8 rep sets with a deep hamstring stretch.',
        },
        {
          order: 2,
          exerciseId: 'barbell_hip_thrusts',
          role: 'isolation',
          notes: '8–12 reps with a hard pause/squeeze at the top.',
        },
      ],
    },
    {
      id: 'hamstrings_long_short_formula',
      name: 'Hamstrings – Nordic Curls + Leg Curls',
      description:
        'Pair brutal eccentric strength with a pump‑style finisher to hammer both long and short heads.',
      pattern: 'superset',
      targetMuscles: ['hamstrings_group'],
      steps: [
        {
          order: 1,
          exerciseId: 'nordic_curls',
          role: 'compound',
          notes: 'Slow, controlled eccentrics; use assistance as needed on the way up.',
        },
        {
          order: 2,
          exerciseId: 'leg_curls',
          role: 'isolation',
          notes: '12–20 reps focusing on constant tension and full squeeze.',
        },
      ],
    },
    {
      id: 'knee_vm_tibialis_formula',
      name: 'Knee / VMO / Tibialis – Extensions + Sissy + Toe Raises',
      description:
        'A tri‑set to attack the front of the knee from every angle while building tibialis strength.',
      pattern: 'tri_set',
      targetMuscles: ['vmo', 'tibialis_anterior', 'quads_group'],
      steps: [
        {
          order: 1,
          exerciseId: 'leg_extensions',
          role: 'isolation',
          notes: 'Controlled 10–15 reps, stay shy of joint pain but chase burn.',
        },
        {
          order: 2,
          exerciseId: 'sissy_squats',
          role: 'compound',
          notes: 'Bodyweight or lightly loaded, 8–12 reps through long knee travel.',
        },
        {
          order: 3,
          exerciseId: 'kettlebell_toe_raises',
          role: 'finisher',
          notes: 'High‑rep tibialis work to finish the joint from the front.',
        },
      ],
    },
    {
      id: 'calves_achilles_formula',
      name: 'Calves & Achilles – Toe Raises + Standing Calf Raises',
      description:
        'Shin work plus heavy standing calf raises to build thick calves and a strong Achilles.',
      pattern: 'superset',
      targetMuscles: ['calves_group', 'tibialis_anterior'],
      steps: [
        {
          order: 1,
          exerciseId: 'kettlebell_toe_raises',
          role: 'activation',
          notes: 'Pre‑pump the tibialis with 15–25 controlled reps.',
        },
        {
          order: 2,
          exerciseId: 'standing_calf_raises',
          role: 'compound',
          notes: 'Heavy straight sets in the 8–15 rep range with a pause at stretch and squeeze.',
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
  // 5) WORKOUT – THE SNIPER’S LEG DAY
  // -----------------------------

  await prisma.workout.upsert({
    where: { id: 'snipers_leg_day' },
    update: {},
    create: {
      id: 'snipers_leg_day',
      slug: 'snipers-leg-day',
      name: 'THE SNIPER’S LEG DAY (THE LEG DAY FORMULA)',
      goal:
        'Leg strength and hypertrophy focused on building a complete lower body – glutes, hams, quads and calves.',
      priorityRules:
        'Start with ONE heavy strength movement for legs (squat or hinge) using the 3‑set drop‑set scheme. ' +
        'Then follow the blocks in order: posterior chain, single‑leg quad, hamstring superset, knee/tibialis work and finishers. ' +
        'Choose from the listed options but keep the structure the same so the formula stays deadly and repeatable.',
      primaryRegionId: 'legs',
    },
  });

  const workoutBlocks = [
    {
      id: 'legs-strength-block',
      workoutId: 'snipers_leg_day',
      label: '1. Strength – NUMBER 1 Leg Movement (Pick 1)',
      schemeStyle: 'drop_set',
      schemeDesc: `Set 1: 3–4 Rep Max
Set 2: Drop ~20% & set REP PR
Set 3: Drop another ~20% & set REP PR
Work up to a heavy 3–4 rep max, then run two back‑off drops as rep PRs.`,
      notes:
        'Pick ONE heavy squat/hinge and run the full drop‑set scheme before anything else.',
      targetMuscles: ['glutes_group', 'hamstrings_group', 'quads_group'],
      exerciseOptions: [
        'front_squats',
        'deficit_deadlifts',
        'full_rom_back_squats',
        'wide_stance_box_squats',
        'zercher_squats',
      ],
    },
    {
      id: 'legs-posterior-chain-block',
      workoutId: 'snipers_leg_day',
      label: '2. Posterior Chain – Hip Hinge & Glute Power',
      schemeStyle: 'straight_sets',
      schemeDesc:
        '2–4 heavy sets of 6–10 reps, then optional lighter back‑off sets for pump.',
      notes:
        'Pick 1–2 of these posterior‑chain movements and focus on controlled, powerful reps.',
      targetMuscles: ['hamstrings_group', 'gluteus_maximus', 'erector_spinae'],
      exerciseOptions: [
        'romanian_deadlift',
        'standing_good_mornings',
        'seated_barbell_good_mornings',
        'hyperextension_rows',
        'barbell_hip_thrusts',
        'nordic_curls',
        'sumo_deadlift',
      ],
    },
    {
      id: 'legs-single-leg-quad-block',
      workoutId: 'snipers_leg_day',
      label: '3. Single‑Leg Quad Exercise (Pick 1)',
      schemeStyle: 'straight_sets',
      schemeDesc: '3 sets per leg, failing between 8–12 reps.',
      notes:
        'Use one of these to hammer each leg individually and expose left/right imbalances.',
      targetMuscles: ['quads_group', 'gluteus_maximus', 'hip_abductors_group', 'hip_adductors_group'],
      exerciseOptions: ['reverse_lunges', 'barbell_split_squats', 'bulgarian_split_squats'],
    },
    {
      id: 'legs-hamstring-superset-block',
      workoutId: 'snipers_leg_day',
      label: '4. Hamstring SUPERSET',
      schemeStyle: 'superset',
      schemeDesc:
        '2–3 supersets. First movement: heavy 8–12 reps. Second movement: high‑rep / near‑failure pump.',
      notes:
        'Think one heavy hinge or curl, immediately into a pump finisher (bridge, curl, or reverse hyper).',
      targetMuscles: ['hamstrings_group', 'gluteus_maximus'],
      exerciseOptions: [
        'leg_curls',
        'romanian_deadlift',
        'zercher_deadlifts',
        'zercher_rdls',
        'nordic_curls',
        'glute_bridge_feet_elevated',
        'reverse_hyperextensions',
        'cable_hamstring_curls',
      ],
    },
    {
      id: 'legs-knee-tibialis-block',
      workoutId: 'snipers_leg_day',
      label: '5. Knee / VMO / Tibialis Block',
      schemeStyle: 'tri_set',
      schemeDesc:
        '2–3 rounds of a tri‑set: Leg Extensions → Sissy Squats → Tibialis/Calf work.',
      notes:
        'Use this block to bulletproof knees and shins with controlled long‑range work.',
      targetMuscles: ['quads_group', 'vmo', 'tibialis_anterior', 'calves_group'],
      exerciseOptions: [
        'leg_extensions',
        'sissy_squats',
        'reverse_nordics',
        'kettlebell_toe_raises',
        'standing_calf_raises',
        'backward_treadmill_walk',
      ],
    },
    {
      id: 'legs-finisher-block',
      workoutId: 'snipers_leg_day',
      label: '6. Injury Resilience / Finisher',
      schemeStyle: 'sequence',
      schemeDesc:
        'Pick 2–4 movements and run them as a circuit for high‑rep sets to finish hips, groin and calves.',
      notes:
        'Side‑lying leg work, Copenhagen’s and calf work here make your legs feel “bulletproofed” instead of just pumped.',
      targetMuscles: [
        'hip_adductors_group',
        'hip_abductors_group',
        'calves_group',
        'anterior_shin_group',
      ],
      exerciseOptions: [
        'side_lying_leg_raises',
        'copenhagen_planks',
        'pistol_squats',
        'hindu_squats',
        'standing_calf_raises',
        'kettlebell_toe_raises',
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

  console.log('✅ Legs guide, anatomy, exercises, formulas, and Sniper’s Leg Day seeded.');
}

seedLegs()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });