import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, slug, title, author, primaryRegionId, sections } = data;

    // Validate required fields
    if (!id || !slug || !title) {
      return NextResponse.json(
        { error: "Missing required fields: id, slug, or title" },
        { status: 400 }
      );
    }

    // Check if guide exists
    const existingGuide = await prisma.guide.findUnique({
      where: { id },
      include: { sections: true },
    });

    if (existingGuide) {
      // Update existing guide
      // First, get all section IDs for this guide
      const sectionIds = existingGuide.sections.map((s) => s.id);

      // Delete related records first (in correct order)
      if (sectionIds.length > 0) {
        await prisma.sectionExercise.deleteMany({
          where: { sectionId: { in: sectionIds } },
        });
        await prisma.sectionAnatomy.deleteMany({
          where: { sectionId: { in: sectionIds } },
        });
      }

      // Now delete old sections
      await prisma.section.deleteMany({
        where: { guideId: id },
      });

      // Then update guide and create new sections
      const updatedGuide = await prisma.guide.update({
        where: { id },
        data: {
          slug,
          title,
          author,
          primaryRegionId,
          sections: {
            create: sections.map((section: any) => ({
              id: section.id,
              kind: section.kind,
              title: section.title,
              order: section.order,
              content: section.content,
              images: section.images || [],
            })),
          },
        },
        include: {
          sections: true,
        },
      });

      return NextResponse.json({
        success: true,
        guide: updatedGuide,
      });
    } else {
      // Create new guide
      const newGuide = await prisma.guide.create({
        data: {
          id,
          slug,
          title,
          author,
          primaryRegionId,
          sections: {
            create: sections.map((section: any) => ({
              id: section.id,
              kind: section.kind,
              title: section.title,
              order: section.order,
              content: section.content,
              images: section.images || [],
            })),
          },
        },
        include: {
          sections: true,
        },
      });

      return NextResponse.json({
        success: true,
        guide: newGuide,
      });
    }
  } catch (error) {
    console.error("Error saving guide:", error);
    return NextResponse.json(
      {
        error: "Failed to save guide",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

