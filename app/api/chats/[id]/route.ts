import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/chats/[id] - Get chat with messages
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId) {
      return NextResponse.json({ error: "Device ID required" }, { status: 400 });
    }

    const chat = await prisma.chat.findFirst({
      where: { id, deviceId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Failed to fetch chat:", error);
    return NextResponse.json({ error: "Failed to fetch chat" }, { status: 500 });
  }
}

// DELETE /api/chats/[id] - Delete a chat
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId) {
      return NextResponse.json({ error: "Device ID required" }, { status: 400 });
    }

    // Verify ownership
    const chat = await prisma.chat.findFirst({
      where: { id, deviceId },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    await prisma.chat.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete chat:", error);
    return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 });
  }
}

// PATCH /api/chats/[id] - Update chat (rename)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId) {
      return NextResponse.json({ error: "Device ID required" }, { status: 400 });
    }

    const body = await request.json();
    const { title } = body;

    // Verify ownership
    const existingChat = await prisma.chat.findFirst({
      where: { id, deviceId },
    });

    if (!existingChat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const chat = await prisma.chat.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Failed to update chat:", error);
    return NextResponse.json({ error: "Failed to update chat" }, { status: 500 });
  }
}
