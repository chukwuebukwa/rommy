import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const types = await prisma.exercise.groupBy({
    by: ["type"],
    _count: true,
  });

  return NextResponse.json(
    types.map((t) => ({
      id: t.type,
      name: t.type.charAt(0).toUpperCase() + t.type.slice(1),
      count: t._count,
    }))
  );
}

