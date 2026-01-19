import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, UIMessage, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { search } from '@/lib/rag';
import { prisma } from '@/lib/prisma';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================================================
// PRE-FETCH CONTEXT (runs BEFORE Claude, ~200ms)
// ============================================================================

type RAGContext = {
  exercises: Array<{
    id: string;
    name: string;
    summary: string;
    videoUrl: string | null;
    mentionFormat: string;
    videoEmbedFormat: string | null;
  }>;
  anatomy: Array<{
    id: string;
    name: string;
    summary: string;
    mentionFormat: string;
  }>;
  guides: Array<{
    id: string;
    guideId: string | undefined;
    title: string;
    content: string;
    mentionFormat: string;
  }>;
};

async function prefetchContext(query: string): Promise<RAGContext> {
  // Single vector search across all collections - runs in ~100-200ms
  const results = await search(query, { limit: 15 });

  // Group by type
  const exerciseResults = results.filter(r => r.collection === 'Exercise');
  const anatomyResults = results.filter(r => r.collection === 'Anatomy');
  const sectionResults = results.filter(r => r.collection === 'Section');

  // Batch fetch video URLs for exercises (single query)
  let videoMap = new Map<string, string>();
  if (exerciseResults.length > 0) {
    const ids = exerciseResults.map(e => e.sourceId);
    const data = await prisma.exercise.findMany({
      where: { id: { in: ids } },
      select: { id: true, cdnVideoUrl: true, videoUrl: true },
    });
    data.forEach(e => {
      const url = e.cdnVideoUrl || e.videoUrl;
      if (url) videoMap.set(e.id, url);
    });
  }

  return {
    exercises: exerciseResults.slice(0, 8).map(e => {
      const videoUrl = videoMap.get(e.sourceId) || null;
      return {
        id: e.sourceId,
        name: e.name,
        summary: truncate(e.text, 200),
        videoUrl,
        mentionFormat: `@[${e.name}](exercise:${e.sourceId})`,
        videoEmbedFormat: videoUrl ? `!video[${e.name}](${e.sourceId}|${videoUrl})` : null,
      };
    }),
    anatomy: anatomyResults.slice(0, 5).map(a => ({
      id: a.sourceId,
      name: a.name,
      summary: truncate(a.text, 250),
      mentionFormat: `@[${a.name}](anatomy:${a.sourceId})`,
    })),
    guides: sectionResults.slice(0, 5).map(s => ({
      id: s.sourceId,
      guideId: s.guideId,
      title: s.name,
      content: truncate(s.text, 400), // More content for guides
      mentionFormat: `@[${s.name}](section:${s.guideId}/${s.sourceId})`,
    })),
  };
}

function truncate(text: string | null | undefined, max: number): string {
  if (!text || text.length <= max) return text || '';
  return text.slice(0, max) + '...';
}

function formatContext(ctx: RAGContext): string {
  const parts: string[] = [];

  if (ctx.exercises.length > 0) {
    parts.push('## Relevant Exercises\n' + ctx.exercises.map(e =>
      `- **${e.name}** (${e.id}): ${e.summary}${e.videoUrl ? ` [has video]` : ''}`
    ).join('\n'));
  }

  if (ctx.anatomy.length > 0) {
    parts.push('## Relevant Anatomy\n' + ctx.anatomy.map(a =>
      `- **${a.name}** (${a.id}): ${a.summary}`
    ).join('\n'));
  }

  if (ctx.guides.length > 0) {
    parts.push('## Relevant Guide Content\n' + ctx.guides.map(g =>
      `- **${g.title}**: ${g.content}`
    ).join('\n'));
  }

  return parts.join('\n\n');
}

// ============================================================================
// TOOLS - For workouts and detailed guide content
// ============================================================================

