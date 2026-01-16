"use client";

import { useState, useCallback } from "react";
import { AnatomyExplorerTree, TreeNode } from "@/components/AnatomyExplorerTree";
import { AnatomyExplorerGraph } from "@/components/AnatomyExplorerGraph";

interface Connection {
  targetId: string;
  targetName: string;
  targetRegion: string;
  targetRegionName: string;
  sharedExercises: number;
}

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

interface NodeInfo {
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
}

interface Props {
  tree: TreeNode[];
  connections: Record<string, Connection[]>;
  nodeLookup: Record<string, NodeInfo>;
}

export function AnatomyExplorerClient({ tree, connections, nodeLookup }: Props) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    // Start with regions expanded
    const initial = new Set<string>();
    tree.forEach(region => initial.add(region.id));
    return initial;
  });

  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // When clicking a node in the graph, expand path to it and select it
  const handleGraphNodeClick = useCallback((nodeId: string) => {
    // Find the path to this node and expand all ancestors
    const findPath = (nodes: TreeNode[], targetId: string, path: string[] = []): string[] | null => {
      for (const node of nodes) {
        if (node.id === targetId) {
          return [...path, node.id];
        }
        if (node.children.length > 0) {
          const found = findPath(node.children, targetId, [...path, node.id]);
          if (found) return found;
        }
      }
      return null;
    };

    const path = findPath(tree, nodeId);
    if (path) {
      setExpandedNodes(prev => {
        const next = new Set(prev);
        path.forEach(id => next.add(id));
        return next;
      });
      setSelectedNodeId(nodeId);
    }
  }, [tree]);

  const selectedNode = selectedNodeId ? nodeLookup[selectedNodeId] : null;
  const selectedConnections = selectedNodeId ? connections[selectedNodeId] || [] : [];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel: Tree */}
      <div className="w-[400px] md:w-[440px] xl:w-[480px] border-r overflow-y-auto bg-gray-50 p-3 flex-shrink-0">
        <AnatomyExplorerTree
          nodes={tree}
          selectedId={selectedNodeId}
          expandedIds={expandedNodes}
          connections={connections}
          onSelect={handleSelectNode}
          onToggleExpand={handleToggleExpand}
        />
      </div>

      {/* Right Panel: Graph */}
      <div className="flex-1 bg-white min-w-0">
        {selectedNode ? (
          <AnatomyExplorerGraph
            selectedNode={selectedNode}
            connections={selectedConnections}
            nodeLookup={nodeLookup}
            onNodeClick={handleGraphNodeClick}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">👈</div>
              <p>Select a muscle from the tree</p>
              <p className="text-sm">to see its cross-region connections</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
