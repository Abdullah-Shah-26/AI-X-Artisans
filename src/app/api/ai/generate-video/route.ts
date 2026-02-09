import { NextRequest, NextResponse } from "next/server";

// Check if real credentials exist by checking environment variable
function hasRealCredentials(): boolean {
  // Check if Google Cloud Project ID is set and not a placeholder
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const hasValidProjectId =
    projectId && !projectId.includes("your-project") && projectId !== "";

  // Check if service account key environment variable exists
  const serviceAccountKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const hasServiceAccount = serviceAccountKey && serviceAccountKey !== "";

  return !!(hasValidProjectId && hasServiceAccount);
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, style, prompt } = await request.json();

    if (!imageUrl && !prompt) {
      return NextResponse.json(
        { error: "Image URL or prompt required" },
        { status: 400 },
      );
    }

    // Use demo mode if no real credentials
    const useDemo = !hasRealCredentials();

    if (useDemo) {
      const styleMap: Record<string, string> = {
        slideshow: "slideshow-1.mp4",
        zoom: "slideshow-1.mp4", // Using slideshow as fallback
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
        message: `${style} video generated successfully (Demo Mode)`,
      });
    }

    // REAL VERTEX AI MODE: Check for credentials
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
      return NextResponse.json(
        {
          error:
            "Google Cloud Project ID not configured. See VERTEX_AI_SETUP.md for setup instructions.",
        },
        { status: 500 },
      );
    }

    // Dynamically import vertexai only when needed
    try {
      const { generateVideo } = await import("@/lib/vertexai");

      // Use Vertex AI for video generation
      const result = await generateVideo(
        prompt || "Create a video",
        imageUrl,
        style,
      );

      // Extract video data from Vertex AI response
      const videoData = result.candidates?.[0]?.content?.parts?.[0];

      if (!videoData) {
        throw new Error("No video generated");
      }

      // Return the video URL or base64 data
      const videoUrl = videoData.text?.includes("http")
        ? videoData.text
        : `data:video/mp4;base64,${videoData}`;

      return NextResponse.json({
        status: "completed",
        videoUrl: videoUrl,
        message: `${style} video generated successfully`,
      });
    } catch (importError: any) {
      // If vertexai module doesn't exist, fall back to demo mode
      if (importError.code === "MODULE_NOT_FOUND") {
        console.log("[FALLBACK] Vertex AI module not found, using demo mode");
        const styleMap: Record<string, string> = {
          slideshow: "slideshow-1.mp4",
          zoom: "slideshow-1.mp4",
          rotate: "rotate-1.mp4",
          story: "story-1.mp4",
        };
        const videoFile = styleMap[style] || "story-1.mp4";
        return NextResponse.json({
          status: "completed",
          videoUrl: `/demo/${videoFile}`,
          message: `${style} video generated successfully (Demo Mode)`,
        });
      }
      throw importError;
    }
  } catch (error: any) {
    console.error("Video generation error:", error);

    if (error.message?.includes("quota") || error.message?.includes("limit")) {
      return NextResponse.json(
        {
          error: "API quota exceeded, please try again later",
          quota: true,
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate video" },
      { status: 500 },
    );
  }
}
