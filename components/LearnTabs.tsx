"use client";

import { useState } from "react";
import { AnatomyTabContent } from "./AnatomyTabContent";
import { GuideTabContent } from "./GuideTabContent";

interface Tab {
  id: string;
  label: string;
  type: "guide" | "anatomy";
  data: any;
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
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold">{regionName}</h1>
        {regionDescription && (
          <p className="text-gray-600 mt-2">{regionDescription}</p>
        )}
      </div>

      {/* Horizontal Tab Navigation */}
      <div className="border-b">
        <nav className="flex gap-1 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 font-medium border-b-2 transition
                ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
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

