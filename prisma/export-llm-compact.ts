import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Ultra-compact format for LLM context windows
// Uses abbreviations: p=primary, s=secondary, c=compound, i=isolation

const nodes = await prisma.anatomyNode.findMany({
  include: {
    exerciseLinks: {
      include: { exercise: { select: { id: true, name: true, type: true, movementPattern: true } } }
    }
  }
});

const exercises = await prisma.exercise.findMany({
  include: {
    anatomyLinks: { include: { anatomy: { select: { id: true, name: true } } } }
  }
});

const byId: Record<string, typeof nodes[0]> = {};
nodes.forEach(n => byId[n.id] = n);

function getRegion(node: typeof nodes[0]) {
  let current = node;
  while (current.parentId && byId[current.parentId]) {
    current = byId[current.parentId];
  }
  return current;
}

// Shorten common words
function shorten(name: string): string {
  return name
    .replace(/Dumbbell/g, "DB")
    .replace(/Barbell/g, "BB")
    .replace(/Cable/g, "Cb")
    .replace(/Machine/g, "Mc")
    .replace(/Hammer Strength/g, "HS")
    .replace(/Incline/g, "Inc")
    .replace(/Decline/g, "Dec")
    .replace(/Standing/g, "Std")
    .replace(/Seated/g, "Sit")
    .replace(/Single Arm/g, "1A")
    .replace(/Double/g, "2x")
    .replace(/Reverse/g, "Rev")
    .replace(/Lateral/g, "Lat")
    .replace(/Anterior/g, "Ant")
    .replace(/Posterior/g, "Post")
    .replace(/Extensions?/g, "Ext")
    .replace(/Raises?/g, "Rs")
    .replace(/Curls?/g, "Crl")
    .replace(/Press(es)?/g, "Pr")
    .replace(/Rows?/g, "Rw")
    .replace(/Pulldowns?/g, "PD")
    .replace(/Pull[- ]?Ups?/g, "PU")
    .replace(/ \(.*?\)/g, "") // Remove parenthetical notes
    .trim();
}

console.log("# ANATOMY GRAPH (COMPACT)\n");

// TREE: One line per muscle with exercises inline
console.log("## MUSCLES\n");
console.log("Format: REGION > muscle: p=[primary] s=[secondary]\n");

const regions = nodes.filter(n => !n.parentId).sort((a, b) => a.name.localeCompare(b.name));

regions.forEach(r => {
  const regionMuscles = nodes
    .filter(n => n.kind === "muscle" || n.kind === "part")
    .filter(n => getRegion(n).id === r.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  regionMuscles.forEach(m => {
    const p = [...new Set(m.exerciseLinks.filter(l => l.role === "primary").map(l => shorten(l.exercise.name)))];
    const s = [...new Set(m.exerciseLinks.filter(l => l.role === "secondary").map(l => shorten(l.exercise.name)))];

    if (p.length === 0 && s.length === 0) return;

    const parts: string[] = [];
    if (p.length > 0) parts.push(`p=[${p.join(",")}]`);
    if (s.length > 0) parts.push(`s=[${s.join(",")}]`);

    console.log(`${shorten(r.name)}>${shorten(m.name)}: ${parts.join(" ")}`);
  });
});

// EXERCISES: Compact format
console.log("\n## EXERCISES\n");
console.log("Format: name (type): p=[muscles] s=[muscles]\n");

exercises.sort((a, b) => a.name.localeCompare(b.name)).forEach(ex => {
  const p = [...new Set(ex.anatomyLinks.filter(l => l.role === "primary").map(l => shorten(l.anatomy.name)))];
  const s = [...new Set(ex.anatomyLinks.filter(l => l.role === "secondary").map(l => shorten(l.anatomy.name)))];

  const parts: string[] = [];
  if (p.length > 0) parts.push(`p=[${p.join(",")}]`);
  if (s.length > 0) parts.push(`s=[${s.join(",")}]`);

  const type = ex.type === "compound" ? "c" : "i";
  console.log(`${shorten(ex.name)} (${type}): ${parts.join(" ")}`);
});

// CROSS-REGION: Top connections
console.log("\n## CROSS-REGION TOP 20\n");

const coAct: Record<string, { a: string, b: string, count: number }> = {};
nodes.forEach(n => {
  const myReg = getRegion(n).id;
  n.exerciseLinks.forEach(link => {
    nodes.forEach(other => {
      if (other.id >= n.id) return;
      if (getRegion(other).id === myReg) return;
      if (other.exerciseLinks.some(ol => ol.exercise.id === link.exercise.id)) {
        const key = [n.id, other.id].sort().join("|");
        if (!coAct[key]) coAct[key] = { a: shorten(n.name), b: shorten(other.name), count: 0 };
        coAct[key].count++;
      }
    });
  });
});

Object.values(coAct)
  .sort((a, b) => b.count - a.count)
  .slice(0, 20)
  .forEach(c => console.log(`${c.count}: ${c.a} <> ${c.b}`));

// QUICK LOOKUPS
console.log("\n## QUICK LOOKUPS\n");
console.log("Push muscles: Front Delts, Triceps, Mid Chest, Upper Chest, Lower Chest");
console.log("Pull muscles: Lats, Traps, Rhomboids, Rear Delts, Biceps, Brachialis");
console.log("Legs anterior: Quads, Hip Flexors, Tibialis");
console.log("Legs posterior: Glutes, Hamstrings, Calves");
console.log("Shoulder press: Front Delts (p), Side Delts (p), Traps (s)");
console.log("Chest press: Chest (p), Front Delts (s), Triceps (s)");
console.log("Rowing: Lats/Rhomboids (p), Rear Delts/Traps (s), Biceps (s)");

await prisma.$disconnect();
