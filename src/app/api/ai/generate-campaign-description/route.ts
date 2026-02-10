import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  let title = "";

  try {
    const body = await req.json();
    title = body.title || "";

    if (!title) {
      return NextResponse.json(
        {
          description:
            "Help me fund this important project. Your support will enable me to grow my craft and continue preserving traditional artisan techniques.",
        },
        { status: 200 },
      );
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3.0-flash",
        generationConfig: {
          // @ts-ignore - latest SDK property for Gemini 3
          thinking_level: "low",
        }
      });

      const prompt = `Write a 2-3 sentence crowdfunding campaign description for: "${title}". Focus on why the artisan needs funding and the impact it will have. Keep it simple and heartfelt.`;

      const result = await model.generateContent(prompt);
      const description = result.response.text().trim();

      return NextResponse.json({ description });
    } catch (aiError) {
      console.error("AI generation error:", aiError);
      // Fallback if AI fails
      const fallbackDescription = `Help me fund this important project: ${title}. Your support will enable me to grow my craft and continue preserving traditional artisan techniques for future generations.`;
      return NextResponse.json({ description: fallbackDescription });
    }
  } catch (error) {
    console.error("Error in campaign description API:", error);

    // Always return a valid response
    const fallbackDescription = title
      ? `Help me fund this important project: ${title}. Your support will enable me to grow my craft and continue preserving traditional artisan techniques for future generations.`
      : `Help me fund this important project. Your support will enable me to grow my craft and continue preserving traditional artisan techniques for future generations.`;

    return NextResponse.json({ description: fallbackDescription });
  }
}
