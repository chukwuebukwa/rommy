"use client";

import { useState } from "react";
import { WorkoutBlockCard } from "./WorkoutBlockCard";
import { MentionRenderer } from "./MentionRenderer";

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

interface WorkoutBlock {
  id: string;
  label: string;
  schemeStyle: string;
  schemeDesc: string;
  notes: string | null;
  exercises: Array<{
    kind: string;
    setLabel: string | null;
    exercise: Exercise;
  }>;
}

interface Workout {
  id: string;
  name: string;
  goal: string | null;
  blocks: WorkoutBlock[];
}

interface WorkoutProgramViewProps {
  workout: Workout;
  introContent?: string;
  guideId?: string;
}

export function WorkoutProgramView({ workout, introContent }: WorkoutProgramViewProps) {
  const [introExpanded, setIntroExpanded] = useState(false);

  // Extract intro text (everything before the numbered list starts)
  const getIntroText = (content: string) => {
    // Find where the numbered list starts (e.g., "1.Triceps:")
    const listStart = content.search(/\n\d+\./);
    if (listStart > 0) {
      return content.slice(0, listStart).trim();
    }
    // If no numbered list, return first few paragraphs
    const paragraphs = content.split("\n\n").slice(0, 4);
    return paragraphs.join("\n\n");
  };

  const introText = introContent ? getIntroText(introContent) : null;

  return (
    <div className="w-full space-y-4">
      {/* Collapsible Intro Section */}
      {introText && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <button
            onClick={() => setIntroExpanded(!introExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <svg
                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${introExpanded ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {introExpanded ? "Hide" : "Show"} intro from Uncle Rommy
              </span>
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {workout.blocks.length} blocks
            </span>
          </button>

          {introExpanded && (
            <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
              <div className="pt-4 prose prose-sm dark:prose-invert max-w-none">
                <MentionRenderer content={introText} />
              </div>
              {workout.goal && (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">{workout.goal}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Workout Blocks - Full Width */}
      <div className="space-y-4">
        {workout.blocks.map((block, idx) => (
          <WorkoutBlockCard
            key={block.id}
            block={block}
            blockNumber={idx + 1}
          />
        ))}
      </div>
    </div>
  );
}
