import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const regions = await prisma.anatomyNode.findMany({
    where: { kind: "region" },
    include: {
      _count: {
        select: {
          children: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const exerciseCount = await prisma.exercise.count();
  const formulaCount = await prisma.formula.count();
  const workoutCount = await prisma.workout.count();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Rommy's Workout Guide</h1>
        <p className="text-gray-600">
          Wikipedia-style pages with everything on one page. No clicking through - just expand and scroll!
        </p>
      </div>

      {/* Main Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📖 Browse Anatomy</h2>
          <p className="text-gray-600 mb-4">
            Complete hierarchical articles - Arms → Biceps → Long Head, all on one page
          </p>
          <div className="space-y-2">
            {regions.map((region) => (
              <Link
                key={region.id}
                href={`/anatomy/${region.id}`}
                className="block p-3 border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-600">{region.name}</span>
                  <span className="text-xs text-gray-500">{region._count.children} sub-sections</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/exercises"
            className="block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:border-green-500 hover:shadow-md transition"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🏋️ Exercises</h2>
            <p className="text-gray-600 mb-2">
              Browse all {exerciseCount} exercises with form cues and videos
            </p>
            <div className="text-green-600 font-medium text-sm">View all →</div>
          </Link>

          <Link
            href="/formulas"
            className="block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:border-purple-500 hover:shadow-md transition"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🧪 Formulas</h2>
            <p className="text-gray-600 mb-2">
              {formulaCount} exercise supersets and combinations
            </p>
            <div className="text-purple-600 font-medium text-sm">View all →</div>
          </Link>

          <Link
            href="/workouts"
            className="block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:border-red-500 hover:shadow-md transition"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 Workouts</h2>
            <p className="text-gray-600 mb-2">
              {workoutCount} complete training programs
            </p>
            <div className="text-red-600 font-medium text-sm">View all →</div>
          </Link>
        </div>
      </div>

      {/* Database Explorer Link */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">🗄️ Database Explorer</h3>
        <p className="text-gray-600 mb-3">
          Want to explore the raw database with tables, IDs, and relationships?
        </p>
        <Link
          href="/db"
          className="inline-block px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition font-medium text-sm"
        >
          Open Database Explorer →
        </Link>
      </div>
    </div>
  );
}
