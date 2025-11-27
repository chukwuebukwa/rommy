"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  name: string;
  level: number;
}

interface TableOfContentsProps {
  sections: TOCItem[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="sticky top-6 w-64 flex-shrink-0">
      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full px-4 py-3 bg-gray-100 border-b border-gray-200 flex items-center justify-between hover:bg-gray-200 transition"
        >
          <span className="font-bold text-gray-900 text-sm">Contents</span>
          <span className="text-xs text-gray-600">{isCollapsed ? "show" : "hide"}</span>
        </button>

        {!isCollapsed && (
          <nav className="p-3">
            <ul className="space-y-1">
              {sections.map((section) => {
                const isActive = activeId === section.id;
                
                // Map levels to proper indentation
                const indentClass = {
                  1: "",
                  2: "ml-3",
                  3: "ml-6",
                  4: "ml-9",
                  5: "ml-12",
                }[section.level] || "";
                
                return (
                  <li key={section.id} className={indentClass}>
                    <a
                      href={`#${section.id}`}
                      className={`block px-2 py-1.5 rounded text-sm transition ${
                        isActive
                          ? "bg-blue-100 text-blue-900 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${section.level === 1 ? "font-semibold" : ""}`}
                    >
                      {section.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

