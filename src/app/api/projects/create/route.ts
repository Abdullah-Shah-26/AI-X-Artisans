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

    const { title, description, skillsNeeded } = await request.json();
    if (!title || !description || !skillsNeeded?.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await prisma.project.create({
      data: { title, description, skillsNeeded, postedById: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
