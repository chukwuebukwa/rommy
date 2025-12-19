"use client";

import { useState } from "react";
import Link from "next/link";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-gray-900 text-white flex-shrink-0 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6">
          <Link href="/" className="block">
            <h1 className="text-xl font-bold mb-1">💪 Rommy's Guide</h1>
            <p className="text-xs text-gray-400">Database Browser</p>
          </Link>
        </div>

        <nav className="px-3 pb-6">
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">🏠</span>
              Home
            </Link>
            
            <div className="pt-4 pb-2 px-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Browse
              </div>
            </div>

            <Link
              href="/learn"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">🎓</span>
              Learn
            </Link>

            <Link
              href="/anatomy"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">🦾</span>
              Anatomy
            </Link>

            <Link
              href="/exercises"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">🏋️</span>
              Exercises
            </Link>

            <Link
              href="/formulas"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">🧪</span>
              Formulas
            </Link>

            <Link
              href="/workouts"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">📋</span>
              Workouts
            </Link>

            <Link
              href="/guides"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">📖</span>
              Guides
            </Link>

            <Link
              href="/db"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">🗄️</span>
              Database
            </Link>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-800">
            <div className="px-3 mb-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Quick Access
              </div>
            </div>
            
            <Link
              href="/learn/arms"
              className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-2">💪</span>
              Arms
            </Link>
            
            <Link
              href="/learn/back"
              className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-2">🔙</span>
              Back
            </Link>

            <Link
              href="/learn/chest"
              className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-2">🫁</span>
              Chest
            </Link>

            <Link
              href="/learn/legs"
              className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-2">🦵</span>
              Legs
            </Link>

            <Link
              href="/learn/shoulders"
              className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-2">👐</span>
              Shoulders
            </Link>

            <Link
              href="/learn/core"
              className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-2">🎯</span>
              Core
            </Link>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-800 px-3">
            <div className="text-xs text-gray-500">
              <p className="mb-2">Navigate through entities and their relationships.</p>
              <p className="text-gray-600">Built for Natural Crusaders 💪</p>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Hamburger button for mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {sidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <div id="breadcrumb-container" className="flex-1 lg:flex-none">
              {/* Breadcrumbs will be rendered here by child pages */}
            </div>
            
            <div className="text-sm text-gray-500 hidden sm:block">
              Database Browser
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

