import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the new structure
// Each entry: { newId, title, kind, parentId (null or ref to another newId), oldSectionOrders[] }
const NEW_STRUCTURE = [
  {
    newId: "shoulders-cover",
    title: "SHOULDERS",
    kind: "cover",
    parentId: null,
    order: 0,
    oldOrders: [0],
  },
  {
    newId: "shoulders-intro",
    title: "INTRO",
    kind: "intro",
    parentId: null,
    order: 1,
    oldOrders: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    newId: "shoulders-anatomy",
    title: "ANATOMY",
    kind: "anatomy",
    parentId: null,
    order: 2,
    oldOrders: [9, 20], // ANATOMY intro + transition text
  },
  {
    newId: "shoulders-anatomy-deltoids",
    title: "The Deltoids",
    kind: "anatomy",
    parentId: "shoulders-anatomy",
    order: 3,
    oldOrders: [10, 13], // Deltoid overview + summary
  },
  {
    newId: "shoulders-anatomy-rear-delts",
    title: "Rear Delts",
    kind: "anatomy",
    parentId: "shoulders-anatomy",
    order: 4,
    oldOrders: [11],
  },
  {
    newId: "shoulders-anatomy-side-front-delts",
    title: "Side & Front Delts",
    kind: "exercises",
    parentId: "shoulders-anatomy",
    order: 5,
    oldOrders: [12],
  },
  {
    newId: "shoulders-anatomy-rotator-cuff",
    title: "The Rotator Cuff",
    kind: "anatomy",
    parentId: "shoulders-anatomy",
    order: 6,
    oldOrders: [14, 15],
  },
  {
    newId: "shoulders-anatomy-trapezius",
    title: "The Trapezius",
    kind: "anatomy",
    parentId: "shoulders-anatomy",
    order: 7,
    oldOrders: [16, 17, 18, 19],
  },
  {
    newId: "shoulders-strength",
    title: "STRENGTH",
    kind: "content",
    parentId: null,
    order: 8,
    oldOrders: [21, 22, 23],
  },
  {
    newId: "shoulders-muscle-growth",
    title: "MUSCLE GROWTH",
    kind: "content",
    parentId: null,
    order: 9,
    oldOrders: [24, 25, 37],
  },
  {
    newId: "shoulders-injury-resilience",
    title: "INJURY RESILIENCE",
    kind: "content",
    parentId: null,
    order: 10,
    oldOrders: [26, 27, 28, 29],
  },
  {
    newId: "shoulders-mobility",
    title: "MOBILITY",
    kind: "anatomy",
    parentId: null,
    order: 11,
    oldOrders: [30, 31, 32],
  },
  {
    newId: "shoulders-program",
    title: "THE FLAWLESS SHOULDER DAY",
    kind: "program",
    parentId: null,
    order: 12,
    oldOrders: [33, 36, 38],
  },
  {
    newId: "shoulders-bonus-rehab",
    title: "BONUS: SHOULDER REHAB",
    kind: "content",
    parentId: null,
    order: 13,
    oldOrders: [34, 35],
  },
  {
    newId: "shoulders-bonus-exercises",
    title: "THE BONUSES BONUS",
    kind: "program",
    parentId: null,
    order: 14,
    oldOrders: [39, 40, 41, 42, 43],
  },
  {
    newId: "shoulders-conclusion",
    title: "IN CONCLUSION",
    kind: "program",
    parentId: null,
    order: 15,
    oldOrders: [44, 45, 46, 47],
  },
];

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log(dryRun ? "=== DRY RUN MODE ===" : "=== LIVE MODE ===");
  console.log("");

  // 1. Fetch all current sections
  const oldSections = await prisma.section.findMany({
    where: { guideId: "shoulders" },
    include: {
      exerciseLinks: true,
      focusAnatomyLinks: true,
    },
    orderBy: { order: "asc" },
  });

  console.log(`Found ${oldSections.length} existing sections`);

  // Create lookup by order
  const byOrder: Record<number, typeof oldSections[0]> = {};
  oldSections.forEach(s => byOrder[s.order] = s);

  // 2. Validate mapping - check all old orders exist
  const allOldOrders = NEW_STRUCTURE.flatMap(s => s.oldOrders);
  const missingOrders = allOldOrders.filter(o => !byOrder[o]);
  if (missingOrders.length > 0) {
    console.error(`Missing sections for orders: ${missingOrders.join(", ")}`);
    return;
  }

  // Check for unmapped sections
  const mappedOrders = new Set(allOldOrders);
  const unmapped = oldSections.filter(s => !mappedOrders.has(s.order));
  if (unmapped.length > 0) {
    console.warn(`\nWARNING: ${unmapped.length} sections not mapped:`);
    unmapped.forEach(s => console.warn(`  [${s.order}] ${s.title.slice(0, 50)}`));
    console.warn("");
  }

  // 3. Build new sections data
  console.log("\n=== NEW STRUCTURE ===\n");

  const newSectionsData = NEW_STRUCTURE.map(spec => {
    const sourceSections = spec.oldOrders.map(o => byOrder[o]).filter(Boolean);

    // Merge content
    const mergedContent = sourceSections.map(s => s.content).join("\n\n");

    // Merge images
    const mergedImages: string[] = [];
    sourceSections.forEach(s => {
      if (s.images && Array.isArray(s.images)) {
        mergedImages.push(...(s.images as string[]));
      }
    });

    // Collect all exercise links
    const exerciseIds = new Set<string>();
    sourceSections.forEach(s => {
      s.exerciseLinks.forEach(link => exerciseIds.add(link.exerciseId));
    });

    // Collect all anatomy links
    const anatomyIds = new Set<string>();
    sourceSections.forEach(s => {
      s.focusAnatomyLinks.forEach(link => anatomyIds.add(link.anatomyNodeId));
    });

    const indent = spec.parentId ? "  → " : "";
    console.log(`${indent}[${spec.order}] ${spec.title} (${spec.kind})`);
    console.log(`${indent}   Sources: orders ${spec.oldOrders.join(", ")}`);
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
      sourceIds: sourceSections.map(s => s.id),
    };
  });

  if (dryRun) {
    console.log("\n=== DRY RUN COMPLETE ===");
    console.log("Run without --dry-run to execute changes");
    return;
  }

  // 4. Execute in transaction
  console.log("\n=== EXECUTING CHANGES ===\n");

  await prisma.$transaction(async (tx) => {
    // Delete old exercise links
    const oldSectionIds = oldSections.map(s => s.id);
    await tx.sectionExercise.deleteMany({
      where: { sectionId: { in: oldSectionIds } }
    });
    console.log("Deleted old exercise links");

    // Delete old anatomy links
    await tx.sectionAnatomy.deleteMany({
      where: { sectionId: { in: oldSectionIds } }
    });
    console.log("Deleted old anatomy links");

    // Delete old sections
    await tx.section.deleteMany({
      where: { guideId: "shoulders" }
    });
    console.log("Deleted old sections");

    // Create new sections (without parentId first to avoid FK issues)
    for (const data of newSectionsData) {
      await tx.section.create({
        data: {
          id: data.spec.newId,
          guideId: "shoulders",
          kind: data.spec.kind,
          title: data.spec.title,
          order: data.spec.order,
          content: data.mergedContent,
          images: data.mergedImages.length > 0 ? data.mergedImages : undefined,
          parentId: null, // Set in second pass
        }
      });
      console.log(`Created section: ${data.spec.newId}`);
    }

    // Update parentIds
    for (const data of newSectionsData) {
      if (data.spec.parentId) {
        await tx.section.update({
          where: { id: data.spec.newId },
          data: { parentId: data.spec.parentId }
        });
        console.log(`Set parent for ${data.spec.newId} → ${data.spec.parentId}`);
      }
    }

    // Create new exercise links
    for (const data of newSectionsData) {
      for (const exerciseId of data.exerciseIds) {
        await tx.sectionExercise.create({
          data: {
            sectionId: data.spec.newId,
            exerciseId,
          }
        });
      }
      if (data.exerciseIds.length > 0) {
        console.log(`Created ${data.exerciseIds.length} exercise links for ${data.spec.newId}`);
      }
    }

    // Create new anatomy links
    for (const data of newSectionsData) {
      for (const anatomyId of data.anatomyIds) {
        await tx.sectionAnatomy.create({
          data: {
            sectionId: data.spec.newId,
            anatomyNodeId: anatomyId,
          }
        });
      }
      if (data.anatomyIds.length > 0) {
        console.log(`Created ${data.anatomyIds.length} anatomy links for ${data.spec.newId}`);
      }
    }
  });

  console.log("\n=== COMPLETE ===");
  console.log(`Reorganized shoulders guide: ${oldSections.length} → ${NEW_STRUCTURE.length} sections`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
