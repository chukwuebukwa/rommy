import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      roleSummary,
      primaryFunctions,
      aestheticNotes,
      meta,
    } = body;

    // Update anatomy node
    await prisma.anatomyNode.update({
      where: { id },
      data: {
        name,
        description,
        roleSummary,
        primaryFunctions,
        aestheticNotes,
        meta,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving anatomy:", error);
    return NextResponse.json(
      { error: "Failed to save anatomy" },
      { status: 500 }
    );
  }
}

