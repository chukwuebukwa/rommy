"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage, isToolUIPart } from "ai";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { MentionDrawer } from "./MentionDrawer";
import { ToolStatusIndicator, CompletedTools } from "./ToolStatusIndicator";
import { InlineChatVideo } from "./InlineChatVideo";
import { ChatSidebar } from "./ChatSidebar";
import { getDeviceId } from "@/lib/device-id";

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

type VideoEmbed = { exerciseId: string; exerciseName: string; videoUrl: string };

function extractMentionsAndVideos(content: string): {
  processedContent: string;
  mentions: Map<string, { name: string; type: string; id: string }>;
  videos: Map<string, VideoEmbed>;
} {
  const mentions = new Map<string, { name: string; type: string; id: string }>();
  const videos = new Map<string, VideoEmbed>();
  let counter = 0;

  // Extract video embeds first: !video[Name](id|url)
  const videoRegex = /!video\[([^\]]+)\]\(([^|]+)\|([^)]+)\)/g;
  let processedContent = content.replace(videoRegex, (_, name, id, url) => {
    const placeholder = `⟦VIDEO${counter++}⟧`;
    videos.set(placeholder, { exerciseId: id, exerciseName: name, videoUrl: url });
    return placeholder;
  });

  // Extract mentions: @[Name](type:id)
  const mentionRegex = /@\[([^\]]+)\]\(([^:]+):([^)]+)\)/g;
  processedContent = processedContent.replace(mentionRegex, (_, name, type, id) => {
    const placeholder = `⟦MENTION${counter++}⟧`;
    mentions.set(placeholder, { name, type, id });
    return placeholder;
  });

  return { processedContent, mentions, videos };
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

  const { processedContent, mentions, videos } = extractMentionsAndVideos(content);

  const replacePlaceholders = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    // Match both mention and video placeholders
    const placeholderRegex = /⟦(MENTION|VIDEO)(\d+)⟧/g;
    let lastIndex = 0;
    let match;

    while ((match = placeholderRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const placeholder = match[0];
      const placeholderType = match[1];

      if (placeholderType === 'VIDEO') {
        const video = videos.get(placeholder);
        if (video) {
          parts.push(
            <InlineChatVideo
              key={placeholder}
              exerciseId={video.exerciseId}
              exerciseName={video.exerciseName}
              videoUrl={video.videoUrl}
            />
          );
        }
      } else {
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

// Helper to extract tool invocations from message parts
// AI SDK v6 uses different tool part structure with type like "tool-searchExercises"
function getToolInvocations(message: UIMessage) {
  return message.parts
    .filter(part => isToolUIPart(part))
    .map(part => {
      // isToolUIPart confirms this is a tool part, access via any to get properties
      const toolPart = part as any;

      // Extract tool name from type (e.g., "tool-searchExercises" -> "searchExercises")
      // or from toolName property for dynamic tools
      const toolName = toolPart.type === 'dynamic-tool'
        ? toolPart.toolName
        : toolPart.type.replace('tool-', '');

      // Map v6 states to our simplified states
      let mappedState: 'partial-call' | 'call' | 'result' = 'call';
      if (toolPart.state === 'input-streaming') {
        mappedState = 'partial-call';
      } else if (toolPart.state === 'input-available') {
        mappedState = 'call';
      } else if (toolPart.state === 'output-available' || toolPart.state === 'output-error') {
        mappedState = 'result';
      }

      return {
        toolCallId: toolPart.toolCallId as string,
        toolName,
        state: mappedState,
        args: toolPart.input as Record<string, unknown> | undefined,
      };
    });
}

type ChatListItem = {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

export function Chat() {
  const router = useRouter();
  const transport = useMemo(() => new DefaultChatTransport({
    api: "/api/chat",
  }), []);

  const { messages, sendMessage, setMessages, status, error } = useChat({
    transport,
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    type: "exercise" | "anatomy" | "guide" | "section" | null;
    id: string | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
  });

  // Chat history state
  const [deviceId, setDeviceId] = useState<string>("");
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const lastSavedMessageCount = useRef(0);

  const isLoading = status === "streaming" || status === "submitted";

  // Initialize device ID
  useEffect(() => {
    const id = getDeviceId();
    setDeviceId(id);
  }, []);

  // Load chat list when device ID is available
  useEffect(() => {
    if (!deviceId) return;
    loadChatList();
  }, [deviceId]);

  const loadChatList = useCallback(async () => {
    if (!deviceId) return;
    try {
      const res = await fetch("/api/chats", {
        headers: { "x-device-id": deviceId },
      });
      if (res.ok) {
        const chats = await res.json();
        setChatList(chats);
      }
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  }, [deviceId]);

  // Save messages when they change (after streaming completes)
  useEffect(() => {
    if (!deviceId || !currentChatId || isLoading) return;
    if (messages.length === 0) return;
    if (messages.length <= lastSavedMessageCount.current) return;

    // Save new messages
    const saveNewMessages = async () => {
      for (let i = lastSavedMessageCount.current; i < messages.length; i++) {
        const msg = messages[i];
        const textContent = getMessageText(msg);
        if (!textContent.trim()) continue;

        await fetch(`/api/chats/${currentChatId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-device-id": deviceId,
          },
          body: JSON.stringify({
            role: msg.role,
            content: textContent,
          }),
        });
      }
      lastSavedMessageCount.current = messages.length;
      // Refresh chat list to update titles/timestamps
      loadChatList();
    };

    saveNewMessages();
  }, [deviceId, currentChatId, messages, isLoading, loadChatList]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = useCallback(async () => {
    if (!deviceId) return;

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": deviceId,
        },
      });

      if (res.ok) {
        const newChat = await res.json();
        setCurrentChatId(newChat.id);
        setMessages([]);
        lastSavedMessageCount.current = 0;
        loadChatList();
      }
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  }, [deviceId, setMessages, loadChatList]);

  const handleSelectChat = useCallback(async (chatId: string) => {
    if (!deviceId || chatId === currentChatId) return;

    setIsLoadingChat(true);
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        headers: { "x-device-id": deviceId },
      });

      if (res.ok) {
        const chat = await res.json();
        setCurrentChatId(chatId);

        // Convert stored messages to UIMessage format
        const uiMessages: UIMessage[] = chat.messages.map((msg: { id: string; role: string; content: string; createdAt: string }) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          parts: [{ type: "text", text: msg.content }],
          createdAt: new Date(msg.createdAt),
        }));

        setMessages(uiMessages);
        lastSavedMessageCount.current = uiMessages.length;
      }
    } catch (err) {
      console.error("Failed to load chat:", err);
    } finally {
      setIsLoadingChat(false);
    }
  }, [deviceId, currentChatId, setMessages]);

  const handleDeleteChat = useCallback(async (chatId: string) => {
    if (!deviceId) return;

    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
        headers: { "x-device-id": deviceId },
      });

      if (res.ok) {
        // If deleting current chat, clear it
        if (chatId === currentChatId) {
          setCurrentChatId(null);
          setMessages([]);
          lastSavedMessageCount.current = 0;
        }
        loadChatList();
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  }, [deviceId, currentChatId, setMessages, loadChatList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Create a new chat if we don't have one
    if (!currentChatId && deviceId) {
      try {
        const res = await fetch("/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-device-id": deviceId,
          },
        });
        if (res.ok) {
          const newChat = await res.json();
          setCurrentChatId(newChat.id);
          loadChatList();
        }
      } catch (err) {
        console.error("Failed to create chat:", err);
      }
    }

    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestedPrompt = async (prompt: string) => {
    // Create a new chat if we don't have one
    if (!currentChatId && deviceId) {
      try {
        const res = await fetch("/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-device-id": deviceId,
          },
        });
        if (res.ok) {
          const newChat = await res.json();
          setCurrentChatId(newChat.id);
          loadChatList();
        }
      } catch (err) {
        console.error("Failed to create chat:", err);
      }
    }

    sendMessage({ text: prompt });
  };

  const handleMentionClick = (type: MentionType, id: string) => {
    // For sections, the id format might be "guideId/sectionId" - extract just the sectionId
    const actualId = type === "section" && id.includes('/') ? id.split('/')[1] : id;
    setDrawerState({ isOpen: true, type, id: actualId });
  };

  const currentChatTitle = chatList.find(c => c.id === currentChatId)?.title || "New Chat";

  return (
    <>
      <div className="flex h-full bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
        {/* Sidebar */}
        <ChatSidebar
          chats={chatList}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-900/95">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors md:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="flex-1 text-white font-medium truncate">
              {currentChatId ? currentChatTitle : "Uncle Rommy"}
            </h1>
            <button
              onClick={handleNewChat}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="New Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

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
            // Message list - clean GPT-style layout
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6 space-y-6">
              {messages.map((message) => {
                const toolInvocations = message.role === "assistant" ? getToolInvocations(message) : [];
                const messageText = getMessageText(message);
                const hasText = messageText.trim().length > 0;
                const hasActiveTools = toolInvocations.some(t => t.state === 'call' || t.state === 'partial-call');
                const hasCompletedTools = toolInvocations.some(t => t.state === 'result');

                // User message - right-aligned subtle pill
                if (message.role === "user") {
                  return (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-[85%] px-4 py-2.5 rounded-3xl bg-gray-700/60 text-gray-100">
                        <div className="whitespace-pre-wrap text-[15px]">{messageText}</div>
                      </div>
                    </div>
                  );
                }

                // Assistant message - clean left-aligned, no bubble
                return (
                  <div key={message.id} className="text-gray-100">
                    {/* Tool status - show when active */}
                    {hasActiveTools && (
                      <div className="mb-3">
                        <ToolStatusIndicator toolCalls={toolInvocations} />
                      </div>
                    )}

                    {/* Show completed tools indicator */}
                    {hasCompletedTools && (
                      <div className={hasText ? "mb-3" : "mb-2"}>
                        <CompletedTools toolCalls={toolInvocations} />
                      </div>
                    )}

                    {/* Message content */}
                    {hasText && (
                      <MessageContent
                        content={messageText}
                        isUser={false}
                        onMentionClick={handleMentionClick}
                      />
                    )}

                    {/* Loading indicator - show when tools are running OR when tools finished but no text yet */}
                    {!hasText && (hasActiveTools || hasCompletedTools) && (
                      <div className="flex items-center gap-1.5 py-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading indicator for new response */}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-center gap-1.5 py-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
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

        {/* Input area - fixed on mobile above bottom nav */}
        <div className="fixed bottom-16 left-0 right-0 md:static md:bottom-auto border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm p-3 sm:p-4 z-30">
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
