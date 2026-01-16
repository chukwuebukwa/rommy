"use client";

import { useState } from "react";
import { AnatomyTabContent } from "./AnatomyTabContent";
import { GuideTabContent } from "./GuideTabContent";

interface Tab {
  id: string;
  label: string;
  type: "guide" | "anatomy";
  data: any;
  isCrossReference?: boolean;
}

interface LearnTabsProps {
  regionName: string;
  regionDescription: string | null;
  tabs: Tab[];
}

export function LearnTabs({
  regionName,
  regionDescription,
  tabs,
}: LearnTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-gray-100">{regionName}</h1>
        {regionDescription && (
          <p className="text-gray-400 mt-2">{regionDescription}</p>
        )}
      </div>

      {/* Horizontal Tab Navigation */}
      <div className="border-b border-gray-700">
        <nav className="flex gap-1 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 font-medium border-b-2 transition relative
                ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
                }
              `}
            >
              {tab.label}
              {tab.isCrossReference && (
                <span className="ml-1 text-xs text-purple-400" title="Also covered in this guide">
                  ✦
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {currentTab?.type === "guide" && (
          <GuideTabContent guide={currentTab.data} />
        )}
        {currentTab?.type === "anatomy" && (
          <AnatomyTabContent anatomyNode={currentTab.data} />
        )}
      </div>
    </div>
  );
}

