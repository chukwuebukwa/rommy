"use client";

import Link from "next/link";
import { useState } from "react";

interface MentionRendererProps {
  content: string;
}

export function MentionRenderer({ content }: MentionRendererProps) {
  const [hoveredMention, setHoveredMention] = useState<{
    type: string;
    id: string;
    name: string;
  } | null>(null);

  // Parse mentions: @[Name](type:id)
  const renderContent = () => {
    const mentionRegex = /@\[([^\]]+)\]\(([^:]+):([^)]+)\)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = mentionRegex.exec(content)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      const name = match[1];
      const type = match[2]; // "exercise" or "anatomy"
      const id = match[3];

      // Determine link and style
      const href = type === "exercise" ? `/exercises/${id}` : `/anatomy/${id}`;
      const bgColor =
        type === "exercise" ? "bg-green-100 hover:bg-green-200" : "bg-blue-100 hover:bg-blue-200";
      const textColor = type === "exercise" ? "text-green-800" : "text-blue-800";
      const emoji = type === "exercise" ? "🏋️" : "🦾";

      parts.push(
        <Link
          key={key++}
          href={href}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${bgColor} ${textColor} font-medium transition hover:shadow-sm`}
          onMouseEnter={() => setHoveredMention({ type, id, name })}
          onMouseLeave={() => setHoveredMention(null)}
          title={`${type}: ${name}`}
        >
          <span>{emoji}</span>
          <span>{name}</span>
        </Link>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <div className="relative">
      <div className="whitespace-pre-wrap leading-relaxed">{renderContent()}</div>

      {/* Optional: Hover preview (can expand this later) */}
      {hoveredMention && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm z-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {hoveredMention.type === "exercise" ? "🏋️" : "🦾"}
            </span>
            <div>
              <div className="font-bold">{hoveredMention.name}</div>
              <div className="text-xs text-gray-500">
                {hoveredMention.type === "exercise" ? "Exercise" : "Anatomy"} • {hoveredMention.id}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Click to view details →
          </div>
        </div>
      )}
    </div>
  );
}

