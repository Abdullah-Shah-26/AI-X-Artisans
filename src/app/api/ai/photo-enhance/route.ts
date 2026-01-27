import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// DEMO MODE - Set to true to use pre-generated images
const DEMO_MODE = true;

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, theme, customPrompt } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 },
      );
    }

    // DEMO MODE: Return pre-generated images
    if (DEMO_MODE) {
      const demoFolder = path.join(process.cwd(), "public", "demo");
      const themeMap: Record<string, string> = {
        clean: "clean",
        festive: "festive",
        artistic: "artistic",
        rustic: "rustic",
      };

      const themeName = themeMap[theme] || "clean";

      // Try to find demo images for this theme
      try {
        const files = fs.readdirSync(demoFolder);
        const themeFiles = files.filter(
          (f) =>
            f.startsWith(`${themeName}-`) &&
            (f.endsWith(".jpg") || f.endsWith(".png")),
        );

        if (themeFiles.length > 0) {
          // Pick a random demo image
          const randomFile =
            themeFiles[Math.floor(Math.random() * themeFiles.length)];
          const demoImageUrl = `/demo/${randomFile}`;

          return NextResponse.json({
            enhancedUrl: demoImageUrl,
            theme,
            message: `${theme} style applied (DEMO MODE)`,
            demo: true,
          });
        }
      } catch (err) {
        console.log("Demo folder not found or empty, falling back to AI");
      }
    }

    // REAL AI MODE: Use Hugging Face
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

      if (response.status === 503) {
        return NextResponse.json(
          {
            error: "Model is loading, please try again in 30 seconds",
            loading: true,
            enhancedUrl: imageUrl,
          },
          { status: 200 },
        );
      }

      return NextResponse.json({
        enhancedUrl: imageUrl,
        theme,
        message: "Using original image (API error)",
      });
    }

    const resultBlob = await response.blob();
    const arrayBuffer = await resultBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const enhancedUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      enhancedUrl,
      theme,
      message: `${theme} style applied successfully (FREE - Hugging Face)`,
    });
  } catch (error: any) {
    console.error("Photo enhance error:", error);

    const { imageUrl } = await request.json().catch(() => ({ imageUrl: null }));

    return NextResponse.json({
      enhancedUrl: imageUrl || "",
      message: "Using original image (error occurred)",
      error: error.message,
    });
  }
}
