import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const patterns = await prisma.exercise.groupBy({
    by: ["movementPattern"],
    _count: true,
  });

  return NextResponse.json(
    patterns.map((p) => ({
      id: p.movementPattern,
      name: p.movementPattern.charAt(0).toUpperCase() + p.movementPattern.slice(1),
      count: p._count,
    }))
  );
}

