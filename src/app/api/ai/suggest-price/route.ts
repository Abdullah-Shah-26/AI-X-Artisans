import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
    const { imageUrl, productType } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(getMockPrice(productType));
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

    // Handle base64 or URL
    let imagePart: any;
    if (imageUrl.startsWith("data:")) {
      const [mimeInfo, base64Data] = imageUrl.split(",");
      const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || "image/jpeg";
      imagePart = { inlineData: { data: base64Data, mimeType } };
    } else {
      // In a real environment, you'd fetch the image. 
      // For this implementation, we assume base64 is passed from the client as seen in other routes.
      // If it's a URL, Gemini can also take it in some SDK versions, but base64 is safer.
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = response.headers.get("content-type") || "image/jpeg";
      imagePart = { inlineData: { data: base64, mimeType } };
    }

    const prompt = `Analyze this product image and suggest a fair price range in Indian Rupees (INR).
    
    Product type: ${productType || "handcrafted artisan product"}
    
    Consider:
    - The visual quality/intricacy shown in the image
    - Type of craft and materials visible
    - Estimated time and skill required for this specific piece
    - Current Indian market rates for similar handcrafted items
    - Fair pricing that supports artisan livelihoods
    
    Return ONLY a JSON object with keys: minPrice and maxPrice (numbers).`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json({
        minPrice: parsed.minPrice || parsed.min_price,
        maxPrice: parsed.maxPrice || parsed.max_price
      });
    } catch (parseError) {
      console.error("Failed to parse Gemini pricing JSON:", text);
      return NextResponse.json(getMockPrice(productType));
    }
  } catch (error) {
    console.error("Price suggestion error:", error);
    return NextResponse.json(getMockPrice(body?.productType));
  }
}


function getMockPrice(productType?: string) {
  const keywords = (productType || "").toLowerCase();

  // Default price range
  let minPrice = 500;
  let maxPrice = 1500;

  if (keywords.includes("silk") || keywords.includes("saree")) {
    minPrice = 2500;
    maxPrice = 8000;
  } else if (keywords.includes("pottery") || keywords.includes("ceramic")) {
    minPrice = 400;
    maxPrice = 1200;
  } else if (keywords.includes("jewelry") || keywords.includes("silver")) {
    minPrice = 1500;
    maxPrice = 5000;
  } else if (keywords.includes("wood") || keywords.includes("carving")) {
    minPrice = 800;
    maxPrice = 3000;
  } else if (keywords.includes("textile") || keywords.includes("fabric")) {
    minPrice = 600;
    maxPrice = 2000;
  } else if (keywords.includes("painting") || keywords.includes("art")) {
    minPrice = 1000;
    maxPrice = 5000;
  } else if (keywords.includes("basket") || keywords.includes("weave")) {
    minPrice = 300;
    maxPrice = 1000;
  }

  return { minPrice, maxPrice };
}
