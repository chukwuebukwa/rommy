"use client";

import { MentionRenderer } from "./MentionRenderer";

interface Guide {
  id: string;
  title: string;
  author: string | null;
  sections: Section[];
}

interface Section {
  id: string;
  kind: string;
  title: string;
  order: number;
  content: string;
  images: string[] | null;
}

interface GuideTabContentProps {
  guide: Guide;
}

export function GuideTabContent({ guide }: GuideTabContentProps) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-gray-700 pb-4">
        <h2 className="text-3xl font-bold text-gray-100">{guide.title}</h2>
        {guide.author && <p className="text-gray-400 mt-2">By {guide.author}</p>}
      </div>

      {guide.sections
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <GuideSection key={section.id} section={section} />
        ))}
    </div>
  );
}

interface GuideSectionProps {
  section: Section;
}

function GuideSection({ section }: GuideSectionProps) {
  const images = section.images || [];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded uppercase font-semibold">
          {section.kind}
        </span>
        <h3 className="text-2xl font-bold text-gray-100">{section.title}</h3>
      </div>

      <div className="prose prose-invert max-w-none">
        <MentionRenderer content={section.content} />
      </div>

      {images.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h4 className="font-semibold text-gray-100 mb-3">📸 Images</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((imagePath) => (
              <img
                key={imagePath}
                src={`/guides/${imagePath}`}
                alt={section.title}
                className="rounded-lg border border-gray-700 shadow-sm hover:shadow-md transition cursor-pointer w-full h-auto object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

