"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionEditor } from "./SectionEditor";
import { GuidePaginatedEditor } from "./GuidePaginatedEditor";

interface Section {
  id: string;
  kind: string;
  title: string;
  order: number;
  content: string;
  images: string[] | null;
  parentId?: string | null;
}

interface Guide {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  primaryRegion: {
    id: string;
  } | null;
  sections: Section[];
}

interface AnatomyNode {
  id: string;
  name: string;
  kind: string;
}

interface Exercise {
  id: string;
  name: string;
  type: string;
}

interface GuideEditorProps {
  guide: Guide | null;
  anatomyNodes: AnatomyNode[];
  exercises: Exercise[];
  initialPage?: number;
}

export function GuideEditor({ guide, anatomyNodes, exercises, initialPage = 0 }: GuideEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(guide?.title || "");
  const [slug, setSlug] = useState(guide?.slug || "");
  const [author, setAuthor] = useState(guide?.author || "Uncle Rommy");
  const [primaryRegionId, setPrimaryRegionId] = useState(guide?.primaryRegion?.id || "");
  const [sections, setSections] = useState<Section[]>(
    guide?.sections?.sort((a, b) => a.order - b.order) || []
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "paginated">(
    guide && guide.sections.length > 10 ? "paginated" : "list"
  );

  const regionNodes = anatomyNodes.filter((n) => n.kind === "region");

  // For existing guides with many sections, default to paginated editor
  if (guide && viewMode === "paginated") {
    return (
      <GuidePaginatedEditor
        guide={{
          ...guide,
          sections: sections,
        }}
        onSwitchToListView={() => setViewMode("list")}
        initialPage={initialPage}
        exercises={exercises}
        anatomyNodes={anatomyNodes}
      />
    );
  }

  const addSection = () => {
    const newSection: Section = {
      id: `section_${Date.now()}`,
      kind: "anatomy",
      title: "New Section",
      order: sections.length,
      content: "",
      images: [],
      parentId: null,
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })));
  };

  const moveSection = (id: string, direction: "up" | "down") => {
    const index = sections.findIndex((s) => s.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];

    // Update order values
    setSections(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const guideData = {
        id: guide?.id || slug.toLowerCase().replace(/\s+/g, "_"),
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        title,
        author,
        primaryRegionId: primaryRegionId || null,
        sections: sections.map((s, i) => ({
          id: s.id,
          kind: s.kind,
          title: s.title,
          order: i,
          content: s.content,
          images: s.images ?? null, // ✨ EXPLICITLY preserve images - fixes the bug!
          parentId: s.parentId || null,
          guideId: guide?.id || slug.toLowerCase().replace(/\s+/g, "_"),
        })),
      };

      const response = await fetch("/api/guides/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guideData),
      });

      if (!response.ok) throw new Error("Failed to save guide");

      alert("Guide saved successfully! ✨");
      router.push(`/guides/${guideData.id}`);
    } catch (error) {
      console.error("Error saving guide:", error);
      alert("Failed to save guide. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (previewMode) {
    return (
      <div className="space-y-8">
        {/* Preview Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between sticky top-0 z-10 shadow-md">
          <h1 className="text-2xl font-bold">👁️ Preview Mode</h1>
          <button
            onClick={() => setPreviewMode(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ✏️ Back to Editor
          </button>
        </div>

        {/* Preview Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto">
          <div className="border-b pb-4 mb-8">
            <h2 className="text-4xl font-bold mb-2">{title}</h2>
            {author && <p className="text-gray-600">By {author}</p>}
          </div>

          {sections.map((section, index) => (
            <div key={section.id} className="mb-12 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded uppercase font-semibold">
                  {section.kind}
                </span>
                <h3 className="text-3xl font-bold">{section.title}</h3>
              </div>

              <div className="prose max-w-none text-lg leading-relaxed">
                <p className="whitespace-pre-wrap">{section.content}</p>
              </div>

              {section.images && section.images.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.images.map((imagePath) => (
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

              {index < sections.length - 1 && (
                <hr className="mt-8 border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">
            {guide ? "✏️ Edit Guide" : "✨ Create New Guide"}
          </h1>
          <div className="flex gap-3">
            {guide && sections.length > 0 && (
              <button
                onClick={() => setViewMode("paginated")}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
              >
                📖 Page View
              </button>
            )}
            <button
              onClick={() => setPreviewMode(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              👁️ Preview
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title || !slug}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "💾 Saving..." : "💾 Save Guide"}
            </button>
          </div>
        </div>

        {/* Guide Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Arms Training Guide"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="arms-training-guide"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Uncle Rommy"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Primary Region</label>
          <select
            value={primaryRegionId}
            onChange={(e) => setPrimaryRegionId(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a region...</option>
            {regionNodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            onUpdate={(updates) => updateSection(section.id, updates)}
            onDelete={() => deleteSection(section.id)}
            onMoveUp={index > 0 ? () => moveSection(section.id, "up") : undefined}
            onMoveDown={
              index < sections.length - 1
                ? () => moveSection(section.id, "down")
                : undefined
            }
            exercises={exercises}
            anatomyNodes={anatomyNodes}
          />
        ))}
      </div>

      {/* Add Section Button */}
      <button
        onClick={addSection}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-gray-600 hover:text-blue-600 font-medium"
      >
        ➕ Add New Section
      </button>
    </div>
  );
}

