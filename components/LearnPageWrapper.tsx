"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LearnConfigModal } from "./LearnConfigModal";

interface LearnPageWrapperProps {
  regionId: string;
  children: React.ReactNode;
}

export function LearnPageWrapper({ regionId, children }: LearnPageWrapperProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    // Refresh the page to show new configuration
    router.refresh();
  };

  return (
    <div className="relative">
      {children}

      {/* Floating Configure Button */}
      <button
        onClick={() => setIsConfigOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-40 flex items-center space-x-2"
        title="Configure tabs"
      >
        <span className="text-xl">⚙️</span>
        <span className="hidden sm:inline font-medium">Configure</span>
      </button>

      {/* Config Modal */}
      <LearnConfigModal
        regionId={regionId}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

