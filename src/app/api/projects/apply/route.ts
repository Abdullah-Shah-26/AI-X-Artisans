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

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 }
      );
    }

    // Get project to find artisan
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { postedById: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if already applied
    const existing = await prisma.projectApplication.findUnique({
      where: {
        projectId_volunteerId: {
          projectId,
          volunteerId: user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Already applied" }, { status: 400 });
    }

    // Create application
    await prisma.projectApplication.create({
      data: {
        projectId,
        volunteerId: user.id,
        artisanId: project.postedById,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 });
  }
}
