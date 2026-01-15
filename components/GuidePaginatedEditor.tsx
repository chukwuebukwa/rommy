"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MentionTextarea } from "./MentionTextarea";
import { MentionRenderer } from "./MentionRenderer";
import { useToast } from "./Toast";

interface Section {
  id: string;
  kind: string;
  title: string;
  order: number;
  content: string;
  images: string[] | null;
  parentId?: string | null;
  children?: Section[];
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

interface MentionItem {
  id: string;
  name: string;
  type: "exercise" | "anatomy";
  kind?: string;
}

interface Exercise {
  id: string;
  name: string;
  type: string;
}

interface AnatomyNode {
  id: string;
  name: string;
  kind: string;
}

interface GuidePaginatedEditorProps {
  guide: Guide;
  onSwitchToListView: () => void;
  initialPage?: number;
  exercises?: Exercise[];
  anatomyNodes?: AnatomyNode[];
}

const SECTION_KINDS = [
  "cover",
  "intro",
  "mindset",
  "anatomy",
  "exercises",
  "program",
  "tips",
  "content",
];

export function GuidePaginatedEditor({
  guide,
  onSwitchToListView,
  initialPage = 0,
  exercises = [],
  anatomyNodes = [],
}: GuidePaginatedEditorProps) {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>(
    [...guide.sections].sort((a, b) => a.order - b.order)
  );
  const [currentPage, setCurrentPage] = useState(
    initialPage >= 0 && initialPage < guide.sections.length ? initialPage : 0
  );

  // Convert to mention items format
  const mentionExercises: MentionItem[] = exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    type: "exercise" as const,
  }));

  const mentionAnatomy: MentionItem[] = anatomyNodes.map((node) => ({
    id: node.id,
    name: node.name,
    type: "anatomy" as const,
    kind: node.kind,
  }));
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showToc, setShowToc] = useState(true);
  const { showToast, ToastContainer } = useToast();

  const totalPages = sections.length;
  const currentSection = sections[currentPage];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't navigate if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        // Only keep Cmd+S for saving when in text fields
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          handleSave();
        }
        return;
      }

      // Arrow keys work outside of text inputs
      if (e.key === "ArrowLeft" && currentPage > 0) {
        goToPage(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalPages - 1) {
        goToPage(currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const updateCurrentSection = useCallback(
    (updates: Partial<Section>) => {
      setSections((prev) =>
        prev.map((s, i) => (i === currentPage ? { ...s, ...updates } : s))
      );
      setHasChanges(true);
    },
    [currentPage]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const guideData = {
        id: guide.id,
        slug: guide.slug,
        title: guide.title,
        author: guide.author,
        primaryRegionId: guide.primaryRegion?.id || null,
        sections: sections.map((s, i) => ({
          id: s.id,
          kind: s.kind,
          title: s.title,
          order: i,
          content: s.content,
          images: s.images ?? null, // ✨ EXPLICITLY preserve images - fixes the bug!
          parentId: s.parentId || null,
          guideId: guide.id,
        })),
      };

      const response = await fetch("/api/guides/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guideData),
      });

      if (!response.ok) throw new Error("Failed to save guide");

      setHasChanges(false);
      showToast("Guide saved successfully!", "success");
    } catch (error) {
      console.error("Error saving guide:", error);
      showToast("Failed to save guide. Check console for details.", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteCurrentSection = () => {
    if (sections.length <= 1) {
      alert("Cannot delete the last section");
      return;
    }
    if (!confirm(`Delete "${currentSection.title}"?`)) return;

    const newSections = sections
      .filter((_, i) => i !== currentPage)
      .map((s, i) => ({ ...s, order: i }));
    setSections(newSections);
    setHasChanges(true);

    if (currentPage >= newSections.length) {
      setCurrentPage(newSections.length - 1);
    }
  };

  const addSectionAfterCurrent = () => {
    const newSection: Section = {
      id: `section_${Date.now()}`,
      kind: "content",
      title: "New Section",
      order: currentPage + 1,
      content: "",
      images: [],
      parentId: null,
    };

    const newSections = [
      ...sections.slice(0, currentPage + 1),
      newSection,
      ...sections.slice(currentPage + 1),
    ].map((s, i) => ({ ...s, order: i }));

    setSections(newSections);
    setHasChanges(true);
    setCurrentPage(currentPage + 1);
  };

  const addSubsectionToCurrentSection = () => {
    // Find all children of the current section
    const childrenIndices = sections
      .map((s, i) => ({ section: s, index: i }))
      .filter(({ section }) => section.parentId === currentSection.id)
      .map(({ index }) => index);
    
    // Insert after the last child, or after the parent if no children exist
    const insertAfterIndex = childrenIndices.length > 0 
      ? Math.max(...childrenIndices)
      : currentPage;

    const newSection: Section = {
      id: `section_${Date.now()}`,
      kind: "content",
      title: "New Subsection",
      order: insertAfterIndex + 1,
      content: "",
      images: [],
      parentId: currentSection.id,
    };

    const newSections = [
      ...sections.slice(0, insertAfterIndex + 1),
      newSection,
      ...sections.slice(insertAfterIndex + 1),
    ].map((s, i) => ({ ...s, order: i }));

    setSections(newSections);
    setHasChanges(true);
    setCurrentPage(insertAfterIndex + 1);
  };

  // Helper function to check if a section is a child/descendant
  const isChildOf = (potentialChild: Section, potentialParent: Section): boolean => {
    if (potentialChild.id === potentialParent.id) return true;
    if (!potentialChild.parentId) return false;
    
    const parent = sections.find(s => s.id === potentialChild.parentId);
    if (!parent) return false;
    
    return isChildOf(parent, potentialParent);
  };

  // Get available parent sections (excluding self and descendants)
  const getAvailableParentSections = () => {
    return sections.filter(s => {
      if (s.id === currentSection.id) return false; // Can't be parent of itself
      if (isChildOf(s, currentSection)) return false; // Can't be parent if it's a descendant
      return true;
    });
  };

  if (!currentSection) {
    return <div className="p-8 text-center text-gray-500">No sections found</div>;
  }

  return (
    <>
      {ToastContainer}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Table of Contents Sidebar */}
        {showToc && (
        <div className="w-64 bg-gray-900 text-white overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900">
            <h3 className="font-bold text-sm uppercase text-gray-400">
              Pages ({totalPages})
            </h3>
          </div>
          <div className="py-2">
            {sections.map((section, index) => {
              const depth = (() => {
                let d = 0;
                let current = section;
                while (current.parentId) {
                  d++;
                  const parent = sections.find(s => s.id === current.parentId);
                  if (!parent) break;
                  current = parent;
                }
                return d;
              })();
              
              return (
                <button
                  key={section.id}
                  onClick={() => goToPage(index)}
                  className={`w-full text-left px-4 py-2 text-sm transition flex items-start gap-2 ${
                    index === currentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                  style={{ paddingLeft: `${16 + depth * 16}px` }}
                >
                  <span className="text-gray-500 w-6 flex-shrink-0 text-right">
                    {index + 1}
                  </span>
                  <span className="truncate flex-1">
                    {depth > 0 && "└ "}
                    {section.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Editor */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Top Bar */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowToc(!showToc)}
              className="p-2 hover:bg-gray-100 rounded"
              title="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{guide.title}</span>
              <span className="mx-2">·</span>
              <span>Page {currentPage + 1} of {totalPages}</span>
              {hasChanges && <span className="ml-2 text-orange-500">• Unsaved</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToListView}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              📋 List View
            </button>
            <button
              onClick={() => router.push(`/guides/${guide.id}?page=${currentPage}`)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              👁️ View
            </button>
            <button
              id="save-btn"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "..." : "💾 Save"}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded transition ${
              currentPage === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          {/* Quick page dots - show subset if many pages */}
          <div className="flex items-center gap-1 max-w-md overflow-hidden">
            {totalPages <= 20 ? (
              sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentPage ? "bg-blue-600 w-4" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  title={`Page ${index + 1}`}
                />
              ))
            ) : (
              <span className="text-sm text-gray-500">
                {currentPage + 1} / {totalPages}
              </span>
            )}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className={`flex items-center gap-1 px-3 py-1.5 rounded transition ${
              currentPage === totalPages - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Section Header */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Section Details</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addSectionAfterCurrent}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    title="Add a new section after this one"
                  >
                    ➕ Add After
                  </button>
                  <button
                    onClick={addSubsectionToCurrentSection}
                    className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded"
                    title="Add a subsection (child) to this section"
                  >
                    📑 Add Subsection
                  </button>
                  <button
                    onClick={deleteCurrentSection}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={currentSection.title}
                    onChange={(e) => updateCurrentSection({ title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Section title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Type
                  </label>
                  <select
                    value={currentSection.kind}
                    onChange={(e) => updateCurrentSection({ kind: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {SECTION_KINDS.map((kind) => (
                      <option key={kind} value={kind}>
                        {kind.charAt(0).toUpperCase() + kind.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Parent Section
                  </label>
                  <select
                    value={currentSection.parentId || ""}
                    onChange={(e) => updateCurrentSection({ parentId: e.target.value || null })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">None (Top Level)</option>
                    {getAvailableParentSections().map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg border p-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Content
              </label>
              <MentionTextarea
                value={currentSection.content}
                onChange={(value) => updateCurrentSection({ content: value })}
                rows={16}
                placeholder="Enter section content... Type @ to mention exercises or anatomy nodes"
                exercises={mentionExercises}
                anatomyNodes={mentionAnatomy}
              />
              <p className="text-xs text-gray-400 mt-2">
                <strong>Markdown:</strong> # headings · **bold** · *italic* · [link](url) · ![](image) · !video[id] · !videos[id1, id2]
              </p>
            </div>

            {/* Images */}
            {currentSection.images && currentSection.images.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-4">
                  Images ({currentSection.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentSection.images.map((imagePath, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={`/guides/${imagePath}`}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition rounded-lg flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            const markdown = `![](${imagePath})`;
                            const newContent = currentSection.content + `\n\n${markdown}`;
                            updateCurrentSection({ content: newContent });
                          }}
                          className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-blue-600 text-white rounded text-xs transition"
                          title="Insert into content"
                        >
                          + Insert
                        </button>
                        <button
                          onClick={() => {
                            const newImages = currentSection.images!.filter(
                              (_, i) => i !== idx
                            );
                            updateCurrentSection({ images: newImages });
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-600 text-white rounded-full transition"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate">{imagePath}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Preview</h3>
              <div className="prose prose-sm max-w-none border-t pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded uppercase">
                    {currentSection.kind}
                  </span>
                  <h4 className="text-xl font-bold m-0">{currentSection.title}</h4>
                </div>
                <MentionRenderer content={currentSection.content} />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

