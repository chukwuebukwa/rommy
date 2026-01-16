"use client";

import { useState, useEffect, useCallback } from "react";
import { ExerciseDrawer } from "@/components/ExerciseDrawer";

type Exercise = {
  id: string;
  name: string;
  videoUrl: string | null;
  type: string;
};

type FullExercise = {
  id: string;
  name: string;
  type: string;
  movementPattern: string;
  cueSummary: string | null;
  videoUrl: string | null;
  equipment: string[];
  anatomyLinks?: Array<{
    role: string;
    anatomy: { id: string; name: string };
  }>;
};

type VideoStatus = "all" | "ok" | "missing" | "review";

// Exercises flagged by audit as needing review
const NEEDS_REVIEW_IDS = [
  "shoulder_21s", "back_bridges", "barbell_good_mornings", "cable_hamstring_curls",
  "face_pulls", "hip_abduction_machine", "hip_adduction_machine", "mid_delt_drop_set",
  "neck_bridges", "neutral_grip_barbell_rows", "neutral_grip_dumbbell_rows",
  "neutral_grip_hammer_strength_row", "pec_deck_flyes", "push_up_circuit", "rack_pulls",
  "reverse_barbell_ez_bar_curls", "reverse_grip_pushdown", "reverse_plate_curls",
  "romanian_deadlift", "rope_attachment_upright_rows", "shoulder_elixir_potion",
  "single_arm_cable_rows", "single_arm_db_overhead_extensions", "single_arm_hammer_curls",
  "sledgehammer_forearm_sequence", "standing_calf_raises", "standing_good_mornings",
  "supinated_barbell_rows", "supinated_dumbbell_rows", "upper_back_barbell_rows",
  "upper_back_dumbbell_rows", "upright_rows_bar", "weighted_dips", "weighted_pull_ups"
];

function extractYouTubeId(url: string): string | null {
  // youtu.be/VIDEO_ID
  let match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // youtube.com/shorts/VIDEO_ID
  match = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // youtube.com/watch?v=VIDEO_ID
  match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  return null;
}

