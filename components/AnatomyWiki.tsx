"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExerciseDrawer } from "./ExerciseDrawer";

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
  formulaTargets?: Array<{
    formula: {
      id: string;
      name: string;
      description: string | null;
      pattern: string;
      steps: Array<{
        order: number;
        role: string;
        notes: string | null;
        exercise: {
          id: string;
          name: string;
          type: string;
        };
      }>;
      targets: Array<{
        anatomyNodeId: string;
        anatomy: {
          id: string;
          name: string;
        };
      }>;
    };
  }>;
}

interface AnatomyWikiProps {
  node: AnatomyNodeData;
  level?: number;
}

export function AnatomyWiki({ node, level = 1 }: AnatomyWikiProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    const newSet = new Set(collapsedSections);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCollapsedSections(newSet);
  };

  const isCollapsed = (id: string) => collapsedSections.has(id);

  const openExerciseDrawer = (exercise: any) => {
    setSelectedExercise(exercise);
    setIsDrawerOpen(true);
  };

  const closeExerciseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedExercise(null), 300);
  };

  const primaryFunctions = node.primaryFunctions
    ? (typeof node.primaryFunctions === "string" ? JSON.parse(node.primaryFunctions) : node.primaryFunctions)
    : [];
  const aestheticNotes = node.aestheticNotes
    ? (typeof node.aestheticNotes === "string" ? JSON.parse(node.aestheticNotes) : node.aestheticNotes)
    : [];

  const primaryExercises = node.exerciseLinks?.filter((link) => link.role === "primary") || [];
  const secondaryExercises = node.exerciseLinks?.filter((link) => link.role === "secondary") || [];
  
  // Only show formulas that directly target THIS node (no roll-up from children)
  const allFormulas = node.formulaTargets?.map((target) => ({
    formula: target.formula,
    targetNodes: [{ id: node.id, name: node.name }],
  })) || [];

  // Header size based on level
  const HeaderTag = `h${Math.min(level + 1, 6)}` as keyof React.JSX.IntrinsicElements;
  const headerSizes = [
    "text-3xl",
    "text-2xl", 
    "text-xl",
    "text-lg",
    "text-base",
  ];
  const headerSize = headerSizes[level - 1] || "text-base";

  return (
    <>
      <ExerciseDrawer
        exercise={selectedExercise}
        isOpen={isDrawerOpen}
        onClose={closeExerciseDrawer}
      />

      {/* Fullscreen Image Overlay */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen view"
            className="max-w-full max-h-full object-contain p-4"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Section Header - Wikipedia style, no nesting */}
      <div id={node.id} className="border-b border-gray-300 pb-2 mb-4 scroll-mt-20">
        <button
          onClick={() => toggleSection(node.id)}
          className="flex items-center gap-2 w-full text-left hover:text-blue-600 transition"
        >
          <HeaderTag className={`${headerSize} font-bold text-gray-900`}>
            {node.name}
          </HeaderTag>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs uppercase font-semibold">
            {node.kind}
          </span>
          <span className="text-gray-400 text-sm ml-auto">
            {isCollapsed(node.id) ? "[show]" : "[hide]"}
          </span>
        </button>
      </div>

      {!isCollapsed(node.id) && (
        <div className="mb-8">
          {/* Description */}
          {node.description && (
            <p className="text-gray-700 leading-relaxed mb-4">{node.description}</p>
          )}

          {/* Images */}
          {node.meta?.images && node.meta.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {node.meta.images.map((imagePath: string, i: number) => {
                const getImageSrc = (path: string) => {
                  if (path.startsWith('guides:')) {
                    return `/guides/${path.replace('guides:', '')}`;
                  } else if (path.startsWith('anatomy:')) {
                    return `/anatomy/${path.replace('anatomy:', '')}`;
                  }
                  return `/anatomy/${path}`;
                };
                
                return (
                  <button
                    key={i}
                    onClick={() => setFullscreenImage(getImageSrc(imagePath))}
                    className="relative group"
                  >
                    <img
                      src={getImageSrc(imagePath)}
                      alt={`${node.name} image ${i + 1}`}
                      className="w-full h-40 object-cover rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg bg-black/20">
                      <div className="bg-black/50 rounded-full p-2">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Role Summary */}
          {node.roleSummary && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded mb-4">
              <p className="text-blue-900 italic">{node.roleSummary}</p>
            </div>
          )}

          {/* Functions and Aesthetics - side by side */}
          {(primaryFunctions.length > 0 || aestheticNotes.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {primaryFunctions.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Primary Functions</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {primaryFunctions.map((func: string, i: number) => (
                      <li key={i} className="text-gray-700">
                        {func}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aestheticNotes.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Aesthetic Notes</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {aestheticNotes.map((note: string, i: number) => (
                      <li key={i} className="text-gray-700">
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
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-3">
                💪 Primary Exercises ({primaryExercises.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {primaryExercises.map((link) => {
                  const equipment = link.exercise.equipment
                    ? typeof link.exercise.equipment === "string"
                      ? JSON.parse(link.exercise.equipment)
                      : link.exercise.equipment
                    : [];

                  const typeColors = link.exercise.type === "isolation"
                    ? "bg-purple-100 text-purple-700 border-purple-300"
                    : "bg-orange-100 text-orange-700 border-orange-300";

                  return (
                    <button
                      key={link.exercise.id}
                      onClick={() => openExerciseDrawer(link.exercise)}
                      className="w-full text-left p-3 bg-green-50 border border-green-200 rounded hover:border-green-400 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-green-700 text-sm leading-tight">
                          {link.exercise.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 border ${typeColors}`}>
                          {link.exercise.type}
                        </span>
                      </div>
                      {link.exercise.cueSummary && (
                        <p className="text-gray-700 text-xs mb-2 line-clamp-2">{link.exercise.cueSummary}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {equipment.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {equipment.slice(0, 2).map((item: string) => (
                              <span
                                key={item}
                                className="px-2 py-0.5 bg-white text-gray-600 rounded text-xs"
                              >
                                {item}
                              </span>
                            ))}
                            {equipment.length > 2 && (
                              <span className="text-xs text-gray-500">+{equipment.length - 2}</span>
                            )}
                          </div>
                        )}
                        {link.exercise.videoUrl && (
                          <span className="text-xs text-blue-600">📹</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Secondary Exercises */}
          {secondaryExercises.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-3">
                Secondary Exercises ({secondaryExercises.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {secondaryExercises.map((link) => {
                  const equipment = link.exercise.equipment
                    ? typeof link.exercise.equipment === "string"
                      ? JSON.parse(link.exercise.equipment)
                      : link.exercise.equipment
                    : [];

                  const typeColors = link.exercise.type === "isolation"
                    ? "bg-purple-100 text-purple-700 border-purple-300"
                    : "bg-orange-100 text-orange-700 border-orange-300";

                  return (
                    <button
                      key={link.exercise.id}
                      onClick={() => openExerciseDrawer(link.exercise)}
                      className="w-full text-left p-3 bg-yellow-50 border border-yellow-200 rounded hover:border-yellow-400 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-yellow-700 text-sm leading-tight">
                          {link.exercise.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 border ${typeColors}`}>
                          {link.exercise.type}
                        </span>
                      </div>
                      {link.exercise.cueSummary && (
                        <p className="text-gray-700 text-xs mb-2 line-clamp-2">{link.exercise.cueSummary}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {equipment.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {equipment.slice(0, 2).map((item: string) => (
                              <span
                                key={item}
                                className="px-2 py-0.5 bg-white text-gray-600 rounded text-xs"
                              >
                                {item}
                              </span>
                            ))}
                            {equipment.length > 2 && (
                              <span className="text-xs text-gray-500">+{equipment.length - 2}</span>
                            )}
                          </div>
                        )}
                        {link.exercise.videoUrl && (
                          <span className="text-xs text-blue-600">📹</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Exercise Formulas */}
          {allFormulas.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-3">
                🎯 Exercise Formulas ({allFormulas.length})
              </h4>
              <div className="space-y-4">
                {allFormulas.map((item) => {
                  const formula = item.formula;
                  return (
                    <div
                      key={formula.id}
                      className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Link href={`/formulas/${formula.id}`}>
                          <h5 className="font-bold text-purple-700 text-base hover:text-purple-900 hover:underline cursor-pointer">
                            {formula.name}
                          </h5>
                        </Link>
                        <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs font-medium uppercase">
                          {formula.pattern}
                        </span>
                      </div>

                      {formula.description && (
                        <p className="text-gray-700 text-sm mb-3">{formula.description}</p>
                      )}

                      {/* Show which anatomy nodes this formula targets */}
                      {item.targetNodes.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-600 mb-1">Targets:</div>
                          <div className="flex flex-wrap gap-1">
                            {item.targetNodes.map((tn) => (
                              <span
                                key={tn.id}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                              >
                                {tn.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Exercise Steps */}
                      <div className="space-y-2">
                        {formula.steps.map((step: any) => (
                          <div
                            key={step.exercise.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold text-purple-800">
                              {step.order}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                openExerciseDrawer(step.exercise);
                              }}
                              className="font-medium text-gray-900 hover:text-blue-600 hover:underline cursor-pointer text-left"
                            >
                              {step.exercise.name}
                            </button>
                            <span className="px-2 py-0.5 bg-white border border-purple-200 text-purple-700 rounded text-xs">
                              {step.role}
                            </span>
                            {step.notes && (
                              <span className="text-xs text-gray-500">• {step.notes}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Render children as sibling sections, not nested */}
      {node.children.map((child) => (
        <AnatomyWiki key={child.id} node={child} level={level + 1} />
      ))}
    </>
  );
}

