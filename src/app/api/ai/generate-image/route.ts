import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/vertexai";

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // Check if Google Cloud Project ID is configured and not placeholder
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const hasValidProjectId =
      projectId && !projectId.includes("your-project") && projectId !== "";

    if (!hasValidProjectId) {
      return NextResponse.json(
        {
          error:
            "Image generation is currently unavailable. Google Cloud Vertex AI is not configured in this deployment.",
          available: false,
        },
        { status: 503 },
      );
    }

    // Use Vertex AI for image generation
    const result = await generateImage(prompt, style);

    // Extract image data from Vertex AI response
    const imageData = result.candidates?.[0]?.content?.parts?.[0];

    if (!imageData) {
      throw new Error("No image generated");
    }

    return NextResponse.json({
      success: true,
      imageUrl: `data:image/png;base64,${imageData}`,
      message: "Image generated successfully",
    });
  } catch (error: any) {
    console.error("Image generation error:", error);

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
      { error: error.message || "Failed to generate image", available: false },
      { status: 500 },
    );
  }
}
