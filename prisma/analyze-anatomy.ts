import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const nodes = await prisma.anatomyNode.findMany({
  include: {
    parent: true,
    exerciseLinks: {
      include: { exercise: { select: { id: true, name: true } } }
    }
  }
});

const byId: Record<string, any> = {};
nodes.forEach(n => byId[n.id] = n);

function getRegion(node: any) {
  let current = node;
  while (current.parentId) {
    current = byId[current.parentId];
  }
  return current;
}

const coActivation: Record<string, any> = {};

nodes.forEach(n => {
  n.exerciseLinks.forEach(link => {
    const exId = link.exercise.id;
    nodes.forEach(other => {
      if (other.id === n.id) return;
      const hasLink = other.exerciseLinks.some(ol => ol.exercise.id === exId);
      if (hasLink) {
        const key = [n.id, other.id].sort().join("|");
        coActivation[key] = coActivation[key] || {
          a: n,
          b: other,
          exercises: new Set()
        };
        coActivation[key].exercises.add(exId);
      }
    });
  });
});

const crossRegion = Object.values(coActivation)
  .filter(c => getRegion(c.a).id !== getRegion(c.b).id)
  .sort((a, b) => b.exercises.size - a.exercises.size);

console.log("=== TOP CROSS-REGION MUSCLE RELATIONSHIPS ===\n");
console.log("(Muscles that frequently work together but are in different regions)\n");

crossRegion.slice(0, 25).forEach(c => {
  const regA = getRegion(c.a).name;
  const regB = getRegion(c.b).name;
  console.log(`${c.exercises.size}x: ${c.a.name} (${regA}) <-> ${c.b.name} (${regB})`);
});

console.log("\n=== REGION OVERLAP COUNTS ===\n");
const regionPairs: Record<string, number> = {};
crossRegion.forEach(c => {
  const regA = getRegion(c.a).name;
  const regB = getRegion(c.b).name;
  const key = [regA, regB].sort().join(" <-> ");
  regionPairs[key] = (regionPairs[key] || 0) + c.exercises.size;
});

Object.entries(regionPairs)
  .sort((a, b) => b[1] - a[1])
  .forEach(([pair, count]) => {
    console.log(`${count} connections: ${pair}`);
  });

await prisma.$disconnect();
