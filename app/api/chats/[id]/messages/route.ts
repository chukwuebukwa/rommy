import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/chats/[id]/messages - Save a message to the chat
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: chatId } = await params;
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId) {
      return NextResponse.json({ error: "Device ID required" }, { status: 400 });
    }

    // Verify chat ownership
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, deviceId },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const body = await request.json();
    const { role, content } = body;

    if (!role || !content) {
      return NextResponse.json({ error: "Role and content required" }, { status: 400 });
    }

    // Create the message
    const message = await prisma.chatMessage.create({
      data: {
        chatId,
        role,
        content: typeof content === "string" ? content : JSON.stringify(content),
      },
    });

    // Update chat's updatedAt and auto-generate title if needed
    const updateData: { updatedAt: Date; title?: string } = { updatedAt: new Date() };

    // If this is the first user message and chat has no title, generate one
    if (role === "user" && !chat.title) {
      const textContent = typeof content === "string" ? content : JSON.stringify(content);
      // Use first 50 chars of the message as title
      updateData.title = textContent.slice(0, 50) + (textContent.length > 50 ? "..." : "");
    }

    await prisma.chat.update({
      where: { id: chatId },
      data: updateData,
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Failed to save message:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
