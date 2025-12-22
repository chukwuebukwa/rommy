import { notFound } from "next/navigation";
import Link from "next/link";
import { graphqlQuery } from "@/lib/graphql/client";
import { GET_GUIDE_DETAIL } from "@/lib/graphql/prepared-queries";
import { MentionRenderer } from "@/components/MentionRenderer";

export default async function GuideViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await graphqlQuery(GET_GUIDE_DETAIL, { id });

  if (!data?.guide) {
    notFound();
  }

  const guide = data.guide as any;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/guides"
          className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Guides
        </Link>
        <Link
          href={`/guides/editor/${guide.id}`}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ✏️ Edit Guide
        </Link>
      </div>

      {/* Guide Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto shadow-lg">
        {/* Guide Header */}
        <div className="border-b pb-6 mb-8">
          <h1 className="text-5xl font-bold mb-3">{guide.title}</h1>
          {guide.author && (
            <p className="text-gray-600 text-lg mb-2">By {guide.author}</p>
          )}
          {guide.primaryRegion && (
            <Link
              href={`/learn/${guide.primaryRegion.id}`}
              className="inline-flex items-center gap-2 text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-lg hover:bg-purple-200 transition"
            >
              <span>🎓</span>
              <span>{guide.primaryRegion.name}</span>
            </Link>
          )}
        </div>

        {/* Sections */}
        {guide.sections
          .sort((a: any, b: any) => a.order - b.order)
          .map((section: any, index: number) => (
            <div key={section.id} className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded uppercase font-semibold">
                  {section.kind}
                </span>
                <h2 className="text-3xl font-bold">{section.title}</h2>
              </div>

              <div className="prose prose-lg max-w-none mb-6">
                <MentionRenderer content={section.content} />
              </div>

              {section.images && section.images.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.images.map((imagePath: string) => (
                      <img
                        key={imagePath}
                        src={`/guides/${imagePath}`}
                        alt={section.title}
                        className="rounded-lg border shadow-md hover:shadow-xl transition cursor-pointer w-full h-auto object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Section Anatomy Links */}
              {section.focusAnatomyLinks &&
                section.focusAnatomyLinks.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-semibold mb-2 text-sm text-gray-600">
                      🎯 Focus Areas:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {section.focusAnatomyLinks.map((link: any) => (
                        <Link
                          key={link.anatomy.id}
                          href={`/anatomy/${link.anatomy.id}`}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition"
                        >
                          {link.anatomy.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              {/* Section Exercise Links */}
              {section.exerciseLinks && section.exerciseLinks.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold mb-2 text-sm text-gray-600">
                    🏋️ Mentioned Exercises:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {section.exerciseLinks.map((link: any) => (
                      <Link
                        key={link.exercise.id}
                        href={`/exercises/${link.exercise.id}`}
                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition"
                      >
                        {link.exercise.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {index < guide.sections.length - 1 && (
                <hr className="mt-12 border-gray-200" />
              )}
            </div>
          ))}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center gap-4">
        <Link
          href="/guides"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          📚 View All Guides
        </Link>
        <Link
          href={`/guides/editor/${guide.id}`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ✏️ Edit This Guide
        </Link>
      </div>
    </div>
  );
}
