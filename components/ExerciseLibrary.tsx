"use client";

import { useState } from "react";
import Link from "next/link";
import { ExerciseEditor } from "./ExerciseEditor";
import { VideoEmbed } from "./VideoEmbed";

interface Exercise {
  id: string;
  name: string;
  type: string;
  movementPattern: string;
  videoUrl: string | null;
  cdnVideoUrl: string | null;
  equipment: string[] | null;
  cueSummary: string | null;
  anatomyLinks: Array<{
    role: string;
    anatomy: {
      id: string;
      name: string;
      kind: string;
      parent: {
        name: string;
        parent?: {
          name: string;
        } | null;
      } | null;
    };
  }>;
}

interface ExerciseLibraryProps {
  exercises: Exercise[];
}

export function ExerciseLibrary({ exercises: initialExercises }: ExerciseLibraryProps) {
  const [exercises, setExercises] = useState(initialExercises);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // Build anatomy path
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

  // Get all unique anatomy tags from exercises
  const getAllAnatomyTags = () => {
    const tags = new Set<string>();
    exercises.forEach((exercise) => {
      exercise.anatomyLinks.forEach((link) => {
        buildAnatomyPath(link.anatomy).forEach(part => tags.add(part));
      });
    });
    return Array.from(tags).sort();
  };

  const anatomyTags = getAllAnatomyTags();

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags(new Set());
  };

  // Filter exercises based on selected tags
  const filteredExercises = selectedTags.size === 0
    ? exercises
    : exercises.filter((exercise) => {
        const exerciseTags = new Set<string>();
        exercise.anatomyLinks.forEach((link) => {
          buildAnatomyPath(link.anatomy).forEach(part => exerciseTags.add(part));
        });
        // Check if any selected tag is in this exercise's tags
        return Array.from(selectedTags).some(tag => exerciseTags.has(tag));
      });

  const types = ["compound", "isolation"];
  const groupedExercises = types.map((type) => ({
    type,
    exercises: filteredExercises.filter((ex) => ex.type === type),
  }));

  const handleSaveExercise = (updatedExercise: Exercise) => {
    setExercises(
      exercises.map((ex) => (ex.id === updatedExercise.id ? updatedExercise : ex))
    );
  };

  return (
    <>
      {editingExercise && (
        <ExerciseEditor
          exercise={editingExercise}
          onClose={() => setEditingExercise(null)}
          onSave={handleSaveExercise}
        />
      )}
      
      <div className="space-y-8">
      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Filter by Anatomy</h3>
          {selectedTags.size > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
            >
              Clear all ({selectedTags.size})
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {anatomyTags.map((tag) => {
            const isSelected = selectedTags.has(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  isSelected
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Summary */}
      {selectedTags.size > 0 && (
        <div className="text-gray-600">
          Showing {filteredExercises.length} of {exercises.length} exercises
        </div>
      )}

      {/* Exercise List */}
      {groupedExercises.map(({ type, exercises: typeExercises }) => (
        typeExercises.length > 0 && (
          <div key={type} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 capitalize flex items-center gap-2">
              {type === "compound" ? "🏋️" : "🎯"} {type} Exercises ({typeExercises.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typeExercises.map((exercise) => {
                const primaryLinks = exercise.anatomyLinks
                  .filter((link) => link.role === "primary");
                const secondaryLinks = exercise.anatomyLinks
                  .filter((link) => link.role === "secondary");

                // Group anatomy by parent hierarchy
                const groupAnatomyByParent = (links: typeof primaryLinks) => {
                  const grouped = new Map<string, Set<string>>();
                  
                  links.forEach((link) => {
                    const anatomy = link.anatomy;
                    if (anatomy.parent) {
                      // Get the top-most parent as the group
                      let topParent = anatomy.parent;
                      while (topParent.parent) {
                        topParent = topParent.parent;
                      }
                      
                      const groupKey = topParent.name;
                      if (!grouped.has(groupKey)) {
                        grouped.set(groupKey, new Set());
                      }
                      
                      // Add the full path for this anatomy node
                      const path = buildAnatomyPath(anatomy).slice(1).join(' → ');
                      if (path) {
                        grouped.get(groupKey)!.add(path);
                      }
                    } else {
                      // No parent, just add the name
                      if (!grouped.has(anatomy.name)) {
                        grouped.set(anatomy.name, new Set());
                      }
                    }
                  });
                  
                  return grouped;
                };

                const primaryGroups = groupAnatomyByParent(primaryLinks);
                const secondaryGroups = groupAnatomyByParent(secondaryLinks);

                return (
                  <div
                    key={exercise.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-blue-400 transition relative group overflow-hidden"
                  >
                    {/* Edit button - top right corner */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingExercise(exercise);
                      }}
                      className="absolute top-3 right-3 z-10 px-3 py-1 bg-white/90 backdrop-blur-sm hover:bg-blue-600 hover:text-white text-gray-700 text-sm font-medium rounded shadow-sm transition opacity-0 group-hover:opacity-100"
                    >
                      Edit
                    </button>

                    <div className="p-5 space-y-4">
                      {/* Exercise Name */}
                      <Link href={`/exercises/${exercise.id}`}>
                        <h3 className="font-bold text-xl text-gray-900 hover:text-blue-600 transition pr-16">
                          {exercise.name}
                        </h3>
                      </Link>

                      {/* Primary Muscles */}
                      {primaryLinks.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-gray-600">Primary:</div>
                          {Array.from(primaryGroups.entries()).map(([group, paths]) => (
                            <div key={group} className="text-sm">
                              <div className="font-medium text-gray-800">{group}</div>
                              {Array.from(paths).map((path, idx) => (
                                <div key={idx} className="text-gray-600 ml-2">
                                  {path}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Video Embed - Smaller */}
                      {exercise.videoUrl && (
                        <div className="my-3">
                          <div className="relative w-full rounded-lg overflow-hidden bg-gray-100" style={{ paddingBottom: "56.25%" }}>
                            <iframe
                              src={(() => {
                                try {
                                  const url = new URL(exercise.videoUrl);
                                  let videoId = "";
                                  if (url.pathname.includes("/shorts/")) {
                                    videoId = url.pathname.split("/shorts/")[1]?.split("?")[0] || "";
                                  } else if (url.hostname.includes("youtube.com")) {
                                    videoId = url.searchParams.get("v") || "";
                                  } else if (url.hostname.includes("youtu.be")) {
                                    videoId = url.pathname.slice(1).split("?")[0];
                                  }
                                  return videoId ? `https://www.youtube.com/embed/${videoId}` : exercise.videoUrl;
                                } catch {
                                  return exercise.videoUrl;
                                }
                              })()}
                              className="absolute top-0 left-0 w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={exercise.name}
                            />
                          </div>
                        </div>
                      )}

                      {/* Secondary Muscles */}
                      {secondaryLinks.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-gray-600">Secondary:</div>
                          {Array.from(secondaryGroups.entries()).map(([group, paths]) => (
                            <div key={group} className="text-sm">
                              <div className="font-medium text-gray-700">{group}</div>
                              {Array.from(paths).map((path, idx) => (
                                <div key={idx} className="text-gray-600 ml-2">
                                  {path}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Movement Pattern */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Pattern:</span>{" "}
                          <span className="text-gray-800">{exercise.movementPattern}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ))}

      {/* No Results */}
      {filteredExercises.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-lg">No exercises found matching the selected filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear filters
          </button>
        </div>
      )}
      </div>
    </>
  );
}

