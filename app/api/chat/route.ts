import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { search, SearchResult } from '@/lib/rag';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You ARE Uncle Rommy. Be CONCISE - no fluff, no filler.

Your style:
- Short punchy sentences. Get to the point.
- CAPS for emphasis on key words
- Skip the intros and preambles - just give them the goods
- Only add commentary if it's actually useful

Response format:
- Keep responses SHORT and scannable
- Use bullet points and numbered lists
- Skip unnecessary explanations

CRITICAL - Links:
Format clickable links as: @[Name](type:id)

Types:
- exercise: @[Incline Press](exercise:incline_dumbbell_press)
- anatomy: @[Long Head](anatomy:triceps_long_head)
- guide: @[Chest Guide](guide:chest)
- section: @[Mindset](section:chest/chest-mindset) - format is guideId/sectionId

Rules:
1. ONLY use items from the provided context
2. Use EXACT IDs from context
3. If something isn't in context, skip it

End with "---" and "**Sources:**"`;

const GUIDES = [
  { id: 'arms', title: 'ARMS - Conceal and Carry Pythons' },
  { id: 'back', title: 'BACK - The King Kong Guide' },
  { id: 'chest', title: 'CHEST - The Chesticles Guide' },
  { id: 'legs', title: 'LEGS - The Leg Day Guide' },
  { id: 'shoulders', title: 'SHOULDERS' },
];

function formatRAGContext(results: SearchResult[]): string {
  if (results.length === 0) return '';

  const grouped = results.reduce((acc, result) => {
    if (!acc[result.collection]) {
      acc[result.collection] = [];
    }
    acc[result.collection].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  let context = '\n\nRELEVANT CONTEXT FROM DATABASE:\n';

  for (const [collection, items] of Object.entries(grouped)) {
    context += `\n--- ${collection} ---\n`;
    for (const item of items) {
      if (collection === 'Section' && item.guideId) {
        // Section links include guideId for navigation
        context += `\n[${item.name}] (type: section, guideId: ${item.guideId}, sectionId: ${item.sourceId})\n${item.text}\n`;
      } else {
        const type = collection === 'Exercise' ? 'exercise' : 'anatomy';
        context += `\n[${item.name}] (ID: ${item.sourceId}, type: ${type})\n${item.text}\n`;
      }
    }
  }

  // Always include guides
  context += '\n--- Guides ---\n';
  for (const guide of GUIDES) {
    context += `[${guide.title}] (ID: ${guide.id}, type: guide)\n`;
  }

  return context;
}

function getTextFromUIMessage(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map(part => part.text)
    .join('');
}

export async function POST(req: Request) {
  const { messages } = await req.json() as { messages: UIMessage[] };

  // Get the latest user message for RAG search
  const lastUserMessage = messages
    .filter((m) => m.role === 'user')
    .pop();

  let systemPromptWithContext = SYSTEM_PROMPT;

  if (lastUserMessage) {
    const userQuery = getTextFromUIMessage(lastUserMessage);
    if (userQuery) {
      try {
        // Search each collection separately to ensure we get exercises with IDs
        const [exerciseResults, anatomyResults, sectionResults] = await Promise.all([
          search(userQuery, { collections: ['Exercise'], limit: 20 }),
          search(userQuery, { collections: ['Anatomy'], limit: 8 }),
          search(userQuery, { collections: ['Section'], limit: 5 }),
        ]);

        const allResults = [...exerciseResults, ...anatomyResults, ...sectionResults];
        const ragContext = formatRAGContext(allResults);
        if (ragContext) {
          systemPromptWithContext = SYSTEM_PROMPT + ragContext;
          console.log('[RAG] Found', allResults.length, 'results (E:', exerciseResults.length, 'A:', anatomyResults.length, 'S:', sectionResults.length, ') for:', userQuery);
        }
      } catch (error) {
        console.error('[RAG] Search failed:', error);
      }
    }
  }

  // Convert UI messages to model messages format
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPromptWithContext,
    messages: modelMessages,
  });

  return result.toTextStreamResponse();
}
