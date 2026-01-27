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

    const { applicationId, action } = await request.json();

    if (!applicationId || !action) {
      return NextResponse.json(
        { error: "Application ID and action required" },
        { status: 400 }
      );
    }

    if (!["ACCEPTED", "DECLINED"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Get application and verify ownership
    const application = await prisma.projectApplication.findUnique({
      where: { id: applicationId },
      include: {
        project: true,
        volunteer: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.artisanId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Update application status
    await prisma.projectApplication.update({
      where: { id: applicationId },
      data: { status: action },
    });

    // If accepted, create collaboration and conversation
    if (action === "ACCEPTED") {
      // Create collaboration
      await prisma.collaboration.create({
        data: {
          projectId: application.projectId,
          volunteerId: application.volunteerId,
          artisanId: user.id,
        },
      });

      // Update project status
      await prisma.project.update({
        where: { id: application.projectId },
        data: { status: "IN_PROGRESS" },
      });

      // Create or get conversation
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            {
              participant1Id: user.id,
              participant2Id: application.volunteerId,
            },
            {
              participant1Id: application.volunteerId,
              participant2Id: user.id,
            },
          ],
        },
      });

      if (!existingConversation) {
        await prisma.conversation.create({
          data: {
            participant1Id: user.id,
            participant2Id: application.volunteerId,
            lastMessageText: `Collaboration started on "${application.project.title}"`,
            lastMessageAt: new Date(),
          },
        });
      }

      // Create/update connection to ACCEPTED
      await prisma.connectionRequest.upsert({
        where: {
          senderId_receiverId: {
            senderId: user.id,
            receiverId: application.volunteerId,
          },
        },
        update: { status: "ACCEPTED" },
        create: {
          senderId: user.id,
          receiverId: application.volunteerId,
          status: "ACCEPTED",
        },
      });
    }

    return NextResponse.json({ success: true, status: action });
  } catch (error) {
    console.error("Respond to application error:", error);
    return NextResponse.json(
      { error: "Failed to respond to application" },
      { status: 500 }
    );
  }
}
