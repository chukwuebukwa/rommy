import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Fetch all data
const nodes = await prisma.anatomyNode.findMany({
  include: {
    parent: true,
    children: { select: { id: true } },
    exerciseLinks: {
      include: {
        exercise: { select: { id: true, name: true, type: true, movementPattern: true } }
      }
    }
  }
});

const exercises = await prisma.exercise.findMany({
  include: {
    anatomyLinks: {
      include: { anatomy: { select: { id: true, name: true, kind: true } } }
    }
  }
});

// Build ID lookup
const byId: Record<string, typeof nodes[0]> = {};
nodes.forEach(n => byId[n.id] = n);

function getRegionId(node: typeof nodes[0]): string {
  let current = node;
  while (current.parentId && byId[current.parentId]) {
    current = byId[current.parentId];
  }
  return current.id;
}

// ===== 1. COMPACT LLM-OPTIMIZED JSON =====

interface CompactGraph {
  regions: Record<string, {
    name: string;
    muscles: Record<string, {
      name: string;
      kind: string;
      parent?: string;
      primary: string[];    // exercise names
      secondary: string[];  // exercise names
    }>;
  }>;
  exercises: Record<string, {
    name: string;
    type: string;
    pattern: string;
    primary: string[];    // muscle names
    secondary: string[];  // muscle names
  }>;
  coactivation: Array<{
    muscles: [string, string];
    regions: [string, string];
    count: number;
  }>;
}

const graph: CompactGraph = {
  regions: {},
  exercises: {},
  coactivation: []
};

// Build regions with muscles
const roots = nodes.filter(n => !n.parentId);
roots.forEach(r => {
  graph.regions[r.id] = { name: r.name, muscles: {} };
});

// Add all muscles to their regions
nodes.forEach(n => {
  if (n.kind === "region") return;

  const regionId = getRegionId(n);
  if (!graph.regions[regionId]) return;

  const primary = n.exerciseLinks.filter(l => l.role === "primary").map(l => l.exercise.name);
  const secondary = n.exerciseLinks.filter(l => l.role === "secondary").map(l => l.exercise.name);

  graph.regions[regionId].muscles[n.id] = {
    name: n.name,
    kind: n.kind,
    parent: n.parentId || undefined,
    primary: [...new Set(primary)],
    secondary: [...new Set(secondary)]
  };
});

// Build exercises
exercises.forEach(ex => {
  const primary = ex.anatomyLinks.filter(l => l.role === "primary").map(l => l.anatomy.name);
  const secondary = ex.anatomyLinks.filter(l => l.role === "secondary").map(l => l.anatomy.name);

  graph.exercises[ex.id] = {
    name: ex.name,
    type: ex.type,
    pattern: ex.movementPattern,
    primary: [...new Set(primary)],
    secondary: [...new Set(secondary)]
  };
});

// Build coactivation (cross-region pairs)
const coActivation: Record<string, { a: string, b: string, regA: string, regB: string, count: number }> = {};

nodes.forEach(n => {
  const myRegion = getRegionId(n);
  n.exerciseLinks.forEach(link => {
    const exId = link.exercise.id;
    nodes.forEach(other => {
      if (other.id >= n.id) return;
      const otherRegion = getRegionId(other);
      if (myRegion === otherRegion) return;

      const hasLink = other.exerciseLinks.some(ol => ol.exercise.id === exId);
      if (hasLink) {
        const key = [n.id, other.id].sort().join("|");
        if (!coActivation[key]) {
          coActivation[key] = { a: n.name, b: other.name, regA: graph.regions[myRegion]?.name || myRegion, regB: graph.regions[otherRegion]?.name || otherRegion, count: 0 };
        }
        coActivation[key].count++;
      }
    });
  });
});

graph.coactivation = Object.values(coActivation)
  .sort((a, b) => b.count - a.count)
  .slice(0, 50)
  .map(c => ({
    muscles: [c.a, c.b] as [string, string],
    regions: [c.regA, c.regB] as [string, string],
    count: c.count
  }));

// Output
console.log(JSON.stringify(graph, null, 2));

await prisma.$disconnect();
