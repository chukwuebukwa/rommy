"use client";

import { useState } from "react";
import { ExerciseDrawer } from "./ExerciseDrawer";

interface Exercise {
  id: string;
  name: string;
  type: string;
  movementPattern: string;
  cueSummary: string | null;
  videoUrl: string | null;
  equipment: any;
  anatomyLinks: Array<{
    role: string;
    anatomy: {
      id: string;
      name: string;
      parent?: {
        name: string;
        parent?: {
          name: string;
        };
      };
    };
  }>;
}

interface WorkoutBlockExercise {
  kind: string;
  exercise: Exercise;
}

interface WorkoutBlock {
  id: string;
  label: string;
  schemeStyle: string;
  schemeDesc: string;
  notes: string | null;
  exercises: WorkoutBlockExercise[];
}

interface WorkoutBlockCardProps {
  block: WorkoutBlock;
  blockNumber: number;
}

const schemeStyleLabels: Record<string, { label: string; color: string }> = {
  drop_set: { label: "Drop Set", color: "bg-red-100 text-red-700 border-red-300" },
  superset: { label: "Superset", color: "bg-purple-100 text-purple-700 border-purple-300" },
  straight_sets: { label: "Straight Sets", color: "bg-blue-100 text-blue-700 border-blue-300" },
};

export function WorkoutBlockCard({ block, blockNumber }: WorkoutBlockCardProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openExerciseDrawer = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsDrawerOpen(true);
  };

  const closeExerciseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedExercise(null), 300);
  };

  // Parse block label to extract target muscle
  const labelParts = block.label.split("–").map(s => s.trim());
  const blockTitle = labelParts.length > 1 ? labelParts[1] : block.label;

  // Get scheme style info
  const schemeInfo = schemeStyleLabels[block.schemeStyle] || {
    label: block.schemeStyle,
    color: "bg-gray-100 text-gray-700 border-gray-300"
  };

  // Get unique anatomy targets from all exercises
  const getAnatomyTargets = (exercise: Exercise) => {
    const targets: string[] = [];
    exercise.anatomyLinks.forEach(link => {
      if (link.role === "primary") {
        targets.push(link.anatomy.name);
      }
    });
    return targets;
  };

  // For supersets, group exercises by type (compound = Set A, isolation = Set B)
  const isSuperset = block.schemeStyle === "superset";
  const compoundExercises = block.exercises.filter(e => e.exercise.type === "compound");
  const isolationExercises = block.exercises.filter(e => e.exercise.type === "isolation");

  // Parse scheme description to extract rep ranges for each set
  const parseSchemeDesc = (desc: string) => {
    // Try to extract patterns like "5-9 reps" or "7-11 reps"
    const repMatches = desc.match(/(\d+[-–]\d+)\s*reps/gi) || [];
    return {
      setA: repMatches[0]?.replace(/\s*reps/i, "") || "",
      setB: repMatches[1]?.replace(/\s*reps/i, "") || "",
    };
  };

  const repRanges = parseSchemeDesc(block.schemeDesc);

  // Render a single exercise button
  const renderExerciseButton = (wbe: WorkoutBlockExercise) => {
    const typeColors = wbe.exercise.type === "isolation"
      ? "bg-purple-50 border-purple-200"
      : "bg-orange-50 border-orange-200";

    const typeBadgeColors = wbe.exercise.type === "isolation"
      ? "bg-purple-100 text-purple-700"
      : "bg-orange-100 text-orange-700";

    const anatomyTargets = getAnatomyTargets(wbe.exercise);

    return (
      <button
        key={wbe.exercise.id}
        onClick={() => openExerciseDrawer(wbe.exercise)}
        className={`w-full text-left p-3 rounded-lg border-2 hover:border-green-400 hover:shadow-md transition cursor-pointer ${typeColors}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-gray-900 leading-tight text-sm">
            {wbe.exercise.name}
          </h4>
          {wbe.exercise.videoUrl && (
            <span className="text-blue-500 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeBadgeColors}`}>
            {wbe.exercise.type}
          </span>
          {anatomyTargets.slice(0, 2).map((target, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {target}
            </span>
          ))}
        </div>
      </button>
    );
  };

  return (
    <>
      <ExerciseDrawer
        exercise={selectedExercise}
        isOpen={isDrawerOpen}
        onClose={closeExerciseDrawer}
      />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Block Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white">{blockNumber}</span>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {blockTitle}
                </h3>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${schemeInfo.color}`}>
              {schemeInfo.label}
            </span>
          </div>
        </div>

        {/* Scheme Description */}
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
          <div className="text-sm text-amber-900 whitespace-pre-line leading-relaxed">
            {block.schemeDesc}
          </div>
        </div>

        {/* Exercises */}
        <div className="p-4">
          {isSuperset && compoundExercises.length > 0 && isolationExercises.length > 0 ? (
            // SUPERSET LAYOUT: Show Set A and Set B grouped
            <div className="space-y-4">
              {/* Set A - Compound */}
              <div className="border-l-4 border-orange-400 pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Set A</span>
                  <span className="text-xs text-gray-500">Compound</span>
                  {repRanges.setA && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      {repRanges.setA} reps
                    </span>
                  )}
                  <span className="text-xs text-gray-400">Pick 1:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {compoundExercises.map(renderExerciseButton)}
                </div>
              </div>

              {/* Superset Arrow */}
              <div className="flex items-center justify-center py-1">
                <div className="flex items-center gap-2 text-purple-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span className="text-xs font-semibold uppercase tracking-wider">then</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* Set B - Isolation */}
              <div className="border-l-4 border-purple-400 pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Set B</span>
                  <span className="text-xs text-gray-500">Isolation</span>
                  {repRanges.setB && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {repRanges.setB} reps
                    </span>
                  )}
                  <span className="text-xs text-gray-400">Pick 1:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {isolationExercises.map(renderExerciseButton)}
                </div>
              </div>
            </div>
          ) : (
            // REGULAR LAYOUT: Flat grid
            <>
              {block.exercises.length > 1 && (
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  Pick 1 from {block.exercises.length} options:
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {block.exercises.map(renderExerciseButton)}
              </div>
            </>
          )}
        </div>

        {/* Notes (if any) */}
        {block.notes && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-600 italic">{block.notes}</p>
          </div>
        )}
      </div>
    </>
  );
}
