import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { generateProductContentWithGroq } from "@/lib/groq";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const platformPrompts: Record<string, string> = {
  instagram: `Create an engaging Instagram post. Use emojis naturally, make it visually descriptive, and include a call-to-action. The tone should be warm, authentic, and inspiring. Focus on the story behind the craft.`,
  facebook: `Create a Facebook post that tells a compelling story. Make it conversational and engaging, encourage comments and shares. Include details about the artisan's journey and the product's uniqueness.`,
  linkedin: `Create a professional LinkedIn post highlighting the business value, sustainability aspects, and the artisan's expertise. Focus on craftsmanship, fair trade, and supporting local communities.`,
  twitter: `Create a concise, impactful tweet (under 280 characters for the main message). Make it catchy and shareable. Use trending-style language.`,
};

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
    const {
      imageUrl,
      productType,
      platform = "instagram",
    } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    const groqResult = await generateProductContentWithGroq(
      productType,
      platform
    );
    return NextResponse.json(groqResult);
  } catch (error: any) {
    console.error("Description generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
