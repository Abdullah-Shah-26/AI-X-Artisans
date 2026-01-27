import { NextRequest, NextResponse } from "next/server";

// DEMO MODE - Set to true to use pre-generated images
const DEMO_MODE = true;

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, style } = await request.json();

    if (!imageUrl || !style) {
      return NextResponse.json(
        { error: "Image URL and style required" },
        { status: 400 },
      );
    }

    // DEMO MODE: Return pre-generated styled images
    if (DEMO_MODE) {
      // Map style to specific demo image file (no random picking)
      const styleMap: Record<string, string> = {
        clean: "clean-1.png",
        festive: "festive-1.png",
        artistic: "artistic-1.png",
        rustic: "rustic-1.png",
      };

      const imageFile = styleMap[style] || "clean-1.png";
      const demoImageUrl = `/demo/${imageFile}`;

      console.log(
        `[DEMO MODE] Returning image: ${demoImageUrl} for style: ${style}`,
      );

      return NextResponse.json({
        success: true,
        imageUrl: demoImageUrl,
        message: `${style} style applied successfully`,
      });
    }

    const hfToken = process.env.HUGGINGFACE_API_KEY;
    if (!hfToken) {
      return NextResponse.json(
        { error: "Hugging Face API key not configured" },
        { status: 500 },
      );
    }

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
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
      if (response.status === 503) {
        return NextResponse.json(
          {
            error: "Model is loading, please try again in 20 seconds",
            loading: true,
          },
          { status: 503 },
        );
      }
      throw new Error(`API error: ${errorText}`);
    }

    const resultBlob = await response.blob();
    const arrayBuffer = await resultBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const styledImageUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      success: true,
      imageUrl: styledImageUrl,
      message: `${style} style applied successfully (FREE - Hugging Face)`,
    });
  } catch (error: any) {
    console.error("Style image error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image" },
      { status: 500 },
    );
  }
}
