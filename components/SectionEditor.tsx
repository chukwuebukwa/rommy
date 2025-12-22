"use client";

import { useState } from "react";
import { ImagePicker } from "./ImagePicker";
import { MentionTextarea } from "./MentionTextarea";

interface Section {
  id: string;
  kind: string;
  title: string;
  order: number;
  content: string;
  images: string[] | null;
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

interface SectionEditorProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  exercises: Exercise[];
  anatomyNodes: AnatomyNode[];
}

const SECTION_TYPES = [
  { value: "intro", label: "Introduction", emoji: "👋" },
  { value: "anatomy", label: "Anatomy", emoji: "🦾" },
  { value: "mindset", label: "Mindset", emoji: "🧠" },
  { value: "strength", label: "Strength", emoji: "💪" },
  { value: "program", label: "Program", emoji: "📋" },
  { value: "exercise", label: "Exercise", emoji: "🏋️" },
  { value: "tips", label: "Tips & Tricks", emoji: "💡" },
  { value: "science", label: "Science", emoji: "🔬" },
  { value: "conclusion", label: "Conclusion", emoji: "🎯" },
];

export function SectionEditor({
  section,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  exercises,
  anatomyNodes,
}: SectionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const selectedType = SECTION_TYPES.find((t) => t.value === section.kind) || SECTION_TYPES[0];

  // Convert to mention items format
  const mentionExercises = exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    type: "exercise" as const,
  }));

  const mentionAnatomy = anatomyNodes.map((node) => ({
    id: node.id,
    name: node.name,
    type: "anatomy" as const,
    kind: node.kind,
  }));

  const handleAddImages = (images: string[]) => {
    const currentImages = section.images || [];
    onUpdate({ images: [...currentImages, ...images] });
    setShowImagePicker(false);
  };

  const handleRemoveImage = (imagePath: string) => {
    const currentImages = section.images || [];
    onUpdate({ images: currentImages.filter((img) => img !== imagePath) });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Section Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              {isExpanded ? "▼" : "▶"}
            </button>

            <span className="text-2xl">{selectedType.emoji}</span>

            <input
              type="text"
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="flex-1 px-3 py-1 text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition"
              placeholder="Section Title"
            />

            <select
              value={section.kind}
              onChange={(e) => onUpdate({ kind: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition"
            >
              {SECTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.emoji} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {onMoveUp && (
              <button
                onClick={onMoveUp}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                title="Move up"
              >
                ↑
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={onMoveDown}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                title="Move down"
              >
                ↓
              </button>
            )}
            <button
              onClick={onDelete}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
              title="Delete section"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Section Body */}
      {isExpanded && (
        <div className="p-6 space-y-6 relative overflow-visible">
          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              📝 Content
            </label>
            <MentionTextarea
              value={section.content}
              onChange={(value) => onUpdate({ content: value })}
              rows={8}
              placeholder="Write your content here... Use Uncle Rommy's voice and wisdom! Type @ to mention exercises or anatomy. ✨"
              exercises={mentionExercises}
              anatomyNodes={mentionAnatomy}
            />
          </div>

          {/* Images Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                🖼️ Images ({section.images?.length || 0})
              </label>
              <button
                onClick={() => setShowImagePicker(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                ➕ Add Images
              </button>
            </div>

            {section.images && section.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {section.images.map((imagePath) => (
                  <div key={imagePath} className="relative group">
                    <img
                      src={`/guides/${imagePath}`}
                      alt={section.title}
                      className="w-full h-32 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                      onClick={() => handleRemoveImage(imagePath)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                      title="Remove image"
                    >
                      ✕
                    </button>
                    <div className="mt-1 text-xs text-gray-500 truncate" title={imagePath}>
                      {imagePath.split("/").pop()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
                <p className="text-sm">No images yet. Click "Add Images" to get started!</p>
              </div>
            )}
          </div>

          {/* Character Count */}
          <div className="text-sm text-gray-500 text-right">
            {section.content.length} characters
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImagePicker
          onSelect={handleAddImages}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
}

