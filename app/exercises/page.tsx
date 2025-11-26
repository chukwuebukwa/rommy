"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Exercise {
  id: string;
  name: string;
  type: string;
  movementPattern: string;
  equipment: string | null;
  videoUrl: string | null;
  cueSummary: string | null;
}

interface Column {
  title: string;
  items: { id: string; name: string; count?: number }[];
  selectedId: string | null;
}

export default function ExercisesPage() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial groupings
    fetch("/api/exercises/groups")
      .then((res) => res.json())
      .then((data) => {
        setColumns([
          {
            title: "Group By",
            items: [
              { id: "type", name: "By Type (Compound/Isolation)" },
              { id: "pattern", name: "By Movement Pattern" },
              { id: "all", name: "All Exercises" },
            ],
            selectedId: null,
          },
        ]);
        setLoading(false);
      });
  }, []);

  const handleSelect = async (item: { id: string; name: string }, columnIndex: number) => {
    const newColumns = columns.slice(0, columnIndex + 1);
    newColumns[columnIndex] = { ...newColumns[columnIndex], selectedId: item.id };

    if (columnIndex === 0) {
      // First column - group type selected
      if (item.id === "type") {
        const response = await fetch("/api/exercises/by-type");
        const types = await response.json();
        newColumns.push({
          title: "Exercise Type",
          items: types,
          selectedId: null,
        });
      } else if (item.id === "pattern") {
        const response = await fetch("/api/exercises/by-pattern");
        const patterns = await response.json();
        newColumns.push({
          title: "Movement Pattern",
          items: patterns,
          selectedId: null,
        });
      } else if (item.id === "all") {
        const response = await fetch("/api/exercises/all");
        const exercises = await response.json();
        newColumns.push({
          title: "All Exercises",
          items: exercises.map((ex: Exercise) => ({ id: ex.id, name: ex.name })),
          selectedId: null,
        });
      }
    } else if (columnIndex === 1) {
      // Second column - specific type/pattern selected
      const groupType = columns[0].selectedId;
      if (groupType === "type") {
        const response = await fetch(`/api/exercises/by-type/${item.id}`);
        const exercises = await response.json();
        newColumns.push({
          title: `${item.name} Exercises`,
          items: exercises.map((ex: Exercise) => ({ id: ex.id, name: ex.name })),
          selectedId: null,
        });
      } else if (groupType === "pattern") {
        const response = await fetch(`/api/exercises/by-pattern/${item.id}`);
        const exercises = await response.json();
        newColumns.push({
          title: `${item.name} Exercises`,
          items: exercises.map((ex: Exercise) => ({ id: ex.id, name: ex.name })),
          selectedId: null,
        });
      }
    } else if (columnIndex === 2) {
      // Third column - specific exercise selected
      const response = await fetch(`/api/exercises/${item.id}`);
      const exercise = await response.json();
      setSelectedExercise(exercise);
      newColumns[columnIndex] = { ...newColumns[columnIndex], selectedId: item.id };
    }

    setColumns(newColumns);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading exercises...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -m-8">
      {/* Breadcrumb */}
      <div className="px-8 py-4 border-b bg-white flex-shrink-0">
        <div className="text-sm text-gray-500">
          <span className="text-gray-900 font-medium">Exercise Library</span>
          {selectedExercise && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{selectedExercise.name}</span>
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
              <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-4 py-3 font-semibold text-sm text-gray-700">
                {column.title}
              </div>
              {column.items.map((item) => {
                const isSelected = column.selectedId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item, columnIndex)}
                    className={`
                      p-4 border-b border-gray-100 cursor-pointer transition
                      ${isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50"}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.count !== undefined && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {item.count}
                        </span>
                      )}
                      {columnIndex < 2 && <span className="text-gray-400">→</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedExercise && (
          <div className="w-96 flex-shrink-0 border-l border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold uppercase">
                    {selectedExercise.type}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                    {selectedExercise.movementPattern}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedExercise.name}
                </h2>
              </div>

              {selectedExercise.equipment && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Equipment</div>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(selectedExercise.equipment).map((item: string) => (
                      <span
                        key={item}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedExercise.cueSummary && (
                <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-500 rounded">
                  <div className="text-xs font-semibold text-blue-900 mb-1">Form Cues</div>
                  <div className="text-sm text-blue-800">{selectedExercise.cueSummary}</div>
                </div>
              )}

              {selectedExercise.videoUrl && (
                <div className="mb-4">
                  <a
                    href={selectedExercise.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-center font-medium"
                  >
                    📹 Watch Video Tutorial
                  </a>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <Link
                  href={`/exercises/${selectedExercise.id}`}
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
