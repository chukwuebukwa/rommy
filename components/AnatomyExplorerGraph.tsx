"use client";

import { useMemo, useEffect, useState } from "react";
import { AggregatedExerciseGrid, AggregatedExercise, ExerciseSource } from "@/components/AggregatedExerciseGrid";
import { AnatomyEditor } from "@/components/AnatomyEditor";
import { ExerciseDrawer } from "@/components/ExerciseDrawer";

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

interface NodeInfo {
  id: string;
  name: string;
  kind: string;
  parentId: string | null;
  regionId: string;
  regionName: string;
  exerciseCount: number;
  totalExerciseCount: number;
  exercises?: ExerciseInfo[];
  aggregatedExercises?: AggregatedExercise[];
  exerciseSources?: ExerciseSource[];
}

interface AnatomyEditorData {
  id: string;
  name: string;
  kind: string;
  slug: string;
  description: string | null;
  roleSummary: string | null;
  primaryFunctions: string[] | null;
  aestheticNotes: string[] | null;
  meta: any;
}

interface Props {
  selectedNode: NodeInfo;
  connections: Connection[];
  nodeLookup: Record<string, NodeInfo>;
  onNodeClick: (id: string) => void;
}

const regionColors: Record<string, string> = {
  arms: "#8B5CF6",
  back: "#3B82F6",
  chest: "#EF4444",
  legs: "#10B981",
  shoulders: "#F59E0B",
};

const kindColors: Record<string, string> = {
  region: "#3B82F6",
  group: "#10B981",
  muscle: "#8B5CF6",
  part: "#F59E0B",
  tendon: "#EC4899",
};

