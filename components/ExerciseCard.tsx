"use client";

import Link from "next/link";

interface ExerciseCardProps {
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
  kind: string;
}

export function ExerciseCard({ exercise, kind }: ExerciseCardProps) {
  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="block p-5 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition bg-gradient-to-r from-white to-gray-50"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h4 className="text-xl font-bold text-green-600">
          {exercise.name}
        </h4>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium uppercase flex-shrink-0">
          {kind}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Type:</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
            {exercise.type}
          </span>
          <span className="text-gray-500">•</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
            {exercise.movementPattern}
          </span>
        </div>

        {exercise.anatomyLinks.length > 0 && (
          <div>
            <span className="text-gray-500 mr-2">Primary muscles:</span>
            {exercise.anatomyLinks.map((link) => (
              <span
                key={link.anatomyNodeId}
                className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs mr-2"
              >
                {link.anatomy.name}
              </span>
            ))}
          </div>
        )}

        {exercise.cueSummary && (
          <div className="mt-3 p-3 bg-white border border-gray-200 rounded">
            <div className="text-gray-500 font-semibold mb-1">Form Cues:</div>
            <div className="text-gray-700">{exercise.cueSummary}</div>
          </div>
        )}

        {exercise.videoUrl && (
          <a
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            📹 Watch video tutorial →
          </a>
        )}
      </div>
    </Link>
  );
}

