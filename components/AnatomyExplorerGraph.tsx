"use client";

import { useMemo } from "react";

interface Connection {
  targetId: string;
  targetName: string;
  targetRegion: string;
  targetRegionName: string;
  sharedExercises: number;
}

interface NodeInfo {
  id: string;
  name: string;
  kind: string;
  regionId: string;
  regionName: string;
  exerciseCount: number;
}

interface Props {
  selectedNode: NodeInfo;
  connections: Connection[];
  nodeLookup: Record<string, NodeInfo>;
  onNodeClick: (id: string) => void;
}

const regionColors: Record<string, string> = {
  arms: "#8B5CF6",      // purple
  back: "#3B82F6",      // blue
  chest: "#EF4444",     // red
  legs: "#10B981",      // green
  shoulders: "#F59E0B", // amber
};

export function AnatomyExplorerGraph({ selectedNode, connections, nodeLookup, onNodeClick }: Props) {
  // Group connections by region and limit display
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

  // Layout: Center node + radial connected nodes
  const centerX = 300;
  const centerY = 250;
  const radius = 180;

  // Calculate positions for connected nodes
  const connectedNodes = useMemo(() => {
    // Take top 12 connections to avoid overcrowding
    const top = connections.slice(0, 12);
    return top.map((conn, i) => {
      const angle = (i / top.length) * 2 * Math.PI - Math.PI / 2;
      return {
        ...conn,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        nodeInfo: nodeLookup[conn.targetId],
      };
    });
  }, [connections, nodeLookup]);

  const selectedColor = regionColors[selectedNode.regionId] || "#6B7280";

  if (connections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">🔗</div>
          <p className="font-medium">{selectedNode.name}</p>
          <p className="text-sm">No cross-region connections</p>
          <p className="text-xs mt-2">This muscle only works within {selectedNode.regionName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header stats */}
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg">{selectedNode.name}</h2>
        <p className="text-sm text-gray-600">
          {totalConnections} cross-region connections to {connections.length} muscles
        </p>
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
                {regionName}: {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Graph */}
      <div className="flex-1 relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 600 500" className="max-w-full">
          {/* Edges */}
          {connectedNodes.map((conn) => {
            const targetColor = regionColors[conn.targetRegion] || "#6B7280";
            const strokeWidth = Math.min(Math.max(conn.sharedExercises / 3, 1), 8);
            return (
              <line
                key={conn.targetId}
                x1={centerX}
                y1={centerY}
                x2={conn.x}
                y2={conn.y}
                stroke={targetColor}
                strokeWidth={strokeWidth}
                strokeOpacity={0.4}
              />
            );
          })}

          {/* Connected nodes */}
          {connectedNodes.map((conn) => {
            const targetColor = regionColors[conn.targetRegion] || "#6B7280";
            const nodeRadius = Math.min(Math.max(20 + conn.sharedExercises, 25), 45);
            return (
              <g
                key={conn.targetId}
                className="cursor-pointer"
                onClick={() => onNodeClick(conn.targetId)}
              >
                <circle
                  cx={conn.x}
                  cy={conn.y}
                  r={nodeRadius}
                  fill={targetColor}
                  className="transition-all hover:opacity-80"
                />
                <text
                  x={conn.x}
                  y={conn.y - 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize={10}
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {conn.targetName.length > 15
                    ? conn.targetName.slice(0, 12) + "..."
                    : conn.targetName}
                </text>
                <text
                  x={conn.x}
                  y={conn.y + 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize={11}
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {conn.sharedExercises}x
                </text>
              </g>
            );
          })}

          {/* Center node (selected) */}
          <g>
            <circle
              cx={centerX}
              cy={centerY}
              r={50}
              fill={selectedColor}
              stroke="white"
              strokeWidth={4}
            />
            <text
              x={centerX}
              y={centerY - 8}
              textAnchor="middle"
              fill="white"
              fontSize={11}
              fontWeight="bold"
            >
              {selectedNode.name.length > 18
                ? selectedNode.name.slice(0, 15) + "..."
                : selectedNode.name}
            </text>
            <text
              x={centerX}
              y={centerY + 8}
              textAnchor="middle"
              fill="white"
              fontSize={10}
              opacity={0.9}
            >
              ({selectedNode.regionName.split(" ")[0]})
            </text>
          </g>
        </svg>
      </div>

      {/* Connection list */}
      <div className="border-t max-h-48 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left px-4 py-2">Muscle</th>
              <th className="text-left px-4 py-2">Region</th>
              <th className="text-right px-4 py-2">Shared</th>
            </tr>
          </thead>
          <tbody>
            {connections.slice(0, 15).map((conn) => (
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
    </div>
  );
}
