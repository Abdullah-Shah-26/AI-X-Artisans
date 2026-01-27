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

    const { role } = await request.json();

    if (!["ARTISAN", "VOLUNTEER", "CUSTOMER"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update user role
    await prisma.user.update({
      where: { id: user.id },
      data: { role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Switch role error:", error);
    return NextResponse.json(
      { error: "Failed to switch role" },
      { status: 500 }
    );
  }
}
