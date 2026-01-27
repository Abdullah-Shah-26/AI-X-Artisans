import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { collaborationId, rating, feedback } = await request.json();
    if (!collaborationId || !rating) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const collab = await prisma.collaboration.findUnique({
      where: { id: collaborationId },
    });

    if (!collab || collab.artisanId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await prisma.$transaction([
      prisma.collaboration.update({
        where: { id: collaborationId },
        data: { status: "COMPLETED", endDate: new Date(), rating, feedback },
      }),
      prisma.project.update({
        where: { id: collab.projectId },
        data: { status: "COMPLETED" },
      }),
      prisma.volunteerProfile.update({
        where: { userId: collab.volunteerId },
        data: { projectsCompleted: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("End collaboration error:", error);
    return NextResponse.json(
      { error: "Failed to end collaboration" },
      { status: 500 }
    );
  }
}
