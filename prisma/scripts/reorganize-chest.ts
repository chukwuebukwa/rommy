import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the new structure using section IDs
// Format: { newId, title, kind, parentId, order, oldIds[] }
const NEW_STRUCTURE = [
  {
    newId: "chest-cover",
    title: "CHEST",
    kind: "cover",
    parentId: null,
    order: 0,
    oldIds: ["chest-page-2"], // Cover page
  },
  {
    newId: "chest-intro",
    title: "INTRO",
    kind: "intro",
    parentId: null,
    order: 1,
    oldIds: [
      "chest-intro",
      "chest-page-4", // "Have you ever seen..."
      "chest-page-5", // "MINDSET" header
      "chest-page-7", // "Genetically I was never meant..."
      "chest-page-8", // "All I found on internet was useless..."
      "chest-page-9", // "I am giving you the shortcut..."
    ],
  },
  {
    newId: "chest-mindset",
    title: "MINDSET",
    kind: "mindset",
    parentId: null,
    order: 2,
    oldIds: ["chest-mindset"], // Keep existing
  },
  {
    newId: "chest-anatomy",
    title: "ANATOMY",
    kind: "anatomy",
    parentId: null,
    order: 3,
    oldIds: [
      "chest-anatomy-overview",
      "chest-page-12", // "ANATOMY" duplicate
      "chest-page-13", // "Okay bro..." pec explanation
    ],
  },
  {
    newId: "chest-anatomy-pec-minor",
    title: "Pec Minor",
    kind: "anatomy",
    parentId: "chest-anatomy",
    order: 4,
    oldIds: [
      "chest-anatomy-pec-minor",
      "chest-page-14", // "And when that happens..."
    ],
  },
  {
    newId: "chest-anatomy-pec-major",
    title: "Pec Major - The 3 Heads",
    kind: "anatomy",
    parentId: "chest-anatomy",
    order: 5,
    oldIds: [
      "chest-anatomy-pec-major",
      "chest-page-15", // "If you get Upper Chest dialed in"
      "chest-page-16", // Exercise examples clavicular
      "chest-page-17", // Abdominal head
      "chest-page-18", // Exercise examples abdominal
    ],
  },
  {
    newId: "chest-anatomy-biomechanics",
    title: "Biomechanics",
    kind: "anatomy",
    parentId: "chest-anatomy",
    order: 6,
    oldIds: [
      "chest-biomechanics",
      "chest-page-19", // "Every movement is rotation"
      "chest-page-20", // "Part 2: When you press..."
      "chest-page-21", // "By reversing your grip..."
    ],
  },
  {
    newId: "chest-strength",
    title: "STRENGTH",
    kind: "content",
    parentId: null,
    order: 7,
    oldIds: [
      "chest-page-22", // "STRENGTH"
      "chest-page-23", // "Going wider on grip..."
      "chest-page-24", // "Now at this point..."
    ],
  },
  {
    newId: "chest-muscle-growth",
    title: "MUSCLE GROWTH",
    kind: "content",
    parentId: null,
    order: 8,
    oldIds: [
      "chest-page-25", // "MUSCLE GROWTH (3D SHOULDERS)"
      "chest-page-26", // "First part of superset..."
      "chest-page-27", // "Chest Formula EXAMPLES"
    ],
  },
  {
    newId: "chest-injury-resilience",
    title: "INJURY RESILIENCE",
    kind: "content",
    parentId: null,
    order: 9,
    oldIds: [
      "chest-injury-resilience",
      "chest-page-28", // "BUILDING INJURY RESILIENCE"
      "chest-page-29", // "I want you to get back..."
      "chest-page-30", // "Trapezius, Rhomboids..."
      "chest-page-31", // Exercise examples rhomboids
      "chest-page-32", // Exercise examples rear delts
    ],
  },
  {
    newId: "chest-mobility",
    title: "MOBILITY",
    kind: "anatomy",
    parentId: null,
    order: 10,
    oldIds: [
      "chest-page-34", // "MOBILITY"
    ],
  },
  {
    newId: "chest-program",
    title: "THE SNIPER'S CHEST DAY",
    kind: "program",
    parentId: null,
    order: 11,
    oldIds: [
      "chest-snipers-chest-day",
      "chest-page-35", // "THE SNIPER'S CHEST DAY" duplicate
      "chest-page-36", // "Upper Chest SuperSet"
      "chest-page-37", // "Lower Chest SuperSet"
    ],
  },
  {
    newId: "chest-bonus-rehab",
    title: "BONUS: SHOULDER REHAB",
    kind: "content",
    parentId: null,
    order: 12,
    oldIds: [
      "chest-shoulder-rehab",
      "chest-page-33", // "BONUS #1"
    ],
  },
  {
    newId: "chest-bonus-exercises",
    title: "BONUS: EXERCISE LIBRARY",
    kind: "program",
    parentId: null,
    order: 13,
    oldIds: [
      "chest-exercise-library",
      "chest-page-38", // "BONUS #2"
      "chest-page-39", // Exercise links
      "chest-page-40", // "MOBILITY" exercise links
    ],
  },
  {
    newId: "chest-conclusion",
    title: "IN CONCLUSION",
    kind: "program",
    parentId: null,
    order: 14,
    oldIds: [
      "chest-page-41", // "IN CONCLUSION"
      "chest-page-42", // "CLICK HERE To Become Undeniable"
      "chest-page-43", // "CLICK HERE" duplicate
      "chest-page-44", // "THANK YOU FOR READING"
    ],
  },
];

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log(dryRun ? "=== DRY RUN MODE ===" : "=== LIVE MODE ===");
  console.log("");

  // 1. Fetch all current sections
  const oldSections = await prisma.section.findMany({
    where: { guideId: "chest" },
    include: {
      exerciseLinks: true,
      focusAnatomyLinks: true,
    },
  });

  console.log(`Found ${oldSections.length} existing sections`);

  // Create lookup by ID
  const byId: Record<string, typeof oldSections[0]> = {};
  oldSections.forEach(s => byId[s.id] = s);

  // 2. Validate mapping
  const allOldIds = NEW_STRUCTURE.flatMap(s => s.oldIds);
  const missingIds = allOldIds.filter(id => !byId[id]);
  if (missingIds.length > 0) {
    console.error(`Missing sections for IDs: ${missingIds.join(", ")}`);
    return;
  }

  // Check for unmapped sections
  const mappedIds = new Set(allOldIds);
  const unmapped = oldSections.filter(s => !mappedIds.has(s.id));
  if (unmapped.length > 0) {
    console.warn(`\nWARNING: ${unmapped.length} sections not mapped:`);
    unmapped.forEach(s => console.warn(`  ${s.id} | ${s.title.slice(0, 40)}`));
    console.warn("");
  }

  // 3. Build new sections data
  console.log("\n=== NEW STRUCTURE ===\n");

  const newSectionsData = NEW_STRUCTURE.map(spec => {
    const sourceSections = spec.oldIds.map(id => byId[id]).filter(Boolean);

    // Merge content
    const mergedContent = sourceSections.map(s => s.content).join("\n\n");

    // Merge images
    const mergedImages: string[] = [];
    sourceSections.forEach(s => {
      if (s.images && Array.isArray(s.images)) {
        mergedImages.push(...(s.images as string[]));
      }
    });

    // Collect all exercise links (dedupe)
    const exerciseIds = new Set<string>();
    sourceSections.forEach(s => {
      s.exerciseLinks.forEach(link => exerciseIds.add(link.exerciseId));
    });

    // Collect all anatomy links (dedupe)
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
      where: { guideId: "chest" }
    });
    console.log("Deleted old sections");

    // Create new sections
    for (const data of newSectionsData) {
      await tx.section.create({
        data: {
          id: data.spec.newId,
          guideId: "chest",
          kind: data.spec.kind,
          title: data.spec.title,
          order: data.spec.order,
          content: data.mergedContent,
          images: data.mergedImages.length > 0 ? data.mergedImages : undefined,
          parentId: null,
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
  console.log(`Reorganized chest guide: ${oldSections.length} → ${NEW_STRUCTURE.length} sections`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
