import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ pattern: string }> }
) {
  const { pattern } = await params;

  const exercises = await prisma.exercise.findMany({
    where: { movementPattern: pattern },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(exercises);
}

