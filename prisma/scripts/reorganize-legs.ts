import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NEW_STRUCTURE = [
  {
    newId: "legs-cover",
    title: "LEGS",
    kind: "cover",
    parentId: null,
    order: 0,
    oldIds: ["legs-page-1"],
  },
  {
    newId: "legs-intro",
    title: "INTRO",
    kind: "intro",
    parentId: null,
    order: 1,
    oldIds: [
      "legs-page-2", // "NO WORDS LEFT UNSAID"
      "legs-page-3", // testosterone from leg training
      "legs-page-4", // poor posture
      "legs-page-5", // Page 5
      "legs-page-6", // imperative to physique
      "legs-page-7", // legs aren't up to speed
    ],
  },
  {
    newId: "legs-mindset",
    title: "MINDSET",
    kind: "mindset",
    parentId: null,
    order: 2,
    oldIds: [
      "legs-page-8",  // MINDSET header
      "legs-page-9",  // toes poke outward?
      "legs-page-10", // got started lifting
      "legs-page-11", // torn meniscus story
      "legs-page-12", // got injured because
      "legs-page-13", // genetically never meant
      "legs-page-14", // testing exercises
      "legs-page-15", // sections of guide
      "legs-page-16", // undeniable standard
      "legs-page-17", // rules of natural crusader
      "legs-page-18", // these rules define
    ],
  },
  {
    newId: "legs-anatomy",
    title: "ANATOMY",
    kind: "anatomy",
    parentId: null,
    order: 3,
    oldIds: [
      "legs-page-19", // ANATOMY header
      "legs-page-20", // basic overview anterior/posterior
    ],
  },
  {
    newId: "legs-anatomy-glutes",
    title: "Glutes",
    kind: "anatomy",
    parentId: "legs-anatomy",
    order: 4,
    oldIds: [
      "legs-page-21", // let's start with glutes
      "legs-page-22", // if glutes are weak
      "legs-page-23", // gluteus medius
      "legs-page-24", // all three muscles work together
      "legs-page-25", // adductors
      "legs-page-26", // TFL
    ],
  },
  {
    newId: "legs-anatomy-hamstrings",
    title: "Hamstrings",
    kind: "anatomy",
    parentId: "legs-anatomy",
    order: 5,
    oldIds: [
      "legs-page-27", // athletes struggle with
      "legs-page-28", // semimembranosus
      "legs-page-29", // biceps femoris
      "legs-page-30", // biceps femoris short head
    ],
  },
  {
    newId: "legs-anatomy-erector-spinae",
    title: "Erector Spinae",
    kind: "anatomy",
    parentId: "legs-anatomy",
    order: 6,
    oldIds: [
      "legs-page-31", // next section - erectors
      "legs-page-32", // erector spinae key
    ],
  },
  {
    newId: "legs-anatomy-calves",
    title: "Calves",
    kind: "anatomy",
    parentId: "legs-anatomy",
    order: 7,
    oldIds: [
      "legs-page-33", // plantar flexion vocab
      "legs-page-34", // stubborn calves
      "legs-page-35", // achilles tendon
    ],
  },
  {
    newId: "legs-anatomy-quads",
    title: "Quadriceps",
    kind: "anatomy",
    parentId: "legs-anatomy",
    order: 8,
    oldIds: [
      "legs-page-36", // anterior chain intro
      "legs-page-37", // rectus femoris
      "legs-page-38", // vastus medialis
      "legs-page-39", // vastus intermedius
      "legs-page-40", // tibialis anterior
    ],
  },
  {
    newId: "legs-anatomy-hip-flexors",
    title: "Hip Flexors",
    kind: "anatomy",
    parentId: "legs-anatomy",
    order: 9,
    oldIds: [
      "legs-page-41", // hip flexors intro
      "legs-page-42", // psoas
      "legs-page-43", // iliacus
    ],
  },
  {
    newId: "legs-anatomy-biomechanics",
    title: "Biomechanics",
    kind: "anatomy",
    parentId: "legs-anatomy",
    order: 10,
    oldIds: [
      "legs-page-44", // biomechanics
      "legs-page-45", // external rotation
    ],
  },
  {
    newId: "legs-strength",
    title: "STRENGTH",
    kind: "content",
    parentId: null,
    order: 11,
    oldIds: [
      "legs-page-46", // STRENGTH header
      "legs-page-47", // longer ranges of motion
      "legs-page-48", // use these 5
      "legs-page-49", // dynamic effort sets
    ],
  },
  {
    newId: "legs-muscle-growth",
    title: "MUSCLE GROWTH",
    kind: "content",
    parentId: null,
    order: 12,
    oldIds: [
      "legs-page-50", // MUSCLE GROWTH header
      "legs-page-51", // implement it
      "legs-page-52", // overwhelming muscle
    ],
  },
  {
    newId: "legs-injury-resilience",
    title: "INJURY RESILIENCE & MOBILITY",
    kind: "content",
    parentId: null,
    order: 13,
    oldIds: [
      "legs-page-53", // INJURIES header
      "legs-page-54", // energy tap
      "legs-page-55", // examples
      "legs-page-56", // EXTRA MOBILITY header
      "legs-page-57", // entry level exercises
    ],
  },
  {
    newId: "legs-program",
    title: "THE SNIPER'S LEG DAY",
    kind: "program",
    parentId: null,
    order: 14,
    oldIds: [
      "legs-page-58", // THE SNIPER'S LEG DAY
      "legs-page-59", // single leg quad exercise
    ],
  },
  {
    newId: "legs-bonus",
    title: "BONUS",
    kind: "program",
    parentId: null,
    order: 15,
    oldIds: [
      "legs-page-60", // BONUS #1
      "legs-page-61", // BONUS #2
      "legs-page-62", // exercise links
    ],
  },
  {
    newId: "legs-conclusion",
    title: "IN CONCLUSION",
    kind: "program",
    parentId: null,
    order: 16,
    oldIds: [
      "legs-page-63", // IN CONCLUSION
      "legs-page-64", // click here undeniable
      "legs-page-65", // click here undeniable 2
      "legs-page-66", // thank you
    ],
  },
];

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log(dryRun ? "=== DRY RUN MODE ===" : "=== LIVE MODE ===");
  console.log("");

  const oldSections = await prisma.section.findMany({
    where: { guideId: "legs" },
    include: {
      exerciseLinks: true,
      focusAnatomyLinks: true,
    },
  });

  console.log(`Found ${oldSections.length} existing sections`);

  const byId: Record<string, typeof oldSections[0]> = {};
  oldSections.forEach(s => byId[s.id] = s);

  const allOldIds = NEW_STRUCTURE.flatMap(s => s.oldIds);
  const missingIds = allOldIds.filter(id => !byId[id]);
  if (missingIds.length > 0) {
    console.error(`Missing sections for IDs: ${missingIds.join(", ")}`);
    return;
  }

  const mappedIds = new Set(allOldIds);
  const unmapped = oldSections.filter(s => !mappedIds.has(s.id));
  if (unmapped.length > 0) {
    console.warn(`\nWARNING: ${unmapped.length} sections not mapped:`);
    unmapped.forEach(s => console.warn(`  ${s.id} | ${s.title.slice(0, 40)}`));
    console.warn("");
  }

  console.log("\n=== NEW STRUCTURE ===\n");

  const newSectionsData = NEW_STRUCTURE.map(spec => {
    const sourceSections = spec.oldIds.map(id => byId[id]).filter(Boolean);
    const mergedContent = sourceSections.map(s => s.content).join("\n\n");
    const mergedImages: string[] = [];
    sourceSections.forEach(s => {
      if (s.images && Array.isArray(s.images)) {
        mergedImages.push(...(s.images as string[]));
      }
    });

    const exerciseIds = new Set<string>();
    sourceSections.forEach(s => {
      s.exerciseLinks.forEach(link => exerciseIds.add(link.exerciseId));
    });

    const anatomyIds = new Set<string>();
    sourceSections.forEach(s => {
      s.focusAnatomyLinks.forEach(link => anatomyIds.add(link.anatomyNodeId));
    });

    const indent = spec.parentId ? "  → " : "";
    console.log(`${indent}[${spec.order}] ${spec.title} (${spec.kind})`);
    console.log(`${indent}   Sources: ${spec.oldIds.length} sections`);
    console.log(`${indent}   Content: ${mergedContent.length} chars`);
    console.log(`${indent}   Images: ${mergedImages.length}`);
    console.log(`${indent}   Exercises: ${exerciseIds.size}, Anatomy: ${anatomyIds.size}`);
    console.log("");

    return {
      spec,
      mergedContent,
      mergedImages,
      exerciseIds: Array.from(exerciseIds),
      anatomyIds: Array.from(anatomyIds),
    };
  });

  if (dryRun) {
    console.log("\n=== DRY RUN COMPLETE ===");
    console.log("Run without --dry-run to execute changes");
    return;
  }

  console.log("\n=== EXECUTING CHANGES ===\n");

  await prisma.$transaction(async (tx) => {
    const oldSectionIds = oldSections.map(s => s.id);
    await tx.sectionExercise.deleteMany({
      where: { sectionId: { in: oldSectionIds } }
    });
    console.log("Deleted old exercise links");

    await tx.sectionAnatomy.deleteMany({
      where: { sectionId: { in: oldSectionIds } }
    });
    console.log("Deleted old anatomy links");

    await tx.section.deleteMany({
      where: { guideId: "legs" }
    });
    console.log("Deleted old sections");

    for (const data of newSectionsData) {
      await tx.section.create({
        data: {
          id: data.spec.newId,
          guideId: "legs",
          kind: data.spec.kind,
          title: data.spec.title,
          order: data.spec.order,
          content: data.mergedContent,
          images: data.mergedImages.length > 0 ? data.mergedImages : null,
          parentId: null,
        }
      });
      console.log(`Created section: ${data.spec.newId}`);
    }

    for (const data of newSectionsData) {
      if (data.spec.parentId) {
        await tx.section.update({
          where: { id: data.spec.newId },
          data: { parentId: data.spec.parentId }
        });
        console.log(`Set parent for ${data.spec.newId} → ${data.spec.parentId}`);
      }
    }

    for (const data of newSectionsData) {
      for (const exerciseId of data.exerciseIds) {
        await tx.sectionExercise.create({
          data: { sectionId: data.spec.newId, exerciseId }
        });
      }
      if (data.exerciseIds.length > 0) {
        console.log(`Created ${data.exerciseIds.length} exercise links for ${data.spec.newId}`);
      }
    }

    for (const data of newSectionsData) {
      for (const anatomyId of data.anatomyIds) {
        await tx.sectionAnatomy.create({
          data: { sectionId: data.spec.newId, anatomyNodeId: anatomyId }
        });
      }
      if (data.anatomyIds.length > 0) {
        console.log(`Created ${data.anatomyIds.length} anatomy links for ${data.spec.newId}`);
      }
    }
  });

  console.log("\n=== COMPLETE ===");
  console.log(`Reorganized legs guide: ${oldSections.length} → ${NEW_STRUCTURE.length} sections`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
