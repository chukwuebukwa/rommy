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
  parentId?: string | null;
  parent?: {
    id: string;
    title: string;
    order: number;
  } | null;
  children?: {
    id: string;
    title: string;
    order: number;
    kind: string;
  }[];
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

  // Get breadcrumb trail for current section
  const getBreadcrumbs = (section: Section): Section[] => {
    const breadcrumbs: Section[] = [];
    let current = section;
    
    while (current.parent) {
      const parentSection = sections.find(s => s.id === current.parent!.id);
      if (!parentSection) break;
      breadcrumbs.unshift(parentSection);
      current = parentSection;
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentSection);

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
          {/* Breadcrumb Navigation */}
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              {breadcrumbs.map((crumb, idx) => {
                const crumbIndex = sections.findIndex(s => s.id === crumb.id);
                return (
                  <div key={crumb.id} className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(crumbIndex)}
                      className="hover:text-blue-600 transition"
                    >
                      {crumb.title}
                    </button>
                    <span className="text-gray-400">/</span>
                  </div>
                );
              })}
              <span className="text-gray-900 font-medium">{currentSection.title}</span>
            </nav>
          )}

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

        {/* Subsections Navigation */}
        {currentSection.children && currentSection.children.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-sm font-semibold text-blue-900 uppercase mb-3">
              📑 Subsections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSection.children.map((child) => {
                const childIndex = sections.findIndex(s => s.id === child.id);
                return (
                  <button
                    key={child.id}
                    onClick={() => goToPage(childIndex)}
                    className="text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase font-semibold mt-0.5">
                        {child.kind}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{child.title}</div>
                        <div className="text-xs text-gray-500 mt-1">Page {childIndex + 1}</div>
                      </div>
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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

