import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// GET - Get all connections for current user
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const connections = await prisma.connectionRequest.findMany({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        receiver: {
          select: { id: true, name: true, avatar: true, role: true },
        },
      },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(connections);
  } catch (error) {
    console.error("Error fetching connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }
}

// POST - Send a connection request
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId } = await request.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 }
      );
    }

    if (receiverId === user.id) {
      return NextResponse.json(
        { error: "Cannot send request to yourself" },
        { status: 400 }
      );
    }

    // Verify receiver exists in database
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if connection already exists
    const existing = await prisma.connectionRequest.findFirst({
      where: {
        OR: [
          { senderId: user.id, receiverId },
          { senderId: receiverId, receiverId: user.id },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Connection request already exists", existing },
        { status: 400 }
      );
    }

    const connection = await prisma.connectionRequest.create({
      data: {
        senderId: user.id,
        receiverId,
        status: "PENDING",
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json(connection);
  } catch (error) {
    console.error("Error creating connection:", error);
    return NextResponse.json(
      { error: "Failed to send connection request" },
      { status: 500 }
    );
  }
}

// PATCH - Accept or reject a connection request
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { connectionId, status } = await request.json();

    if (!connectionId || !status) {
      return NextResponse.json(
        { error: "Connection ID and status are required" },
        { status: 400 }
      );
    }

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Verify user is the receiver
    const connection = await prisma.connectionRequest.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    if (connection.receiverId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this connection" },
        { status: 403 }
      );
    }

    const updated = await prisma.connectionRequest.update({
      where: { id: connectionId },
      data: { status },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating connection:", error);
    return NextResponse.json(
      { error: "Failed to update connection" },
      { status: 500 }
    );
  }
}
