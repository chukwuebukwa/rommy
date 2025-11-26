import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(exercises);
}

