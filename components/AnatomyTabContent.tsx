"use client";

import { useState } from "react";
import { ExerciseDrawer } from "./ExerciseDrawer";

interface AnatomyNode {
  id: string;
  name: string;
  kind: string;
  description: string | null;
  roleSummary: string | null;
  primaryFunctions: any;
  aestheticNotes: any;
  children?: AnatomyNode[];
  exerciseLinks?: Array<{
    role: string;
    exercise: any;
  }>;
}

interface AnatomyTabContentProps {
  anatomyNode: AnatomyNode;
}

export function AnatomyTabContent({ anatomyNode }: AnatomyTabContentProps) {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openExercise = (exercise: any) => {
    setSelectedExercise(exercise);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Group Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">{anatomyNode.name}</h2>
        {anatomyNode.description && (
          <p className="text-gray-300">{anatomyNode.description}</p>
        )}
        {anatomyNode.roleSummary && (
          <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
            <p className="italic text-blue-200">{anatomyNode.roleSummary}</p>
          </div>
        )}
      </div>

      {/* Top-level node content (for nodes without children, like Front Delts) */}
      {(!anatomyNode.children || anatomyNode.children.length === 0) && (
        <AnatomySection
          node={anatomyNode}
          onExerciseClick={openExercise}
          level={1}
          hideTitle={true}
        />
      )}

      {/* Child muscles (e.g., Biceps Brachii, Brachialis) */}
      {anatomyNode.children?.map((muscle) => (
        <AnatomySection
          key={muscle.id}
          node={muscle}
          onExerciseClick={openExercise}
        />
      ))}

      {/* Exercise Drawer */}
      <ExerciseDrawer
        exercise={selectedExercise}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

interface AnatomySectionProps {
  node: AnatomyNode;
  onExerciseClick: (exercise: any) => void;
  level?: number;
  hideTitle?: boolean;
}

function AnatomySection({
  node,
  onExerciseClick,
  level = 2,
  hideTitle = false,
}: AnatomySectionProps) {
  const primaryFunctions = parseFunctions(node.primaryFunctions);
  const aestheticNotes = parseFunctions(node.aestheticNotes);
  
  // Sort exercises: primary first, then secondary
  const exercises = (node.exerciseLinks || []).sort((a, b) => {
    if (a.role === 'primary' && b.role === 'secondary') return -1;
    if (a.role === 'secondary' && b.role === 'primary') return 1;
    return 0;
  });

  const HeadingTag = `h${Math.min(level + 1, 6)}` as any;

  return (
    <div className="space-y-4">
      {!hideTitle && (
        <HeadingTag
          className={`font-bold text-gray-100 ${level === 2 ? "text-xl" : "text-lg"}`}
        >
          {node.name}
          <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded uppercase">
            {node.kind}
          </span>
        </HeadingTag>
      )}

      {!hideTitle && node.description && (
        <p className="text-gray-300">{node.description}</p>
      )}

      {/* Functions & Notes */}
      <div className="grid md:grid-cols-2 gap-4">
        {primaryFunctions.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-100 mb-2">Primary Functions</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              {primaryFunctions.map((fn, i) => (
                <li key={i}>{fn}</li>
              ))}
            </ul>
          </div>
        )}
        {aestheticNotes.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-100 mb-2">Aesthetic Notes</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              {aestheticNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Exercises for this specific anatomy part */}
      {exercises.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-100 mb-3">
            Exercises Targeting {node.name}
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 list-disc list-inside text-gray-300">
            {exercises.map(({ role, exercise }) => (
              <li key={exercise.id} className="text-sm">
                <button
                  onClick={() => onExerciseClick(exercise)}
                  className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
                >
                  {exercise.name}
                </button>
                <span className={`ml-1 text-xs ${
                  role === 'primary'
                    ? 'text-green-400'
                    : 'text-gray-500'
                }`}>
                  ({role})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nested children (muscle heads/parts) */}
      {node.children?.map((child) => (
        <div key={child.id} className="ml-6 border-l-2 border-gray-700 pl-6">
          <AnatomySection
            node={child}
            onExerciseClick={onExerciseClick}
            level={level + 1}
          />
        </div>
      ))}
    </div>
  );
}

function parseFunctions(data: any): string[] {
  if (!data) return [];
  if (typeof data === "string") return JSON.parse(data);
  return data;
}

