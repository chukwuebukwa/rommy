"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MentionRenderer } from "./MentionRenderer";

interface Section {
  id: string;
  kind: string;
  title: string;
  order: number;
  content: string;
  images: string[] | null;
  focusAnatomyLinks?: any[];
  exerciseLinks?: any[];
}

interface Guide {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  primaryRegion?: {
    id: string;
    name: string;
  } | null;
  sections: Section[];
}

interface GuidePaginatedViewProps {
  guide: Guide;
}

export function GuidePaginatedView({ guide }: GuidePaginatedViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "0", 10);
  const [currentPage, setCurrentPage] = useState(
    initialPage >= 0 && initialPage < guide.sections.length ? initialPage : 0
  );
  const sections = guide.sections.sort((a, b) => a.order - b.order);
  const totalPages = sections.length;
  const currentSection = sections[currentPage];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Navigation Controls */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className={`flex items-center gap-1 font-medium transition ${
              currentPage === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-900 hover:text-blue-600"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          {/* Page Indicator */}
          <div className="flex items-center gap-2">
            {totalPages <= 15 ? (
              // Show dots for few pages
              sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`transition-all rounded-sm ${
                    index === currentPage
                      ? "w-6 h-2 bg-gray-900"
                      : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  title={`Go to page ${index + 1}`}
                />
              ))
            ) : (
              // Compact pagination for many pages
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 font-medium">
                  {currentPage + 1} / {totalPages}
                </span>
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className={`flex items-center gap-1 font-medium transition ${
              currentPage === totalPages - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-900 hover:text-blue-600"
            }`}
          >
            Next
            <svg
              className="w-5 h-5"
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
        </div>
      </div>

      {/* Page Content */}
      <div className="min-h-[600px]">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 uppercase font-medium">
              {currentSection.kind}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/guides/editor/${guide.id}?page=${currentPage}`)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
                title="Edit this page"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>
              <span className="text-sm text-gray-500">
                {currentPage + 1} / {totalPages}
              </span>
            </div>
          </div>
          <h2 className="text-4xl font-bold">
            {currentSection.title}
          </h2>
        </div>

        {/* Section Content */}
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none">
            <MentionRenderer content={currentSection.content} />
          </div>

          {/* Images */}
          {currentSection.images && currentSection.images.length > 0 && (
            <div className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSection.images.map((imagePath) => (
                  <img
                    key={imagePath}
                    src={`/guides/${imagePath}`}
                    alt={currentSection.title}
                    className="w-full h-auto object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Focus Areas */}
          {currentSection.focusAnatomyLinks &&
            currentSection.focusAnatomyLinks.length > 0 && (
              <div className="mt-12">
                <div className="flex flex-wrap gap-3">
                  {currentSection.focusAnatomyLinks.map((link: any) => (
                    <Link
                      key={link.anatomy.id}
                      href={`/anatomy/${link.anatomy.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {link.anatomy.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* Mentioned Exercises */}
          {currentSection.exerciseLinks &&
            currentSection.exerciseLinks.length > 0 && (
              <div className="mt-8">
                <div className="flex flex-wrap gap-3">
                  {currentSection.exerciseLinks.map((link: any) => (
                    <Link
                      key={link.exercise.id}
                      href={`/exercises/${link.exercise.id}`}
                      className="text-sm text-green-600 hover:underline"
                    >
                      {link.exercise.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

    </div>
  );
}

