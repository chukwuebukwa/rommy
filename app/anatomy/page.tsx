"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AnatomyNode {
  id: string;
  kind: string;
  name: string;
  description: string | null;
  roleSummary: string | null;
  parentId: string | null;
  primaryFunctions: string | null;
  aestheticNotes: string | null;
}

interface Column {
  items: AnatomyNode[];
  selectedId: string | null;
}

export default function AnatomyPage() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedNode, setSelectedNode] = useState<AnatomyNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load root nodes (regions)
    fetch("/api/anatomy/roots")
      .then((res) => res.json())
      .then((data) => {
        setColumns([{ items: data, selectedId: null }]);
        setLoading(false);
      });
  }, []);

  const handleSelect = async (node: AnatomyNode, columnIndex: number) => {
    // Update selection in current column
    const newColumns = columns.slice(0, columnIndex + 1);
    newColumns[columnIndex] = { ...newColumns[columnIndex], selectedId: node.id };

    // Load children if any
    const response = await fetch(`/api/anatomy/${node.id}/children`);
    const children = await response.json();

    if (children.length > 0) {
      newColumns.push({ items: children, selectedId: null });
    }

    setColumns(newColumns);
    setSelectedNode(node);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading anatomy tree...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -m-8">
      {/* Breadcrumb */}
      <div className="px-8 py-4 border-b bg-white flex-shrink-0">
        <div className="text-sm text-gray-500">
          <span className="text-gray-900 font-medium">Anatomy Browser</span>
          {selectedNode && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{selectedNode.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Miller Columns */}
        <div className="flex flex-1 overflow-x-auto">
          {columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="flex-shrink-0 w-80 border-r border-gray-200 bg-white overflow-y-auto"
            >
              {column.items.map((node) => {
                const isSelected = column.selectedId === node.id;
                const kindColors: Record<string, string> = {
                  region: "bg-blue-100 text-blue-800",
                  group: "bg-green-100 text-green-800",
                  muscle: "bg-purple-100 text-purple-800",
                  part: "bg-orange-100 text-orange-800",
                };

                return (
                  <div
                    key={node.id}
                    onClick={() => handleSelect(node, columnIndex)}
                    className={`
                      p-4 border-b border-gray-100 cursor-pointer transition
                      ${isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50"}
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-gray-900">{node.name}</div>
                      {node.kind !== "part" && (
                        <span className="text-gray-400">→</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs mb-2">
                      <span className={`px-2 py-0.5 rounded font-medium ${kindColors[node.kind]}`}>
                        {node.kind}
                      </span>
                    </div>
                    {node.description && (
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {node.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedNode && (
          <div className="w-96 flex-shrink-0 border-l border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-6">
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                  {selectedNode.kind}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedNode.name}
                </h2>
              </div>

              {selectedNode.description && (
                <div className="mb-4">
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {selectedNode.description}
                  </div>
                </div>
              )}

              {selectedNode.roleSummary && (
                <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-500 rounded">
                  <div className="text-sm font-semibold text-blue-900 mb-1">Role Summary</div>
                  <div className="text-sm text-blue-800">{selectedNode.roleSummary}</div>
                </div>
              )}

              {selectedNode.primaryFunctions && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    Primary Functions
                  </div>
                  <ul className="space-y-1">
                    {JSON.parse(selectedNode.primaryFunctions).map((func: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {func}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedNode.aestheticNotes && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    Aesthetic Notes
                  </div>
                  <ul className="space-y-1">
                    {JSON.parse(selectedNode.aestheticNotes).map((note: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <Link
                  href={`/anatomy/${selectedNode.id}`}
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
