"use client";

import { useEffect, useState } from "react";

interface Exercise {
  id: string;
  name: string;
  type: string;
  movementPattern: string;
  cueSummary: string | null;
  videoUrl: string | null;
  equipment: any;
  anatomyLinks?: Array<{
    role: string;
    anatomy: {
      id: string;
      name: string;
      kind?: string;
    };
  }>;
}

interface ExerciseDrawerProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExerciseDrawer({ exercise, isOpen, onClose }: ExerciseDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!exercise) return null;

  const equipment = exercise.equipment
    ? typeof exercise.equipment === "string"
      ? JSON.parse(exercise.equipment)
      : exercise.equipment
    : [];

  const primaryMuscles = exercise.anatomyLinks?.filter((link) => link.role === "primary") || [];
  const secondaryMuscles = exercise.anatomyLinks?.filter((link) => link.role === "secondary") || [];

  // Extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    
    try {
      const urlObj = new URL(url);
      let videoId = "";
      
      // Handle /shorts/ URLs
      if (urlObj.pathname.includes("/shorts/")) {
        videoId = urlObj.pathname.split("/shorts/")[1]?.split("?")[0] || "";
      }
      // Handle regular youtube.com URLs
      else if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || "";
      }
      // Handle youtu.be URLs
      else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.slice(1).split("?")[0];
      }
      
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
      console.error("Failed to parse video URL:", url, e);
      return null;
    }
  };

  const embedUrl = getYouTubeEmbedUrl(exercise.videoUrl);

  const drawerClasses = isMobile
    ? `fixed inset-x-0 bottom-0 max-h-[85vh] ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`
    : `fixed top-0 right-0 h-full w-full md:w-[600px] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`${drawerClasses} bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{exercise.name}</h2>
              <a
                href={`/exercises/${exercise.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition"
              >
                View full exercise page →
              </a>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold uppercase">
              {exercise.type}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {exercise.movementPattern}
            </span>
            {primaryMuscles.map((link) => (
              <a
                key={link.anatomy.id}
                href={`/anatomy/${link.anatomy.id}`}
                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition"
              >
                {link.anatomy.name}
              </a>
            ))}
            {secondaryMuscles.map((link) => (
              <a
                key={link.anatomy.id}
                href={`/anatomy/${link.anatomy.id}`}
                className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium hover:bg-yellow-200 transition"
              >
                {link.anatomy.name}
              </a>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Video Embed */}
          {embedUrl ? (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Video Tutorial</h3>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={embedUrl}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={exercise.name}
                />
              </div>
            </div>
          ) : exercise.videoUrl ? (
            <div>
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
              >
                <span className="text-xl">📹</span>
                Watch Video Tutorial
              </a>
            </div>
          ) : null}

          {/* Form Cues */}
          {exercise.cueSummary && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">Form Cues</h3>
              <p className="text-gray-700">{exercise.cueSummary}</p>
            </div>
          )}

          {/* Anatomy Targets */}
          {exercise.anatomyLinks && exercise.anatomyLinks.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Targets</h3>
              <div className="space-y-2">
                {exercise.anatomyLinks.map((link) => (
                  <div
                    key={link.anatomy.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <span
                      className={`text-xs px-2 py-1 rounded font-semibold ${
                        link.role === "primary"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {link.role}
                    </span>
                    <a
                      href={`/learn/${link.anatomy.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {link.anatomy.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment */}
          {equipment.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Equipment Needed</h3>
              <div className="flex flex-wrap gap-2">
                {equipment.map((item: string) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ID for reference */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <span className="font-mono">{exercise.id}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

