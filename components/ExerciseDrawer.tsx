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
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle mount/unmount with animation
  useEffect(() => {
    if (isOpen && exercise) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, exercise]);

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

  if (!shouldRender || !exercise) return null;

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
    ? `fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl ${
        isAnimating ? "translate-y-0" : "translate-y-full"
      }`
    : `fixed top-0 right-0 h-full w-full md:w-[600px] ${
        isAnimating ? "translate-x-0" : "translate-x-full"
      }`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`${drawerClasses} bg-gray-900 shadow-xl z-50 transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        {/* Header - minimal */}
        <div className="sticky top-0 bg-gray-900 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-100">{exercise.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Video - prominent, right at top */}
          {embedUrl && (
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={exercise.name}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          {/* No embed but has video URL */}
          {!embedUrl && exercise.videoUrl && (
            <a
              href={exercise.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-xl font-medium"
            >
              Watch Video
            </a>
          )}

          {/* Form Cues - most important after video */}
          {exercise.cueSummary && (
            <div className="p-3 bg-blue-900/30 rounded-xl">
              <p className="text-sm text-gray-200 leading-relaxed">{exercise.cueSummary}</p>
            </div>
          )}

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-1 bg-blue-800/60 text-blue-200 rounded text-xs font-medium uppercase">
              {exercise.type}
            </span>
            <span className="px-2 py-1 bg-gray-700/60 text-gray-300 rounded text-xs">
              {exercise.movementPattern}
            </span>
            {primaryMuscles.map((link) => (
              <span key={link.anatomy.id} className="px-2 py-1 bg-green-800/50 text-green-300 rounded text-xs">
                {link.anatomy.name}
              </span>
            ))}
            {secondaryMuscles.map((link) => (
              <span key={link.anatomy.id} className="px-2 py-1 bg-yellow-800/50 text-yellow-300 rounded text-xs">
                {link.anatomy.name}
              </span>
            ))}
          </div>

          {/* Equipment */}
          {equipment.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Equipment</h3>
              <div className="flex flex-wrap gap-1.5">
                {equipment.map((item: string) => (
                  <span key={item} className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Targets */}
          {exercise.anatomyLinks && exercise.anatomyLinks.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Targets</h3>
              <div className="space-y-1.5">
                {exercise.anatomyLinks.map((link) => (
                  <a
                    key={link.anatomy.id}
                    href={`/anatomy/${link.anatomy.id}`}
                    className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition"
                  >
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      link.role === "primary" ? "bg-green-800/60 text-green-300" : "bg-yellow-800/60 text-yellow-300"
                    }`}>
                      {link.role}
                    </span>
                    <span className="text-sm text-gray-200">{link.anatomy.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Link to full page */}
          <a
            href={`/exercises/${exercise.id}`}
            className="block text-center text-sm text-gray-400 hover:text-gray-200 py-2"
          >
            View full exercise page →
          </a>
        </div>
      </div>
    </>
  );
}

