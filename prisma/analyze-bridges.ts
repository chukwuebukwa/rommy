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

// Find muscles that share exercises with muscles in OTHER regions
const bridgeScore: Record<string, { node: any, regions: Set<string>, connections: number }> = {};

nodes.forEach(n => {
  const myRegion = getRegion(n).id;
  const myExercises = new Set(n.exerciseLinks.map(l => l.exercise.id));

  if (myExercises.size === 0) return;

  const otherRegions = new Set<string>();
  let connections = 0;

  nodes.forEach(other => {
    const otherRegion = getRegion(other).id;
    if (otherRegion === myRegion) return;

    other.exerciseLinks.forEach(link => {
      if (myExercises.has(link.exercise.id)) {
        otherRegions.add(otherRegion);
        connections++;
      }
    });
  });

  if (otherRegions.size > 0) {
    bridgeScore[n.id] = { node: n, regions: otherRegions, connections };
  }
});

const sorted = Object.values(bridgeScore)
  .sort((a, b) => b.connections - a.connections);

console.log("=== BRIDGE MUSCLES (connect multiple regions) ===\n");

sorted.slice(0, 20).forEach(b => {
  const myRegion = getRegion(b.node).name;
  const otherRegions = [...b.regions].map(r => {
    const region = nodes.find(n => n.id === r);
    return region?.name || r;
  });
  console.log(`${b.node.name} (${b.node.kind})`);
  console.log(`  Home: ${myRegion}`);
  console.log(`  Bridges to: ${otherRegions.join(", ")}`);
  console.log(`  Cross-region exercise connections: ${b.connections}`);
  console.log("");
});

// Identify functional clusters
console.log("\n=== KEY INSIGHT: FUNCTIONAL CLUSTERS ===\n");

console.log("1. PUSH CLUSTER (Chest + Front Delts + Triceps)");
console.log("   - These 3 fire together on pressing movements");
console.log("");

console.log("2. PULL/UPPER BACK CLUSTER (Lats + Traps + Rhomboids + Rear Delts + Rotator Cuff)");
console.log("   - Back and Shoulders heavily overlap here");
console.log("   - 90 cross-region connections!");
console.log("");

console.log("3. POSTERIOR CHAIN CLUSTER (Glutes + Hamstrings + Erector Spinae)");
console.log("   - Legs and Back connect through hip hinge movements");
console.log("   - 46 cross-region connections");
console.log("");

console.log("4. ISOLATED GROUPS:");
console.log("   - Biceps (only 0 cross-region, works within Arms)");
console.log("   - Calves (minimal cross-region)");
console.log("   - Quads (some erector connection via squats)");

await prisma.$disconnect();
