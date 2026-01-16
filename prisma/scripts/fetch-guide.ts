import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchGuide(guideId: string) {
  const guide = await prisma.guide.findUnique({
    where: { id: guideId },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          children: {
            orderBy: { order: "asc" },
          },
          exerciseLinks: {
            include: {
              exercise: {
                select: { id: true, name: true, type: true }
              }
            }
          },
          focusAnatomyLinks: {
            include: {
              anatomy: {
                select: { id: true, name: true, kind: true }
              }
            }
          }
        }
      }
    }
  });

  return guide;
}

async function main() {
  const guideId = process.argv[2] || "back";

  console.log(`Fetching guide: ${guideId}\n`);

  const guide = await fetchGuide(guideId);

  if (!guide) {
    console.log("Guide not found");
    return;
  }

  console.log(`# ${guide.title}\n`);
  console.log(`Slug: ${guide.slug}`);
  console.log(`Sections: ${guide.sections.length}\n`);
  console.log("---\n");

  // Only show top-level sections (no parent)
  const topLevelSections = guide.sections.filter(s => !s.parentId);

  for (const section of topLevelSections) {
    console.log(`## ${section.order}. ${section.title} [${section.kind}]`);

    // Show anatomy focus
    if (section.focusAnatomyLinks.length > 0) {
      const muscles = section.focusAnatomyLinks.map(l => l.anatomy.name).join(", ");
      console.log(`   Focus: ${muscles}`);
    }

    // Show content preview
    if (section.content) {
      const preview = section.content.slice(0, 150).replace(/\n/g, " ");
      console.log(`   Content: ${preview}...`);
    }

    // Show exercises
    if (section.exerciseLinks.length > 0) {
      console.log(`   Exercises (${section.exerciseLinks.length}):`);
      for (const link of section.exerciseLinks) {
        console.log(`     - ${link.exercise.name} [${link.exercise.type}]`);
      }
    }

    // Show children sections
    const children = guide.sections.filter(s => s.parentId === section.id);
    if (children.length > 0) {
      console.log(`   Subsections (${children.length}):`);
      for (const child of children) {
        console.log(`     - ${child.order}. ${child.title} [${child.kind}]`);
      }
    }

    console.log("");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
