import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { productName, originalPrice, offerAmount, artisanHistory } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ advice: "Please configure your API key for AI advice." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.0-flash",
      generationConfig: {
        // @ts-ignore - Gemini 3 configuration
        thinking_level: "low",
      }
    });

    const prompt = `
      You are an expert business advisor for traditional artisans.
      An artisan is selling "${productName}" for ₹${originalPrice}.
      A customer has offered ₹${offerAmount}.
      
      Artisan Context: ${artisanHistory || "No previous history."}
      
      Provide a brief, 2-sentence tactical recommendation for the artisan. 
      Should they Accept, Reject, or Counter? If Counter, what specific amount?
      Be empathetic to the artisan's need for a fair wage while considering the customer's interest.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ advice: text });
  } catch (error: any) {
    console.error("Negotiation advice error:", error);
    return NextResponse.json({ error: "Failed to get AI advice" }, { status: 500 });
  }
}
