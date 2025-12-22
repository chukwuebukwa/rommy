"use client";

import React, { useState } from "react";
import { MentionDrawer } from "./MentionDrawer";

interface MentionRendererProps {
  content: string;
}

export function MentionRenderer({ content }: MentionRendererProps) {
  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    type: "exercise" | "anatomy" | null;
    id: string | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
  });

  // Parse mentions: @[Name](type:id)
  const renderContent = () => {
    const mentionRegex = /@\[([^\]]+)\]\(([^:]+):([^)]+)\)/g;
    const parts: (string | React.ReactNode)[] = [];
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

      parts.push(
        <button
          key={key++}
          onClick={() =>
            setDrawerState({
              isOpen: true,
              type: type as "exercise" | "anatomy",
              id,
            })
          }
          className="text-blue-600 hover:underline cursor-pointer"
          title={`${type}: ${name}`}
        >
          {name}
        </button>
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
    <>
      <div className="whitespace-pre-wrap leading-relaxed">{renderContent()}</div>

      <MentionDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState({ isOpen: false, type: null, id: null })}
        type={drawerState.type}
        id={drawerState.id}
      />
    </>
  );
}

