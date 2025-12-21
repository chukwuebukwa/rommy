"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

export interface LearnBreadcrumbProps {
  currentRegion: {
    id: string;
    name: string;
  };
  allRegions: Array<{
    id: string;
    name: string;
  }>;
  basePath?: string; // e.g. "/learn" or "/learn2"
}

export function LearnBreadcrumb({ currentRegion, allRegions, basePath = "/learn" }: LearnBreadcrumbProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const emojiMap: Record<string, string> = {
    arms: "💪",
    back: "🔙",
    chest: "🫁",
    legs: "🦵",
    shoulders: "👐",
    core: "🎯",
  };

  const breadcrumbContent = (
    <nav className="flex items-center space-x-2 text-sm">
      <Link
        href="/"
        className="text-gray-500 hover:text-gray-700 transition"
      >
        Home
      </Link>
      <span className="text-gray-400">/</span>
      
      <div className="relative" data-dropdown>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-gray-900 font-medium hover:text-blue-600 transition"
        >
          <span>{emojiMap[currentRegion.id] || "🦾"}</span>
          <span>{currentRegion.name}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-1">
              {allRegions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => {
                    router.push(`${basePath}/${region.id}`);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition flex items-center gap-2 ${
                    region.id === currentRegion.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span>{emojiMap[region.id] || "🦾"}</span>
                  <span>{region.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  if (!mounted) return null;

  const container = document.getElementById("breadcrumb-container");
  if (!container) return null;

  return createPortal(breadcrumbContent, container);
}

