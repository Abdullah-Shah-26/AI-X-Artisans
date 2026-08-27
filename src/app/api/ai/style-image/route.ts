import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, style } = await request.json();

    if (!imageUrl || !style) {
      return NextResponse.json(
        { error: "Image URL and style required" },
        { status: 400 },
      );
    }

    const hfToken = process.env.HUGGINGFACE_API_KEY;
    if (!hfToken) {
      return NextResponse.json(
        {
          error: "AI image styling is currently unavailable. Image generation service is not configured in this deployment environment.",
          available: false,
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
      minimalist:
        "minimalist aesthetic, clean lines, neutral background, modern studio lighting",
      bohemian:
        "bohemian aesthetic, earthy tones, natural textures, artistic mood",
      extravagant:
        "luxurious premium setting, rich colors, dramatic lighting, high-end display",
      classic:
        "timeless classic presentation, elegant backdrop, balanced soft lighting",
    };

    const prompt = stylePrompts[style] || stylePrompts.clean;

    // Use Hugging Face image-to-image model (FREE)
    const response = await fetch(
      `https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            image: await imageBlob
              .arrayBuffer()
              .then((buf) => Buffer.from(buf).toString("base64")),
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "AI image styling is currently unavailable.",
          available: false,
        },
        { status: 503 },
      );
    }

    const resultBlob = await response.blob();
    const arrayBuffer = await resultBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const styledImageUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      success: true,
      imageUrl: styledImageUrl,
      message: `${style} style applied successfully`,
    });
  } catch (error: any) {
    console.error("Style image error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image", available: false },
      { status: 500 },
    );
  }
}
