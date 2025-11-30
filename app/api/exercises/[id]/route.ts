import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, type, movementPattern, videoUrl, equipment, cueSummary, anatomyLinks } = body;

    // Start a transaction to update the exercise and its anatomy links
    const result = await prisma.$transaction(async (tx) => {
      // Update the exercise basic info
      const exercise = await tx.exercise.update({
        where: { id: params.id },
        data: {
          name,
          type,
          movementPattern,
          videoUrl: videoUrl || null,
          equipment: equipment || null,
          cueSummary: cueSummary || null,
        },
      });

      // Delete existing anatomy links
      await tx.exerciseAnatomy.deleteMany({
        where: { exerciseId: params.id },
      });

      // Create new anatomy links if provided
      if (anatomyLinks && anatomyLinks.length > 0) {
        await tx.exerciseAnatomy.createMany({
          data: anatomyLinks.map((link: { anatomyNodeId: string; role: string }) => ({
            exerciseId: params.id,
            anatomyNodeId: link.anatomyNodeId,
            role: link.role,
          })),
        });
      }

      // Fetch the updated exercise with links
      return await tx.exercise.findUnique({
        where: { id: params.id },
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

