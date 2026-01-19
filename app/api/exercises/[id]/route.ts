import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        anatomyLinks: {
          include: {
            anatomy: true,
          },
        },
      },
    });

    if (!exercise) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(exercise);
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, movementPattern, videoUrl, cdnVideoUrl, equipment, cueSummary, anatomyLinks } = body;

    // Start a transaction to update the exercise and its anatomy links
    const result = await prisma.$transaction(async (tx: typeof prisma) => {
      // Update the exercise basic info
      const exercise = await tx.exercise.update({
        where: { id },
        data: {
          name,
          type,
          movementPattern,
          videoUrl: videoUrl || null,
          cdnVideoUrl: cdnVideoUrl || null,
          equipment: equipment || null,
          cueSummary: cueSummary || null,
        },
      });

      // Delete existing anatomy links
      await tx.exerciseAnatomy.deleteMany({
        where: { exerciseId: id },
      });

      // Create new anatomy links if provided
      if (anatomyLinks && anatomyLinks.length > 0) {
        await tx.exerciseAnatomy.createMany({
          data: anatomyLinks.map((link: { anatomyNodeId: string; role: string }) => ({
            exerciseId: id,
            anatomyNodeId: link.anatomyNodeId,
            role: link.role,
          })),
        });
      }

      // Fetch the updated exercise with links
      return await tx.exercise.findUnique({
        where: { id },
        include: {
          anatomyLinks: {
            include: {
              anatomy: {
                include: {
                  parent: {
                    include: {
                      parent: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating exercise:", error);
    return NextResponse.json(
      { error: "Failed to update exercise" },
      { status: 500 }
    );
  }
}

