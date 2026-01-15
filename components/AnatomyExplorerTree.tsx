"use client";

export interface TreeNode {
  id: string;
  name: string;
  kind: string;
  description: string | null;
  exerciseCount: number;
  children: TreeNode[];
}

interface Connection {
  targetId: string;
  targetName: string;
  targetRegion: string;
  targetRegionName: string;
  sharedExercises: number;
}

interface Props {
  nodes: TreeNode[];
  selectedId: string | null;
  expandedIds: Set<string>;
  connections: Record<string, Connection[]>;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

const kindColors: Record<string, { bg: string; text: string; border: string }> = {
  region: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  group: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  muscle: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
  part: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  tendon: { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-300" },
};

function TreeNodeComponent({
  node,
  depth,
  selectedId,
  expandedIds,
  connections,
  onSelect,
  onToggleExpand,
}: {
  node: TreeNode;
  depth: number;
  selectedId: string | null;
  expandedIds: Set<string>;
  connections: Record<string, Connection[]>;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
}) {
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children.length > 0;
  const nodeConnections = connections[node.id] || [];
  const hasCrossRegion = nodeConnections.length > 0;
  const colors = kindColors[node.kind] || kindColors.part;

  // Count total cross-region exercises
  const totalCrossRegion = nodeConnections.reduce((sum, c) => sum + c.sharedExercises, 0);

  return (
    <div>
      <div
        className={`
          flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-all
          ${isSelected ? "bg-blue-500 text-white" : "hover:bg-gray-100"}
        `}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node.id)}
      >
        {/* Expand/collapse toggle */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold
              ${isSelected ? "text-white hover:bg-blue-400" : "text-gray-500 hover:bg-gray-200"}
            `}
          >
            {isExpanded ? "−" : "+"}
          </button>
        ) : (
          <span className="w-5" />
        )}

        {/* Kind badge */}
        <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${
          isSelected ? "bg-blue-400 text-white" : `${colors.bg} ${colors.text}`
        }`}>
          {node.kind.slice(0, 3).toUpperCase()}
        </span>

        {/* Name */}
        <span className={`flex-1 font-medium truncate ${isSelected ? "text-white" : "text-gray-900"}`}>
          {node.name}
        </span>

        {/* Exercise count */}
        {node.exerciseCount > 0 && (
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            isSelected ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-600"
          }`}>
            {node.exerciseCount} ex
          </span>
        )}

        {/* Cross-region indicator */}
        {hasCrossRegion && (
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
            isSelected ? "bg-yellow-400 text-yellow-900" : "bg-yellow-100 text-yellow-700"
          }`} title={`${totalCrossRegion} cross-region connections`}>
            ↔ {totalCrossRegion}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              connections={connections}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AnatomyExplorerTree({
  nodes,
  selectedId,
  expandedIds,
  connections,
  onSelect,
  onToggleExpand,
}: Props) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-4 mb-4 text-xs">
        <span className="flex items-center gap-1">
          <span className={`px-1.5 py-0.5 rounded ${kindColors.region.bg} ${kindColors.region.text}`}>REG</span>
          Region
        </span>
        <span className="flex items-center gap-1">
          <span className={`px-1.5 py-0.5 rounded ${kindColors.group.bg} ${kindColors.group.text}`}>GRO</span>
          Group
        </span>
        <span className="flex items-center gap-1">
          <span className={`px-1.5 py-0.5 rounded ${kindColors.muscle.bg} ${kindColors.muscle.text}`}>MUS</span>
          Muscle
        </span>
        <span className="flex items-center gap-1">
          <span className={`px-1.5 py-0.5 rounded ${kindColors.part.bg} ${kindColors.part.text}`}>PAR</span>
          Part
        </span>
        <span className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">↔ N</span>
          Cross-region links
        </span>
      </div>
      {nodes.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          expandedIds={expandedIds}
          connections={connections}
          onSelect={onSelect}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </div>
  );
}
