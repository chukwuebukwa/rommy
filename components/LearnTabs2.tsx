"use client";

import { useState, useMemo } from "react";
import { VideoGridTabContent } from "./VideoGridTabContent";

interface Tab {
  id: string;
  label: string;
  type: "anatomy";
  data: any;
  isCrossReference?: boolean;
}

interface LearnTabs2Props {
  regionName: string;
  regionDescription: string | null;
  tabs: Tab[];
}

export function LearnTabs2({
  regionName,
  regionDescription,
  tabs,
}: LearnTabs2Props) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());

  const currentTab = tabs.find((t) => t.id === activeTab);

  // Collect all unique anatomy targets from current tab's exercises
  const availableFilters = useMemo(() => {
    if (!currentTab?.data) return [];
    
    const anatomySet = new Set<string>();
    
    const collectAnatomy = (node: any) => {
      if (node.exerciseLinks) {
        node.exerciseLinks.forEach(({ exercise }: any) => {
          exercise.anatomyLinks?.forEach((link: any) => {
            anatomySet.add(link.anatomy.name);
          });
        });
      }
      if (node.children) {
        node.children.forEach((child: any) => collectAnatomy(child));
      }
    };
    
    collectAnatomy(currentTab.data);
    return Array.from(anatomySet).sort();
  }, [currentTab]);

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setSelectedFilters(newFilters);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Flush Top Navbar - Tabs 75% + Filter 25% */}
      <div className="flex-shrink-0 bg-white border-b flex items-stretch sticky top-0 z-10 md:static">
        {/* Tabs - 75% with horizontal scroll */}
        <nav 
          className="w-3/4 flex border-r border-gray-200 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400" 
          aria-label="Tabs"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db transparent'
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedFilters(new Set());
              }}
              className={`
                flex-shrink-0 px-4 py-2 font-semibold border-b-2 transition text-center text-xs whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Filter Dropdown - 25% */}
        <div className="w-1/4 px-2 py-1.5 relative flex items-center">
          <select
            className="w-full px-2 py-1.5 pr-14 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                toggleFilter(e.target.value);
                e.target.value = "";
              }
            }}
          >
            <option value="">
              {selectedFilters.size > 0 
                ? `Filtering by ${selectedFilters.size} ${selectedFilters.size === 1 ? 'target' : 'targets'}` 
                : 'Filter by anatomy...'}
            </option>
            {availableFilters.map((filter) => (
              <option key={filter} value={filter}>
                {selectedFilters.has(filter) ? `✓ ${filter}` : filter}
              </option>
            ))}
          </select>
          
          {/* Clear filters button - positioned absolutely inside */}
          {selectedFilters.size > 0 && (
            <button
              onClick={() => setSelectedFilters(new Set())}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-blue-600 hover:text-blue-800 font-medium"
              title="Clear all filters"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Video Grid Content */}
      <div className="flex-1 overflow-y-auto">
        {currentTab?.type === "anatomy" && (
          <VideoGridTabContent 
            anatomyNode={currentTab.data} 
            selectedFilters={selectedFilters}
          />
        )}
      </div>
    </div>
  );
}

