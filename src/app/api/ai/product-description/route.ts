import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { productName, craftTradition, artisanStory } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a marketing expert for traditional artisan crafts. 
    Generate a compelling product description for:
    - Product: ${productName}
    - Craft Tradition: ${craftTradition}
    - Artisan's Story: ${artisanStory}
    
    The description should:
    1. Highlight the cultural significance
    2. Emphasize the handmade quality
    3. Connect emotionally with buyers
    4. Be 2-3 paragraphs long
    
    Return only the description text, no headers or labels.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text();

    return NextResponse.json({ description });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
