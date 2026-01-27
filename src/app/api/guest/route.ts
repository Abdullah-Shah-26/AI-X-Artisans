import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// POST - Enable guest/demo mode with a specific role
export async function POST(request: Request) {
  try {
    const { role } = await request.json();

    if (!["artisan", "customer", "volunteer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const cookieStore = await cookies();

    // Set guest mode cookie
    cookieStore.set("guestMode", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // Set the view mode cookie for the selected role
    cookieStore.set("viewMode", role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Error enabling guest mode:", error);
    return NextResponse.json(
      { error: "Failed to enable guest mode" },
      { status: 500 }
    );
  }
}

// DELETE - Exit guest/demo mode
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("guestMode");
    cookieStore.delete("viewMode");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error exiting guest mode:", error);
    return NextResponse.json(
      { error: "Failed to exit guest mode" },
      { status: 500 }
    );
  }
}