function VideoThumbnail({ url, onClick }: { url: string; onClick: () => void }) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return <div className="text-red-500 text-sm">Invalid URL</div>;

  return (
    <div
      className="relative w-full aspect-video cursor-pointer group"
      onClick={onClick}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
        alt="Video thumbnail"
        className="w-full h-full object-cover rounded"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({
  exercise,
  onUpdate,
  isReviewed,
  onMarkReviewed,
}: {
  exercise: Exercise;
  onUpdate: (id: string, videoUrl: string | null) => void;
  isReviewed: boolean;
  onMarkReviewed: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(exercise.videoUrl || "");
  const [saving, setSaving] = useState(false);

  // Update url when exercise changes
  useEffect(() => {
    setUrl(exercise.videoUrl || "");
    setEditing(false);
  }, [exercise.id, exercise.videoUrl]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/exercises/${exercise.id}/video`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url || null }),
      });
      if (res.ok) {
        onUpdate(exercise.id, url || null);
        setEditing(false);
      }
    } catch {
      alert("Failed to save");
    }
    setSaving(false);
  };

  const videoId = exercise.videoUrl ? extractYouTubeId(exercise.videoUrl) : null;

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Video */}
      <div className="aspect-video bg-black">
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No video set
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{exercise.name}</h2>
            <p className="text-gray-500 font-mono text-sm">{exercise.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            exercise.videoUrl ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}>
            {exercise.videoUrl ? "Has Video" : "Missing"}
          </span>
        </div>

        {/* URL Edit */}
        {editing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/shorts/..."
              className="w-full px-4 py-3 border-2 rounded-lg text-lg"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") {
                  setEditing(false);
                  setUrl(exercise.videoUrl || "");
                }
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setUrl(exercise.videoUrl || "");
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <p className="text-gray-600 truncate flex-1 font-mono text-sm">
              {exercise.videoUrl || "No URL set"}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Edit URL
            </button>
            <button
              onClick={onMarkReviewed}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                isReviewed
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-700"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isReviewed ? "Done" : "Mark Done"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ExerciseCard({
  exercise,
  onUpdate,
  onClick,
}: {
  exercise: Exercise;
  onUpdate: (id: string, videoUrl: string | null) => void;
  onClick: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(exercise.videoUrl || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/exercises/${exercise.id}/video`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url || null }),
      });
      if (res.ok) {
        onUpdate(exercise.id, url || null);
        setEditing(false);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save");
      }
    } catch {
      alert("Failed to save");
    }
    setSaving(false);
  };

  const status = exercise.videoUrl ? "ok" : "missing";

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div
          className="cursor-pointer hover:text-blue-600 transition"
          onClick={onClick}
        >
          <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
          <p className="text-xs text-gray-500">{exercise.id}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            status === "ok"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status === "ok" ? "Has Video" : "Missing"}
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-2">{exercise.type}</p>

      {/* Video Preview */}
      <div className="mb-3 bg-gray-100 rounded overflow-hidden">
        {exercise.videoUrl ? (
          <VideoThumbnail url={exercise.videoUrl} onClick={onClick} />
        ) : (
          <div
            className="aspect-video flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 transition"
            onClick={onClick}
          >
            No video
          </div>
        )}
      </div>

      {/* URL Display/Edit */}
      {editing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/shorts/..."
            className="w-full px-3 py-2 border rounded text-sm"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setUrl(exercise.videoUrl || "");
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500 truncate flex-1">
            {exercise.videoUrl || "No URL set"}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="text-blue-600 text-sm hover:underline"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExerciseVideosPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<VideoStatus>("all");
  const [selectedExercise, setSelectedExercise] = useState<FullExercise | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  // Load reviewed from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("reviewed-exercises");
    if (saved) {
      setReviewed(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save reviewed to localStorage
  const markReviewed = (id: string) => {
    setReviewed((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("reviewed-exercises", JSON.stringify([...next]));
      return next;
    });
  };

  const unmarkReviewed = (id: string) => {
    setReviewed((prev) => {
      const next = new Set(prev);
      next.delete(id);
      localStorage.setItem("reviewed-exercises", JSON.stringify([...next]));
      return next;
    });
  };

  const clearAllReviewed = () => {
    setReviewed(new Set());
    localStorage.removeItem("reviewed-exercises");
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const openDrawer = async (exerciseId: string) => {
    try {
      const res = await fetch(`/api/exercises/${exerciseId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedExercise(data);
        setDrawerOpen(true);
      }
    } catch (e) {
      console.error("Failed to fetch exercise:", e);
    }
  };

  // Get filtered list first so we can use it for navigation
  const getFiltered = useCallback(() => {
    return exercises.filter((ex) => {
      if (search) {
        const q = search.toLowerCase();
        if (!ex.name.toLowerCase().includes(q) && !ex.id.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filter === "ok" && !ex.videoUrl) return false;
      if (filter === "missing" && ex.videoUrl) return false;
      if (filter === "review") {
        if (!NEEDS_REVIEW_IDS.includes(ex.id)) return false;
        if (reviewed.has(ex.id)) return false; // Hide reviewed
      }
      return true;
    });
  }, [exercises, search, filter, reviewed]);

  const filtered = getFiltered();

  // Keyboard navigation for review mode
  useEffect(() => {
    if (!reviewMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setReviewIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setReviewIndex((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === "Escape") {
        setReviewMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reviewMode, filtered.length]);

  // Reset review index when filter changes
  useEffect(() => {
    setReviewIndex(0);
  }, [filter, search]);

  const fetchExercises = async () => {
    try {
      console.log("Fetching exercises...");
      const res = await fetch("/api/exercises");
      console.log("Response status:", res.status);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log("Got exercises:", data.length);
      setExercises(data);
    } catch (e) {
      console.error("Failed to fetch exercises:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id: string, videoUrl: string | null) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, videoUrl } : ex))
    );
  };

  const needsReviewList = exercises.filter((e) => NEEDS_REVIEW_IDS.includes(e.id));
  const remainingReview = needsReviewList.filter((e) => !reviewed.has(e.id));

  const counts = {
    all: exercises.length,
    ok: exercises.filter((e) => e.videoUrl).length,
    missing: exercises.filter((e) => !e.videoUrl).length,
    review: remainingReview.length,
    reviewTotal: needsReviewList.length,
  };

  const startReviewMode = () => {
    setReviewMode(true);
    setReviewIndex(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading exercises...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Exercise Video Manager
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{counts.all}</div>
            <div className="text-sm text-gray-500">Total Exercises</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{counts.ok}</div>
            <div className="text-sm text-gray-500">Have Videos</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-yellow-600">{counts.missing}</div>
            <div className="text-sm text-gray-500">Missing Videos</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-orange-600">
              {counts.review}
              <span className="text-lg text-gray-400">/{counts.reviewTotal}</span>
            </div>
            <div className="text-sm text-gray-500">Needs Review</div>
            {reviewed.size > 0 && (
              <button
                onClick={clearAllReviewed}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                Reset ({reviewed.size} done)
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg"
          />
          <div className="flex gap-2">
            {(["all", "ok", "missing", "review"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === f
                    ? f === "review" ? "bg-orange-600 text-white" : "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                {f === "all" ? "All" : f === "ok" ? "Has Video" : f === "missing" ? "Missing" : "Needs Review"}
              </button>
            ))}
          </div>
          <button
            onClick={startReviewMode}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700"
          >
            Review Mode
          </button>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filtered.length} of {exercises.length} exercises
        </p>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onUpdate={handleUpdate}
              onClick={() => openDrawer(exercise.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No exercises found matching your filters.
          </div>
        )}
      </div>

      <ExerciseDrawer
        exercise={selectedExercise}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Review Mode Overlay */}
      {reviewMode && filtered.length > 0 && (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
            <div className="text-white">
              <span className="text-lg font-semibold">Review Mode</span>
              <span className="ml-4 text-gray-400">
                {reviewIndex + 1} / {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">
                Use arrow keys to navigate, Esc to exit
              </span>
              <button
                onClick={() => setReviewMode(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center p-8">
            <button
              onClick={() => setReviewIndex((i) => Math.max(0, i - 1))}
              disabled={reviewIndex === 0}
              className="p-4 text-white hover:bg-gray-800 rounded-full disabled:opacity-30"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex-1 max-w-4xl mx-8">
              <ReviewCard
                exercise={filtered[reviewIndex]}
                onUpdate={handleUpdate}
                isReviewed={reviewed.has(filtered[reviewIndex].id)}
                onMarkReviewed={() => {
                  const id = filtered[reviewIndex].id;
                  if (reviewed.has(id)) {
                    unmarkReviewed(id);
                  } else {
                    markReviewed(id);
                    // Auto-advance to next if not at end
                    if (reviewIndex < filtered.length - 1) {
                      setTimeout(() => setReviewIndex((i) => i + 1), 300);
                    }
                  }
                }}
              />
            </div>

            <button
              onClick={() => setReviewIndex((i) => Math.min(filtered.length - 1, i + 1))}
              disabled={reviewIndex === filtered.length - 1}
              className="p-4 text-white hover:bg-gray-800 rounded-full disabled:opacity-30"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-800">
            <div
              className="h-full bg-purple-600 transition-all"
              style={{ width: `${((reviewIndex + 1) / filtered.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
