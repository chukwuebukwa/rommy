"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExerciseEditor } from "./ExerciseEditor";
import { VideoEmbed } from "./VideoEmbed";

interface Exercise {
  id: string;
  name: string;
  type: string;
  movementPattern: string;
  videoUrl: string | null;
  cdnVideoUrl: string | null;
  equipment: any;
  cueSummary: string | null;
  anatomyLinks: Array<{
    role: string;
    anatomyNodeId: string;
    anatomy: {
      id: string;
      name: string;
      kind: string;
      description?: string | null;
      parent: {
        name: string;
        parent?: {
          name: string;
        } | null;
      } | null;
    };
  }>;
  mentionedIn: Array<{
    sectionId: string;
    section: {
      id: string;
      title: string;
      guideId: string;
      guide: {
        title: string;
      };
    };
  }>;
  formulas: Array<{
    formulaId: string;
    order: number;
    role: string;
    notes: string | null;
    formula: {
      id: string;
      name: string;
    };
  }>;
  workoutBlocks: Array<{
    blockId: string;
    kind: string;
    block: {
      id: string;
      label: string;
      workoutId: string;
      workout: {
        name: string;
      };
    };
  }>;
}

interface NavigationInfo {
  prevId: string | null;
  nextId: string | null;
  currentIndex: number;
  totalCount: number;
}

interface ExerciseDetailClientProps {
  exercise: Exercise;
  navigation: NavigationInfo;
}

