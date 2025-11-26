import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Rommy's Workout Guide Browser
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Browse and explore the complete anatomy, exercises, formulas, and workout programs.
          Navigate through entities and discover their relationships.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Link
          href="/anatomy"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition hover:border-blue-500 group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">🦾</span>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">
              Anatomy
            </h2>
          </div>
          <p className="text-gray-600">
            Explore regions, muscle groups, individual muscles, and their parts.
            Hierarchical structure from arms → biceps → biceps brachii → long head.
          </p>
        </Link>

        <Link
          href="/guides"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition hover:border-green-500 group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">📖</span>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-600">
              Guides
            </h2>
          </div>
          <p className="text-gray-600">
            Read through Uncle Rommy's complete training guides with sections covering
            mindset, anatomy, strength, and programming.
          </p>
        </Link>

        <Link
          href="/exercises"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition hover:border-purple-500 group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">🏋️</span>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600">
              Exercises
            </h2>
          </div>
          <p className="text-gray-600">
            Browse all exercises with video tutorials, primary and secondary muscles,
            equipment needed, and where they're mentioned.
          </p>
        </Link>

        <Link
          href="/formulas"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition hover:border-orange-500 group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">🧪</span>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600">
              Formulas
            </h2>
          </div>
          <p className="text-gray-600">
            Discover exercise formulas and supersets designed to target specific
            muscle heads with compound-isolation pairings.
          </p>
        </Link>

        <Link
          href="/workouts"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition hover:border-red-500 group"
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">📋</span>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-red-600">
              Workouts
            </h2>
          </div>
          <p className="text-gray-600">
            View complete workout routines like "The Sniper's Arm Day" with
            exercise blocks, rep schemes, and training protocols.
          </p>
        </Link>

        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">🔗</span>
            <h2 className="text-2xl font-bold text-gray-900">
              Relationships
            </h2>
          </div>
          <p className="text-gray-600">
            Every entity shows its connections: exercises link to muscles,
            formulas link to exercises, sections link to anatomy and exercises.
          </p>
        </div>
      </div>

      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-bold text-blue-900 mb-2">
          💡 Miller Columns Navigation (Like Finder!)
        </h3>
        <p className="text-blue-800 mb-3">
          The Anatomy and Exercise pages use a <strong>Miller Columns</strong> interface 
          just like macOS Finder. Click items in one column to see its children in the 
          next column to the right. The rightmost panel shows full details.
        </p>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• <strong>Anatomy:</strong> Navigate from Regions → Groups → Muscles → Parts</li>
          <li>• <strong>Exercises:</strong> Browse by Type or Movement Pattern, then drill down</li>
          <li>• Click any item to expand its children and see details</li>
          <li>• Use horizontal scroll to see all columns if needed</li>
        </ul>
      </div>
    </div>
  );
}

