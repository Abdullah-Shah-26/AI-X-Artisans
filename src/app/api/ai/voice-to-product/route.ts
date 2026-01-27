import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { audioBase64, mimeType, imageUrl } = await request.json();

    if (!audioBase64) {
      return NextResponse.json(
        { error: "Audio data is required" },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build the prompt parts
    const parts: any[] = [
      {
        inlineData: {
          data: audioBase64,
          mimeType: mimeType || "audio/webm",
        },
      },
    ];

    // Add image if provided
    if (imageUrl) {
      // Fetch image and convert to base64
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString("base64");
      const imageMimeType =
        imageResponse.headers.get("content-type") || "image/jpeg";

      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType,
        },
      });
    }

    parts.push({
      text: `You are an AI assistant helping artisans create product listings.

${imageUrl ? "Analyze the provided audio description and product image." : "Analyze the provided audio description."}

Extract and generate:
1. Product name (short, catchy)
2. Category (one of: Textiles, Pottery, Jewelry, Woodwork, Metalwork, Leather, Paintings, Sculptures, Basketry, Other)
3. Craft tradition (e.g., Handloom, Block Print, Embroidery, Terracotta, etc.)
4. Short description (1-2 sentences for product cards)
5. Detailed description (2-3 paragraphs highlighting cultural significance and craftsmanship)
6. Suggested price range in INR (minPrice and maxPrice as numbers)

Return ONLY a JSON object with this structure:
{
  "transcription": "verbatim transcription of the audio",
  "productName": "string",
  "category": "string",
  "craftTradition": "string",
  "shortDescription": "string",
  "detailedDescription": "string",
  "minPrice": number,
  "maxPrice": number
}`,
    });

    const result = await model.generateContent(parts);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const productData = JSON.parse(jsonMatch[0]);

    return NextResponse.json(productData);
  } catch (error: any) {
    console.error("Voice-to-product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process voice input" },
      { status: 500 },
    );
  }
}