export function AnatomyExplorerGraph({ selectedNode, connections, nodeLookup, onNodeClick }: Props) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorLoading, setEditorLoading] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [editorData, setEditorData] = useState<AnatomyEditorData | null>(null);

  // Exercise drawer state
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [exerciseDrawerOpen, setExerciseDrawerOpen] = useState(false);
  const [exerciseLoading, setExerciseLoading] = useState(false);

  const openExerciseDrawer = async (exerciseId: string) => {
    setExerciseLoading(true);
    setExerciseDrawerOpen(true);
    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetExercise($id: String!) {
              exercise(id: $id) {
                id
                name
                type
                movementPattern
                cueSummary
                videoUrl
                equipment
                anatomyLinks {
                  role
                  anatomy {
                    id
                    name
                    kind
                  }
                }
              }
            }
          `,
          variables: { id: exerciseId },
        }),
      });
      const data = await response.json();
      setSelectedExercise(data.data?.exercise || null);
    } catch (error) {
      console.error("Failed to load exercise:", error);
    } finally {
      setExerciseLoading(false);
    }
  };

  const closeExerciseDrawer = () => {
    setExerciseDrawerOpen(false);
    setTimeout(() => setSelectedExercise(null), 300);
  };

  // Compute ancestry chain
  const ancestry = useMemo(() => {
    const chain: NodeInfo[] = [];
    let current: NodeInfo | undefined = selectedNode;

    while (current) {
      chain.unshift(current);
      if (current.parentId && nodeLookup[current.parentId]) {
        current = nodeLookup[current.parentId];
      } else {
        break;
      }
    }
    return chain;
  }, [selectedNode, nodeLookup]);

  const groupedByRegion = useMemo(() => {
    const groups: Record<string, Connection[]> = {};
    connections.forEach(conn => {
      if (!groups[conn.targetRegion]) {
        groups[conn.targetRegion] = [];
      }
      groups[conn.targetRegion].push(conn);
    });
    return groups;
  }, [connections]);

  const regionEntries = Object.entries(groupedByRegion);
  const totalConnections = connections.reduce((sum, c) => sum + c.sharedExercises, 0);

  // Layout for spine graph
  const spineY = 50;
  const spineStartX = 80;
  const spineNodeSpacing = 140;

  // Cross-region connections below spine
  const crossRegionY = 120;
  const crossRegionSpacing = 130;

  // Calculate SVG dimensions - account for cross-region spread
  const selectedX = spineStartX + (ancestry.length - 1) * spineNodeSpacing;
  const crossRegionSpread = Math.min(connections.length, 5) * crossRegionSpacing / 2;
  const svgWidth = Math.max(600, selectedX + crossRegionSpread + 100);
  const svgHeight = connections.length > 0 ? 340 : 130;

  useEffect(() => {
    if (!editorOpen) return;
    if (editorData?.id === selectedNode.id) return;

    const fetchEditorData = async () => {
      setEditorLoading(true);
      setEditorError(null);
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetAnatomyForEditor($id: String!) {
                anatomyNode(id: $id) {
                  id
                  name
                  kind
                  slug
                  description
                  roleSummary
                  primaryFunctions
                  aestheticNotes
                  meta
                }
              }
            `,
            variables: { id: selectedNode.id },
          }),
        });
        const data = await response.json();
        if (!data?.data?.anatomyNode) {
          throw new Error("Anatomy node not found.");
        }
        setEditorData(data.data.anatomyNode as AnatomyEditorData);
      } catch (error) {
        console.error("Failed to load anatomy editor data:", error);
        setEditorError("Failed to load anatomy editor.");
      } finally {
        setEditorLoading(false);
      }
    };

    fetchEditorData();
  }, [editorOpen, selectedNode.id, editorData?.id]);

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-lg">{selectedNode.name}</h2>
            <p className="text-sm text-gray-600">
              {selectedNode.exerciseCount} exercises
              {selectedNode.totalExerciseCount > selectedNode.exerciseCount && (
                <span className="text-gray-400"> ({selectedNode.totalExerciseCount} total)</span>
              )}
              {" "}• {totalConnections} cross-region links
            </p>
          </div>
          <button
            onClick={() => setEditorOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Edit Anatomy
          </button>
        </div>
      </div>

      {/* Hierarchy Spine Graph */}
      <div className="border-b bg-gray-50 overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ minWidth: svgWidth }}
        >
          {/* Spine line */}
          <line
            x1={spineStartX}
            y1={spineY}
            x2={selectedX}
            y2={spineY}
            stroke="#CBD5E1"
            strokeWidth={3}
          />

          {/* Ancestry nodes */}
          {ancestry.map((node, i) => {
            const x = spineStartX + i * spineNodeSpacing;
            const isSelected = node.id === selectedNode.id;
            const color = kindColors[node.kind] || "#6B7280";
            const radius = isSelected ? 28 : 20;

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onClick={() => onNodeClick(node.id)}
              >
                {/* Connector to next */}
                {i < ancestry.length - 1 && (
                  <line
                    x1={x + radius}
                    y1={spineY}
                    x2={x + spineNodeSpacing - 20}
                    y2={spineY}
                    stroke={color}
                    strokeWidth={2}
                    markerEnd="url(#arrow)"
                  />
                )}

                <circle
                  cx={x}
                  cy={spineY}
                  r={radius}
                  fill={isSelected ? color : "white"}
                  stroke={color}
                  strokeWidth={3}
                  className="transition-all hover:opacity-80"
                />

                {/* Node name below circle */}
                <text
                  x={x}
                  y={spineY + radius + 16}
                  textAnchor="middle"
                  fill={isSelected ? color : "#374151"}
                  fontSize={11}
                  fontWeight={isSelected ? "bold" : "medium"}
                  className="pointer-events-none"
                >
                  {node.name}
                </text>

                {/* Kind label inside circle */}
                <text
                  x={x}
                  y={spineY + 4}
                  textAnchor="middle"
                  fill={isSelected ? "white" : color}
                  fontSize={9}
                  fontWeight="bold"
                  className="pointer-events-none uppercase"
                >
                  {node.kind.slice(0, 3)}
                </text>
              </g>
            );
          })}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94A3B8" />
            </marker>
          </defs>

          {/* Cross-region connections */}
          {connections.length > 0 && (
            <>
              {/* Vertical line from selected node */}
              <line
                x1={selectedX}
                y1={spineY + 28}
                x2={selectedX}
                y2={crossRegionY}
                stroke="#CBD5E1"
                strokeWidth={2}
                strokeDasharray="4"
              />

              {/* Cross-region nodes */}
              {connections.slice(0, 5).map((conn, i) => {
                const numConnections = Math.min(connections.length, 5);
                const offset = (i - (numConnections - 1) / 2) * crossRegionSpacing;
                const x = Math.max(80, Math.min(svgWidth - 80, selectedX + offset));
                const y = crossRegionY + 70;
                const targetColor = regionColors[conn.targetRegion] || "#6B7280";
                const nodeRadius = 24;

                return (
                  <g
                    key={conn.targetId}
                    className="cursor-pointer"
                    onClick={() => onNodeClick(conn.targetId)}
                  >
                    {/* Line to cross-region node */}
                    <line
                      x1={selectedX}
                      y1={crossRegionY}
                      x2={x}
                      y2={y - nodeRadius}
                      stroke={targetColor}
                      strokeWidth={Math.min(conn.sharedExercises / 2 + 1, 4)}
                      strokeOpacity={0.6}
                    />

                    <circle
                      cx={x}
                      cy={y}
                      r={nodeRadius}
                      fill={targetColor}
                      className="transition-all hover:opacity-80"
                    />

                    {/* Shared count inside circle */}
                    <text
                      x={x}
                      y={y + 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize={14}
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {conn.sharedExercises}
                    </text>

                    {/* Name below circle */}
                    <text
                      x={x}
                      y={y + nodeRadius + 14}
                      textAnchor="middle"
                      fill="#374151"
                      fontSize={10}
                      fontWeight="medium"
                      className="pointer-events-none"
                    >
                      {conn.targetName}
                    </text>

                    {/* Region badge below name */}
                    <text
                      x={x}
                      y={y + nodeRadius + 26}
                      textAnchor="middle"
                      fill={targetColor}
                      fontSize={9}
                      className="pointer-events-none"
                    >
                      {conn.targetRegionName}
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>

      {/* Exercises Section */}
      {(selectedNode.aggregatedExercises?.length ?? 0) > 0 && (
        <div className="border-b p-4">
          <h3 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">💪</span>
            Exercises
            <span className="text-gray-400 font-normal">
              ({selectedNode.exerciseCount} direct
              {selectedNode.totalExerciseCount > selectedNode.exerciseCount && (
                <>, {selectedNode.totalExerciseCount} total</>
              )})
            </span>
          </h3>
          <AggregatedExerciseGrid
            exercises={selectedNode.aggregatedExercises || []}
            sources={selectedNode.exerciseSources || []}
            onExerciseClick={openExerciseDrawer}
          />
        </div>
      )}

      {(selectedNode.aggregatedExercises?.length ?? 0) === 0 && (
        <div className="p-4 border-b text-center text-gray-400">
          <p className="text-sm">No exercises linked</p>
        </div>
      )}

      {/* Cross-region connections list */}
      {connections.length > 0 && (
        <div className="border-b">
          <div className="p-4 bg-gray-50">
            <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
              <span className="text-lg">🔗</span>
              Cross-Region Connections ({connections.length})
            </h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              {regionEntries.map(([regionId, conns]) => {
                const color = regionColors[regionId] || "#6B7280";
                const regionName = conns[0].targetRegionName;
                const count = conns.reduce((sum, c) => sum + c.sharedExercises, 0);
                return (
                  <span
                    key={regionId}
                    className="px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: color }}
                  >
                    {regionName.split(" ")[0]}: {count}
                  </span>
                );
              })}
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2">Muscle</th>
                <th className="text-left px-4 py-2">Region</th>
                <th className="text-right px-4 py-2">Shared</th>
              </tr>
            </thead>
            <tbody>
              {connections.slice(0, 10).map((conn) => (
                <tr
                  key={conn.targetId}
                  className="hover:bg-gray-50 cursor-pointer border-t"
                  onClick={() => onNodeClick(conn.targetId)}
                >
                  <td className="px-4 py-2 font-medium">{conn.targetName}</td>
                  <td className="px-4 py-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs text-white"
                      style={{ backgroundColor: regionColors[conn.targetRegion] || "#6B7280" }}
                    >
                      {conn.targetRegionName.split(" ")[0]}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-bold">{conn.sharedExercises}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {connections.length === 0 && (
        <div className="p-6 text-center text-gray-400">
          <p className="text-sm">No cross-region connections</p>
        </div>
      )}

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <div className="p-4">
              {editorLoading && (
                <div className="text-sm text-gray-500">Loading editor...</div>
              )}
              {editorError && (
                <div className="text-sm text-red-600">{editorError}</div>
              )}
              {!editorLoading && !editorError && editorData && (
                <AnatomyEditor
                  anatomy={editorData}
                  onClose={() => setEditorOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <ExerciseDrawer
        exercise={selectedExercise}
        isOpen={exerciseDrawerOpen}
        onClose={closeExerciseDrawer}
      />
    </div>
  );
}
