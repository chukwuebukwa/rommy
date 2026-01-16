import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function searchForContent(guideId: string, searchTerms: string[]) {
  const sections = await prisma.section.findMany({
    where: { guideId },
    select: { id: true, title: true, content: true, order: true, kind: true },
    orderBy: { order: "asc" }
  });

  const matches: { order: number; title: string; kind: string; snippet: string; term: string }[] = [];

  for (const s of sections) {
    const lower = s.content.toLowerCase();
    for (const term of searchTerms) {
      if (lower.includes(term.toLowerCase())) {
        const idx = lower.indexOf(term.toLowerCase());
        const start = Math.max(0, idx - 40);
        const end = Math.min(s.content.length, idx + 80);
        matches.push({
          order: s.order,
          title: s.title.slice(0, 50),
          kind: s.kind,
          snippet: s.content.slice(start, end).replace(/\n/g, " "),
          term
        });
        break; // Only report first match per section
      }
    }
  }

  return matches;
}

async function compareGuides(guideId: string) {
  const rawId = `${guideId}-raw`;

  console.log(`\n${"=".repeat(60)}`);
  console.log(`COMPARING: ${guideId} vs ${rawId}`);
  console.log(`${"=".repeat(60)}\n`);

  // Get section counts
  const orgCount = await prisma.section.count({ where: { guideId } });
  const rawCount = await prisma.section.count({ where: { guideId: rawId } });
  console.log(`Reorganized: ${orgCount} sections`);
  console.log(`Raw import:  ${rawCount} sections\n`);

  // Define what content might be misplaced based on guide
  const suspiciousTerms: Record<string, string[]> = {
    shoulders: ["chest", "pectoralis", "pec major", "pec minor", "bench press"],
    chest: ["shoulder", "deltoid", "rotator cuff", "lateral raise"],
    back: ["chest", "pectoralis", "shoulder press"],
    arms: ["chest", "back", "lat pulldown"],
    legs: ["chest", "shoulder", "arm"],
  };

  const terms = suspiciousTerms[guideId] || ["misplaced"];

  // Search reorganized guide
  console.log(`Searching ${guideId} for potentially misplaced content...`);
  const orgMatches = await searchForContent(guideId, terms);

  if (orgMatches.length === 0) {
    console.log("✅ No suspicious content found\n");
  } else {
    console.log(`⚠️  Found ${orgMatches.length} potential issues:\n`);
    for (const m of orgMatches) {
      console.log(`  [${m.order}] ${m.title} (${m.kind})`);
      console.log(`      Term: "${m.term}"`);
      console.log(`      ...${m.snippet}...`);
      console.log("");
    }
  }

  // Check if same content exists in raw
  if (orgMatches.length > 0) {
    console.log(`Checking if same content exists in ${rawId}...`);
    const rawMatches = await searchForContent(rawId, terms);
    console.log(`Raw guide has ${rawMatches.length} sections with same terms`);
    if (rawMatches.length > 0) {
      console.log("(Content was already in original PDF - not a reorganization bug)\n");
    }
  }
}

async function main() {
  const guideArg = process.argv[2];

  if (guideArg) {
    await compareGuides(guideArg);
  } else {
    // Compare all guides
    const guides = ["shoulders", "chest", "back", "arms", "legs"];
    for (const guide of guides) {
      await compareGuides(guide);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
