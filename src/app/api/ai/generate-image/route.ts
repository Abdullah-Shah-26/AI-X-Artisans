import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/vertexai";

// DEMO MODE - Set to false to use real Vertex AI (requires credentials)
const DEMO_MODE = true;

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // DEMO MODE: Return pre-generated images based on style
    if (DEMO_MODE) {
      const styleMap: Record<string, string> = {
        product: "clean-1.png",
        artistic: "artistic-1.png",
        realistic: "rustic-1.png",
        traditional: "festive-1.png",
      };

      const imageFile = styleMap[style] || "clean-1.png";
      const demoImageUrl = `/demo/${imageFile}`;

      console.log(
        `[DEMO MODE] Returning image: ${demoImageUrl} for style: ${style}`,
      );

      return NextResponse.json({
        success: true,
        imageUrl: demoImageUrl,
        message: "Image generated successfully (Demo Mode)",
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
      { error: error.message || "Failed to generate image" },
      { status: 500 },
    );
  }
}