export function ExerciseDetailClient({ exercise: initialExercise, navigation }: ExerciseDetailClientProps) {
  const [exercise, setExercise] = useState(initialExercise);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const equipment = exercise.equipment
    ? (typeof exercise.equipment === 'string' 
        ? JSON.parse(exercise.equipment) 
        : exercise.equipment)
    : [];

  const primaryMuscles = exercise.anatomyLinks?.filter((link) => link.role === "primary") ?? [];
  const secondaryMuscles = exercise.anatomyLinks?.filter((link) => link.role === "secondary") ?? [];

  const handleSaveExercise = (updatedExercise: Exercise) => {
    setExercise(updatedExercise);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't navigate if in edit mode or if user is typing in an input
      if (isEditing || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      
      // Left arrow for previous
      if (e.key === "ArrowLeft" && navigation.prevId) {
        router.push(`/exercises/${navigation.prevId}`);
      }
      // Right arrow for next
      if (e.key === "ArrowRight" && navigation.nextId) {
        router.push(`/exercises/${navigation.nextId}`);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigation.prevId, navigation.nextId, router, isEditing]);

  return (
    <>
      {isEditing && (
        <ExerciseEditor
          exercise={exercise as any}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveExercise as any}
        />
      )}

      <div className="space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/exercises"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Exercises
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {navigation.currentIndex} of {navigation.totalCount}
            </span>
            
            <div className="flex gap-2">
              {navigation.prevId ? (
                <Link
                  href={`/exercises/${navigation.prevId}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition flex items-center gap-2"
                >
                  ← Prev
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                >
                  ← Prev
                </button>
              )}

              {navigation.nextId ? (
                <Link
                  href={`/exercises/${navigation.nextId}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition flex items-center gap-2"
                >
                  Next →
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                >
                  Next →
                </button>
              )}
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              ✏️ Edit
            </button>
          </div>
        </div>

        {/* Two Column Layout on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Exercise Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{exercise.name}</h1>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-semibold text-sm uppercase">
                  {exercise.type}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded font-medium text-sm">
                  {exercise.movementPattern}
                </span>
              </div>

              {/* Anatomy Tags */}
              {primaryMuscles.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Primary Muscles:</div>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const uniqueParts = new Set<string>();
                      primaryMuscles.forEach((link) => {
                        const path = [];
                        if (link.anatomy.parent?.parent) path.push(link.anatomy.parent.parent.name);
                        if (link.anatomy.parent) path.push(link.anatomy.parent.name);
                        path.push(link.anatomy.name);
                        path.forEach(part => uniqueParts.add(part));
                      });
                      return Array.from(uniqueParts).map((part, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium"
                        >
                          {part}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {secondaryMuscles.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Secondary Muscles:</div>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const uniqueParts = new Set<string>();
                      secondaryMuscles.forEach((link) => {
                        const path = [];
                        if (link.anatomy.parent?.parent) path.push(link.anatomy.parent.parent.name);
                        if (link.anatomy.parent) path.push(link.anatomy.parent.name);
                        path.push(link.anatomy.name);
                        path.forEach(part => uniqueParts.add(part));
                      });
                      return Array.from(uniqueParts).map((part, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium"
                        >
                          {part}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {equipment.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Equipment:</div>
                  <div className="flex flex-wrap gap-2">
                    {equipment.map((item: string) => (
                      <span
                        key={item}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {exercise.cueSummary && (
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <div className="text-sm font-semibold text-blue-900 mb-1">Form Cues:</div>
                  <p className="text-blue-900">{exercise.cueSummary}</p>
                </div>
              )}
            </div>

            {/* Primary Muscles */}
            {primaryMuscles.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Primary Muscles ({primaryMuscles.length})
                </h2>
                <div className="space-y-4">
                  {primaryMuscles.map((link) => {
                    const path = [];
                    if (link.anatomy.parent?.parent) {
                      path.push(link.anatomy.parent.parent.name);
                    }
                    if (link.anatomy.parent) {
                      path.push(link.anatomy.parent.name);
                    }
                    
                    return (
                      <Link
                        key={link.anatomyNodeId}
                        href={`/anatomy/${link.anatomy.id}`}
                        className="block p-4 border-2 border-green-200 bg-green-50 rounded hover:border-green-500 hover:shadow-md transition"
                      >
                        <div className="font-semibold text-green-700 text-lg">{link.anatomy.name}</div>
                        {path.length > 0 && (
                          <div className="text-sm text-green-600 mt-1">
                            {path.join(" › ")}
                          </div>
                        )}
                        {link.anatomy.description && (
                          <p className="text-sm text-gray-600 mt-2">{link.anatomy.description}</p>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Secondary Muscles */}
            {secondaryMuscles.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Secondary Muscles ({secondaryMuscles.length})
                </h2>
                <div className="space-y-4">
                  {secondaryMuscles.map((link) => {
                    const path = [];
                    if (link.anatomy.parent?.parent) {
                      path.push(link.anatomy.parent.parent.name);
                    }
                    if (link.anatomy.parent) {
                      path.push(link.anatomy.parent.name);
                    }
                    
                    return (
                      <Link
                        key={link.anatomyNodeId}
                        href={`/anatomy/${link.anatomy.id}`}
                        className="block p-4 border border-yellow-200 bg-yellow-50 rounded hover:border-yellow-500 hover:shadow-md transition"
                      >
                        <div className="font-semibold text-yellow-700">{link.anatomy.name}</div>
                        {path.length > 0 && (
                          <div className="text-sm text-yellow-600 mt-1">
                            {path.join(" › ")}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Formulas */}
            {(exercise.formulas?.length ?? 0) > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Part of Formulas ({exercise.formulas?.length ?? 0})
                </h2>
                <div className="space-y-3">
                  {exercise.formulas?.map((step) => (
                    <Link
                      key={step.formulaId}
                      href={`/formulas/${step.formula.id}`}
                      className="block p-4 border border-gray-200 rounded hover:border-purple-500 hover:shadow-md transition"
                    >
                      <div className="font-semibold text-purple-600">{step.formula.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Step {step.order} • {step.role}
                        {step.notes && ` • ${step.notes}`}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Workout Blocks */}
            {(exercise.workoutBlocks?.length ?? 0) > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Used in Workouts ({exercise.workoutBlocks?.length ?? 0})
                </h2>
                <div className="space-y-3">
                  {exercise.workoutBlocks?.map((wbe) => (
                    <Link
                      key={wbe.blockId}
                      href={`/workouts/${wbe.block.workoutId}#${wbe.block.id}`}
                      className="block p-4 border border-gray-200 rounded hover:border-red-500 hover:shadow-md transition"
                    >
                      <div className="text-sm text-gray-500">{wbe.block.workout.name}</div>
                      <div className="font-semibold text-red-600 mt-1">{wbe.block.label}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {wbe.kind === "option" ? "Optional exercise" : "Required exercise"}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mentioned in Sections */}
            {(exercise.mentionedIn?.length ?? 0) > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Mentioned in Guide Sections ({exercise.mentionedIn?.length ?? 0})
                </h2>
                <div className="space-y-3">
                  {exercise.mentionedIn?.map((se) => (
                    <Link
                      key={se.sectionId}
                      href={`/guides/${se.section.guideId}#${se.section.id}`}
                      className="block p-4 border border-gray-200 rounded hover:border-indigo-500 hover:shadow-md transition"
                    >
                      <div className="text-sm text-gray-500">{se.section.guide.title}</div>
                      <div className="font-semibold text-indigo-600 mt-1">{se.section.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Video (Sticky) */}
          <div>
            {(exercise.videoUrl || exercise.cdnVideoUrl) && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow md:sticky md:top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Tutorial</h2>
                
                {/* CDN Video (preferred) */}
                {exercise.cdnVideoUrl && (
                  <div className="space-y-3">
                    <video
                      controls
                      className="w-full rounded-lg max-h-[500px]"
                      poster={exercise.cdnVideoUrl.replace('.mp4', '-thumbnail.jpg')}
                    >
                      <source src={exercise.cdnVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
                      <span className="font-semibold">✓</span>
                      <span>CDN Video Available</span>
                    </div>
                  </div>
                )}
                
                {/* YouTube Fallback */}
                {exercise.videoUrl && !exercise.cdnVideoUrl && (
                  <div className="space-y-3">
                    <VideoEmbed videoUrl={exercise.videoUrl} title={exercise.name} />
                    <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded">
                      <span className="font-semibold">⚠</span>
                      <span>YouTube only (no CDN video)</span>
                    </div>
                  </div>
                )}
                
                {/* Show YouTube link if CDN exists */}
                {exercise.videoUrl && exercise.cdnVideoUrl && (
                  <div className="mt-3 pt-3 border-t">
                    <a
                      href={exercise.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View on YouTube →
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

