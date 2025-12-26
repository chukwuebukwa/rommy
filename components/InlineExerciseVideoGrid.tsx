"use client";

import { useState, useEffect, useRef } from "react";

interface Exercise {
  id: string;
  name: string;
  videoUrl: string | null;
  cdnVideoUrl: string | null;
  type: string;
}

interface InlineExerciseVideoGridProps {
  exerciseIds: string[];
  onExerciseClick?: (id: string) => void;
}

function VideoCard({ exercise, onExerciseClick }: { exercise: Exercise; onExerciseClick?: (id: string) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getYouTubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      let videoId = "";
      if (urlObj.pathname.includes("/shorts/")) {
        videoId = urlObj.pathname.split("/shorts/")[1]?.split("?")[0] || "";
      } else if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || "";
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.slice(1).split("?")[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch {
      return null;
    }
  };

  const embedUrl = getYouTubeEmbedUrl(exercise.videoUrl);

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
              webkit-playsinline="true"
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
        ) : embedUrl ? (
          <>
            <iframe
              src={`${embedUrl}?controls=1&modestbranding=1&rel=0`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={exercise.name}
            />
            <div className="absolute top-2 right-2 z-10">
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded">
                YT
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
          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-600 text-white rounded uppercase mb-1 inline-block">
            {exercise.type}
          </span>
          <p className="text-white text-xs font-semibold line-clamp-2">{exercise.name}</p>
        </div>
      </div>
    </div>
  );
}

export function InlineExerciseVideoGrid({ exerciseIds, onExerciseClick }: InlineExerciseVideoGridProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const results = await Promise.all(
          exerciseIds.map(async (id) => {
            const response = await fetch("/api/graphql", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: `
                  query GetExercise($id: String!) {
                    exercise(id: $id) {
                      id
                      name
                      videoUrl
                      cdnVideoUrl
                      type
                    }
                  }
                `,
                variables: { id },
              }),
            });
            const data = await response.json();
            return data.data?.exercise as Exercise | null;
          })
        );
        
        setExercises(results.filter((e): e is Exercise => e !== null));
      } catch (err) {
        console.error("Failed to load exercises:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [exerciseIds]);

  if (loading) {
    return (
      <div className="my-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {exerciseIds.map((id) => (
          <div key={id} className="aspect-[9/16] bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="my-4 bg-red-50 text-red-600 rounded-lg p-4 text-sm">
        No exercises found for IDs: {exerciseIds.join(", ")}
      </div>
    );
  }

  // Determine grid columns based on number of videos
  const gridCols = exercises.length === 1 
    ? "grid-cols-1 max-w-[200px]" 
    : exercises.length === 2 
    ? "grid-cols-2 max-w-[420px]" 
    : exercises.length === 3 
    ? "grid-cols-3 max-w-[620px]" 
    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={`my-6 grid ${gridCols} gap-3`}>
      {exercises.map((exercise) => (
        <VideoCard key={exercise.id} exercise={exercise} onExerciseClick={onExerciseClick} />
      ))}
    </div>
  );
}

