import { NextRequest, NextResponse } from "next/server";

// DEMO MODE - Set to true to use pre-generated videos
const DEMO_MODE = true;

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, style } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL required" },
        { status: 400 },
      );
    }

    // DEMO MODE: Return pre-generated videos based on style
    if (DEMO_MODE) {
      // Map style to specific demo video file (no random picking)
      const styleMap: Record<string, string> = {
        slideshow: "slideshow-1.mp4",
        zoom: "zoom-1.mp4",
        rotate: "rotate-1.mp4",
        story: "story-1.mp4",
      };

      const videoFile = styleMap[style] || "story-1.mp4";
      const demoVideoUrl = `/demo/${videoFile}`;

      console.log(
        `[DEMO MODE] Returning video: ${demoVideoUrl} for style: ${style}`,
      );

      return NextResponse.json({
        status: "completed",
        videoUrl: demoVideoUrl,
        message: `${style} video generated successfully`,
      });
    }

    // Video generation disabled - requires paid credits
    return NextResponse.json(
      { error: "Video generation is currently unavailable" },
      { status: 503 },
    );
  } catch (error: any) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate video" },
      { status: 500 },
    );
  }
}
