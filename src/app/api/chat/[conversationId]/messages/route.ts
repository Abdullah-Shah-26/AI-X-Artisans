import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// GET - Get all messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const { conversationId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (
      !conversation ||
      (conversation.participant1Id !== user.id &&
        conversation.participant2Id !== user.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: "asc" },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

// POST - Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const { conversationId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, imageUrl } = await request.json();

    if (!text && !imageUrl) {
      return NextResponse.json(
        { error: "Message text or image required" },
        { status: 400 },
      );
    }

    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (
      !conversation ||
      (conversation.participant1Id !== user.id &&
        conversation.participant2Id !== user.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        text,
        imageUrl,
        senderId: user.id,
        conversationId,
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    // Update conversation's last message
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageText: text || "Sent an image",
        lastMessageAt: new Date(),
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
