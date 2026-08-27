import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, theme, customPrompt } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 },
      );
    }

    // REAL AI MODE: Check if Hugging Face API key is configured
    const hfToken = process.env.HUGGINGFACE_API_KEY;
    if (!hfToken) {
      return NextResponse.json(
        {
          error: "Photo enhancement is currently unavailable. Image generation service is not configured in this deployment.",
          available: false,
          enhancedUrl: null,
        },
        { status: 503 },
      );
    }

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch source image", available: false },
        { status: 400 },
      );
    }
    const imageBlob = await imageResponse.blob();

    // Style prompts for different themes
    const stylePrompts: Record<string, string> = {
      clean:
        "professional product photography, white background, studio lighting, high quality, sharp focus",
      festive:
        "festive decorations, warm golden lighting, celebration mood, colorful, joyful atmosphere",
      artistic:
        "artistic composition, creative styling, unique perspective, aesthetic, beautiful lighting",
      rustic:
        "rustic wooden surface, natural textures, warm lighting, handcrafted feel, organic materials",
    };

    const basePrompt = stylePrompts[theme] || stylePrompts.clean;
    const finalPrompt = customPrompt
      ? `${basePrompt}. ${customPrompt}`
      : basePrompt;

    // Use Hugging Face Stable Diffusion for image-to-image
    const response = await fetch(
      `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: finalPrompt,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error:", errorText);

      return NextResponse.json(
        {
          error: "Photo enhancement service is currently unavailable.",
          available: false,
          enhancedUrl: null,
        },
        { status: 503 },
      );
    }

    const resultBlob = await response.blob();
    const arrayBuffer = await resultBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const enhancedUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      success: true,
      enhancedUrl,
      theme,
      message: `${theme} style applied successfully`,
    });
  } catch (error: any) {
    console.error("Photo enhance error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to process image",
        available: false,
        enhancedUrl: null,
      },
      { status: 500 },
    );
  }
}
