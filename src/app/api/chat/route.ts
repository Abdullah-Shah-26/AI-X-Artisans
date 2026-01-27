import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// GET - Get all conversations for current user
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: user.id }, { participant2Id: user.id }],
      },
      include: {
        participant1: {
          select: { id: true, name: true, avatar: true },
        },
        participant2: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    // Transform to include otherParticipant
    const transformed = conversations.map((conv) => ({
      id: conv.id,
      otherParticipant:
        conv.participant1Id === user.id ? conv.participant2 : conv.participant1,
      lastMessage: conv.lastMessageText,
      lastMessageAt: conv.lastMessageAt,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST - Create or get conversation with another user
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { otherUserId } = await request.json();

    if (!otherUserId) {
      return NextResponse.json(
        { error: "Other user ID required" },
        { status: 400 }
      );
    }

    // Check if conversation exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: user.id, participant2Id: otherUserId },
          { participant1Id: otherUserId, participant2Id: user.id },
        ],
      },
      include: {
        participant1: { select: { id: true, name: true, avatar: true } },
        participant2: { select: { id: true, name: true, avatar: true } },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participant1Id: user.id,
          participant2Id: otherUserId,
        },
        include: {
          participant1: { select: { id: true, name: true, avatar: true } },
          participant2: { select: { id: true, name: true, avatar: true } },
        },
      });
    }

    return NextResponse.json({
      id: conversation.id,
      otherParticipant:
        conversation.participant1Id === user.id
          ? conversation.participant2
          : conversation.participant1,
      lastMessage: conversation.lastMessageText,
      lastMessageAt: conversation.lastMessageAt,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
