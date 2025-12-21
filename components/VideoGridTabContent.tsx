"use client";

import { useRef, useState } from "react";

interface Exercise {
  id: string;
  name: string;
  videoUrl: string | null;
  cdnVideoUrl: string | null;
  type: string;
  movementPattern: string;
  anatomyLinks?: Array<{
    role: string;
    anatomy: {
      id: string;
      name: string;
    };
  }>;
}

interface AnatomyNode {
  id: string;
  name: string;
  children?: AnatomyNode[];
  exerciseLinks?: Array<{
    role: string;
    exercise: Exercise;
  }>;
}

interface VideoGridTabContentProps {
  anatomyNode: AnatomyNode;
  selectedFilters: Set<string>;
}

export function VideoGridTabContent({ anatomyNode, selectedFilters }: VideoGridTabContentProps) {
  // Collect all exercises from this node and all children recursively
  const collectExercises = (node: AnatomyNode): Exercise[] => {
    const exercises: Exercise[] = [];
    
    // Add exercises from this node
    if (node.exerciseLinks) {
      node.exerciseLinks.forEach(({ exercise }) => {
        // Only include exercises with video URLs (CDN or YouTube)
        if (exercise.cdnVideoUrl || exercise.videoUrl) {
          exercises.push(exercise);
        }
      });
    }
    
    // Recursively add exercises from children
    if (node.children) {
      node.children.forEach(child => {
        exercises.push(...collectExercises(child));
      });
    }
    
    return exercises;
  };

  // Get unique exercises (in case same exercise appears multiple times)
  const allExercises = collectExercises(anatomyNode);
  const uniqueExercises = Array.from(
    new Map(allExercises.map(ex => [ex.id, ex])).values()
  );

  // Filter exercises based on selected anatomy filters
  const filteredExercises = selectedFilters.size === 0 
    ? uniqueExercises 
    : uniqueExercises.filter(exercise => {
        // Check if exercise has any of the selected anatomy targets
        return exercise.anatomyLinks?.some(link => 
          selectedFilters.has(link.anatomy.name)
        );
      });

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
    } catch (e) {
      return null;
    }
  };

  // Video Card Component with hover preview
  function VideoCard({ exercise }: { exercise: Exercise }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const embedUrl = getYouTubeEmbedUrl(exercise.videoUrl);

    const handleMouseEnter = () => {
      setIsHovering(true);
      if (videoRef.current && exercise.cdnVideoUrl) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Autoplay might be blocked, that's okay
        });
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    return (
      <div
        className="relative aspect-[9/16] bg-gray-900 overflow-hidden group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {exercise.cdnVideoUrl ? (
          <>
            {/* HTML5 Video Player (CDN) */}
            <video
              ref={videoRef}
              src={exercise.cdnVideoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              muted
              playsInline
              preload="metadata"
            />
            
            {/* Play indicator when not hovering */}
            {!isHovering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                  <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}

            {/* CDN Badge */}
            <div className="absolute top-2 right-2 z-10">
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-green-500 text-white rounded">
                CDN
              </span>
            </div>
          </>
        ) : embedUrl ? (
          <>
            {/* YouTube Fallback */}
            <iframe
              src={`${embedUrl}?controls=1&modestbranding=1&rel=0`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={exercise.name}
            />
            
            {/* YouTube Badge */}
            <div className="absolute top-2 right-2 z-10">
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-600 text-white rounded">
                YT
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <p className="text-white text-xs text-center px-2">
              {exercise.name}
            </p>
          </div>
        )}

        {/* Overlay with tags and exercise name */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none flex flex-col justify-end p-2">
          {/* Tags at top of text area */}
          <div className="flex flex-wrap gap-1 mb-1">
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-600 text-white rounded uppercase">
              {exercise.type}
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-700 text-white rounded">
              {exercise.movementPattern}
            </span>
            {/* Anatomy target tags */}
            {exercise.anatomyLinks?.map((link) => (
              <span
                key={`${link.anatomy.id}-${link.role}`}
                className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                  link.role === 'primary' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-yellow-500 text-black'
                }`}
              >
                {link.anatomy.name}
              </span>
            ))}
          </div>
          {/* Exercise name */}
          <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">
            {exercise.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-0 md:px-8">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-[2px] bg-[#0a0a0a]">
          {filteredExercises.map((exercise) => (
            <VideoCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </div>
    </>
  );
}

