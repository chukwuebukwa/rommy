import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  try {
    const nodes = await prisma.anatomyNode.findMany({
      where: query ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { id: { contains: query, mode: "insensitive" } },
        ],
      } : {},
      select: {
        id: true,
        name: true,
        kind: true,
        parentId: true,
      },
      orderBy: [
        { kind: "asc" },
        { name: "asc" },
      ],
      take: 50,
    });

    return NextResponse.json(nodes);
  } catch (error) {
    console.error("Error fetching anatomy nodes:", error);
    return NextResponse.json(
      { error: "Failed to fetch anatomy nodes" },
      { status: 500 }
    );
  }
}

