"use client";

import { useState } from "react";
import { ExerciseDrawer } from "./ExerciseDrawer";


interface WorkoutExerciseGridProps {
  exercises: Array<{
    exerciseId: string;
    kind: string;
    exercise: {
      id: string;
      name: string;
      type: string;
      movementPattern: string;
      cueSummary: string | null;
      videoUrl: string | null;
      anatomyLinks: Array<{
        anatomyNodeId: string;
        anatomy: {
          name: string;
        };
      }>;
    };
  }>;
  pickLabel: string;
}

export function WorkoutExerciseGrid({ exercises, pickLabel }: WorkoutExerciseGridProps) {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openExerciseDrawer = (exercise: any) => {
    setSelectedExercise(exercise);
    setIsDrawerOpen(true);
  };

  const closeExerciseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedExercise(null), 300);
  };

  // Build anatomy path (grandparent > parent > muscle)
  const buildAnatomyPath = (anatomy: any) => {
    const path = [anatomy.name];
    if (anatomy.parent) {
      path.unshift(anatomy.parent.name);
      if (anatomy.parent.parent) {
        path.unshift(anatomy.parent.parent.name);
      }
    }
    return path;
  };

  return (
    <>
      <ExerciseDrawer
        exercise={selectedExercise}
        isOpen={isDrawerOpen}
        onClose={closeExerciseDrawer}
      />

      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          Exercise Options (Pick {pickLabel}):
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((wbe) => {
            const typeColors = wbe.exercise.type === "isolation"
              ? "bg-purple-100 text-purple-700 border-purple-300"
              : "bg-orange-100 text-orange-700 border-orange-300";

            const kindColors = wbe.kind === "option"
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-blue-100 text-blue-800 border-blue-300";

            return (
              <button
                key={wbe.exerciseId}
                onClick={() => openExerciseDrawer(wbe.exercise)}
                className="w-full text-left p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-400 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="text-lg font-bold text-gray-900 leading-tight">
                    {wbe.exercise.name}
                  </h4>
                  <span className={`px-2 py-1 rounded text-xs font-semibold uppercase flex-shrink-0 border ${kindColors}`}>
                    {wbe.kind}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${typeColors}`}>
                      {wbe.exercise.type}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                      {wbe.exercise.movementPattern}
                    </span>
                  </div>

                  {wbe.exercise.anatomyLinks.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        // Collect all unique anatomy nodes
                        const uniqueParts = new Set<string>();
                        wbe.exercise.anatomyLinks.forEach((link) => {
                          buildAnatomyPath(link.anatomy).forEach(part => uniqueParts.add(part));
                        });
                        return Array.from(uniqueParts).map((part, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                          >
                            {part}
                          </span>
                        ));
                      })()}
                    </div>
                  )}
                </div>

                {wbe.exercise.cueSummary && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs">
                    <div className="text-gray-500 font-semibold mb-1">Form Cues:</div>
                    <div className="text-gray-700 line-clamp-2">{wbe.exercise.cueSummary}</div>
                  </div>
                )}

                {wbe.exercise.videoUrl && (
                  <div className="mt-3 text-xs text-blue-600 font-medium flex items-center gap-1">
                    <span>📹</span>
                    <span>Watch video tutorial →</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