const tools = {
  getWorkout: tool({
    description: 'Get a specific workout program. Use when user asks for a workout routine or program.',
    inputSchema: z.object({
      region: z.string().describe('Body region: arms, chest, back, legs, shoulders'),
    }),
    execute: async ({ region }) => {
      const workout = await prisma.workout.findFirst({
        where: { primaryRegionId: region },
        select: {
          name: true,
          goal: true,
          blocks: {
            select: {
              label: true,
              schemeDesc: true,
              notes: true,
              exercises: {
                select: {
                  kind: true,
                  exercise: { select: { id: true, name: true } }
                },
                take: 6,
              }
            },
            take: 8,
          }
        }
      });

      if (!workout) return { error: `No workout for: ${region}` };

      return {
        name: workout.name,
        goal: workout.goal,
        blocks: workout.blocks.map(b => ({
          label: b.label,
          scheme: b.schemeDesc,
          notes: b.notes,
          exercises: b.exercises.map(e => ({
            name: e.exercise.name,
            kind: e.kind,
            mentionFormat: `@[${e.exercise.name}](exercise:${e.exercise.id})`,
          })),
        })),
      };
    },
  }),

  getGuideSection: tool({
    description: 'Get FULL content from a guide section. Use when you need detailed training advice, programming info, or methodology from the guides.',
    inputSchema: z.object({
      guideId: z.string().describe('Guide: arms, chest, back, legs, shoulders'),
      topic: z.string().describe('Topic to find: supersets, volume, intensity, anatomy, exercises, etc.'),
    }),
    execute: async ({ guideId, topic }) => {
      // Search for relevant sections in this guide
      const sections = await prisma.section.findMany({
        where: {
          guideId,
          OR: [
            { title: { contains: topic, mode: 'insensitive' } },
            { content: { contains: topic, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          content: true,
          kind: true,
        },
        take: 3,
      });

      if (sections.length === 0) {
        return { error: `No sections about "${topic}" in ${guideId} guide` };
      }

      return {
        guideId,
        sections: sections.map(s => ({
          title: s.title,
          kind: s.kind,
          content: s.content, // Full content, not truncated
          mentionFormat: `@[${s.title}](section:${guideId}/${s.id})`,
        })),
      };
    },
  }),
};

// ============================================================================
// SYSTEM PROMPT
// ============================================================================

const SYSTEM_PROMPT = `You ARE Uncle Rommy - a fitness AI with INSTANT access to accurate fitness data.

Your style:
- Short punchy sentences. Get to the point.
- CAPS for emphasis on key words
- Skip intros - just give them the goods

Response format:
- Keep responses SHORT and scannable
- Use bullet points and numbered lists

## CONTEXT PROVIDED

You'll receive relevant exercises, anatomy, and guide snippets AUTOMATICALLY with each query.
Use this context as a starting point.

## Tools

You have TWO tools:
1. **getWorkout** - Get a full workout program (use for workout/routine requests)
2. **getGuideSection** - Get FULL guide content on a topic (use for detailed training advice, programming, supersets, methodology)

If the pre-fetched context snippets mention something interesting but lack detail, use getGuideSection to get the full content.

## Link Format

Create clickable links: @[Name](type:id)
- exercise: @[Incline Press](exercise:incline_dumbbell_press)
- anatomy: @[Long Head](anatomy:triceps_long_head)
- section: @[Supersets](section:arms/arm-supersets)

## Video Embeds

Show exercise videos with: !video[Name](id|url)
Use when user wants to SEE an exercise or learn form.

## Available Guides
- arms, chest, back, legs, shoulders

## Rules
1. Start with pre-fetched context
2. Use getGuideSection for detailed programming/methodology info
3. Use getWorkout for workout requests
4. Create links using @[Name](type:id) format
5. Cite sources - mention which guide content comes from`;

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function POST(req: Request) {
  const { messages } = await req.json() as { messages: UIMessage[] };

  // Get the last user message for context fetching
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
  const query = lastUserMessage?.parts
    ?.filter((p: any) => p.type === 'text')
    .map((p: any) => p.text)
    .join('') || '';

  // PRE-FETCH: Get all relevant context BEFORE calling Claude (~200ms)
  const context = await prefetchContext(query);
  const contextString = formatContext(context);

  // Convert messages and inject context
  const modelMessages = await convertToModelMessages(messages);

  // Add context as a system message before the last user message
  if (contextString && modelMessages.length > 0) {
    // Insert context right before the response
    const contextMessage = {
      role: 'user' as const,
      content: `[CONTEXT FOR THIS QUERY]\n${contextString}\n\n[VIDEO EMBEDS AVAILABLE]\n${
        context.exercises
          .filter(e => e.videoEmbedFormat)
          .map(e => e.videoEmbedFormat)
          .join('\n')
      }`,
    };
    // Insert before last message
    modelMessages.splice(modelMessages.length - 1, 0, contextMessage);
  }

  // ONE Claude API call - context already injected
  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    tools,
    stopWhen: stepCountIs(2), // 1 for optional tool, 1 for response
  });

  return result.toUIMessageStreamResponse();
}
