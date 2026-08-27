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
    const { imageUrl, style, productName, prompt: manualPrompt } = await request.json();

    if (!imageUrl && !manualPrompt) {
      return NextResponse.json(
        { error: "Image URL or prompt required" },
        { status: 400 },
      );
    }

    // If no real credentials configured, accurately return currently unavailable state
    if (!hasRealCredentials()) {
      return NextResponse.json(
        {
          error: "Video generation is currently unavailable. AI video generation service is not configured in this deployment environment.",
          available: false,
        },
        { status: 503 },
      );
    }

    // Build the specialized prompt based on style and platform
    let finalPrompt = manualPrompt || "";

    if (!finalPrompt) {
      const product = productName || "artisan product";
      
      const stylePrompts: Record<string, string> = {
        rotate: `A professional 360-degree orbit showcase for YouTube. The camera performs a smooth, cinematic circular orbit around the stationary ${product}. The background is transformed into a clean, minimalist professional studio with elegant soft-box lighting. Keep every single detail, color, and texture of the ${product} exactly as seen in the source image. The product MUST NOT morph or change; only the camera and background should move. High-end advertising quality.`,
        slideshow: `A cinematic horizontal lifestyle reveal for YouTube. The camera performs a slow, elegant pan across the ${product}. The background is replaced with a warm, artisanal workspace featuring natural wood textures, soft bokeh, and dancing dust motes in sunlight. The ${product} remains perfectly still and identical to the original photo. Smooth cinematic motion, professional color grading, 4K resolution.`,
        story: `A high-energy, vertical social media reel for Instagram. The camera performs a dynamic 'push-in' and 'vibe' jitter to the ${product}. The background is replaced with a vibrant, trendy showroom featuring dynamic light leaks and neon-subtle accents. Every detail of the ${product} from the original image is preserved perfectly. The product remains rigid and consistent while the environment feels alive. Vertical 9:16 aspect ratio.`,
        zoom: `A dramatic macro-zoom reveal. The camera pushes slowly into the fine details of the ${product}. The background is a simplified, high-contrast dark gallery setting that makes the product pop. The ${product} must remain 100% consistent with the source image textures throughout the motion. Professional cinematography.`
      };

      finalPrompt = stylePrompts[style] || `A cinematic showcase of the ${product} from the image, preserving all original details.`;
    }

    // REAL VERTEX AI MODE
    try {
      const { generateVideo } = await import("@/lib/vertexai");

      const result = await generateVideo(
        finalPrompt,
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
    } catch (vertexError: any) {
      console.error("Vertex AI Video Generation Error:", vertexError);
      return NextResponse.json(
        {
          error: vertexError.message || "Video generation is currently unavailable.",
          available: false,
        },
        { status: 503 },
      );
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
      { error: error.message || "Failed to generate video", available: false },
      { status: 500 },
    );
  }
}
