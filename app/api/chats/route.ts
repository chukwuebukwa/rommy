import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/chats - List chats for a device
export async function GET(request: NextRequest) {
  try {
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId) {
      return NextResponse.json({ error: "Device ID required" }, { status: 400 });
    }

    const chats = await prisma.chat.findMany({
      where: { deviceId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}

// POST /api/chats - Create a new chat
export async function POST(request: NextRequest) {
  try {
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId) {
      return NextResponse.json({ error: "Device ID required" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const title = body.title || null;

    const chat = await prisma.chat.create({
      data: {
        deviceId,
        title,
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Failed to create chat:", error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}
