"use client";

import { useState } from "react";
import Link from "next/link";

interface EntityExplorerProps {
  entity: any;
  entityType: "anatomy" | "exercise" | "formula" | "workout" | "guide";
}

export function EntityExplorer({ entity, entityType }: EntityExplorerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["children", "primaryExercises"]) // Auto-expand important sections
  );

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  const renderSection = (
    title: string,
    key: string,
    items: any[],
    renderItem: (item: any) => React.ReactNode,
    color: string = "blue"
  ) => {
    if (!items || items.length === 0) return null;

    const isExpanded = expandedSections.has(key);
    const colorClasses = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      green: "bg-green-50 border-green-200 text-green-600",
      purple: "bg-purple-50 border-purple-200 text-purple-600",
      orange: "bg-orange-50 border-orange-200 text-orange-600",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    };

    return (
      <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden`}>
        <button
          onClick={() => toggleSection(key)}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7-7" />
            </svg>
            <span className="font-mono text-sm font-bold text-gray-900">{title}</span>
            <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-mono">
              {items.length}
            </span>
          </div>
        </button>
        {isExpanded && (
          <div className={`divide-y divide-gray-100`}>
            {items.map((item, index) => (
              <div key={index} className="px-4 py-3 hover:bg-gray-50 transition">
                {renderItem(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (entityType === "anatomy") {
    const primaryFunctions = entity.primaryFunctions
      ? (typeof entity.primaryFunctions === "string"
          ? JSON.parse(entity.primaryFunctions)
          : entity.primaryFunctions)
      : [];
    const aestheticNotes = entity.aestheticNotes
      ? (typeof entity.aestheticNotes === "string"
          ? JSON.parse(entity.aestheticNotes)
          : entity.aestheticNotes)
      : [];

    const primaryExercises =
      entity.exerciseLinks?.filter((link: any) => link.role === "primary") || [];
    const secondaryExercises =
      entity.exerciseLinks?.filter((link: any) => link.role === "secondary") || [];

    return (
      <div className="space-y-6">
        {/* Entity Header */}
        <div className="bg-white border-2 border-blue-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-mono text-xs font-bold uppercase">
              {entity.kind}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{entity.name}</h1>
          </div>
          <div className="font-mono text-sm text-blue-600 mb-4">id: {entity.id}</div>
          {entity.description && (
            <p className="text-gray-700 leading-relaxed mb-4">{entity.description}</p>
          )}
          {entity.roleSummary && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-blue-900 font-medium">{entity.roleSummary}</p>
            </div>
          )}
        </div>

        {/* Properties */}
        {(primaryFunctions.length > 0 || aestheticNotes.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryFunctions.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-mono text-sm font-bold text-gray-900 mb-3">
                  primaryFunctions
                </h3>
                <ul className="space-y-2">
                  {primaryFunctions.map((func: string, i: number) => (
                    <li key={i} className="text-gray-700 text-sm flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {func}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {aestheticNotes.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-mono text-sm font-bold text-gray-900 mb-3">aestheticNotes</h3>
                <ul className="space-y-2">
                  {aestheticNotes.map((note: string, i: number) => (
                    <li key={i} className="text-gray-700 text-sm flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Relationships */}
        {entity.parent && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-mono text-sm font-bold text-gray-900 mb-3">parent</h3>
            <Link
              href={`/anatomy/${entity.parent.id}`}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                {entity.parent.kind}
              </span>
              <span className="font-mono text-sm text-blue-600">{entity.parent.id}</span>
              <span className="text-gray-900">{entity.parent.name}</span>
            </Link>
          </div>
        )}

        {renderSection(
          "children (AnatomyNode)",
          "children",
          entity.children || [],
          (child) => (
            <Link
              href={`/anatomy/${child.id}`}
              className="flex items-center gap-3 hover:text-blue-600 transition"
            >
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-mono">
                {child.kind}
              </span>
              <span className="font-mono text-sm text-green-600">{child.id}</span>
              <span className="text-gray-900">{child.name}</span>
              <span className="text-xs text-gray-500 ml-auto">{child.description}</span>
            </Link>
          )
        )}

        {renderSection(
          "exerciseLinks (primary)",
          "primaryExercises",
          primaryExercises,
          (link) => {
            const equipment = link.exercise.equipment
              ? typeof link.exercise.equipment === "string"
                ? JSON.parse(link.exercise.equipment)
                : link.exercise.equipment
              : [];

            return (
              <div>
                <Link
                  href={`/exercises/${link.exercise.id}`}
                  className="flex items-center gap-3 hover:text-green-600 transition mb-2"
                >
                  <span className="font-mono text-sm text-green-600">{link.exercise.id}</span>
                  <span className="text-gray-900 font-semibold">{link.exercise.name}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">{link.exercise.type}</span>
                </Link>
                {link.exercise.cueSummary && (
                  <p className="text-sm text-gray-600 ml-6">{link.exercise.cueSummary}</p>
                )}
                {equipment.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-6">
                    {equipment.map((item: string) => (
                      <span key={item} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        )}

        {renderSection(
          "exerciseLinks (secondary)",
          "secondaryExercises",
          secondaryExercises,
          (link) => (
            <Link
              href={`/exercises/${link.exercise.id}`}
              className="flex items-center gap-3 hover:text-yellow-600 transition"
            >
              <span className="font-mono text-sm text-yellow-600">{link.exercise.id}</span>
              <span className="text-gray-900">{link.exercise.name}</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">{link.exercise.type}</span>
            </Link>
          )
        )}

        {renderSection(
          "formulaTargets",
          "formulas",
          entity.formulaTargets || [],
          (target) => (
            <Link
              href={`/formulas/${target.formula.id}`}
              className="flex items-center gap-3 hover:text-purple-600 transition"
            >
              <span className="font-mono text-sm text-purple-600">{target.formula.id}</span>
              <span className="text-gray-900">{target.formula.name}</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-mono">
                {target.formula.pattern}
              </span>
            </Link>
          )
        )}

        {renderSection(
          "sectionLinks",
          "sections",
          entity.sectionLinks || [],
          (link) => (
            <Link
              href={`/guides/${link.section.guideId}#${link.section.id}`}
              className="flex flex-col gap-1 hover:text-indigo-600 transition"
            >
              <div className="text-sm text-gray-500">{link.section.guide.title}</div>
              <div className="text-gray-900 font-semibold">{link.section.title}</div>
            </Link>
          )
        )}

        {renderSection(
          "workoutBlockTargets",
          "workouts",
          entity.workoutTargets || [],
          (target) => (
            <Link
              href={`/workouts/${target.block.workoutId}#${target.block.id}`}
              className="flex flex-col gap-1 hover:text-red-600 transition"
            >
              <div className="text-sm text-gray-500">{target.block.workout.name}</div>
              <div className="text-gray-900 font-semibold">{target.block.label}</div>
            </Link>
          )
        )}
      </div>
    );
  }

  return <div>Entity type {entityType} not yet implemented</div>;
}

