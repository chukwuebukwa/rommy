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
  setLabel: string | null;
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
  drop_set: { label: "Drop Set", color: "bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-200" },
  superset: { label: "Superset", color: "bg-purple-100 text-purple-700 dark:bg-purple-800/60 dark:text-purple-200" },
  straight_sets: { label: "Straight Sets", color: "bg-blue-100 text-blue-700 dark:bg-blue-800/60 dark:text-blue-200" },
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
    color: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
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

  // For supersets, group exercises by setLabel (A vs B)
  const isSuperset = block.schemeStyle === "superset";
  const setAExercises = block.exercises.filter(e => e.setLabel === "A");
  const setBExercises = block.exercises.filter(e => e.setLabel === "B");
  // Fallback: if no setLabel, use type (compound = A, isolation = B)
  const hasSetLabels = setAExercises.length > 0 || setBExercises.length > 0;
  const effectiveSetA = hasSetLabels ? setAExercises : block.exercises.filter(e => e.exercise.type === "compound");
  const effectiveSetB = hasSetLabels ? setBExercises : block.exercises.filter(e => e.exercise.type === "isolation");

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
    const typeBadgeColors = wbe.exercise.type === "isolation"
      ? "bg-purple-100 text-purple-700 dark:bg-purple-700/70 dark:text-purple-200"
      : "bg-orange-100 text-orange-700 dark:bg-orange-700/70 dark:text-orange-200";

    return (
      <button
        key={wbe.exercise.id}
        onClick={() => openExerciseDrawer(wbe.exercise)}
        className="w-full text-left px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/40 dark:hover:bg-gray-600/50 active:scale-[0.98] transition-all flex items-center justify-between gap-2"
      >
        <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">
          {wbe.exercise.name}
        </span>
        <span className={`px-2 py-0.5 rounded text-xs ${typeBadgeColors}`}>
          {wbe.exercise.type}
        </span>
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

      <div className="bg-white dark:bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-200 dark:border-transparent shadow-sm">
        {/* Block Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-400 dark:text-gray-300">{blockNumber}</span>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {blockTitle}
              </h3>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${schemeInfo.color}`}>
              {schemeInfo.label}
            </span>
          </div>
        </div>

        {/* Scheme Description */}
        <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20">
          <p className="text-sm text-amber-700 dark:text-amber-200/80 leading-relaxed">
            {block.schemeDesc}
          </p>
        </div>

        {/* Exercises */}
        <div className="p-4">
          {isSuperset && effectiveSetA.length > 0 && effectiveSetB.length > 0 ? (
            // SUPERSET LAYOUT: Show Set A and Set B grouped
            <div className="space-y-4">
              {/* Set A */}
              <div className="border-l-2 border-orange-400 dark:border-orange-500/60 pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400/90 uppercase tracking-wider">Set A</span>
                  {repRanges.setA && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-700/50 dark:text-orange-200 rounded text-xs">
                      {repRanges.setA} reps
                    </span>
                  )}
                  <span className="text-xs text-gray-500">Pick 1:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {effectiveSetA.map(renderExerciseButton)}
                </div>
              </div>

              {/* Superset divider */}
              <div className="flex items-center justify-center">
                <span className="text-xs text-purple-500 dark:text-purple-400/70 font-medium">+ superset with</span>
              </div>

              {/* Set B */}
              <div className="border-l-2 border-purple-400 dark:border-purple-500/60 pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400/90 uppercase tracking-wider">Set B</span>
                  {repRanges.setB && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-700/50 dark:text-purple-200 rounded text-xs">
                      {repRanges.setB} reps
                    </span>
                  )}
                  <span className="text-xs text-gray-500">Pick 1:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {effectiveSetB.map(renderExerciseButton)}
                </div>
              </div>
            </div>
          ) : (
            // REGULAR LAYOUT: Flat grid
            <>
              {block.exercises.length > 1 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
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
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">{block.notes}</p>
          </div>
        )}
      </div>
    </>
  );
}
