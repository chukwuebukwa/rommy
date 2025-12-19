"use client";

import { useState, useEffect } from "react";

interface AnatomyNode {
  id: string;
  name: string;
  kind: string;
}

interface ConfigData {
  regionId: string;
  regionName: string;
  currentConfig: {
    crossReferences: string[];
    excludeChildren: string[];
  };
  available: {
    crossReferences: AnatomyNode[];
    hierarchicalChildren: AnatomyNode[];
  };
}

interface LearnConfigModalProps {
  regionId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function LearnConfigModal({
  regionId,
  isOpen,
  onClose,
  onSave,
}: LearnConfigModalProps) {
  const [configData, setConfigData] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCrossRefs, setSelectedCrossRefs] = useState<Set<string>>(new Set());
  const [selectedExclusions, setSelectedExclusions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && regionId) {
      fetchConfig();
    }
  }, [isOpen, regionId]);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/learn-config?regionId=${regionId}`);
      const data = await response.json();
      setConfigData(data);
      setSelectedCrossRefs(new Set(data.currentConfig.crossReferences));
      setSelectedExclusions(new Set(data.currentConfig.excludeChildren));
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/learn-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regionId,
          crossReferences: Array.from(selectedCrossRefs),
          excludeChildren: Array.from(selectedExclusions),
        }),
      });

      if (response.ok) {
        onSave();
        onClose();
      }
    } catch (error) {
      console.error('Failed to save config:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleCrossRef = (id: string) => {
    const newSet = new Set(selectedCrossRefs);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedCrossRefs(newSet);
  };

  const toggleExclusion = (id: string) => {
    const newSet = new Set(selectedExclusions);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedExclusions(newSet);
  };

  if (!isOpen) return null;

  const hierarchicalCount = configData?.available.hierarchicalChildren.length || 0;
  const excludedCount = selectedExclusions.size;
  const crossRefCount = selectedCrossRefs.size;
  const totalTabs = 1 + (hierarchicalCount - excludedCount) + crossRefCount; // 1 for Guide tab

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-bold">
            Configure Tabs: {configData?.regionName || regionId}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Control which tabs appear on the learn page
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading configuration...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cross-References */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Cross-Referenced Anatomy ✦
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Anatomy from other regions to show as tabs (marked with ✦)
                </p>
                {configData?.available.crossReferences.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No cross-referenced anatomy available in guide
                  </p>
                ) : (
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    {configData?.available.crossReferences.map((node) => (
                      <label
                        key={node.id}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCrossRefs.has(node.id)}
                          onChange={() => toggleCrossRef(node.id)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="flex-1">
                          {node.name}
                          <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                            {node.kind}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Exclusions */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Exclude Hierarchical Children
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Hide specific tabs from the hierarchy (useful for empty organizational nodes)
                </p>
                {configData?.available.hierarchicalChildren.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No hierarchical children available
                  </p>
                ) : (
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    {configData?.available.hierarchicalChildren.map((node) => (
                      <label
                        key={node.id}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedExclusions.has(node.id)}
                          onChange={() => toggleExclusion(node.id)}
                          className="w-4 h-4 text-red-600 rounded"
                        />
                        <span className="flex-1">
                          {node.name}
                          <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                            {node.kind}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Preview</h3>
                <p className="text-sm">
                  <strong>{totalTabs} tabs</strong> will appear:{" "}
                  <span className="text-gray-600">
                    Guide + {hierarchicalCount - excludedCount} hierarchical{" "}
                    {crossRefCount > 0 && `+ ${crossRefCount} cross-referenced`}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

