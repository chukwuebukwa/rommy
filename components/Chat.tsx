"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, UIMessage } from "ai";
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { MentionDrawer } from "./MentionDrawer";

const SUGGESTED_PROMPTS = [
  { text: "Exercises for tricep long head?", icon: "💪" },
  { text: "Build bigger shoulders", icon: "🎯" },
  { text: "Give me a chest workout", icon: "🏋️" },
  { text: "Compound vs isolation?", icon: "📚" },
];

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map(part => part.text)
    .join('');
}

function extractMentions(content: string): {
  processedContent: string;
  mentions: Map<string, { name: string; type: string; id: string }>;
} {
  const mentions = new Map<string, { name: string; type: string; id: string }>();
  const mentionRegex = /@\[([^\]]+)\]\(([^:]+):([^)]+)\)/g;
  let counter = 0;

  const processedContent = content.replace(mentionRegex, (_, name, type, id) => {
    const placeholder = `⟦MENTION${counter++}⟧`;
    mentions.set(placeholder, { name, type, id });
    return placeholder;
  });

  return { processedContent, mentions };
}

type MentionType = "exercise" | "anatomy" | "guide" | "section";

function MessageContent({
  content,
  isUser,
  onMentionClick,
}: {
  content: string;
  isUser: boolean;
  onMentionClick: (type: MentionType, id: string) => void;
}) {
  if (isUser) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  const { processedContent, mentions } = extractMentions(content);

  const replacePlaceholders = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const placeholderRegex = /⟦MENTION(\d+)⟧/g;
    let lastIndex = 0;
    let match;

    while ((match = placeholderRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const placeholder = match[0];
      const mention = mentions.get(placeholder);
      if (mention) {
        const styles: Record<string, { bg: string; text: string; icon: string }> = {
          exercise: { bg: "bg-blue-500/15 active:bg-blue-500/30 border-blue-500/30", text: "text-blue-400", icon: "🏋️" },
          guide: { bg: "bg-emerald-500/15 active:bg-emerald-500/30 border-emerald-500/30", text: "text-emerald-400", icon: "📖" },
          section: { bg: "bg-amber-500/15 active:bg-amber-500/30 border-amber-500/30", text: "text-amber-400", icon: "📄" },
          anatomy: { bg: "bg-purple-500/15 active:bg-purple-500/30 border-purple-500/30", text: "text-purple-400", icon: "🧬" },
        };
        const style = styles[mention.type] || styles.anatomy;
        parts.push(
          <button
            key={placeholder}
            onClick={() => onMentionClick(mention.type as MentionType, mention.id)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer border touch-manipulation ${style.bg} ${style.text}`}
          >
            <span className="text-[10px] sm:text-xs">{style.icon}</span>
            <span className="truncate max-w-[150px] sm:max-w-none">{mention.name}</span>
          </button>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  const processChildrenWithMentions = (children: React.ReactNode): React.ReactNode => {
    if (typeof children === "string") {
      const replaced = replacePlaceholders(children);
      return replaced.length === 1 ? replaced[0] : <>{replaced}</>;
    }
    if (Array.isArray(children)) {
      return children.map((child, i) => {
        if (typeof child === "string") {
          const replaced = replacePlaceholders(child);
          return replaced.length === 1 ? <span key={i}>{replaced[0]}</span> : <span key={i}>{replaced}</span>;
        }
        return child;
      });
    }
    return children;
  };

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-li:leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-base sm:text-lg font-bold mt-3 mb-2 first:mt-0 text-white">{processChildrenWithMentions(children)}</h1>,
          h2: ({ children }) => <h2 className="text-sm sm:text-base font-bold mt-3 mb-2 first:mt-0 text-white">{processChildrenWithMentions(children)}</h2>,
          h3: ({ children }) => <h3 className="text-xs sm:text-sm font-semibold mt-2 mb-1 first:mt-0 text-gray-100">{processChildrenWithMentions(children)}</h3>,
          p: ({ children }) => (
            <p className="mb-2 sm:mb-3 last:mb-0 text-sm sm:text-base">{processChildrenWithMentions(children)}</p>
          ),
          ul: ({ children }) => <ul className="list-disc pl-4 sm:pl-5 mb-2 sm:mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 sm:pl-5 mb-2 sm:mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => (
            <li className="text-sm sm:text-base">{processChildrenWithMentions(children)}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{processChildrenWithMentions(children)}</strong>
          ),
          em: ({ children }) => <em className="italic text-gray-300">{processChildrenWithMentions(children)}</em>,
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return <code className="bg-gray-700/50 px-1 py-0.5 rounded text-xs font-mono text-gray-200">{children}</code>;
            }
            return <code className={className}>{children}</code>;
          },
          pre: ({ children }) => <pre className="bg-gray-800/50 p-2 sm:p-3 rounded-lg text-xs overflow-x-auto mb-2 sm:mb-3 border border-gray-700/50">{children}</pre>,
          hr: () => <hr className="my-3 sm:my-4 border-gray-700/50" />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

export function Chat() {
  const router = useRouter();
  const transport = useMemo(() => new TextStreamChatTransport({
    api: "/api/chat",
  }), []);

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    type: "exercise" | "anatomy" | null;
    id: string | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage({ text: prompt });
  };

  const handleMentionClick = (type: MentionType, id: string) => {
    if (type === "guide") {
      router.push(`/guides/${id}`);
    } else if (type === "section") {
      const [guideId, sectionId] = id.split('/');
      router.push(`/guides/${guideId}?section=${sectionId}`);
    } else {
      setDrawerState({ isOpen: true, type, id });
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {messages.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center min-h-full text-center px-4 py-8 sm:py-12">
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-3xl sm:text-4xl">💪</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 border-2 border-gray-900 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs">✓</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                Uncle Rommy
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-sm px-4">
                Your AI training assistant
              </p>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-md sm:max-w-xl px-2">
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt.text)}
                    className="group flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 active:bg-gray-800 active:border-blue-500/50 transition-all text-left touch-manipulation"
                  >
                    <span className="text-xl sm:text-2xl flex-shrink-0">{prompt.icon}</span>
                    <span className="text-xs sm:text-sm text-gray-300 line-clamp-2">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Message list
            <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar - hidden on mobile for user messages */}
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-blue-600 hidden sm:flex"
                      : "bg-gradient-to-br from-blue-500 to-purple-600"
                  }`}>
                    <span className="text-xs sm:text-sm">{message.role === "user" ? "👤" : "💪"}</span>
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`flex-1 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white ml-auto max-w-[90%] sm:max-w-[85%]"
                        : "bg-gray-800/80 text-gray-100 border border-gray-700/50 max-w-[95%] sm:max-w-[85%]"
                    }`}
                  >
                    <MessageContent
                      content={getMessageText(message)}
                      isUser={message.role === "user"}
                      onMentionClick={handleMentionClick}
                    />
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-xs sm:text-sm">💪</span>
                  </div>
                  <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="mx-3 sm:mx-4 mb-2 px-3 sm:px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs sm:text-sm">
            {error.message}
          </div>
        )}

        {/* Input area - sticky with safe area */}
        <div className="border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-2 sm:gap-3 items-center bg-gray-800 rounded-xl border border-gray-700 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all px-3 sm:px-4 py-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 sm:p-2.5 bg-blue-600 text-white rounded-lg active:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mention Drawer */}
      <MentionDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState({ isOpen: false, type: null, id: null })}
        type={drawerState.type}
        id={drawerState.id}
      />
    </>
  );
}
