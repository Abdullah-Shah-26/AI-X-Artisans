import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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
        { error: "Receiver ID required" },
        { status: 400 }
      );
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
        { error: "Connection request already exists" },
        { status: 400 }
      );
    }

    // Create connection request
    await prisma.connectionRequest.create({
      data: {
        senderId: user.id,
        receiverId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send connection error:", error);
    return NextResponse.json(
      { error: "Failed to send connection request" },
      { status: 500 }
    );
  }
}
