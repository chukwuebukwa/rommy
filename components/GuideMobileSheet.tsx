"use client";

import { useEffect } from "react";

interface GuideMobileSheetProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: number;
  totalPages: number;
  currentTitle: string;
  children: React.ReactNode;
}

export function GuideMobileSheet({
  isOpen,
  onToggle,
  currentPage,
  totalPages,
  currentTitle,
  children,
}: GuideMobileSheetProps) {
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-[calc(100%-56px)]"
        }`}
      >
        {/* Sheet container */}
        <div className="bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 max-h-[70vh] flex flex-col">
          {/* Collapsed bar / Header */}
          <button
            onClick={onToggle}
            className="flex items-center justify-between px-4 py-4 border-b border-gray-100"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📑</span>
              <span className="font-medium text-gray-900">Sections</span>
              <span className="text-sm text-gray-500">
                ({currentPage + 1}/{totalPages})
              </span>
            </div>

            {/* Toggle icon */}
            <div className="flex items-center gap-2">
              {!isOpen && (
                <span className="text-sm text-gray-500 truncate max-w-[120px]">
                  {currentTitle}
                </span>
              )}
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </div>
          </button>

          {/* Scrollable content */}
          {isOpen && (
            <div className="overflow-y-auto flex-1 pb-safe">{children}</div>
          )}
        </div>
      </div>
    </>
  );
}
