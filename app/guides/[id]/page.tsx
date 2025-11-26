import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const guide = await prisma.guide.findUnique({
    where: { id },
    include: {
      primaryRegion: true,
      sections: {
        include: {
          focusAnatomyLinks: {
            include: {
              anatomy: true,
            },
          },
          exerciseLinks: {
            include: {
              exercise: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!guide) {
    notFound();
  }

  const sectionsByKind = guide.sections.reduce((acc, section) => {
    if (!acc[section.kind]) {
      acc[section.kind] = [];
    }
    acc[section.kind].push(section);
    return acc;
  }, {} as Record<string, typeof guide.sections>);

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Guides", href: "/guides" },
          { label: guide.title },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 shadow">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{guide.title}</h1>

        {guide.author && (
          <div className="text-lg text-gray-700 mb-4">By {guide.author}</div>
        )}

        {guide.primaryRegion && (
          <Link
            href={`/anatomy/${guide.primaryRegion.id}`}
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
          >
            🎯 Primary Focus: {guide.primaryRegion.name}
          </Link>
        )}

        <div className="mt-6 text-gray-700">
          <strong>{guide.sections.length} sections</strong> covering{" "}
          {Object.keys(sectionsByKind).join(", ")}
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Table of Contents</h2>
        <div className="space-y-2">
          {guide.sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="block p-3 border-l-4 border-blue-300 hover:border-blue-600 hover:bg-blue-50 transition"
            >
              <span className="text-sm text-gray-500 uppercase">{section.kind}</span>
              <div className="font-medium text-gray-900">{section.title}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      {guide.sections.map((section) => (
        <div
          key={section.id}
          id={section.id}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow scroll-mt-20"
        >
          <div className="border-b pb-3 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-semibold uppercase">
              {section.kind}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">{section.title}</h2>
          </div>

          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {section.content}
            </div>
          </div>

          {/* Related Anatomy */}
          {section.focusAnatomyLinks.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">Related Anatomy:</h3>
              <div className="flex flex-wrap gap-2">
                {section.focusAnatomyLinks.map((link) => (
                  <Link
                    key={link.anatomyNodeId}
                    href={`/anatomy/${link.anatomy.id}`}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition text-sm"
                  >
                    {link.anatomy.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Exercises */}
          {section.exerciseLinks.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Exercises Mentioned:</h3>
              <div className="flex flex-wrap gap-2">
                {section.exerciseLinks.map((link) => (
                  <Link
                    key={link.exerciseId}
                    href={`/exercises/${link.exercise.id}`}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm"
                  >
                    {link.exercise.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

