"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface Guide {
  id: string;
  title: string;
  author: string | null;
  primaryRegion?: {
    id: string;
    name: string;
  } | null;
}

interface GuideHeaderProps {
  guide: Guide;
}

export function GuideHeader({ guide }: GuideHeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const breadcrumbContainer = document.getElementById("breadcrumb-container");

  if (!breadcrumbContainer) return null;

  return createPortal(
    <div className="flex items-center gap-4">
      <h1 className="text-lg font-bold">{guide.title}</h1>
      {guide.author && (
        <>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-600">By {guide.author}</span>
        </>
      )}
      {guide.primaryRegion && (
        <>
          <span className="text-gray-300">•</span>
          <Link
            href={`/learn/${guide.primaryRegion.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            {guide.primaryRegion.name}
          </Link>
        </>
      )}
      <span className="text-gray-300">•</span>
      <Link
        href={`/guides/editor/${guide.id}`}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Edit
      </Link>
    </div>,
    breadcrumbContainer
  );
}

