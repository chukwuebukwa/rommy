"use client";

import { useState, ReactNode } from "react";

interface ExpandableSectionProps {
  title: string;
  count?: number;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

export function ExpandableSection({
  title,
  count,
  children,
  defaultOpen = false,
  badge,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">{title}</span>
          {count !== undefined && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
              {count}
            </span>
          )}
          {badge && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold uppercase">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="px-6 py-4 border-t border-gray-200">{children}</div>}
    </div>
  );
}

