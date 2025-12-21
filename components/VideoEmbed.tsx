"use client";

interface VideoEmbedProps {
  videoUrl: string | null;
  title: string;
}

export function VideoEmbed({ videoUrl, title }: VideoEmbedProps) {
  if (!videoUrl) return null;

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

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  if (embedUrl) {
    return (
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Video Tutorial</h3>
        <div className="relative w-full max-h-[500px]" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        </div>
      </div>
    );
  }

  // Fallback to link if can't embed
  return (
    <div>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
      >
        <span className="text-xl">📹</span>
        Watch Video Tutorial
      </a>
    </div>
  );
}

