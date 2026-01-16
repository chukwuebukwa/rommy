import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const guides = await prisma.guide.findMany({
    orderBy: { title: "asc" },
    include: {
      _count: {
        select: { sections: true },
      },
    },
  });

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Training Guides
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Complete guides by Uncle Rommy for building strength, muscle, and resilience.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {guides.map((guide) => (
          <Link
            key={guide.id}
            href={`/guides/${guide.id}`}
            className="group block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-200"
          >
            {/* Guide Card */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {guide.title.charAt(0)}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {guide._count.sections} pages
                </span>
              </div>
              
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-1">
                {guide.title}
              </h2>

              {guide.author && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By {guide.author}
                </p>
              )}
            </div>
            
            {/* Bottom accent */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {guides.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No guides yet</h2>
          <p className="text-gray-500 dark:text-gray-400">Check back soon for training guides!</p>
        </div>
      )}
    </div>
  );
}
