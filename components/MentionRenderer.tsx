"use client";

import React, { useState } from "react";
import { MentionDrawer } from "./MentionDrawer";
import { InlineExerciseVideo } from "./InlineExerciseVideo";
import { InlineExerciseVideoGrid } from "./InlineExerciseVideoGrid";

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

  // Render inline markdown (bold, italic, links, mentions) within a line
  const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Try to match patterns in order of priority
      
      // 1. Mentions: @[Name](type:id)
      const mentionMatch = remaining.match(/^@\[([^\]]+)\]\(([^:]+):([^)]+)\)/);
      if (mentionMatch) {
        const [full, name, type, id] = mentionMatch;
        parts.push(
          <button
            key={`${keyPrefix}-${key++}`}
            onClick={() =>
              setDrawerState({
                isOpen: true,
                type: type as "exercise" | "anatomy",
                id,
              })
            }
            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
            title={`${type}: ${name}`}
          >
            {name}
          </button>
        );
        remaining = remaining.slice(full.length);
        continue;
      }

      // 2. Inline images: ![alt](path)
      const imageMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (imageMatch) {
        const [full, alt, src] = imageMatch;
        // Check if it's a guide image path (no http) or external URL
        const imageSrc = src.startsWith('http') ? src : `/guides/${src}`;
        parts.push(
          <img
            key={`${keyPrefix}-${key++}`}
            src={imageSrc}
            alt={alt || 'Image'}
            className="inline-block max-w-full h-auto rounded-lg my-2"
          />
        );
        remaining = remaining.slice(full.length);
        continue;
      }

      // 3. Links: [text](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const [full, linkText, url] = linkMatch;
        parts.push(
          <a
            key={`${keyPrefix}-${key++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {linkText}
          </a>
        );
        remaining = remaining.slice(full.length);
        continue;
      }

      // 4. Bold: **text** or __text__
      const boldMatch = remaining.match(/^(\*\*|__)(.+?)\1/);
      if (boldMatch) {
        const [full, , boldText] = boldMatch;
        parts.push(
          <strong key={`${keyPrefix}-${key++}`} className="font-bold">
            {boldText}
          </strong>
        );
        remaining = remaining.slice(full.length);
        continue;
      }

      // 5. Italic: *text* or _text_ (but not ** or __)
      const italicMatch = remaining.match(/^(\*|_)(?!\1)(.+?)\1(?!\1)/);
      if (italicMatch) {
        const [full, , italicText] = italicMatch;
        parts.push(
          <em key={`${keyPrefix}-${key++}`} className="italic">
            {italicText}
          </em>
        );
        remaining = remaining.slice(full.length);
        continue;
      }

      // 6. Inline code: `code`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        const [full, codeText] = codeMatch;
        parts.push(
          <code
            key={`${keyPrefix}-${key++}`}
            className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400"
          >
            {codeText}
          </code>
        );
        remaining = remaining.slice(full.length);
        continue;
      }

      // No match - take one character and continue
      // But try to batch plain text for efficiency
      const nextSpecialIndex = remaining.search(/[@!\[\*_`]/);
      if (nextSpecialIndex === -1) {
        // No more special chars, add rest as plain text
        parts.push(remaining);
        break;
      } else if (nextSpecialIndex === 0) {
        // Special char at start but didn't match patterns - treat as literal
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        // Add plain text up to next special char
        parts.push(remaining.slice(0, nextSpecialIndex));
        remaining = remaining.slice(nextSpecialIndex);
      }
    }

    return parts;
  };

  // Render content with block-level markdown (headings) and inline formatting
  const renderContent = () => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const key = `line-${i}`;

      // Heading 1: # text
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={key} className="text-3xl font-bold mt-10 mb-4 tracking-tight text-gray-900 dark:text-gray-100">
            {renderInline(line.slice(2), key)}
          </h1>
        );
        continue;
      }

      // Heading 2: ## text
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={key} className="text-2xl font-bold mt-8 mb-3 tracking-tight text-gray-900 dark:text-gray-100">
            {renderInline(line.slice(3), key)}
          </h2>
        );
        continue;
      }

      // Heading 3: ### text
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={key} className="text-xl font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-200">
            {renderInline(line.slice(4), key)}
          </h3>
        );
        continue;
      }

      // Heading 4: #### text
      if (line.startsWith("#### ")) {
        elements.push(
          <h4 key={key} className="text-lg font-semibold mt-5 mb-2 text-gray-800 dark:text-gray-200">
            {renderInline(line.slice(5), key)}
          </h4>
        );
        continue;
      }

      // Horizontal rule: --- or ***
      if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
        elements.push(<hr key={key} className="my-6 border-gray-300 dark:border-gray-700" />);
        continue;
      }

      // Exercise video grid: !videos[id1, id2, id3]
      const videoGridMatch = line.match(/^!videos\[([^\]]+)\]$/);
      if (videoGridMatch) {
        const exerciseIds = videoGridMatch[1]
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0);
        elements.push(
          <InlineExerciseVideoGrid 
            key={key} 
            exerciseIds={exerciseIds}
            onExerciseClick={(id) => setDrawerState({ isOpen: true, type: "exercise", id })}
          />
        );
        continue;
      }

      // Exercise video embed (single): !video[exercise_id]
      const videoMatch = line.match(/^!video\[([^\]]+)\]$/);
      if (videoMatch) {
        const exerciseId = videoMatch[1];
        elements.push(
          <InlineExerciseVideo 
            key={key} 
            exerciseId={exerciseId}
            onExerciseClick={(id) => setDrawerState({ isOpen: true, type: "exercise", id })}
          />
        );
        continue;
      }

      // Bullet list: - item or * item
      if (/^[-*]\s/.test(line)) {
        elements.push(
          <li key={key} className="ml-5 list-disc text-gray-700 dark:text-gray-300 leading-relaxed">
            {renderInline(line.slice(2), key)}
          </li>
        );
        continue;
      }

      // Numbered list: 1. item
      if (/^\d+\.\s/.test(line)) {
        const textStart = line.indexOf(". ") + 2;
        elements.push(
          <li key={key} className="ml-5 list-decimal text-gray-700 dark:text-gray-300 leading-relaxed">
            {renderInline(line.slice(textStart), key)}
          </li>
        );
        continue;
      }

      // Empty line - add spacing
      if (line.trim() === "") {
        elements.push(<div key={key} className="h-5" />);
        continue;
      }

      // Regular paragraph with inline formatting
      elements.push(
        <p key={key} className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
          {renderInline(line, key)}
        </p>
      );
    }

    return elements;
  };

  return (
    <>
      <div className="leading-relaxed">{renderContent()}</div>

      <MentionDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState({ isOpen: false, type: null, id: null })}
        type={drawerState.type}
        id={drawerState.id}
      />
    </>
  );
}

