"use client";

import { useState, useRef, useMemo } from "react";

export interface AggregatedExercise {
  id: string;
  name: string;
  type: string;
  role: string;
  cdnVideoUrl: string | null;
  sourceNodeId: string;
  sourceNodeName: string;
}

export interface ExerciseSource {
  id: string;
  name: string;
  count: number;
}

interface AggregatedExerciseGridProps {
  exercises: AggregatedExercise[];
  sources: ExerciseSource[];
  onExerciseClick?: (id: string) => void;
}

// Color palette for source badges
const sourceColors = [
  { bg: "bg-blue-100", text: "text-blue-700", active: "bg-blue-500 text-white border-blue-500" },
  { bg: "bg-emerald-100", text: "text-emerald-700", active: "bg-emerald-500 text-white border-emerald-500" },
  { bg: "bg-purple-100", text: "text-purple-700", active: "bg-purple-500 text-white border-purple-500" },
  { bg: "bg-orange-100", text: "text-orange-700", active: "bg-orange-500 text-white border-orange-500" },
  { bg: "bg-pink-100", text: "text-pink-700", active: "bg-pink-500 text-white border-pink-500" },
  { bg: "bg-cyan-100", text: "text-cyan-700", active: "bg-cyan-500 text-white border-cyan-500" },
  { bg: "bg-amber-100", text: "text-amber-700", active: "bg-amber-500 text-white border-amber-500" },
  { bg: "bg-indigo-100", text: "text-indigo-700", active: "bg-indigo-500 text-white border-indigo-500" },
];

function VideoCard({
  exercise,
  sourceColor,
  onExerciseClick
}: {
  exercise: AggregatedExercise;
  sourceColor: typeof sourceColors[0];
  onExerciseClick?: (id: string) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current && exercise.cdnVideoUrl) {
      setIsPlaying(true);
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      setIsPlaying(false);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    if (onExerciseClick) {
      onExerciseClick(exercise.id);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className="relative aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {exercise.cdnVideoUrl ? (
          <>
            <video
              ref={videoRef}
              src={exercise.cdnVideoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              muted
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
            />

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}

            <div className="absolute top-2 right-2">
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded">
                CDN
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <p className="text-white text-xs text-center px-2">No video</p>
          </div>
        )}

        {/* Exercise info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pointer-events-none">
          <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded mb-1 inline-block ${sourceColor.bg} ${sourceColor.text}`}>
            {exercise.sourceNodeName}
          </span>
          <br />
          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-600 text-white rounded uppercase mb-1 inline-block">
            {exercise.type}
          </span>
          <p className="text-white text-xs font-semibold line-clamp-2">{exercise.name}</p>
        </div>
      </div>
    </div>
  );
}

export function AggregatedExerciseGrid({
  exercises,
  sources,
  onExerciseClick
}: AggregatedExerciseGridProps) {
  const [selectedSourceIds, setSelectedSourceIds] = useState<Set<string>>(new Set());

  // Build color map for sources
  const sourceColorMap = useMemo(() => {
    const map: Record<string, typeof sourceColors[0]> = {};
    sources.forEach((source, index) => {
      map[source.id] = sourceColors[index % sourceColors.length];
    });
    return map;
  }, [sources]);

  // Filter exercises based on selected sources
  const filteredExercises = useMemo(() => {
    if (selectedSourceIds.size === 0) return exercises;
    return exercises.filter(ex => selectedSourceIds.has(ex.sourceNodeId));
  }, [exercises, selectedSourceIds]);

  // Toggle source filter
  const toggleSource = (sourceId: string) => {
    setSelectedSourceIds(prev => {
      const next = new Set(prev);
      if (next.has(sourceId)) {
        next.delete(sourceId);
      } else {
        next.add(sourceId);
      }
      return next;
    });
  };

  const clearFilters = () => setSelectedSourceIds(new Set());

  if (exercises.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p className="text-sm">No exercises found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tags */}
      {sources.length > 1 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 font-medium">Filter:</span>
          {sources.map(source => {
            const isSelected = selectedSourceIds.has(source.id);
            const color = sourceColorMap[source.id];
            return (
              <button
                key={source.id}
                onClick={() => toggleSource(source.id)}
                className={`px-2 py-1 rounded text-xs font-medium transition border ${
                  isSelected
                    ? color.active
                    : selectedSourceIds.size === 0
                    ? `${color.bg} ${color.text} border-transparent hover:border-gray-300`
                    : "bg-gray-100 text-gray-400 border-transparent"
                }`}
              >
                {source.name} ({source.count})
              </button>
            );
          })}
          {selectedSourceIds.size > 0 && (
            <button
              onClick={clearFilters}
              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      {selectedSourceIds.size > 0 && (
        <div className="text-xs text-gray-500">
          Showing {filteredExercises.length} of {exercises.length} exercises
        </div>
      )}

      {/* Exercise Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredExercises.map((exercise, index) => (
          <VideoCard
            key={`${exercise.id}-${exercise.sourceNodeId}-${index}`}
            exercise={exercise}
            sourceColor={sourceColorMap[exercise.sourceNodeId] || sourceColors[0]}
            onExerciseClick={onExerciseClick}
          />
        ))}
      </div>
    </div>
  );
}
