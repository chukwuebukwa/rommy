"use client";

import { useState, useEffect, useRef } from "react";

interface Exercise {
  id: string;
  name: string;
  videoUrl: string | null;
  cdnVideoUrl: string | null;
  type: string;
}

interface InlineExerciseVideoProps {
  exerciseId: string;
  onExerciseClick?: (id: string) => void;
}

export function InlineExerciseVideo({ exerciseId, onExerciseClick }: InlineExerciseVideoProps) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
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
            variables: { id: exerciseId },
          }),
        });

        const data = await response.json();
        if (data.data?.exercise) {
          setExercise(data.data.exercise);
        } else {
          setError("Exercise not found");
        }
      } catch (err) {
        setError("Failed to load exercise");
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

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

  const handleMouseEnter = () => {
    if (videoRef.current && exercise?.cdnVideoUrl) {
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

  if (loading) {
    return (
      <div className="my-4 bg-gray-100 rounded-lg p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="my-4 bg-red-50 text-red-600 rounded-lg p-4 text-sm">
        {error || "Exercise not found"}: {exerciseId}
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(exercise.videoUrl);
  const hasVideo = exercise.cdnVideoUrl || embedUrl;

  if (!hasVideo) {
    return (
      <button
        onClick={() => onExerciseClick?.(exercise.id)}
        className="my-4 block bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition text-left w-full max-w-md cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏋️</span>
          <div>
            <p className="font-semibold text-gray-900">{exercise.name}</p>
            <p className="text-sm text-gray-500">{exercise.type} • No video available</p>
          </div>
        </div>
      </button>
    );
  }

  const handleClick = () => {
    if (onExerciseClick && exercise) {
      onExerciseClick(exercise.id);
    }
  };

  return (
    <div className="my-6">
      {/* Video Container */}
      <div
        className="relative aspect-[9/16] max-w-[300px] bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
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
            
            {/* Play indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}

            {/* CDN Badge */}
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-xs font-bold bg-green-500 text-white rounded">
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

            {/* YouTube Badge */}
            <div className="absolute top-2 right-2 z-10">
              <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded">
                YT
              </span>
            </div>
          </>
        ) : null}

        {/* Exercise info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pointer-events-none">
          <span className="px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded uppercase mb-1 inline-block">
            {exercise.type}
          </span>
          <p className="text-white text-sm font-semibold">{exercise.name}</p>
        </div>
      </div>

    </div>
  );
}

