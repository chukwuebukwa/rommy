"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Drawer } from "vaul";

interface MentionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: "exercise" | "anatomy" | null;
  id: string | null;
}

export function MentionDrawer({ isOpen, onClose, type, id }: MentionDrawerProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isOpen || !type || !id) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/mention-data?type=${type}&id=${id}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching mention data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, type, id]);

  const content = (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <p className="text-gray-400">Loading details...</p>
          </div>
        </div>
      ) : data ? (
        <>
          {type === "exercise" ? (
            <ExerciseDetails exercise={data} />
          ) : (
            <AnatomyDetails anatomy={data} />
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          No data available
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  // Mobile: Use Vaul Drawer (bottom sheet)
  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl z-50 flex flex-col max-h-[90vh]">
            {/* Drag Handle */}
            <div className="flex justify-center py-3 border-b border-gray-700">
              <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {type === "exercise" ? "🏋️" : "🦾"}
                  </span>
                  <div>
                    <div className="text-xs opacity-90">
                      {type === "exercise" ? "Exercise" : "Anatomy"}
                    </div>
                    <div className="text-lg font-bold">
                      {loading ? "Loading..." : data?.name || "Details"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {type === "anatomy" && id && (
                    <Link
                      href={`/anatomy/editor/${id}`}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition text-sm"
                      onClick={onClose}
                    >
                      ✏️
                    </Link>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                  >
                    <svg
                      className="w-5 h-5"
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
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {content}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  // Desktop: Side drawer
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[600px] bg-gray-900 shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {type === "exercise" ? "🏋️" : "🦾"}
              </span>
              <div>
                <div className="text-sm opacity-90">
                  {type === "exercise" ? "Exercise" : "Anatomy"}
                </div>
                <div className="text-xl font-bold">
                  {loading ? "Loading..." : data?.name || "Details"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {type === "anatomy" && id && (
                <Link
                  href={`/anatomy/editor/${id}`}
                  className="px-3 py-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition text-sm font-medium"
                  onClick={onClose}
                >
                  ✏️ Edit
                </Link>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              >
                <svg
                  className="w-6 h-6"
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
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {content}
        </div>
      </div>
    </>
  );
}

function ExerciseDetails({ exercise }: { exercise: any }) {
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

  const youtubeEmbedUrl = getYouTubeEmbedUrl(exercise.videoUrl);

  return (
    <div className="space-y-6">
      {/* Video */}
      {(exercise.cdnVideoUrl || youtubeEmbedUrl) && (
        <div className="flex justify-center -mx-6 -mt-6 bg-black">
          {exercise.cdnVideoUrl ? (
            <div className="aspect-[9/16] h-[70vh] max-h-[600px]">
              <video
                src={exercise.cdnVideoUrl}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-auto object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="aspect-[9/16] h-[70vh] max-h-[600px] w-full">
              <iframe
                src={`${youtubeEmbedUrl}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={exercise.name}
              />
            </div>
          )}
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Type</div>
          <div className="font-semibold capitalize text-gray-100">{exercise.type}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Pattern</div>
          <div className="font-semibold capitalize text-gray-100">
            {exercise.movementPattern?.replace(/_/g, " ")}
          </div>
        </div>
      </div>

      {/* Equipment */}
      {exercise.equipment && exercise.equipment.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-100 mb-2">🏋️ Equipment</h3>
          <div className="flex flex-wrap gap-2">
            {exercise.equipment.map((item: string) => (
              <span
                key={item}
                className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Form Cues */}
      {exercise.cueSummary && (
        <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded">
          <h3 className="font-semibold mb-2 text-yellow-300">💡 Form Cues</h3>
          <p className="text-yellow-200">{exercise.cueSummary}</p>
        </div>
      )}

      {/* Targeted Anatomy */}
      {exercise.anatomyLinks && exercise.anatomyLinks.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-100 mb-3">🎯 Targets</h3>
          <div className="space-y-2">
            {exercise.anatomyLinks.map((link: any) => (
              <div
                key={link.anatomy.id}
                className={`p-3 rounded-lg ${
                  link.role === "primary"
                    ? "bg-blue-900/50 border-2 border-blue-700"
                    : "bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-100">{link.anatomy.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      link.role === "primary"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {link.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExerciseVideoGrid({ exerciseLinks }: { exerciseLinks: any[] }) {
  const [fullscreenVideo, setFullscreenVideo] = useState<{
    url: string;
    name: string;
    type: 'cdn' | 'youtube';
    anatomyLinks?: Array<{
      role: string;
      anatomy: {
        id: string;
        name: string;
      };
    }>;
  } | null>(null);

  // Sort exercises: primary first, then secondary
  const sortedLinks = [...exerciseLinks].sort((a, b) => {
    if (a.role === "primary" && b.role !== "primary") return -1;
    if (a.role !== "primary" && b.role === "primary") return 1;
    return 0;
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

  return (
    <>
      <div className="grid grid-cols-3 gap-1 max-h-80 overflow-y-auto">
      {sortedLinks.map((link: any) => {
        const exercise = link.exercise;
        const embedUrl = getYouTubeEmbedUrl(exercise.videoUrl);
        
        return (
          <button
            key={exercise.id}
            onClick={() => {
              if (exercise.cdnVideoUrl) {
                setFullscreenVideo({ 
                  url: exercise.cdnVideoUrl, 
                  name: exercise.name, 
                  type: 'cdn',
                  anatomyLinks: exercise.anatomyLinks
                });
              } else if (embedUrl) {
                setFullscreenVideo({ 
                  url: embedUrl, 
                  name: exercise.name, 
                  type: 'youtube',
                  anatomyLinks: exercise.anatomyLinks
                });
              }
            }}
            className="relative aspect-[9/16] bg-gray-900 overflow-hidden group rounded-sm cursor-pointer"
          >
            {exercise.cdnVideoUrl ? (
              <>
                <video
                  src={exercise.cdnVideoUrl}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute top-0.5 right-0.5">
                  <span className="px-0.5 py-0.5 text-[7px] font-bold bg-green-500 text-white rounded">
                    CDN
                  </span>
                </div>
              </>
            ) : embedUrl ? (
              <>
                <img
                  src={`https://img.youtube.com/vi/${embedUrl.split('/embed/')[1]?.split('?')[0]}/mqdefault.jpg`}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={exercise.name}
                />
                <div className="absolute top-0.5 right-0.5">
                  <span className="px-0.5 py-0.5 text-[7px] font-bold bg-red-600 text-white rounded">
                    YT
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                    <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <p className="text-white text-[8px] text-center px-1">{exercise.name}</p>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none flex flex-col justify-end p-1">
              <div className="flex flex-wrap gap-0.5 mb-0.5">
                <span className={`px-0.5 py-0.5 text-[7px] font-semibold rounded ${
                  link.role === "primary" ? "bg-green-600 text-white" : "bg-yellow-500 text-black"
                }`}>
                  {link.role}
                </span>
              </div>
              <p className="text-white text-[9px] font-semibold line-clamp-2 leading-tight">
                {exercise.name}
              </p>
            </div>
          </button>
        );
      })}
      </div>

      {/* Fullscreen Video Modal */}
      {fullscreenVideo && (
        <div
          className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center"
          onClick={() => setFullscreenVideo(null)}
        >
          <button
            onClick={() => setFullscreenVideo(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Exercise Name Label */}
          <div className="absolute top-4 left-4 z-10">
            <h2 className="text-white text-lg md:text-xl font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
              {fullscreenVideo.name}
            </h2>
          </div>

          {/* Anatomy Badges - Bottom Right */}
          {fullscreenVideo.anatomyLinks && fullscreenVideo.anatomyLinks.length > 0 && (
            <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-2">
              {fullscreenVideo.anatomyLinks
                .filter((link) => link.role === "primary")
                .map((link) => (
                  <span
                    key={`${link.anatomy.id}-primary`}
                    className="px-2 py-1 text-xs md:text-sm font-semibold bg-green-600 text-white rounded-md backdrop-blur-sm shadow-lg"
                  >
                    {link.anatomy.name}
                  </span>
                ))}
              {fullscreenVideo.anatomyLinks
                .filter((link) => link.role === "secondary")
                .map((link) => (
                  <span
                    key={`${link.anatomy.id}-secondary`}
                    className="px-2 py-1 text-xs md:text-sm font-semibold bg-yellow-500 text-black rounded-md backdrop-blur-sm shadow-lg"
                  >
                    {link.anatomy.name}
                  </span>
                ))}
            </div>
          )}
          
          <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            {fullscreenVideo.type === 'cdn' ? (
              <video
                src={fullscreenVideo.url}
                className="max-w-full max-h-full"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : (
              <iframe
                src={`${fullscreenVideo.url}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                className="w-full h-full max-w-4xl max-h-[80vh]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={fullscreenVideo.name}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function AnatomyDetails({ anatomy }: { anatomy: any }) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const getImageSrc = (path: string) => {
    if (path.startsWith('guides:')) {
      return `/guides/${path.replace('guides:', '')}`;
    } else if (path.startsWith('anatomy:')) {
      return `/anatomy/${path.replace('anatomy:', '')}`;
    }
    return `/anatomy/${path}`;
  };

  return (
    <div className="space-y-6">
      {/* Fullscreen Image Overlay */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen view"
            className="max-w-full max-h-full object-contain p-4"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
            {anatomy.kind}
          </span>
          <span className="text-gray-400">ID: {anatomy.id}</span>
        </div>

        {anatomy.description && (
          <p className="text-gray-300 leading-relaxed">{anatomy.description}</p>
        )}
      </div>

      {/* Images */}
      {anatomy.meta?.images && anatomy.meta.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {anatomy.meta.images.map((imagePath: string, i: number) => (
            <button
              key={i}
              onClick={() => setFullscreenImage(getImageSrc(imagePath))}
              className="relative group"
            >
              <img
                src={getImageSrc(imagePath)}
                alt={`${anatomy.name} image ${i + 1}`}
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="bg-black/50 rounded-full p-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Role Summary */}
      {anatomy.roleSummary && (
        <div className="bg-purple-900/30 border-l-4 border-purple-500 p-4 rounded">
          <h3 className="font-semibold mb-2 text-purple-300">📋 Role</h3>
          <p className="text-purple-200">{anatomy.roleSummary}</p>
        </div>
      )}

      {/* Primary Functions */}
      {anatomy.primaryFunctions && anatomy.primaryFunctions.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-100 mb-2">⚡ Primary Functions</h3>
          <ul className="space-y-2">
            {anatomy.primaryFunctions.map((func: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-400 mt-1">✓</span>
                <span>{func}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Aesthetic Notes */}
      {anatomy.aestheticNotes && anatomy.aestheticNotes.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-100 mb-2">💪 Aesthetic Notes</h3>
          <ul className="space-y-2">
            {anatomy.aestheticNotes.map((note: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-blue-400 mt-1">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Exercises - Video Grid */}
      {anatomy.exerciseLinks && anatomy.exerciseLinks.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-100 mb-3">🏋️ Related Exercises ({anatomy.exerciseLinks.length})</h3>
          <ExerciseVideoGrid exerciseLinks={anatomy.exerciseLinks} />
        </div>
      )}

      {/* Children */}
      {anatomy.children && anatomy.children.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-100 mb-3">🔗 Sub-parts ({anatomy.children.length})</h3>
          <div className="grid grid-cols-1 gap-2">
            {anatomy.children.map((child: any) => (
              <div
                key={child.id}
                className="p-3 bg-blue-900/30 rounded-lg border border-blue-800"
              >
                <div className="font-medium text-gray-100">{child.name}</div>
                <div className="text-sm text-gray-400">{child.kind}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

