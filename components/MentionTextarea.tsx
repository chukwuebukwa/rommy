"use client";

import { useState, useRef, useEffect } from "react";

interface MentionItem {
  id: string;
  name: string;
  type: "exercise" | "anatomy";
  kind?: string; // For anatomy: region, group, muscle, part
}

interface MentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  exercises: MentionItem[];
  anatomyNodes: MentionItem[];
}

export function MentionTextarea({
  value,
  onChange,
  placeholder,
  rows = 8,
  exercises,
  anatomyNodes,
}: MentionTextareaProps) {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mentionStartRef = useRef<number>(-1);

  // Combine and filter items based on query
  const allItems = [...exercises, ...anatomyNodes];
  const filteredItems = mentionQuery
    ? allItems.filter((item) =>
        item.name.toLowerCase().includes(mentionQuery.toLowerCase())
      )
    : allItems;

  // Limit to 10 items
  const displayItems = filteredItems.slice(0, 10);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    onChange(newValue);

    // Check if @ was just typed
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    console.log("Text changed:", { 
      lastAtIndex, 
      textBeforeCursor, 
      exercisesCount: exercises.length,
      anatomyCount: anatomyNodes.length 
    });

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      // Check if there's a space after @ (which would end the mention)
      if (!textAfterAt.includes(" ") && !textAfterAt.includes("\n")) {
        console.log("Showing mentions with query:", textAfterAt);
        setMentionQuery(textAfterAt);
        setShowMentions(true);
        mentionStartRef.current = lastAtIndex;
        setSelectedIndex(0);

        // Calculate position for dropdown
        if (textareaRef.current) {
          const textarea = textareaRef.current;
          const { top, left } = getCaretCoordinates(textarea, cursorPos);
          setMentionPosition({ top: top + 20, left });
        }
        return;
      }
    }

    // Hide mentions if space or newline after @
    setShowMentions(false);
  };

  const insertMention = (item: MentionItem) => {
    if (!textareaRef.current || mentionStartRef.current === -1) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBefore = value.substring(0, mentionStartRef.current);
    const textAfter = value.substring(cursorPos);

    // Format: @[Name](type:id)
    const mention = `@[${item.name}](${item.type}:${item.id})`;
    const newValue = textBefore + mention + " " + textAfter;

    onChange(newValue);
    setShowMentions(false);
    setMentionQuery("");
    mentionStartRef.current = -1;

    // Move cursor after the mention
    setTimeout(() => {
      const newCursorPos = textBefore.length + mention.length + 1;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, displayItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && displayItems.length > 0) {
      e.preventDefault();
      insertMention(displayItems[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowMentions(false);
    }
  };

  // Simple caret position calculator
  function getCaretCoordinates(
    element: HTMLTextAreaElement,
    position: number
  ): { top: number; left: number } {
    const div = document.createElement("div");
    const style = getComputedStyle(element);
    
    // Copy styles
    for (const prop of style) {
      div.style.setProperty(prop, style.getPropertyValue(prop));
    }
    
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.textContent = element.value.substring(0, position);
    
    document.body.appendChild(div);
    const span = document.createElement("span");
    span.textContent = element.value.substring(position) || ".";
    div.appendChild(span);
    
    const rect = span.getBoundingClientRect();
    const textareaRect = element.getBoundingClientRect();
    
    document.body.removeChild(div);
    
    return {
      top: rect.top - textareaRect.top + element.scrollTop,
      left: rect.left - textareaRect.left,
    };
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-y"
      />

      {showMentions && displayItems.length > 0 && (
        <div
          className="fixed bg-white border-2 border-blue-500 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
          style={{
            top: textareaRef.current ? textareaRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 0,
            left: textareaRef.current ? textareaRef.current.getBoundingClientRect().left + window.scrollX : 0,
            minWidth: "300px",
            maxWidth: "500px",
            zIndex: 9999,
          }}
        >
          {displayItems.map((item, index) => (
            <button
              key={`${item.type}-${item.id}`}
              onClick={() => insertMention(item)}
              className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition ${
                index === selectedIndex ? "bg-blue-100" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    item.type === "exercise"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {item.type === "exercise" ? "🏋️" : "🦾"}{" "}
                  {item.type === "exercise" ? "Exercise" : item.kind || "Anatomy"}
                </span>
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="text-xs text-gray-500 ml-8">{item.id}</div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
        <span>
          💡 Type <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">@</kbd> to
          mention exercises or anatomy nodes
        </span>
        <span className="text-xs">
          {exercises.length} exercises, {anatomyNodes.length} anatomy nodes available
          {showMentions && <span className="ml-2 text-blue-600 font-bold">▶ Dropdown Active</span>}
        </span>
      </div>
    </div>
  );
}

