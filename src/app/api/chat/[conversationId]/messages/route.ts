import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;

  try {
    // Verify user is part of conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ participant1Id: user.id }, { participant2Id: user.id }],
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: "asc" },
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;

  try {
    const { text, imageUrl } = await request.json();

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ participant1Id: user.id }, { participant2Id: user.id }],
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Ensure at least text or image is provided
    if (!text && !imageUrl) {
      return NextResponse.json(
        { error: "Message must contain text or image" },
        { status: 400 },
      );
    }

    // Create message and update conversation
    const lastMessageText = imageUrl
      ? text
        ? `${text} [Image]`
        : "[Image]"
      : text;

    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          text: text || null,
          imageUrl: imageUrl || null,
          senderId: user.id,
          conversationId,
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageText,
          lastMessageAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
