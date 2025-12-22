"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePicker } from "./ImagePicker";

interface AnatomyEditorProps {
  anatomy: {
    id: string;
    name: string;
    kind: string;
    slug: string;
    description: string | null;
    roleSummary: string | null;
    primaryFunctions: string[] | null;
    aestheticNotes: string[] | null;
    meta: any;
  };
}

export function AnatomyEditor({ anatomy }: AnatomyEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(anatomy.name);
  const [description, setDescription] = useState(anatomy.description || "");
  const [roleSummary, setRoleSummary] = useState(anatomy.roleSummary || "");
  const [primaryFunctions, setPrimaryFunctions] = useState<string[]>(
    anatomy.primaryFunctions || []
  );
  const [aestheticNotes, setAestheticNotes] = useState<string[]>(
    anatomy.aestheticNotes || []
  );
  const [images, setImages] = useState<string[]>(
    anatomy.meta?.images || []
  );
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/anatomy/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: anatomy.id,
          name,
          description: description || null,
          roleSummary: roleSummary || null,
          primaryFunctions,
          aestheticNotes,
          meta: {
            ...anatomy.meta,
            images,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      alert("Saved successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving anatomy");
    } finally {
      setSaving(false);
    }
  };

  const addPrimaryFunction = () => {
    setPrimaryFunctions([...primaryFunctions, ""]);
  };

  const updatePrimaryFunction = (index: number, value: string) => {
    const updated = [...primaryFunctions];
    updated[index] = value;
    setPrimaryFunctions(updated);
  };

  const removePrimaryFunction = (index: number) => {
    setPrimaryFunctions(primaryFunctions.filter((_, i) => i !== index));
  };

  const addAestheticNote = () => {
    setAestheticNotes([...aestheticNotes, ""]);
  };

  const updateAestheticNote = (index: number, value: string) => {
    const updated = [...aestheticNotes];
    updated[index] = value;
    setAestheticNotes(updated);
  };

  const removeAestheticNote = (index: number) => {
    setAestheticNotes(aestheticNotes.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Anatomy: {anatomy.id}</h1>
          <p className="text-gray-600">
            Kind: {anatomy.kind} | Slug: {anatomy.slug}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/anatomy/${anatomy.id}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Name */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="e.g., Biceps Brachii"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows={4}
          placeholder="General description..."
        />
      </div>

      {/* Role Summary */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Role Summary</label>
        <textarea
          value={roleSummary}
          onChange={(e) => setRoleSummary(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows={2}
          placeholder="Brief role summary..."
        />
      </div>

      {/* Primary Functions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold">Primary Functions</label>
          <button
            onClick={addPrimaryFunction}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Function
          </button>
        </div>
        <div className="space-y-2">
          {primaryFunctions.map((func, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={func}
                onChange={(e) => updatePrimaryFunction(index, e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="e.g., elbow flexion"
              />
              <button
                onClick={() => removePrimaryFunction(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Aesthetic Notes */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold">Aesthetic Notes</label>
          <button
            onClick={addAestheticNote}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Note
          </button>
        </div>
        <div className="space-y-2">
          {aestheticNotes.map((note, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => updateAestheticNote(index, e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="e.g., Adds width to the arms"
              />
              <button
                onClick={() => removeAestheticNote(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold">Images</label>
          <button
            onClick={() => setShowImagePicker(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Images
          </button>
        </div>
        {images.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {images.map((imagePath, index) => {
              // Handle both old format and new source:path format
              const getImageSrc = (path: string) => {
                if (path.startsWith('guides:')) {
                  return `/guides/${path.replace('guides:', '')}`;
                } else if (path.startsWith('anatomy:')) {
                  return `/anatomy/${path.replace('anatomy:', '')}`;
                }
                return `/anatomy/${path}`;
              };
              
              return (
                <div key={index} className="relative group">
                  <img
                    src={getImageSrc(imagePath)}
                    alt={`Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No images added yet</p>
        )}
      </div>

      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImagePicker
          category={anatomy.id}
          selectedImages={images}
          onSelect={(selectedImages) => {
            setImages(selectedImages);
            setShowImagePicker(false);
          }}
          onClose={() => setShowImagePicker(false)}
          basePath="/anatomy"
        />
      )}
    </div>
  );
}

