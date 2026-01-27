import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { base64, mimeType, folder = "uploads" } = await request.json();

    if (!base64) {
      return NextResponse.json(
        { error: "Base64 image data is required" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const extension = mimeType?.split("/")[1] || "png";
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${extension}`;

    // Convert base64 to buffer
    const buffer = Buffer.from(base64, "base64");

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, buffer, {
        contentType: mimeType || "image/png",
        upsert: true,
      });

    if (error) {
      // Clean log for RLS errors
      if (error.message.includes("row-level security")) {
        console.warn("⚠️ Upload blocked: Supabase RLS policy violation. Check your Storage policies.");
      } else {
        console.error(`Supabase upload failed: ${error.message}`);
      }

      // Return data URL as fallback
      return NextResponse.json({
        url: `data:${mimeType || "image/png"};base64,${base64}`,
        fallback: true,
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
