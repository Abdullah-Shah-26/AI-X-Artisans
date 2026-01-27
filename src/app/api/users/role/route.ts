import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// GET - Get current view mode
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    const cookieStore = await cookies();
    const viewMode = cookieStore.get("viewMode")?.value;
    const originalRole = dbUser?.role || "customer";
    const currentRole = viewMode || originalRole;
    const isDemo = !!viewMode && viewMode !== originalRole;

    return NextResponse.json({ currentRole, originalRole, isDemo });
  } catch (error) {
    console.error("Error getting view mode:", error);
    return NextResponse.json(
      { error: "Failed to get view mode" },
      { status: 500 }
    );
  }
}

// PUT - Switch view mode (doesn't change actual role in DB)
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    if (!["artisan", "customer", "volunteer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Get user's original role from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    const originalRole = dbUser?.role || "customer";
    const cookieStore = await cookies();

    // If switching to original role, remove the view mode cookie
    if (role === originalRole) {
      cookieStore.delete("viewMode");
      return NextResponse.json({
        currentRole: role,
        originalRole,
        isDemo: false,
      });
    }

    // Otherwise, set view mode cookie (don't change DB)
    cookieStore.set("viewMode", role, {
      httpOnly: false, // Allow JS access for client-side checks
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ currentRole: role, originalRole, isDemo: true });
  } catch (error) {
    console.error("Error switching view mode:", error);
    return NextResponse.json(
      { error: "Failed to switch view" },
      { status: 500 }
    );
  }
}
