import Link from "next/link";
import { graphqlQuery } from "@/lib/graphql/client";
import { gql } from "graphql-request";

const GET_ALL_GUIDES = gql`
  query GetAllGuides {
    guides {
      id
      slug
      title
      author
      primaryRegion {
        id
        name
      }
      sections {
        id
      }
    }
  }
`;

export const dynamic = "force-dynamic";

export default async function GuidesManagementPage() {
  try {
    const data = await graphqlQuery(GET_ALL_GUIDES, {});
    const guides = (data?.guides as any[]) || [];

    return (
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">📚 Guide CMS</h1>
              <p className="text-gray-600">
                Create and manage beautiful guides with full control over content, images,
                and layout.
              </p>
            </div>
            <Link
              href="/guides/editor/new"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              ✨ Create New Guide
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold">{guides.length}</div>
            <div className="text-blue-100">Total Guides</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold">
              {guides.reduce((sum, g) => sum + (g.sections?.length || 0), 0)}
            </div>
            <div className="text-purple-100">Total Sections</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold">
              {new Set(guides.map((g) => g.primaryRegion?.id).filter(Boolean)).size}
            </div>
            <div className="text-green-100">Regions Covered</div>
          </div>
        </div>

        {/* Guides List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Your Guides</h2>
          </div>

          {guides.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No guides yet</h3>
              <p className="mb-6">Create your first guide to get started!</p>
              <Link
                href="/guides/editor/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                ✨ Create Your First Guide
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  className="p-6 hover:bg-gray-50 transition group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold group-hover:text-blue-600 transition">
                          {guide.title}
                        </h3>
                        {guide.primaryRegion && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded uppercase font-semibold">
                            {guide.primaryRegion.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {guide.author && <span>✍️ {guide.author}</span>}
                        <span>📄 {guide.sections?.length || 0} sections</span>
                        <span className="text-gray-400">ID: {guide.id}</span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/guides/editor/${guide.id}`}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                        >
                          ✏️ Edit
                        </Link>
                        <Link
                          href={`/guides/${guide.id}`}
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition"
                        >
                          👁️ View
                        </Link>
                        <Link
                          href={`/learn/${guide.primaryRegion?.id || guide.id}`}
                          className="px-4 py-2 bg-purple-100 text-purple-700 text-sm rounded-lg hover:bg-purple-200 transition"
                        >
                          🎓 View in Learn
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-3">💡 Quick Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✨ Use the section editor to craft beautiful, image-rich content</li>
            <li>🖼️ Images are organized by muscle group (arms, back, chest, shoulders)</li>
            <li>👁️ Preview your guide before saving to see how it looks</li>
            <li>📝 Each section can have its own type (anatomy, mindset, tips, etc.)</li>
            <li>🎯 Link guides to anatomy regions for easy navigation</li>
          </ul>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading guides:", error);
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Error Loading Guides</h1>
          <p className="text-red-600">
            Unable to load guides. Please check your database connection.
          </p>
        </div>
      </div>
    );
  }
}
