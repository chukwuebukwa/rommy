import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guideId: string }> }
) {
  try {
    const { guideId } = await params;

    // Find workout by primaryRegionId matching guideId
    const workout = await prisma.workout.findFirst({
      where: { primaryRegionId: guideId },
      include: {
        blocks: {
          orderBy: { id: "asc" },
          include: {
            exercises: {
              include: {
                exercise: {
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
                },
              },
            },
          },
        },
      },
    });

    if (!workout) {
      return NextResponse.json(
        { error: "No workout found for this guide" },
        { status: 404 }
      );
    }

    // Sort blocks by the number in their label (e.g., "1. Triceps..." -> 1)
    workout.blocks.sort((a, b) => {
      const numA = parseInt(a.label.match(/^(\d+)/)?.[1] || "999");
      const numB = parseInt(b.label.match(/^(\d+)/)?.[1] || "999");
      return numA - numB;
    });

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error fetching workout:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout" },
      { status: 500 }
    );
  }
}
