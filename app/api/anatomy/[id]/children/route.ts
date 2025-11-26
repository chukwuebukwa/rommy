import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const children = await prisma.anatomyNode.findMany({
    where: {
      parentId: id,
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(children);
}

