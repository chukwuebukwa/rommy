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
        include: { exercise: { select: { id: true, name: true, type: true, cdnVideoUrl: true } } }
      }
    }
  });

  const byId: Record<string, typeof nodes[0]> = {};
  nodes.forEach((n: typeof nodes[0]) => byId[n.id] = n);

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

  type NodeType = typeof nodes[0];
  nodes.forEach((n: NodeType) => {
    const myRegion = getRegion(n);
    const myExerciseIds = new Set(n.exerciseLinks.map((l: NodeType["exerciseLinks"][0]) => l.exercise.id));

    if (myExerciseIds.size === 0) return;

    const myConnections: typeof connections[string] = [];

    nodes.forEach((other: NodeType) => {
      if (other.id === n.id) return;
      const otherRegion = getRegion(other);
      if (otherRegion.id === myRegion.id) return; // Same region, skip

      // Count shared exercises
      let shared = 0;
      other.exerciseLinks.forEach((link: NodeType["exerciseLinks"][0]) => {
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
  nodes.forEach((n: typeof nodes[0]) => byId[n.id] = n);

  interface TreeNode {
    id: string;
    name: string;
    kind: string;
    description: string | null;
    exerciseCount: number;
    totalExerciseCount: number;
    children: TreeNode[];
  }

  type NodeType = typeof nodes[0];
  function buildNode(node: NodeType): TreeNode {
    const children = nodes.filter((n: NodeType) => n.parentId === node.id);
    const childNodes = children.map((c: NodeType) => buildNode(c)).sort((a: TreeNode, b: TreeNode) => a.name.localeCompare(b.name));
    const childrenTotal = childNodes.reduce((sum: number, c: TreeNode) => sum + c.totalExerciseCount, 0);
    return {
      id: node.id,
      name: node.name,
      kind: node.kind,
      description: node.description,
      exerciseCount: node.exerciseLinks.length,
      totalExerciseCount: node.exerciseLinks.length + childrenTotal,
      children: childNodes
    };
  }

  const roots = nodes.filter((n: NodeType) => !n.parentId);
  return roots.map((r: NodeType) => buildNode(r)).sort((a: TreeNode, b: TreeNode) => a.name.localeCompare(b.name));
}

export default async function AnatomyExplorerPage() {
  const { nodes, connections } = await computeCrossRegionConnections();
  const tree = buildTree(nodes);

  // Create a flat lookup for the client
  interface ExerciseInfo {
    id: string;
    name: string;
    type: string;
    role: string;
    cdnVideoUrl: string | null;
  }

  interface AggregatedExercise extends ExerciseInfo {
    sourceNodeId: string;
    sourceNodeName: string;
  }

  interface ExerciseSource {
    id: string;
    name: string;
    count: number;
  }

  const nodeLookup: Record<string, {
    id: string;
    name: string;
    kind: string;
    parentId: string | null;
    regionId: string;
    regionName: string;
    exerciseCount: number;
    totalExerciseCount: number;
    exercises: ExerciseInfo[];
    aggregatedExercises: AggregatedExercise[];
    exerciseSources: ExerciseSource[];
  }> = {};

  const byId: Record<string, typeof nodes[0]> = {};
  nodes.forEach((n: typeof nodes[0]) => byId[n.id] = n);

  function getRegion(node: typeof nodes[0]): typeof nodes[0] {
    let current = node;
    while (current.parentId && byId[current.parentId]) {
      current = byId[current.parentId];
    }
    return current;
  }

  // Get all descendant IDs for a node (recursive)
  type NodeType = typeof nodes[0];
  function getAllDescendantIds(nodeId: string): string[] {
    const descendants: string[] = [];
    const children = nodes.filter((n: NodeType) => n.parentId === nodeId);
    for (const child of children) {
      descendants.push(child.id);
      descendants.push(...getAllDescendantIds(child.id));
    }
    return descendants;
  }

  nodes.forEach((n: NodeType) => {
    const region = getRegion(n);
    const descendantIds = getAllDescendantIds(n.id);
    const allNodeIds = [n.id, ...descendantIds];

    // Collect exercises from self + all descendants
    const exerciseMap = new Map<string, AggregatedExercise>();
    const sources: ExerciseSource[] = [];

    for (const nodeId of allNodeIds) {
      const sourceNode = byId[nodeId];
      if (!sourceNode) continue;

      const nodeExercises = sourceNode.exerciseLinks;
      if (nodeExercises.length > 0) {
        sources.push({
          id: nodeId,
          name: sourceNode.name,
          count: nodeExercises.length
        });
      }

      for (const link of nodeExercises) {
        // Use compound key for exercise + role to handle same exercise with different roles
        const key = `${link.exercise.id}-${link.role}`;
        if (!exerciseMap.has(key)) {
          exerciseMap.set(key, {
            id: link.exercise.id,
            name: link.exercise.name,
            type: link.exercise.type,
            role: link.role,
            cdnVideoUrl: link.exercise.cdnVideoUrl,
            sourceNodeId: nodeId,
            sourceNodeName: sourceNode.name
          });
        }
      }
    }

    nodeLookup[n.id] = {
      id: n.id,
      name: n.name,
      kind: n.kind,
      parentId: n.parentId,
      regionId: region.id,
      regionName: region.name,
      exerciseCount: n.exerciseLinks.length,
      totalExerciseCount: exerciseMap.size,
      exercises: n.exerciseLinks.map((link: NodeType["exerciseLinks"][0]) => ({
        id: link.exercise.id,
        name: link.exercise.name,
        type: link.exercise.type,
        role: link.role,
        cdnVideoUrl: link.exercise.cdnVideoUrl
      })),
      aggregatedExercises: Array.from(exerciseMap.values()),
      exerciseSources: sources
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
