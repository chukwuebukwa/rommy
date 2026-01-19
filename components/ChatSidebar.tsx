"use client";

import { useState } from "react";

type ChatItem = {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

type ChatSidebarProps = {
  chats: ChatItem[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

export function ChatSidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (deletingId) return;
    setDeletingId(chatId);
    await onDeleteChat(chatId);
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Chats</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onNewChat}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
              title="New Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors md:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto scroll-touch scrollbar-hide">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No chats yet. Start a new conversation!
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat.id);
                    onClose();
                  }}
                  className={`group flex items-center gap-2 p-3 min-h-[52px] rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                    currentChatId === chat.id
                      ? "bg-gray-700/70 text-white"
                      : "text-gray-300 hover:bg-gray-800/70 active:bg-gray-800 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">
                      {chat.title || "New Chat"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(chat.updatedAt)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, chat.id)}
                    disabled={deletingId === chat.id}
                    className="p-1.5 rounded opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 hover:bg-gray-700 transition-all disabled:opacity-50"
                    title="Delete chat"
                  >
                    {deletingId === chat.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
