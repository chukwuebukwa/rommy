import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const exercises = await prisma.exercise.findMany({
      select: {
        id: true,
        name: true,
        videoUrl: true,
        type: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
