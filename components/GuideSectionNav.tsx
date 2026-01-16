"use client";

import { useState, useEffect } from "react";

interface Section {
  id: string;
  kind: string;
  title: string;
  order: number;
  parentId?: string | null;
  children?: {
    id: string;
    title: string;
    order: number;
    kind: string;
  }[];
}

interface GuideSectionNavProps {
  sections: Section[];
  currentPage: number;
  onNavigate: (page: number) => void;
  onClose?: () => void;
}

export function GuideSectionNav({
  sections,
  currentPage,
  onNavigate,
  onClose,
}: GuideSectionNavProps) {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const currentSection = sortedSections[currentPage];

  // Track which parent sections are expanded
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Auto-expand parent of current section
  useEffect(() => {
    if (currentSection?.parentId) {
      setExpandedIds((prev) => new Set([...prev, currentSection.parentId!]));
    }
  }, [currentSection?.parentId]);

  // Get top-level sections (no parent)
  const topLevelSections = sortedSections.filter((s) => !s.parentId);

  // Get children for a parent section
  const getChildren = (parentId: string) => {
    return sortedSections.filter((s) => s.parentId === parentId);
  };

  const toggleExpanded = (sectionId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handleNavigate = (page: number) => {
    onNavigate(page);
    onClose?.();
  };

  const getSectionIndex = (sectionId: string) => {
    return sortedSections.findIndex((s) => s.id === sectionId);
  };

  // Calculate progress percentage
  const progressPercent = Math.round(((currentPage + 1) / sortedSections.length) * 100);

  // Get kind color for section indicator
  const getKindColor = (kind: string) => {
    switch (kind) {
      case 'anatomy': return 'bg-teal-500';
      case 'mindset': return 'bg-purple-500';
      case 'program': return 'bg-orange-500';
      case 'intro': return 'bg-blue-500';
      case 'cover': return 'bg-gray-800';
      default: return 'bg-gray-400';
    }
  };

  return (
    <nav className="py-4">
      {/* Progress bar */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progress</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{progressPercent}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Section {currentPage + 1} of {sortedSections.length}
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-gray-700 mx-4 mb-3" />

      <ul className="space-y-0.5">
        {topLevelSections.map((section) => {
          const sectionIndex = getSectionIndex(section.id);
          const isCurrentSection = sectionIndex === currentPage;
          const children = getChildren(section.id);
          const hasChildren = children.length > 0;
          const isExpanded = expandedIds.has(section.id);
          const hasCurrentChild = children.some(
            (child) => getSectionIndex(child.id) === currentPage
          );

          return (
            <li key={section.id}>
              {/* Parent section row */}
              <div
                className={`flex items-center gap-1 px-4 py-2 cursor-pointer transition-colors ${
                  isCurrentSection
                    ? "bg-blue-50 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200 font-medium"
                    : hasCurrentChild
                    ? "text-blue-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {/* Kind color indicator */}
                <span className={`w-2 h-2 rounded-full ${getKindColor(section.kind)} shrink-0`} />

                {/* Expand/collapse button for sections with children */}
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpanded(section.id)}
                    className="w-4 h-4 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
                  >
                    <svg
                      className={`w-3 h-3 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ) : (
                  <span className="w-4" />
                )}

                {/* Section title */}
                <button
                  onClick={() => handleNavigate(sectionIndex)}
                  className="flex-1 text-left text-sm truncate"
                >
                  {section.title}
                </button>

                {/* Page number indicator */}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {sectionIndex + 1}
                </span>
              </div>

              {/* Children sections */}
              {hasChildren && isExpanded && (
                <ul className="ml-5 border-l border-gray-200 dark:border-gray-700">
                  {children.map((child) => {
                    const childIndex = getSectionIndex(child.id);
                    const isCurrentChild = childIndex === currentPage;

                    return (
                      <li key={child.id}>
                        <button
                          onClick={() => handleNavigate(childIndex)}
                          className={`w-full flex items-center gap-2 pl-4 pr-4 py-1.5 text-sm text-left transition-colors ${
                            isCurrentChild
                              ? "bg-blue-50 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200 font-medium"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                          <span className="flex-1 truncate">{child.title}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {childIndex + 1}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
