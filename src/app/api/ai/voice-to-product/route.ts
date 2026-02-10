import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { transcription } = await request.json();

    if (!transcription) {
      return NextResponse.json(
        { error: "Transcription is required" },
        { status: 400 },
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
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.0-flash",
      generationConfig: {
        // @ts-ignore - Gemini 3 configuration
        thinking_level: "low",
        responseMimeType: "application/json"
      }
    });

    const prompt = `
      You are an AI assistant for an artisan marketplace. 
      Your task is to take a product description provided by an artisan (possibly via voice) and extract structured information.
      
      Extract the following fields in JSON format:
      - productName: Clear title for the product
      - category: One of [Textiles, Pottery, Jewelry, Woodwork, Metalwork, Leather, Paintings, Sculptures, Basketry, Other]
      - craftTradition: One of [Banarasi Weaving, Handloom, Block Print, Embroidery, Terracotta, Brass Work, Woodcarving, Lacquerware, Papier-mâché, Dhokra, Bidri, Kalamkari, Madhubani, Warli, Pattachitra, Other]
      - price: Estimated numeric price (just the number)
      - shortDescription: A 2-sentence marketing summary
      - detailedStory: A longer paragraph about the heritage and effort (100-150 words)

      If the user's input is in Hindi or another language, translate the extracted fields to English.
      If a field is missing, make a reasonable guess based on the context.
      Return ONLY valid JSON.

      Artisan Input: "${transcription}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const productData = JSON.parse(text || "{}");

    return NextResponse.json({
      ...productData,
      transcription, // Include original for reference
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process voice input" },
      { status: 500 },
    );
  }
}

