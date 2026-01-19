"use client";

import { useState, useEffect } from "react";

type FaqEntry = {
  id: string;
  title: string;
  content: string;
  order: number;
};

export default function FaqAdminPage() {
  const [entries, setEntries] = useState<FaqEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load existing FAQ entries
  useEffect(() => {
    fetch("/api/faq")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setMessage({ type: "error", text: "Failed to load entries" });
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title: form.title,
          content: form.content,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state
        if (editingId) {
          setEntries(entries.map((e) => (e.id === editingId ? data.entry : e)));
        } else {
          setEntries([...entries, data.entry]);
        }
        setForm({ title: "", content: "" });
        setEditingId(null);
        setMessage({ type: "success", text: editingId ? "Updated!" : "Added!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save" });
    }

    setSaving(false);
  };

  const handleEdit = (entry: FaqEntry) => {
    setEditingId(entry.id);
    setForm({ title: entry.title, content: entry.content });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ entry?")) return;

    try {
      const res = await fetch(`/api/faq?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEntries(entries.filter((e) => e.id !== id));
        setMessage({ type: "success", text: "Deleted!" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete" });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", content: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Training Notes & FAQ</h1>
        <p className="text-gray-400 mb-8">
          Add notes that the AI can reference when answering questions.
          These get indexed and retrieved automatically via RAG.
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "success" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Entry" : "Add New Entry"}
          </h2>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Title / Topic</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Second chest session same day"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Content / Advice</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="The actual advice or note content..."
              rows={6}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving || !form.title.trim() || !form.content.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded font-medium"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Add Entry"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Existing Entries */}
        <h2 className="text-lg font-semibold mb-4">Existing Entries ({entries.length})</h2>

        {entries.length === 0 ? (
          <p className="text-gray-500">No entries yet. Add your first one above.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-blue-400">{entry.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap text-sm">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
