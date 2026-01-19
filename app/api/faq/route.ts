import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWeaviateClient } from "@/lib/weaviate";

const FAQ_GUIDE_ID = "faq";

// Ensure the FAQ guide exists
async function ensureFaqGuide() {
  const existing = await prisma.guide.findUnique({ where: { id: FAQ_GUIDE_ID } });
  if (!existing) {
    await prisma.guide.create({
      data: {
        id: FAQ_GUIDE_ID,
        slug: "faq",
        title: "Training Notes & FAQ",
        author: "Uncle Rommy",
      },
    });
  }
}

// Index a section to Weaviate
async function indexToWeaviate(section: { id: string; title: string; content: string }) {
  const client = getWeaviateClient();

  // Delete existing if any
  try {
    await client.data.deleter().withClassName("Section").withId(section.id).do();
  } catch {
    // Ignore if doesn't exist
  }

  // Create new
  await client.data
    .creator()
    .withClassName("Section")
    .withProperties({
      sourceId: section.id,
      guideId: FAQ_GUIDE_ID,
      title: section.title,
      text: `${section.title}\n\n${section.content}`,
    })
    .do();
}

// Delete from Weaviate
async function deleteFromWeaviate(sectionId: string) {
  const client = getWeaviateClient();
  try {
    // Find and delete by sourceId
    const result = await client.graphql
      .get()
      .withClassName("Section")
      .withWhere({
        path: ["sourceId"],
        operator: "Equal",
        valueText: sectionId,
      })
      .withFields("_additional { id }")
      .do();

    const items = result.data?.Get?.Section || [];
    for (const item of items) {
      if (item._additional?.id) {
        await client.data.deleter().withClassName("Section").withId(item._additional.id).do();
      }
    }
  } catch {
    // Ignore errors
  }
}

// GET - List all FAQ entries
export async function GET() {
  try {
    await ensureFaqGuide();

    const sections = await prisma.section.findMany({
      where: { guideId: FAQ_GUIDE_ID },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        content: true,
        order: true,
      },
    });

    return NextResponse.json({ entries: sections });
  } catch (error) {
    console.error("Failed to fetch FAQ entries:", error);
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
  }
}

// POST - Create or update FAQ entry
export async function POST(req: NextRequest) {
  try {
    await ensureFaqGuide();

    const body = await req.json();
    const { id, title, content } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    // Generate ID from title if new
    const sectionId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

    // Get next order number
    const maxOrder = await prisma.section.aggregate({
      where: { guideId: FAQ_GUIDE_ID },
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order || 0) + 1;

    // Upsert section
    const section = await prisma.section.upsert({
      where: { id: sectionId },
      update: {
        title: title.trim(),
        content: content.trim(),
      },
      create: {
        id: sectionId,
        guideId: FAQ_GUIDE_ID,
        kind: "faq",
        title: title.trim(),
        content: content.trim(),
        order: nextOrder,
      },
    });

    // Index to Weaviate for RAG
    await indexToWeaviate(section);

    return NextResponse.json({
      entry: {
        id: section.id,
        title: section.title,
        content: section.content,
        order: section.order,
      },
    });
  } catch (error) {
    console.error("Failed to save FAQ entry:", error);
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }
}

// DELETE - Remove FAQ entry
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    // Delete from database
    await prisma.section.delete({ where: { id } });

    // Delete from Weaviate
    await deleteFromWeaviate(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete FAQ entry:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
