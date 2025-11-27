"use client";

import { useState } from "react";
import Link from "next/link";

interface AnatomyNodeData {
  id: string;
  kind: string;
  name: string;
  description: string | null;
  roleSummary: string | null;
  primaryFunctions: any;
  aestheticNotes: any;
  meta: any;
  children: AnatomyNodeData[];
  exerciseLinks?: Array<{
    role: string;
    exercise: {
      id: string;
      name: string;
      type: string;
      movementPattern: string;
      cueSummary: string | null;
      videoUrl: string | null;
      equipment: any;
    };
  }>;
}

interface AnatomyTreeNodeProps {
  node: AnatomyNodeData;
  level: number;
  defaultOpen?: boolean;
}

export function AnatomyTreeNode({ node, level, defaultOpen = true }: AnatomyTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const primaryFunctions = node.primaryFunctions
    ? (typeof node.primaryFunctions === 'string' ? JSON.parse(node.primaryFunctions) : node.primaryFunctions)
    : [];
  const aestheticNotes = node.aestheticNotes
    ? (typeof node.aestheticNotes === 'string' ? JSON.parse(node.aestheticNotes) : node.aestheticNotes)
    : [];
  const meta = node.meta 
    ? (typeof node.meta === 'string' ? JSON.parse(node.meta) : node.meta)
    : null;

  const primaryExercises = node.exerciseLinks?.filter((link) => link.role === "primary") || [];
  const secondaryExercises = node.exerciseLinks?.filter((link) => link.role === "secondary") || [];

  // Color schemes by kind
  const kindConfig: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    region: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-900", badge: "bg-blue-100 text-blue-800" },
    group: { bg: "bg-green-50", border: "border-green-300", text: "text-green-900", badge: "bg-green-100 text-green-800" },
    muscle: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-900", badge: "bg-purple-100 text-purple-800" },
    part: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-900", badge: "bg-orange-100 text-orange-800" },
  };

  const config = kindConfig[node.kind] || kindConfig.part;

  // Indent based on level
  const indentClass = level > 0 ? `ml-${Math.min(level * 6, 12)}` : "";

  return (
    <div className={`${level > 0 ? "ml-8" : ""} mb-4`}>
      <div className={`border-2 ${config.border} ${config.bg} rounded-lg overflow-hidden shadow-sm`}>
        {/* Header - Always Visible */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`p-4 cursor-pointer hover:bg-opacity-80 transition flex items-start justify-between gap-3`}
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 ${config.badge} rounded text-xs font-bold uppercase`}>
                {node.kind}
              </span>
              <h3 className={`text-2xl font-bold ${config.text}`}>{node.name}</h3>
              {node.children.length > 0 && (
                <span className="px-2 py-1 bg-white rounded text-sm text-gray-600">
                  {node.children.length} sub-parts
                </span>
              )}
            </div>
            {node.description && (
              <p className="text-gray-700 text-sm leading-relaxed">{node.description}</p>
            )}
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <svg
              className={`w-6 h-6 text-gray-600 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded Content */}
        {isOpen && (
          <div className="px-4 pb-4 space-y-4 border-t-2 border-white">
            {/* Role Summary */}
            {node.roleSummary && (
              <div className="p-3 bg-white border-l-4 border-blue-500 rounded">
                <p className="text-blue-900 font-medium">{node.roleSummary}</p>
              </div>
            )}

            {/* Functions and Aesthetics */}
            {(primaryFunctions.length > 0 || aestheticNotes.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {primaryFunctions.length > 0 && (
                  <div className="p-3 bg-white rounded">
                    <h4 className="font-semibold text-gray-900 mb-2">Primary Functions:</h4>
                    <ul className="space-y-1">
                      {primaryFunctions.map((func, i) => (
                        <li key={i} className="text-gray-700 text-sm flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {func}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aestheticNotes.length > 0 && (
                  <div className="p-3 bg-white rounded">
                    <h4 className="font-semibold text-gray-900 mb-2">Aesthetic Notes:</h4>
                    <ul className="space-y-1">
                      {aestheticNotes.map((note, i) => (
                        <li key={i} className="text-gray-700 text-sm flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Primary Exercises */}
            {primaryExercises.length > 0 && (
              <div className="p-3 bg-white rounded">
                <h4 className="font-semibold text-gray-900 mb-3">
                  💪 Primary Exercises ({primaryExercises.length}):
                </h4>
                <div className="space-y-3">
                  {primaryExercises.map((link) => {
                    const equipment = link.exercise.equipment
                      ? (typeof link.exercise.equipment === 'string' 
                          ? JSON.parse(link.exercise.equipment) 
                          : link.exercise.equipment)
                      : [];

                    return (
                      <div key={link.exercise.id} className="p-3 border border-green-200 bg-green-50 rounded">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <Link
                            href={`/exercises/${link.exercise.id}`}
                            className="text-lg font-bold text-green-700 hover:text-green-900 hover:underline"
                          >
                            {link.exercise.name}
                          </Link>
                          <span className="px-2 py-1 bg-white text-green-700 rounded text-xs font-medium flex-shrink-0">
                            {link.exercise.type}
                          </span>
                        </div>
                        {link.exercise.cueSummary && (
                          <p className="text-gray-700 text-sm mb-2">{link.exercise.cueSummary}</p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          {equipment.slice(0, 3).map((item) => (
                            <span key={item} className="px-2 py-1 bg-white text-gray-600 rounded text-xs">
                              {item}
                            </span>
                          ))}
                          {link.exercise.videoUrl && (
                            <a
                              href={link.exercise.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              📹 Video
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Secondary Exercises */}
            {secondaryExercises.length > 0 && (
              <div className="p-3 bg-white rounded">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Secondary Exercises ({secondaryExercises.length}):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {secondaryExercises.map((link) => (
                    <Link
                      key={link.exercise.id}
                      href={`/exercises/${link.exercise.id}`}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition"
                    >
                      {link.exercise.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recursive Children - ALWAYS VISIBLE when parent is open */}
            {node.children.length > 0 && (
              <div className="pt-3 space-y-3">
                {node.children.map((child) => (
                  <AnatomyTreeNode
                    key={child.id}
                    node={child}
                    level={level + 1}
                    defaultOpen={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

