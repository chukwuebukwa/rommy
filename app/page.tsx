import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crusadia Codex| Home",
  description: "Your complete guide to building muscle. Browse training programs, exercises, and anatomy breakdowns by Uncle Rommy.",
  openGraph: {
    title: "Crusadia Codex",
    description: "Complete muscle-building guides, exercises, and anatomy by Uncle Rommy.",
  },
};

// Body part config
const GUIDE_CONFIG: Record<string, { icon: string; color: string }> = {
  arms: { icon: "💪", color: "bg-orange-500" },
  chest: { icon: "🫁", color: "bg-sky-500" },
  back: { icon: "🦍", color: "bg-purple-500" },
  legs: { icon: "🦵", color: "bg-emerald-500" },
  shoulders: { icon: "🎯", color: "bg-amber-500" },
};

export default async function Home() {
  const guides = await prisma.guide.findMany({
    orderBy: { title: "asc" },
    include: {
      _count: {
        select: { sections: true },
      },
      sections: {
        where: { kind: "program" },
        orderBy: { order: "asc" },
        take: 1,
        select: { id: true, title: true, order: true },
      },
    },
  });

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Training Programs
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          by Uncle Rommy
        </p>
      </div>

      {/* Guide List - Clean iOS Style */}
      <div className="space-y-3">
        {guides.map((guide: typeof guides[0]) => {
          const config = GUIDE_CONFIG[guide.id] || { icon: "📖", color: "bg-gray-500" };
          const programSection = guide.sections[0];
          // Primary action: go to workout if available, otherwise guide start
          const primaryHref = programSection
            ? `/guides/${guide.id}?page=${programSection.order}`
            : `/guides/${guide.id}`;

          return (
            <Link
              key={guide.id}
              href={primaryHref}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800/60 rounded-2xl active:scale-[0.98] transition-transform"
            >
              {/* Icon */}
              <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center text-2xl`}>
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  {guide.id.charAt(0).toUpperCase() + guide.id.slice(1)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {guide.title.replace(/^[A-Z]+ - /, '')}
                </p>
              </div>

              {/* Chevron */}
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
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
