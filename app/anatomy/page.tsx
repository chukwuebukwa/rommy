import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anatomy Browser | Rommy's Workout Encyclopedia",
  description: "Explore muscle anatomy by body region. Understand muscle groups, their functions, and the best exercises to target each one.",
  openGraph: {
    title: "Anatomy Browser",
    description: "Interactive muscle anatomy explorer with exercises for each muscle group.",
  },
};

export default async function AnatomyPage() {
  const regions = await prisma.anatomyNode.findMany({
    where: { kind: "region" },
    include: {
      _count: {
        select: {
          children: true,
          exerciseLinks: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Anatomy" }]} />
      
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Anatomy Browser</h1>
        <p className="text-gray-600 mt-2">
          Browse body regions and their muscle groups
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2">💡 How to Navigate</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• <strong>Click any region</strong> to see its complete muscle breakdown</li>
          <li>• <strong>All nested sub-parts</strong> are visible on one page - no endless clicking</li>
          <li>• <strong>Exercise details</strong> shown inline with form cues and videos</li>
          <li>• Use the <strong>Table of Contents</strong> sidebar for quick navigation</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region: typeof regions[0]) => (
          <Link
            key={region.id}
            href={`/anatomy/${region.id}`}
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-400 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900">{region.name}</h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold uppercase">
                {region.kind}
              </span>
            </div>
            
            {region.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">{region.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{region._count.children}</span>
                <span>sub-parts</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{region._count.exerciseLinks}</span>
                <span>exercises</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

