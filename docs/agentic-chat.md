# Agentic Chat System

## Overview

The chat system uses Claude with dynamic tool calling to provide accurate fitness information. Instead of pre-fetching RAG context, the AI decides which tools to call based on the user's question.

## Architecture

```
User Input → Chat API → streamText with tools (maxSteps=5)
                              ↓
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
        searchExercises  getWorkout    getAnatomyDetails
              ↓               ↓               ↓
              └───────────────┼───────────────┘
                              ↓
                    UIMessageStreamResponse
                              ↓
                    Frontend (Tool Status UI)
```

## Available Tools

| Tool | Description |
|------|-------------|
| `searchExercises` | Search by name, muscle, movement pattern, or type |
| `searchAnatomy` | Look up muscles, groups, or body regions |
| `getExerciseDetails` | Get full details for a specific exercise |
| `getAnatomyDetails` | Get full details for a specific muscle/body part |
| `getGuide` | Get training guides with their sections |
| `getWorkout` | Get workout programs with blocks and exercises |
| `searchSections` | Search guide content for training advice |
| `ragSearch` | Semantic search fallback for general questions |

## Key Files

- `/lib/ai/tools.ts` - Tool definitions using AI SDK v6 format
- `/app/api/chat/route.ts` - Chat API with tool orchestration
- `/components/Chat.tsx` - Chat UI with tool status display
- `/components/ToolStatusIndicator.tsx` - Tool status components
- `/components/InlineChatVideo.tsx` - Inline video embed component

## Tool Response Format

All tools return a `mentionFormat` field for creating clickable links:

```typescript
mentionFormat: '@[Exercise Name](exercise:exercise_id)'
```

Link types:
- `exercise:id` - Exercise link
- `anatomy:id` - Anatomy/muscle link
- `guide:id` - Guide link
- `section:guideId/sectionId` - Guide section link

## Video Embeds

Exercise tools also return `videoUrl` and `videoEmbedFormat` for inline video embeds:

```typescript
videoUrl: 'https://cdn.example.com/exercise.mp4'
videoEmbedFormat: '!video[Exercise Name](exercise_id|video_url)'
```

The AI uses video embeds when:
- User asks to SEE an exercise or wants a demonstration
- Explaining proper form
- Showing 1-3 key exercises

Videos appear as collapsible embeds in the chat:
- Collapsed: Play button with exercise name
- Expanded: Full video player (CDN mp4 or YouTube)

## Frontend Tool Status

The chat shows tool execution status in real-time:
- Active tools display with spinner and description
- Completed tools show as compact badges with checkmarks

## Configuration

- `maxSteps: 5` - Allows up to 5 tool calls per response
- Uses `DefaultChatTransport` for tool invocation streaming
- Model: `claude-sonnet-4-20250514`

## Example Queries

1. "What exercises target the triceps long head?"
   - Calls: `searchExercises` or `searchAnatomy`

2. "Give me a chest workout"
   - Calls: `getWorkout` with region filter

3. "Tell me about the biceps then find exercises for it"
   - Multi-step: `getAnatomyDetails` → `searchExercises`

4. "Show me how to do an incline press"
   - Calls: `searchExercises` or `getExerciseDetails`
   - Returns video embed using `videoEmbedFormat`
