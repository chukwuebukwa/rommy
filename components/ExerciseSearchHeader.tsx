"use client";

import { ExerciseSearch } from "./ExerciseSearch";
import { useRouter } from "next/navigation";

interface ExerciseSearchHeaderProps {
  exercises: Array<{ id: string; name: string }>;
}

export function ExerciseSearchHeader({ exercises }: ExerciseSearchHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-3 mb-3">
        <svg
          className="h-6 w-6 text-blue-600 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <h3 className="text-lg font-bold text-gray-900">Exercise Search</h3>
      </div>
      <ExerciseSearch
        exercises={exercises}
        onSelect={(id) => router.push(`/exercises/${id}`)}
        onSearchChange={() => {}}
        placeholder="Search exercises by name..."
      />
    </div>
  );
}

