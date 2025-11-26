import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const roots = await prisma.anatomyNode.findMany({
    where: {
      parentId: null,
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(roots);
}

