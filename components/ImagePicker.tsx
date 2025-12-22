"use client";

import { useState, useEffect } from "react";

interface ImagePickerProps {
  onSelect: (images: string[]) => void;
  onClose: () => void;
}

interface ImageCategory {
  name: string;
  path: string;
  count: number;
}

export function ImagePicker({ onSelect, onClose }: ImagePickerProps) {
  const [categories, setCategories] = useState<ImageCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load available image categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/guides/images");
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error loading image categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Load images for selected category
  useEffect(() => {
    if (!selectedCategory) {
      setImages([]);
      return;
    }

    const loadImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/guides/images?category=${selectedCategory}`
        );
        const data = await response.json();
        setImages(data.images || []);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, [selectedCategory]);

  const toggleImage = (imagePath: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imagePath)) {
      newSelected.delete(imagePath);
    } else {
      newSelected.add(imagePath);
    }
    setSelectedImages(newSelected);
  };

  const handleConfirm = () => {
    onSelect(Array.from(selectedImages));
  };

  const filteredImages = searchTerm
    ? images.filter((img) =>
        img.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : images;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">🖼️ Image Picker</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search images..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Selected Count */}
          {selectedImages.size > 0 && (
            <div className="mt-3 text-sm text-blue-600 font-medium">
              ✓ {selectedImages.size} image{selectedImages.size !== 1 ? "s" : ""}{" "}
              selected
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-64 border-r border-gray-200 overflow-y-auto p-4 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.path}
                  onClick={() => setSelectedCategory(category.path)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedCategory === category.path
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <div className="font-medium capitalize">{category.name}</div>
                  <div
                    className={`text-sm ${
                      selectedCategory === category.path
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {category.count} images
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Images Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {!selectedCategory ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-lg">Select a category to browse images</p>
                </div>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">⏳</div>
                  <p className="text-gray-500">Loading images...</p>
                </div>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-lg">No images found</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map((imagePath) => {
                  const isSelected = selectedImages.has(imagePath);
                  return (
                    <button
                      key={imagePath}
                      onClick={() => toggleImage(imagePath)}
                      className={`relative group rounded-lg overflow-hidden border-2 transition ${
                        isSelected
                          ? "border-blue-600 ring-2 ring-blue-600"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={`/guides/${imagePath}`}
                        alt={imagePath}
                        className="w-full h-40 object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                          <div className="bg-blue-600 text-white rounded-full p-2">
                            ✓
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition">
                        <p className="text-white text-xs truncate">
                          {imagePath.split("/").pop()}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedImages.size === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add {selectedImages.size} Image{selectedImages.size !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

