import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rommy's Workout Guide Browser",
  description: "Browse workout guides, anatomy, exercises, and formulas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 text-white flex-shrink-0 overflow-y-auto">
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
                  href="/anatomy"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  <span className="mr-3">🦾</span>
                  Anatomy
                </Link>

                <Link
                  href="/exercises"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  <span className="mr-3">🏋️</span>
                  Exercises
                </Link>

                <Link
                  href="/formulas"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  <span className="mr-3">🧪</span>
                  Formulas
                </Link>

                <Link
                  href="/workouts"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  <span className="mr-3">📋</span>
                  Workouts
                </Link>

                <Link
                  href="/guides"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  <span className="mr-3">📖</span>
                  Guides
                </Link>

                <Link
                  href="/db"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 transition"
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
                  href="/anatomy/arms"
                  className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
                >
                  <span className="mr-2">💪</span>
                  Arms
                </Link>
                
                <Link
                  href="/anatomy/back"
                  className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
                >
                  <span className="mr-2">🔙</span>
                  Back
                </Link>

                <Link
                  href="/anatomy/chest"
                  className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
                >
                  <span className="mr-2">🫁</span>
                  Chest
                </Link>

                <Link
                  href="/anatomy/legs"
                  className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
                >
                  <span className="mr-2">🦵</span>
                  Legs
                </Link>

                <Link
                  href="/anatomy/shoulders"
                  className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
                >
                  <span className="mr-2">👐</span>
                  Shoulders
                </Link>

                <Link
                  href="/anatomy/core"
                  className="flex items-center px-3 py-2 text-xs rounded-lg hover:bg-gray-800 transition text-gray-300"
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
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div id="breadcrumb-container" className="flex-1">
                  {/* Breadcrumbs will be rendered here by child pages */}
                </div>
                <div className="text-sm text-gray-500">
                  Database Browser
                </div>
              </div>
            </header>

            {/* Scrollable content */}
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
