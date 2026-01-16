import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NEW_STRUCTURE = [
  {
    newId: "arms-cover",
    title: "ARMS",
    kind: "cover",
    parentId: null,
    order: 0,
    oldIds: ["arms-page-1"],
  },
  {
    newId: "arms-intro",
    title: "INTRO",
    kind: "intro",
    parentId: null,
    order: 1,
    oldIds: [
      "arms-page-2", // NO WORDS LEFT UNSAID
      "arms-page-3", // sleeper build
      "arms-page-4", // same person scenario
      "arms-page-5", // THIS AREA OF THE BODY
      "arms-page-6", // strong set of arms
      "arms-page-7", // elbows have huge part
      "arms-page-8", // underrated muscle group
    ],
  },
  {
    newId: "arms-mindset",
    title: "MINDSET",
    kind: "mindset",
    parentId: null,
    order: 2,
    oldIds: [
      "arms-page-9",  // MINDSET header
      "arms-page-10", // proportions off
      "arms-page-11", // learning biomechanics
      "arms-page-12", // do not know how it works
      "arms-page-14", // RULES OF NATURAL CRUSADER
    ],
  },
  {
    newId: "arms-anatomy",
    title: "ANATOMY",
    kind: "anatomy",
    parentId: null,
    order: 3,
    oldIds: ["arms-page-15"], // ANATOMY header
  },
  {
    newId: "arms-anatomy-biceps",
    title: "Biceps",
    kind: "anatomy",
    parentId: "arms-anatomy",
    order: 4,
    oldIds: [
      "arms-page-16", // Bicep Brachii 2 heads
      "arms-page-17", // Short Head
      "arms-page-18", // more to bicep
      "arms-page-19", // BRACHIALIS
      "arms-page-20", // significant muscle
    ],
  },
  {
    newId: "arms-anatomy-triceps",
    title: "Triceps",
    kind: "anatomy",
    parentId: "arms-anatomy",
    order: 5,
    oldIds: [
      "arms-page-21", // Tricep 3 heads
      "arms-page-22", // Medial head
      "arms-page-23", // Lateral head
      "arms-page-24", // overview
    ],
  },
  {
    newId: "arms-anatomy-forearms",
    title: "Forearms",
    kind: "anatomy",
    parentId: "arms-anatomy",
    order: 6,
    oldIds: [
      "arms-page-25", // super quick forearms
      "arms-page-26", // forearm workouts
    ],
  },
  {
    newId: "arms-anatomy-biomechanics",
    title: "Biomechanics",
    kind: "anatomy",
    parentId: "arms-anatomy",
    order: 7,
    oldIds: [
      "arms-page-27", // concentric/shortening
      "arms-page-28", // meat and potatoes
    ],
  },
  {
    newId: "arms-strength",
    title: "STRENGTH",
    kind: "content",
    parentId: null,
    order: 8,
    oldIds: [
      "arms-page-29", // STRENGTH header
      "arms-page-30", // Tricep Strength
      "arms-page-31", // first working sets
      "arms-page-32", // Biceps approach
      "arms-page-33", // game time
    ],
  },
  {
    newId: "arms-muscle-growth",
    title: "MUSCLE GROWTH",
    kind: "content",
    parentId: null,
    order: 9,
    oldIds: [
      "arms-page-34", // MUSCLE GROWTH header
      "arms-page-35", // precise accurate
      "arms-page-36", // 2-3 sets failure
    ],
  },
  {
    newId: "arms-injury-resilience",
    title: "INJURY RESILIENCE",
    kind: "content",
    parentId: null,
    order: 10,
    oldIds: [
      "arms-page-37", // BUILDING INJURY RESILIENCE
      "arms-page-38", // what most fail to realize
      "arms-page-39", // Trapezius Rhomboids
      "arms-page-40", // rhomboid exercises
      "arms-page-41", // rear delt exercises
    ],
  },
  {
    newId: "arms-program",
    title: "THE SNIPER'S ARM DAY",
    kind: "program",
    parentId: null,
    order: 11,
    oldIds: [
      "arms-page-42", // SNIPER'S ARM DAY
      "arms-page-43", // Biceps section
      "arms-page-44", // Optional superset
    ],
  },
  {
    newId: "arms-bonus",
    title: "BONUS",
    kind: "program",
    parentId: null,
    order: 12,
    oldIds: [
      "arms-page-45", // BONUS #1 rehab
      "arms-page-46", // BONUS #2
      "arms-page-47", // exercise links curls
      "arms-page-48", // exercise links triceps
    ],
  },
  {
    newId: "arms-conclusion",
    title: "IN CONCLUSION",
    kind: "program",
    parentId: null,
    order: 13,
    oldIds: [
      "arms-page-49", // IN CONCLUSION
      "arms-page-50", // click here undeniable
      "arms-page-51", // click here undeniable 2
      "arms-page-52", // thank you
    ],
  },
];

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log(dryRun ? "=== DRY RUN MODE ===" : "=== LIVE MODE ===");
  console.log("");

  const oldSections = await prisma.section.findMany({
    where: { guideId: "arms" },
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
      where: { guideId: "arms" }
    });
    console.log("Deleted old sections");

    for (const data of newSectionsData) {
      await tx.section.create({
        data: {
          id: data.spec.newId,
          guideId: "arms",
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
  console.log(`Reorganized arms guide: ${oldSections.length} → ${NEW_STRUCTURE.length} sections`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
