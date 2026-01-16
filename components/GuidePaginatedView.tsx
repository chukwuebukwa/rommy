"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MentionRenderer } from "./MentionRenderer";
import { GuideSectionNav } from "./GuideSectionNav";
import { GuideMobileSheet } from "./GuideMobileSheet";
import { WorkoutProgramView } from "./WorkoutProgramView";
import { useTheme } from "./ThemeProvider";

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
  const { theme, toggleTheme } = useTheme();
  const initialPage = parseInt(searchParams.get("page") || "0", 10);
  const [currentPage, setCurrentPage] = useState(
    initialPage >= 0 && initialPage < guide.sections.length ? initialPage : 0
  );
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [workoutLoading, setWorkoutLoading] = useState(false);
  const sections = guide.sections.sort((a, b) => a.order - b.order);
  const totalPages = sections.length;
  const currentSection = sections[currentPage];

  // Close menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPage]);

  // Fetch workout data when on a program section
  useEffect(() => {
    if (currentSection?.kind === "program" && !workoutData) {
      setWorkoutLoading(true);
      fetch(`/api/workouts/by-guide/${guide.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setWorkoutData(data);
          setWorkoutLoading(false);
        })
        .catch(() => setWorkoutLoading(false));
    }
  }, [currentSection?.kind, guide.id, workoutData]);

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

  const navItems = [
    { href: "/", icon: "🏠", label: "Home" },
    { href: "/guides", icon: "📖", label: "Guides" },
    { href: "/learn2", icon: "🎓", label: "Learn" },
    { href: "/exercises", icon: "🏋️", label: "Exercises" },
    { href: "/anatomy", icon: "🦾", label: "Anatomy" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Menu - Main Nav Only */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-gray-900 z-50 transform transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">💪</span>
              <span className="font-bold text-white">Rommy's Guide</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Guide Quick Links */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                Guides
              </div>
              {[
                { id: "arms", icon: "💪", label: "Arms" },
                { id: "chest", icon: "🫁", label: "Chest" },
                { id: "back", icon: "🦍", label: "Back" },
                { id: "legs", icon: "🦵", label: "Legs" },
                { id: "shoulders", icon: "🎯", label: "Shoulders" },
              ].map((g) => (
                <Link
                  key={g.id}
                  href={`/guides/${g.id}`}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition ${
                    guide.id === g.id
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span>{g.icon}</span>
                  <span>{g.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Dark Mode Toggle */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{theme === "dark" ? "🌙" : "☀️"}</span>
                <span className="font-medium">Dark Mode</span>
              </div>
              <div className={`relative w-11 h-6 rounded-full transition-colors ${theme === "dark" ? "bg-blue-600" : "bg-gray-600"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-60 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <GuideSectionNav
            sections={sections}
            currentPage={currentPage}
            onNavigate={goToPage}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header - Clean iOS style */}
        <div className="sticky top-0 z-40 md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center px-4 h-12">
            {/* Back / Menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 text-gray-600 dark:text-gray-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Title - centered */}
            <div className="flex-1 text-center">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {currentSection.title}
              </span>
            </div>

            {/* Page count */}
            <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
              {currentPage + 1}/{totalPages}
            </span>
          </div>
        </div>

        <div className="max-w-3xl px-6 py-8 pb-24 md:pb-8 md:px-10">
          {/* Desktop Navigation Controls */}
          <div className="hidden md:block mb-8">
            <div className="flex items-center justify-between">
              {/* Previous Button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                className={`flex items-center gap-1 font-medium transition ${
                  currentPage === 0
                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
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
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentPage + 1} / {totalPages}
              </span>

              {/* Next Button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`flex items-center gap-1 font-medium transition ${
                  currentPage === totalPages - 1
                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
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
            <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
              {breadcrumbs.map((crumb, idx) => {
                const crumbIndex = sections.findIndex(s => s.id === crumb.id);
                return (
                  <div key={crumb.id} className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(crumbIndex)}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      {crumb.title}
                    </button>
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                  </div>
                );
              })}
              <span className="text-gray-900 dark:text-gray-100 font-medium">{currentSection.title}</span>
            </nav>
          )}

          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs uppercase font-semibold tracking-wider px-2 py-1 rounded ${
              currentSection.kind === 'anatomy' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' :
              currentSection.kind === 'mindset' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
              currentSection.kind === 'program' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
              currentSection.kind === 'intro' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
              currentSection.kind === 'cover' ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' :
              'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {currentSection.kind}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/guides/editor/${guide.id}?page=${currentPage}`)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 transition"
                title="Edit this page"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>
            </div>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {currentSection.title}
          </h2>
        </div>

        {/* Subsections Navigation - compact inline list */}
        {currentSection.children && currentSection.children.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
            <span className="text-gray-500 dark:text-gray-400">In this section:</span>
            {currentSection.children.map((child, idx) => {
              const childIndex = sections.findIndex(s => s.id === child.id);
              return (
                <span key={child.id} className="flex items-center">
                  <button
                    onClick={() => goToPage(childIndex)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                  >
                    {child.title}
                  </button>
                  {idx < currentSection.children!.length - 1 && (
                    <span className="text-gray-300 dark:text-gray-600 ml-2">•</span>
                  )}
                </span>
              );
            })}
          </div>
        )}

        {/* Section Content */}
        <div className="space-y-8">
          {/* Program sections get special treatment with WorkoutProgramView */}
          {currentSection.kind === "program" && workoutData ? (
            <WorkoutProgramView
              workout={workoutData}
              introContent={currentSection.content}
              guideId={guide.id}
            />
          ) : currentSection.kind === "program" && workoutLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MentionRenderer content={currentSection.content} />
            </div>
          )}

          {/* Images */}
          {currentSection.images && currentSection.images.length > 0 && (
            <div className="mt-10">
              <div className={`grid gap-4 ${
                currentSection.images.length === 1
                  ? 'grid-cols-1 max-w-2xl'
                  : currentSection.images.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {currentSection.images.map((imagePath) => (
                  <div key={imagePath} className="overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <img
                      src={`/guides/${imagePath}`}
                      alt={currentSection.title}
                      className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
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
      </main>

      {/* Mobile Bottom Sheet for Guide Sections */}
      <GuideMobileSheet
        isOpen={mobileSheetOpen}
        onToggle={() => setMobileSheetOpen(!mobileSheetOpen)}
        currentPage={currentPage}
        totalPages={totalPages}
        currentTitle={currentSection.title}
      >
        <GuideSectionNav
          sections={sections}
          currentPage={currentPage}
          onNavigate={goToPage}
          onClose={() => setMobileSheetOpen(false)}
        />
      </GuideMobileSheet>
    </div>
  );
}

