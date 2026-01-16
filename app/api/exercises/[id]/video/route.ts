import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { videoUrl } = body;

    // Validate YouTube URL if provided
    if (videoUrl && !isValidYouTubeUrl(videoUrl)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.update({
      where: { id },
      data: { videoUrl: videoUrl || null },
      select: { id: true, name: true, videoUrl: true },
    });

    return NextResponse.json(exercise);
  } catch (error) {
    console.error("Failed to update exercise video:", error);
    return NextResponse.json(
      { error: "Failed to update exercise" },
      { status: 500 }
    );
  }
}

function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
  ];
  return patterns.some((p) => p.test(url));
}
