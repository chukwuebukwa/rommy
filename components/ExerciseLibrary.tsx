"use client";

import { useState } from "react";
import Link from "next/link";
import { ExerciseEditor } from "./ExerciseEditor";

interface Exercise {
  id: string;
  name: string;
  type: string;
  movementPattern: string;
  videoUrl: string | null;
  anatomyLinks: Array<{
    role: string;
    anatomy: {
      name: string;
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeExercises.map((exercise) => {
                const primaryLinks = exercise.anatomyLinks
                  .filter((link) => link.role === "primary");
                const secondaryLinks = exercise.anatomyLinks
                  .filter((link) => link.role === "secondary");

                return (
                  <div
                    key={exercise.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-blue-500 transition relative group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Link href={`/exercises/${exercise.id}`} className="flex-1">
                        <h3 className="font-bold text-lg text-blue-600 hover:underline">
                          {exercise.name}
                        </h3>
                      </Link>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingExercise(exercise);
                        }}
                        className="ml-2 px-3 py-1 bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 text-sm font-medium rounded transition opacity-0 group-hover:opacity-100"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Pattern:</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-medium">
                          {exercise.movementPattern}
                        </span>
                      </div>

                      {primaryLinks.length > 0 && (
                        <div>
                          <div className="text-gray-500 mb-1">Primary:</div>
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              const uniqueParts = new Set<string>();
                              primaryLinks.forEach((link) => {
                                buildAnatomyPath(link.anatomy).forEach(part => uniqueParts.add(part));
                              });
                              return Array.from(uniqueParts).map((part, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                                >
                                  {part}
                                </span>
                              ));
                            })()}
                          </div>
                        </div>
                      )}

                      {secondaryLinks.length > 0 && (
                        <div>
                          <div className="text-gray-500 mb-1">Secondary:</div>
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              const uniqueParts = new Set<string>();
                              secondaryLinks.forEach((link) => {
                                buildAnatomyPath(link.anatomy).forEach(part => uniqueParts.add(part));
                              });
                              return Array.from(uniqueParts).map((part, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
                                >
                                  {part}
                                </span>
                              ));
                            })()}
                          </div>
                        </div>
                      )}

                      {exercise.videoUrl && (
                        <div className="text-blue-500 text-xs mt-2">📹 Video available</div>
                      )}
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

