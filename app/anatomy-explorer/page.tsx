import { prisma } from "@/lib/prisma";
import { AnatomyExplorerClient } from "./AnatomyExplorerClient";

export const dynamic = "force-dynamic";

// Compute cross-region connections for each node
async function computeCrossRegionConnections() {
  const nodes = await prisma.anatomyNode.findMany({
    include: {
      parent: true,
      children: { select: { id: true } },
      exerciseLinks: {
        include: { exercise: { select: { id: true, name: true } } }
      }
    }
  });

  const byId: Record<string, typeof nodes[0]> = {};
  nodes.forEach(n => byId[n.id] = n);

  // Get root region for any node
  function getRegion(node: typeof nodes[0]): typeof nodes[0] {
    let current = node;
    while (current.parentId && byId[current.parentId]) {
      current = byId[current.parentId];
    }
    return current;
  }

  // Build cross-region connection map
  const connections: Record<string, { targetId: string; targetName: string; targetRegion: string; targetRegionName: string; sharedExercises: number }[]> = {};

  nodes.forEach(n => {
    const myRegion = getRegion(n);
    const myExerciseIds = new Set(n.exerciseLinks.map(l => l.exercise.id));

    if (myExerciseIds.size === 0) return;

    const myConnections: typeof connections[string] = [];

    nodes.forEach(other => {
      if (other.id === n.id) return;
      const otherRegion = getRegion(other);
      if (otherRegion.id === myRegion.id) return; // Same region, skip

      // Count shared exercises
      let shared = 0;
      other.exerciseLinks.forEach(link => {
        if (myExerciseIds.has(link.exercise.id)) shared++;
      });

      if (shared > 0) {
        myConnections.push({
          targetId: other.id,
          targetName: other.name,
          targetRegion: otherRegion.id,
          targetRegionName: otherRegion.name,
          sharedExercises: shared
        });
      }
    });

    // Sort by shared exercises descending
    myConnections.sort((a, b) => b.sharedExercises - a.sharedExercises);
    connections[n.id] = myConnections;
  });

  return { nodes, connections };
}

// Build tree structure from flat nodes
function buildTree(nodes: Awaited<ReturnType<typeof computeCrossRegionConnections>>["nodes"]) {
  const byId: Record<string, typeof nodes[0]> = {};
  nodes.forEach(n => byId[n.id] = n);

  interface TreeNode {
    id: string;
    name: string;
    kind: string;
    description: string | null;
    exerciseCount: number;
    children: TreeNode[];
  }

  function buildNode(node: typeof nodes[0]): TreeNode {
    const children = nodes.filter(n => n.parentId === node.id);
    return {
      id: node.id,
      name: node.name,
      kind: node.kind,
      description: node.description,
      exerciseCount: node.exerciseLinks.length,
      children: children.map(c => buildNode(c)).sort((a, b) => a.name.localeCompare(b.name))
    };
  }

  const roots = nodes.filter(n => !n.parentId);
  return roots.map(r => buildNode(r)).sort((a, b) => a.name.localeCompare(b.name));
}

export default async function AnatomyExplorerPage() {
  const { nodes, connections } = await computeCrossRegionConnections();
  const tree = buildTree(nodes);

  // Create a flat lookup for the client
  const nodeLookup: Record<string, {
    id: string;
    name: string;
    kind: string;
    regionId: string;
    regionName: string;
    exerciseCount: number;
  }> = {};

  const byId: Record<string, typeof nodes[0]> = {};
  nodes.forEach(n => byId[n.id] = n);

  function getRegion(node: typeof nodes[0]): typeof nodes[0] {
    let current = node;
    while (current.parentId && byId[current.parentId]) {
      current = byId[current.parentId];
    }
    return current;
  }

  nodes.forEach(n => {
    const region = getRegion(n);
    nodeLookup[n.id] = {
      id: n.id,
      name: n.name,
      kind: n.kind,
      regionId: region.id,
      regionName: region.name,
      exerciseCount: n.exerciseLinks.length
    };
  });

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b bg-white">
        <h1 className="text-2xl font-bold">Anatomy Explorer</h1>
        <p className="text-gray-600 text-sm">
          Select a muscle to see its cross-region connections.
          <span className="text-blue-600 ml-1">90 connections between Back ↔ Shoulders alone.</span>
        </p>
      </div>
      <AnatomyExplorerClient
        tree={tree}
        connections={connections}
        nodeLookup={nodeLookup}
      />
    </div>
  );
}
