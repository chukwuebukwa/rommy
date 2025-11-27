"use client";

import { useState } from "react";
import Link from "next/link";

interface DatabaseData {
  anatomyCount: number;
  exerciseCount: number;
  formulaCount: number;
  workoutCount: number;
  guideCount: number;
  regionCount: number;
  groupCount: number;
  muscleCount: number;
  partCount: number;
  regions: any[];
  recentExercises: any[];
  formulas: any[];
  workouts: any[];
}

export function DatabaseExplorer({ data }: { data: DatabaseData }) {
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  const [expandedFormulas, setExpandedFormulas] = useState<Set<string>>(new Set());
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(new Set());

  const toggleRegion = (id: string) => {
    const newSet = new Set(expandedRegions);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRegions(newSet);
  };

  const toggleExercise = (id: string) => {
    const newSet = new Set(expandedExercises);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedExercises(newSet);
  };

  const toggleFormula = (id: string) => {
    const newSet = new Set(expandedFormulas);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedFormulas(newSet);
  };

  const toggleWorkout = (id: string) => {
    const newSet = new Set(expandedWorkouts);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedWorkouts(newSet);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Database Explorer</h1>
          <p className="text-gray-600 text-sm">Schema: Rommy's Workout Guide • Click to expand inline</p>
        </div>
        <div className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">
          SQLite • {data.anatomyCount + data.exerciseCount + data.formulaCount + data.workoutCount + data.guideCount} records
        </div>
      </div>

      {/* Schema Overview */}
      <div className="grid grid-cols-5 gap-3">
        <Link
          href="/anatomy"
          className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 transition"
        >
          <div className="text-xs font-mono text-blue-600 mb-1">AnatomyNode</div>
          <div className="text-2xl font-bold text-blue-900">{data.anatomyCount}</div>
          <div className="text-xs text-gray-600 mt-2">
            {data.regionCount} regions • {data.groupCount} groups • {data.muscleCount} muscles • {data.partCount} parts
          </div>
        </Link>

        <Link
          href="/exercises"
          className="bg-green-50 border-2 border-green-200 rounded-lg p-4 hover:border-green-400 transition"
        >
          <div className="text-xs font-mono text-green-600 mb-1">Exercise</div>
          <div className="text-2xl font-bold text-green-900">{data.exerciseCount}</div>
          <div className="text-xs text-gray-600 mt-2">movements & variations</div>
        </Link>

        <Link
          href="/formulas"
          className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition"
        >
          <div className="text-xs font-mono text-purple-600 mb-1">Formula</div>
          <div className="text-2xl font-bold text-purple-900">{data.formulaCount}</div>
          <div className="text-xs text-gray-600 mt-2">exercise pairings</div>
        </Link>

        <Link
          href="/workouts"
          className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 hover:border-orange-400 transition"
        >
          <div className="text-xs font-mono text-orange-600 mb-1">Workout</div>
          <div className="text-2xl font-bold text-orange-900">{data.workoutCount}</div>
          <div className="text-xs text-gray-600 mt-2">complete programs</div>
        </Link>

        <Link
          href="/guides"
          className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 hover:border-indigo-400 transition"
        >
          <div className="text-xs font-mono text-indigo-600 mb-1">Guide</div>
          <div className="text-2xl font-bold text-indigo-900">{data.guideCount}</div>
          <div className="text-xs text-gray-600 mt-2">training guides</div>
        </Link>
      </div>

      {/* Regions (Main Entry Points) */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm font-bold text-gray-900">AnatomyNode (regions)</h2>
            <span className="text-xs text-gray-500">{data.regionCount} records • Click to expand</span>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {data.regions.map((region) => (
            <div key={region.id}>
              <button
                onClick={() => toggleRegion(region.id)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedRegions.has(region.id) ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="font-mono text-sm font-semibold text-blue-600">
                        {region.id}
                      </span>
                      <span className="text-gray-900">{region.name}</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono">
                        {region.kind}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 ml-7">{region.description}</div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                    {region.children.length} children • {region._count.exerciseLinks} exercise links
                    <Link
                      href={`/anatomy/${region.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800 ml-2"
                    >
                      View page →
                    </Link>
                  </div>
                </div>
              </button>

              {expandedRegions.has(region.id) && (
                <div className="px-4 py-4 bg-blue-50 border-t border-blue-100 ml-7">
                  {region.roleSummary && (
                    <div className="mb-4 p-3 bg-white border-l-4 border-blue-500 rounded">
                      <p className="text-blue-900 font-medium text-sm">{region.roleSummary}</p>
                    </div>
                  )}

                  {region.children.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                        Child nodes ({region.children.length}):
                      </h4>
                      <div className="space-y-2">
                        {region.children.map((child: any) => (
                          <Link
                            key={child.id}
                            href={`/anatomy/${child.id}`}
                            className="block p-3 bg-white border border-blue-200 rounded hover:border-blue-400 transition"
                          >
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-mono">
                                {child.kind}
                              </span>
                              <span className="font-mono text-sm text-green-600">{child.id}</span>
                              <span className="text-gray-900 text-sm">{child.name}</span>
                            </div>
                            {child.description && (
                              <p className="text-xs text-gray-600 mt-1">{child.description}</p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exercises */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm font-bold text-gray-900">Exercise</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{data.exerciseCount} records • Click to expand</span>
              <Link
                href="/exercises"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View all →
              </Link>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {data.recentExercises.map((exercise) => (
            <div key={exercise.id}>
              <button
                onClick={() => toggleExercise(exercise.id)}
                className="w-full text-left px-4 py-3 hover:bg-green-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedExercises.has(exercise.id) ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="font-mono text-sm font-semibold text-green-600">
                        {exercise.id}
                      </span>
                      <span className="text-gray-900">{exercise.name}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {exercise.type}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">
                        {exercise.movementPattern}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                    {exercise._count.anatomyLinks} anatomy • {exercise._count.formulas} formulas
                    <Link
                      href={`/exercises/${exercise.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800 ml-2"
                    >
                      View page →
                    </Link>
                  </div>
                </div>
              </button>

              {expandedExercises.has(exercise.id) && (
                <div className="px-4 py-4 bg-green-50 border-t border-green-100 ml-7">
                  {exercise.cueSummary && (
                    <div className="mb-4 p-3 bg-white border-l-4 border-green-500 rounded">
                      <div className="text-xs font-semibold text-green-900 mb-1">Form Cues:</div>
                      <p className="text-gray-700 text-sm">{exercise.cueSummary}</p>
                    </div>
                  )}

                  {exercise.videoUrl && (
                    <div className="mb-4">
                      <a
                        href={exercise.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                      >
                        📹 Watch Video Tutorial
                      </a>
                    </div>
                  )}

                  <div className="text-xs text-gray-600">
                    <strong>Relations:</strong> {exercise._count.anatomyLinks} muscle links,{" "}
                    {exercise._count.formulas} formula appearances
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formulas */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm font-bold text-gray-900">Formula</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{data.formulaCount} records • Click to expand</span>
              <Link
                href="/formulas"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View all →
              </Link>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {data.formulas.map((formula) => (
            <div key={formula.id}>
              <button
                onClick={() => toggleFormula(formula.id)}
                className="w-full text-left px-4 py-3 hover:bg-purple-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedFormulas.has(formula.id) ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="font-mono text-sm font-semibold text-purple-600">
                        {formula.id}
                      </span>
                      <span className="text-gray-900">{formula.name}</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-mono">
                        {formula.pattern}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                    {formula._count.steps} steps • {formula._count.targets} targets
                    <Link
                      href={`/formulas/${formula.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800 ml-2"
                    >
                      View page →
                    </Link>
                  </div>
                </div>
              </button>

              {expandedFormulas.has(formula.id) && (
                <div className="px-4 py-4 bg-purple-50 border-t border-purple-100 ml-7">
                  {formula.description && (
                    <p className="text-gray-700 text-sm mb-3">{formula.description}</p>
                  )}
                  <div className="text-xs text-gray-600">
                    <strong>Pattern:</strong> {formula.pattern} •{" "}
                    <strong>Steps:</strong> {formula._count.steps} exercises •{" "}
                    <strong>Targets:</strong> {formula._count.targets} muscles
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Workouts */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm font-bold text-gray-900">Workout</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{data.workoutCount} records • Click to expand</span>
              <Link
                href="/workouts"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View all →
              </Link>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {data.workouts.map((workout) => (
            <div key={workout.id}>
              <button
                onClick={() => toggleWorkout(workout.id)}
                className="w-full text-left px-4 py-3 hover:bg-orange-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedWorkouts.has(workout.id) ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="font-mono text-sm font-semibold text-orange-600">
                        {workout.id}
                      </span>
                      <span className="text-gray-900">{workout.name}</span>
                      {workout.primaryRegion && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                          {workout.primaryRegion.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                    {workout._count.blocks} blocks
                    <Link
                      href={`/workouts/${workout.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800 ml-2"
                    >
                      View page →
                    </Link>
                  </div>
                </div>
              </button>

              {expandedWorkouts.has(workout.id) && (
                <div className="px-4 py-4 bg-orange-50 border-t border-orange-100 ml-7">
                  {workout.goal && (
                    <div className="mb-3 p-3 bg-white border-l-4 border-orange-500 rounded">
                      <div className="text-xs font-semibold text-orange-900 mb-1">Goal:</div>
                      <p className="text-gray-700 text-sm">{workout.goal}</p>
                    </div>
                  )}
                  {workout.priorityRules && (
                    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="text-xs font-semibold text-yellow-900 mb-1">Priority Rules:</div>
                      <p className="text-yellow-900 text-sm">{workout.priorityRules}</p>
                    </div>
                  )}
                  <div className="text-xs text-gray-600">
                    <strong>Blocks:</strong> {workout._count.blocks} training blocks
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Relationship Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-mono text-sm font-bold text-gray-900 mb-3">Relationships</h3>
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="space-y-1">
            <div className="text-gray-600">AnatomyNode → AnatomyNode (parent/children)</div>
            <div className="text-gray-600">AnatomyNode ↔ Exercise (ExerciseAnatomy)</div>
            <div className="text-gray-600">AnatomyNode ↔ Section (SectionAnatomy)</div>
            <div className="text-gray-600">AnatomyNode ↔ Formula (FormulaTarget)</div>
            <div className="text-gray-600">AnatomyNode ↔ WorkoutBlock (WorkoutBlockTarget)</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Exercise ↔ Formula (FormulaStep)</div>
            <div className="text-gray-600">Exercise ↔ Section (SectionExercise)</div>
            <div className="text-gray-600">Exercise ↔ WorkoutBlock (WorkoutBlockExercise)</div>
            <div className="text-gray-600">Guide → Section (1:many)</div>
            <div className="text-gray-600">Workout → WorkoutBlock (1:many)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

