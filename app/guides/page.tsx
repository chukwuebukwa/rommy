import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function GuidesPage() {
  const guides = await prisma.guide.findMany({
    include: {
      primaryRegion: true,
      sections: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Guides" }]} />
      
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Training Guides</h1>
        <p className="text-gray-600 mt-2">
          Complete training guides by Uncle Rommy covering anatomy, mindset, and programming
        </p>
      </div>

      <div className="space-y-6">
        {guides.map((guide) => (
          <Link
            key={guide.id}
            href={`/guides/${guide.id}`}
            className="block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-blue-500 transition"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-2">{guide.title}</h2>

            {guide.author && (
              <div className="text-sm text-gray-500 mb-3">By {guide.author}</div>
            )}

            {guide.primaryRegion && (
              <div className="mb-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                  {guide.primaryRegion.name}
                </span>
              </div>
            )}

            <div className="text-gray-600">
              {guide.sections.length} sections covering {guide.sections.map((s) => s.kind).filter((v, i, a) => a.indexOf(v) === i).join(", ")}
            </div>

            <div className="mt-4 text-sm text-blue-600 font-medium">
              Read guide →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

