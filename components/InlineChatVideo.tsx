"use client";

import { useState } from "react";

interface InlineChatVideoProps {
  exerciseId: string;
  exerciseName: string;
  videoUrl: string;
}

export function InlineChatVideo({ exerciseId, exerciseName, videoUrl }: InlineChatVideoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if it's a CDN video (mp4) or YouTube
  const isCdnVideo = videoUrl.includes('.mp4') || videoUrl.includes('b-cdn.net');
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

  // Extract YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
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

  if (hasError) {
    return null;
  }

  // Collapsed state - compact play button
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="my-1.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-700/50 hover:bg-gray-700 active:bg-gray-600 border border-gray-600/50 rounded-lg transition-all group touch-manipulation"
      >
        <div className="w-6 h-6 rounded-full bg-blue-500/80 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
          <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-xs text-gray-300 max-w-[150px] truncate">{exerciseName}</span>
      </button>
    );
  }

  // Expanded state - show video (compact style)
  return (
    <div className="my-3 max-w-[280px] sm:max-w-[320px] rounded-xl overflow-hidden bg-gray-800/40">
      {/* Video */}
      <div className="relative aspect-video bg-black/50">
        {isCdnVideo ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain"
            onError={() => setHasError(true)}
          >
            Your browser does not support the video tag.
          </video>
        ) : isYouTube ? (
          <iframe
            src={getYouTubeEmbedUrl(videoUrl) || undefined}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={exerciseName}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
            >
              Open Video
            </a>
          </div>
        )}
      </div>
      {/* Caption with minimize button */}
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs text-gray-400 truncate">{exerciseName}</span>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
          title="Minimize"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
