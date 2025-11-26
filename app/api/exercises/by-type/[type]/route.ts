import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  const exercises = await prisma.exercise.findMany({
    where: { type },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(exercises);
}

