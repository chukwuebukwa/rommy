"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: "/", icon: "🏠", label: "Home" },
    { href: "/guides", icon: "📖", label: "Guides" },
    { href: "/learn2", icon: "🎓", label: "Learn" },
    { href: "/exercises", icon: "🏋️", label: "Exercises" },
    { href: "/anatomy", icon: "🦾", label: "Anatomy" },
    { href: "/chat", icon: "💬", label: "Chat" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isFullWidth = pathname === "/anatomy-explorer";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar - hidden on mobile */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30
          w-64 bg-gray-900 text-white flex-shrink-0 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          hidden md:block
        `}
      >
        <div className="p-6">
          <Link href="/" className="block">
            <h1 className="text-xl font-bold mb-1">💪 Rommy's Guide</h1>
            <p className="text-xs text-gray-400">Training Encyclopedia</p>
          </Link>
        </div>

        <nav className="px-3 pb-6">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition ${
                  isActive(item.href)
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-6 mt-6 border-t border-gray-800">
            <div className="px-3 mb-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Guides by Region
              </div>
            </div>
            
            {[
              { id: "shoulders", icon: "👐", label: "Shoulders" },
              { id: "back", icon: "🔙", label: "Back" },
              { id: "arms", icon: "💪", label: "Arms" },
              { id: "chest", icon: "🫁", label: "Chest" },
            ].map((region) => (
              <Link
                key={region.id}
                href={`/guides/${region.id}`}
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition ${
                  pathname === `/guides/${region.id}`
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="mr-2">{region.icon}</span>
                {region.label}
              </Link>
            ))}
          </div>

          <div className="pt-6 mt-6 border-t border-gray-800">
            <div className="px-3 mb-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Tools
              </div>
            </div>
            
            <Link
              href="/anatomy-explorer"
              className={`flex items-center px-3 py-2 text-sm rounded-lg transition ${
                pathname === "/anatomy-explorer"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="mr-2">🔗</span>
              Anatomy Explorer
            </Link>
            <Link
              href="/db"
              className={`flex items-center px-3 py-2 text-sm rounded-lg transition ${
                pathname === "/db"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="mr-2">🗄️</span>
              Database
            </Link>
          </div>

          {/* Dark Mode Toggle */}
          <div className="pt-6 mt-6 border-t border-gray-800">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <div className="flex items-center">
                <span className="mr-3 text-lg">{theme === "dark" ? "🌙" : "☀️"}</span>
                <span>Dark Mode</span>
              </div>
              {/* Toggle Switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  theme === "dark" ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    theme === "dark" ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content - add bottom padding on mobile for bottom nav */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className={isFullWidth ? "w-full" : "max-w-7xl mx-auto"}>
            {children}
          </div>
        </main>

        {/* iOS-style Bottom Navigation - mobile only */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-40 safe-area-bottom">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
                  isActive(item.href)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <span className="text-2xl mb-0.5">{item.icon}</span>
                <span className={`text-[10px] font-medium ${
                  isActive(item.href) ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          {/* Safe area spacer for iOS home indicator */}
          <div className="h-safe-area-bottom bg-white/90 dark:bg-gray-900/90" />
        </nav>
      </div>
    </div>
  );
}
