"use client";

import { useState, useEffect, useRef } from "react";

interface AnatomyNode {
  id: string;
  name: string;
  kind: string;
  parentId: string | null;
}

interface AnatomyLink {
  anatomyNodeId: string;
  role: "primary" | "secondary";
  anatomy?: {
    id: string;
    name: string;
    kind: string;
  };
}

interface Exercise {
  id: string;
  name: string;
  type: string;
  movementPattern: string;
  videoUrl: string | null;
  equipment: string[] | null;
  cueSummary: string | null;
  anatomyLinks: Array<{
    role: string;
    anatomy: {
      id: string;
      name: string;
      kind: string;
      parent: any;
    };
  }>;
}

interface ExerciseEditorProps {
  exercise: Exercise;
  onClose: () => void;
  onSave: (updated: Exercise) => void;
}

export function ExerciseEditor({ exercise, onClose, onSave }: ExerciseEditorProps) {
  const [formData, setFormData] = useState({
    name: exercise.name,
    type: exercise.type,
    movementPattern: exercise.movementPattern,
    videoUrl: exercise.videoUrl || "",
    cueSummary: exercise.cueSummary || "",
    equipment: exercise.equipment || [],
  });

  const [anatomyLinks, setAnatomyLinks] = useState<AnatomyLink[]>(
    exercise.anatomyLinks.map((link) => ({
      anatomyNodeId: link.anatomy.id,
      role: link.role as "primary" | "secondary",
      anatomy: {
        id: link.anatomy.id,
        name: link.anatomy.name,
        kind: link.anatomy.kind,
      },
    }))
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AnatomyNode[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"primary" | "secondary">("primary");
  const [isSaving, setIsSaving] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showSuggestions) {
        onClose();
      } else if (e.key === "Escape" && showSuggestions) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, showSuggestions]);

  // Search anatomy nodes as user types
  useEffect(() => {
    const searchNodes = async () => {
      if (searchQuery.trim().length < 1) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`/api/anatomy-nodes?q=${encodeURIComponent(searchQuery)}`);
        const nodes = await response.json();
        setSearchResults(nodes);
      } catch (error) {
        console.error("Error searching anatomy nodes:", error);
      }
    };

    const debounce = setTimeout(searchNodes, 200);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addAnatomyLink = (node: AnatomyNode) => {
    // Check if already added
    const exists = anatomyLinks.some((link) => link.anatomyNodeId === node.id);
    if (!exists) {
      setAnatomyLinks([
        ...anatomyLinks,
        {
          anatomyNodeId: node.id,
          role: selectedRole,
          anatomy: {
            id: node.id,
            name: node.name,
            kind: node.kind,
          },
        },
      ]);
    }
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const removeAnatomyLink = (anatomyNodeId: string) => {
    setAnatomyLinks(anatomyLinks.filter((link) => link.anatomyNodeId !== anatomyNodeId));
  };

  const toggleLinkRole = (anatomyNodeId: string) => {
    setAnatomyLinks(
      anatomyLinks.map((link) =>
        link.anatomyNodeId === anatomyNodeId
          ? { ...link, role: link.role === "primary" ? "secondary" : "primary" }
          : link
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/exercises/${exercise.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          anatomyLinks: anatomyLinks.map((link) => ({
            anatomyNodeId: link.anatomyNodeId,
            role: link.role,
          })),
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        onSave(updated);
        onClose();
      } else {
        alert("Failed to save exercise");
      }
    } catch (error) {
      console.error("Error saving exercise:", error);
      alert("Error saving exercise");
    } finally {
      setIsSaving(false);
    }
  };

  const primaryLinks = anatomyLinks.filter((link) => link.role === "primary");
  const secondaryLinks = anatomyLinks.filter((link) => link.role === "secondary");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Exercise</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exercise Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="compound">Compound</option>
                  <option value="isolation">Isolation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Movement Pattern
                </label>
                <input
                  type="text"
                  value={formData.movementPattern}
                  onChange={(e) =>
                    setFormData({ ...formData, movementPattern: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., press, curl, extension"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Video URL
              </label>
              <input
                type="text"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cue Summary
              </label>
              <textarea
                value={formData.cueSummary}
                onChange={(e) => setFormData({ ...formData, cueSummary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Brief description of form cues..."
              />
            </div>
          </div>

          {/* Anatomy Tags */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900">Anatomy Tags</h3>

            {/* Add Tag Interface */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search anatomy (muscle, region, group...)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {/* Autocomplete suggestions */}
                  {showSuggestions && searchResults.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      {searchResults.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => addAnatomyLink(node)}
                          className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center justify-between group"
                        >
                          <span>
                            <span className="font-medium">{node.name}</span>
                            <span className="text-gray-500 text-sm ml-2">({node.kind})</span>
                          </span>
                          <span className="text-blue-600 opacity-0 group-hover:opacity-100 text-sm">
                            Add
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedRole("primary")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedRole === "primary"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Primary
                  </button>
                  <button
                    onClick={() => setSelectedRole("secondary")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedRole === "secondary"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Secondary
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Type to search and add tags. Click a tag to toggle between primary/secondary.
              </p>
            </div>

            {/* Current Tags */}
            <div className="space-y-3">
              {/* Primary Tags */}
              {primaryLinks.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Primary Targets ({primaryLinks.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {primaryLinks.map((link) => (
                      <div
                        key={link.anatomyNodeId}
                        className="group flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg border border-green-300"
                      >
                        <button
                          onClick={() => toggleLinkRole(link.anatomyNodeId)}
                          className="font-medium hover:underline"
                        >
                          {link.anatomy?.name}
                        </button>
                        <span className="text-xs text-green-600">({link.anatomy?.kind})</span>
                        <button
                          onClick={() => removeAnatomyLink(link.anatomyNodeId)}
                          className="ml-1 text-green-600 hover:text-red-600 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Secondary Tags */}
              {secondaryLinks.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Secondary Targets ({secondaryLinks.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {secondaryLinks.map((link) => (
                      <div
                        key={link.anatomyNodeId}
                        className="group flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300"
                      >
                        <button
                          onClick={() => toggleLinkRole(link.anatomyNodeId)}
                          className="font-medium hover:underline"
                        >
                          {link.anatomy?.name}
                        </button>
                        <span className="text-xs text-yellow-600">({link.anatomy?.kind})</span>
                        <button
                          onClick={() => removeAnatomyLink(link.anatomyNodeId)}
                          className="ml-1 text-yellow-600 hover:text-red-600 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {anatomyLinks.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                  No anatomy tags added yet. Search and add some above.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

