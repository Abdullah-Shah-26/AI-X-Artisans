import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, name, role } = body;

    const user = await prisma.user.create({
      data: {
        id,
        email,
        name,
        role,
        profileComplete: false,
      },
    });

    // Create role-specific profile
    if (role === "ARTISAN") {
      await prisma.artisanProfile.create({
        data: { userId: id },
      });
    } else if (role === "VOLUNTEER") {
      await prisma.volunteerProfile.create({
        data: { userId: id },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        artisanProfile: true,
        volunteerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
