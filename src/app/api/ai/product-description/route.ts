import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const { productName, craftTradition, artisanStory } = await request.json();

    console.log("Generating description for:", { productName, craftTradition });

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

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

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
    });

    const description = completion.choices[0]?.message?.content || "";

    console.log("Generated description successfully");
    return NextResponse.json({ description });
  } catch (error: any) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate description" },
      { status: 500 },
    );
  }
}
