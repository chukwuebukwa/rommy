"use client";

// Tool name to human-readable description
const TOOL_LABELS: Record<string, string> = {
  getWorkout: 'Loading workout program',
  getGuideSection: 'Getting guide content',
};

interface ToolCall {
  toolCallId: string;
  toolName: string;
  state: 'partial-call' | 'call' | 'result';
  args?: Record<string, unknown>;
}

interface ToolStatusIndicatorProps {
  toolCalls: ToolCall[];
}

export function ToolStatusIndicator({ toolCalls }: ToolStatusIndicatorProps) {
  const activeTools = toolCalls.filter(tc => tc.state === 'call' || tc.state === 'partial-call');

  if (activeTools.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Spinner />
      <span>{TOOL_LABELS[activeTools[0].toolName] || 'Working'}...</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Completed tools - very minimal, just show count
interface CompletedToolsProps {
  toolCalls: ToolCall[];
}

export function CompletedTools({ toolCalls }: CompletedToolsProps) {
  const completedTools = toolCalls.filter(tc => tc.state === 'result');

  if (completedTools.length === 0) {
    return null;
  }

  // Just show a subtle indicator
  return (
    <div className="text-xs text-gray-500 mb-2">
      Searched {completedTools.length} source{completedTools.length > 1 ? 's' : ''}
    </div>
  );
}
