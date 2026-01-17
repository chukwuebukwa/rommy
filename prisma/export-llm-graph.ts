import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Fetch all anatomy data with relationships
const nodes = await prisma.anatomyNode.findMany({
  include: {
    parent: true,
    children: true,
    exerciseLinks: {
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            type: true,
            movementPattern: true
          }
        }
      }
    }
  }
});

const exercises = await prisma.exercise.findMany({
  include: {
    anatomyLinks: {
      include: {
        anatomy: {
          select: { id: true, name: true, kind: true, parentId: true }
        }
      }
    }
  }
});

// Build lookup
const byId: Record<string, typeof nodes[0]> = {};
nodes.forEach(n => byId[n.id] = n);

function getRegion(node: typeof nodes[0]): typeof nodes[0] {
  let current = node;
  while (current.parentId && byId[current.parentId]) {
    current = byId[current.parentId];
  }
  return current;
}

function getPath(node: typeof nodes[0]): string[] {
  const path: string[] = [];
  let current: typeof nodes[0] | undefined = node;
  while (current) {
    path.unshift(current.name);
    current = current.parentId ? byId[current.parentId] : undefined;
  }
  return path;
}

// ===== OUTPUT FORMATS =====

console.log("# ANATOMY GRAPH FOR LLM\n");
console.log("## Format: Compact hierarchical with exercise mappings\n");

// 1. TREE VIEW - Compact indented hierarchy
console.log("## ANATOMY TREE\n");
console.log("```");

const roots = nodes.filter(n => !n.parentId).sort((a, b) => a.name.localeCompare(b.name));

function printTree(node: typeof nodes[0], indent = 0) {
  const exCount = node.exerciseLinks.length;
  const prefix = "  ".repeat(indent);
  const kind = node.kind[0].toUpperCase(); // R=region, G=group, M=muscle, P=part
  const exLabel = exCount > 0 ? ` [${exCount} ex]` : "";
  console.log(`${prefix}${kind}: ${node.name}${exLabel}`);

  const children = nodes.filter(c => c.parentId === node.id).sort((a, b) => a.name.localeCompare(b.name));
  children.forEach(c => printTree(c, indent + 1));
}

roots.forEach(r => {
  printTree(r);
  console.log("");
});
console.log("```\n");

// 2. MUSCLE -> EXERCISES mapping (compact)
console.log("## MUSCLE EXERCISES\n");
console.log("Format: `muscle: primary=[ex1, ex2] secondary=[ex3]`\n");
console.log("```");

const muscles = nodes.filter(n => n.kind === "muscle" || n.kind === "part")
  .sort((a, b) => a.name.localeCompare(b.name));

muscles.forEach(m => {
  const primary = m.exerciseLinks.filter(l => l.role === "primary").map(l => l.exercise.name);
  const secondary = m.exerciseLinks.filter(l => l.role === "secondary").map(l => l.exercise.name);

  if (primary.length === 0 && secondary.length === 0) return;

  const parts: string[] = [];
  if (primary.length > 0) parts.push(`primary=[${primary.join(", ")}]`);
  if (secondary.length > 0) parts.push(`secondary=[${secondary.join(", ")}]`);

  const region = getRegion(m).name;
  console.log(`${m.name} (${region}): ${parts.join(" ")}`);
});
console.log("```\n");

// 3. EXERCISE -> MUSCLES mapping (compact)
console.log("## EXERCISE TARGETS\n");
console.log("Format: `exercise (type/pattern): primary=[m1, m2] secondary=[m3]`\n");
console.log("```");

exercises.sort((a, b) => a.name.localeCompare(b.name)).forEach(ex => {
  const primary = ex.anatomyLinks.filter(l => l.role === "primary").map(l => l.anatomy.name);
  const secondary = ex.anatomyLinks.filter(l => l.role === "secondary").map(l => l.anatomy.name);

  const parts: string[] = [];
  if (primary.length > 0) parts.push(`primary=[${primary.join(", ")}]`);
  if (secondary.length > 0) parts.push(`secondary=[${secondary.join(", ")}]`);

  console.log(`${ex.name} (${ex.type}/${ex.movementPattern}): ${parts.join(" ")}`);
});
console.log("```\n");

// 4. CROSS-REGION RELATIONSHIPS (for compound queries)
console.log("## CROSS-REGION LINKS\n");
console.log("Muscles that share exercises across body regions:\n");
console.log("```");

const coActivation: Record<string, { a: string, b: string, regA: string, regB: string, count: number }> = {};

nodes.forEach(n => {
  const myRegion = getRegion(n).name;
  n.exerciseLinks.forEach(link => {
    const exId = link.exercise.id;
    nodes.forEach(other => {
      if (other.id >= n.id) return; // avoid duplicates
      const otherRegion = getRegion(other).name;
      if (myRegion === otherRegion) return; // same region, skip

      const hasLink = other.exerciseLinks.some(ol => ol.exercise.id === exId);
      if (hasLink) {
        const key = [n.id, other.id].sort().join("|");
        if (!coActivation[key]) {
          coActivation[key] = { a: n.name, b: other.name, regA: myRegion, regB: otherRegion, count: 0 };
        }
        coActivation[key].count++;
      }
    });
  });
});

Object.values(coActivation)
  .sort((a, b) => b.count - a.count)
  .slice(0, 30)
  .forEach(c => {
    console.log(`${c.count}x: ${c.a} (${c.regA}) <-> ${c.b} (${c.regB})`);
  });
console.log("```\n");

// 5. SEMANTIC ALIASES (for natural language queries)
console.log("## ALIASES & SYNONYMS\n");
console.log("```");
const aliases: Record<string, string[]> = {
  "biceps": ["bicep", "guns", "pythons", "bis"],
  "triceps": ["tris", "horseshoe"],
  "chest": ["pecs", "pectorals"],
  "back": ["lats", "upper back", "lower back"],
  "shoulders": ["delts", "deltoids", "caps"],
  "legs": ["quads", "hamstrings", "glutes"],
  "abs": ["core", "six pack", "abdominals"],
  "front delts": ["anterior deltoid", "front shoulder"],
  "rear delts": ["posterior deltoid", "rear shoulder"],
  "side delts": ["lateral deltoid", "medial delt"],
};
Object.entries(aliases).forEach(([muscle, alts]) => {
  console.log(`${muscle}: ${alts.join(", ")}`);
});
console.log("```\n");

// 6. STATS SUMMARY
console.log("## STATS\n");
console.log(`- Regions: ${roots.length}`);
console.log(`- Total anatomy nodes: ${nodes.length}`);
console.log(`- Exercises: ${exercises.length}`);
console.log(`- Exercise-muscle links: ${exercises.reduce((sum, ex) => sum + ex.anatomyLinks.length, 0)}`);

await prisma.$disconnect();
