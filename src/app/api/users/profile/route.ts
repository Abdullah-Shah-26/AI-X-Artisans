import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT - Complete profile setup (for new users)
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { role, bio, location, story, skills, motivation } = body;

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // Check if user exists, if not create them
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      // Create user from Supabase auth data
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
          role: role,
          profileComplete: false,
        },
      });
    } else if (dbUser.role !== role) {
      // Update role if different
      dbUser = await prisma.user.update({
        where: { id: user.id },
        data: { role },
      });
    }

    // Create/update role-specific profile
    if (role === "ARTISAN") {
      await prisma.artisanProfile.upsert({
        where: { userId: user.id },
        update: { bio, location, story },
        create: { userId: user.id, bio, location, story },
      });
    } else if (role === "VOLUNTEER") {
      await prisma.volunteerProfile.upsert({
        where: { userId: user.id },
        update: { bio, skills: skills || [], motivation },
        create: { userId: user.id, bio, skills: skills || [], motivation },
      });
    }

    // Mark profile as complete
    await prisma.user.update({
      where: { id: user.id },
      data: { profileComplete: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing profile:", error);
    return NextResponse.json(
      { error: "Failed to complete profile" },
      { status: 500 }
    );
  }
}

// PATCH - Update existing profile
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      avatar,
      bio,
      location,
      story,
      yearsOfExperience,
      craftTypes,
      skills,
    } = body;

    // Get current user to check role
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user basic info
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || currentUser.name,
        avatar: avatar,
      },
    });

    // Update role-specific profile
    if (currentUser.role === "ARTISAN") {
      await prisma.artisanProfile.upsert({
        where: { userId: user.id },
        update: {
          bio,
          location,
          story,
          yearsOfExperience,
          craftTypes: craftTypes || [],
        },
        create: {
          userId: user.id,
          bio,
          location,
          story,
          yearsOfExperience,
          craftTypes: craftTypes || [],
        },
      });
    } else if (currentUser.role === "VOLUNTEER") {
      await prisma.volunteerProfile.upsert({
        where: { userId: user.id },
        update: {
          bio,
          skills: skills || [],
        },
        create: {
          userId: user.id,
          bio,
          skills: skills || [],
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
