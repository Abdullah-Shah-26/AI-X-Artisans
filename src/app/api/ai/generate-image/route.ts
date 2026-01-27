import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const hfToken = process.env.HUGGINGFACE_API_KEY;
    if (!hfToken) {
      return NextResponse.json(
        { error: "Hugging Face API key not configured" },
        { status: 500 },
      );
    }

    // Initialize Hugging Face client
    const hf = new HfInference(hfToken);

    // Style-specific prompt enhancements
    const stylePrompts: Record<string, string> = {
      product:
        "professional product photography, studio lighting, white background, high quality, 4k",
      artistic:
        "artistic, handcrafted, traditional art style, cultural heritage, detailed",
      realistic: "photorealistic, detailed, high resolution, natural lighting",
      traditional:
        "traditional Indian art style, cultural motifs, handcrafted aesthetic, heritage",
    };

    const enhancedPrompt = `${prompt}, ${stylePrompts[style] || stylePrompts.product}`;

    // Using Stable Diffusion for text-to-image
    const result = await hf.textToImage({
      model: "stabilityai/stable-diffusion-2-1",
      inputs: enhancedPrompt,
    });

    // Result is a Blob
    const arrayBuffer = await (result as unknown as Blob).arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      message: "Image generated successfully",
    });
  } catch (error: any) {
    console.error("Image generation error:", error);

    if (error.message?.includes("loading") || error.message?.includes("503")) {
      return NextResponse.json(
        {
          error: "Model is loading, please try again in 30 seconds",
          loading: true,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate image" },
      { status: 500 },
    );
  }
}
