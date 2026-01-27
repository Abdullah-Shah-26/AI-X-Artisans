import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { artisanName, itemName, itemDescription, craftTradition } =
      await request.json();

    if (!artisanName || !itemName || !craftTradition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a compelling 'Heritage Story' for a certificate of authenticity, around 50-70 words. The story should sound official and connect the artisan, their craft, and the specific item.

- Artisan: ${artisanName}
- Item Name: ${itemName}
- Item Description: ${itemDescription || "A handcrafted masterpiece"}
- Craft Tradition: ${craftTradition}

Focus on skill, tradition, and the beauty of handcrafted art. Write in a formal, certificate-appropriate tone.`;

    const result = await model.generateContent(prompt);
    const heritageStory = result.response.text();

    return NextResponse.json({ heritageStory });
  } catch (error: any) {
    console.error("Error generating heritage story:", error);

    // Handle quota exceeded
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate heritage story" },
      { status: 500 }
    );
  }
}
