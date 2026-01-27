import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

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

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json(getMockPrice(productType));
    }

    const groq = new Groq({ apiKey: groqKey });

    const prompt = `You are an expert in pricing handcrafted artisan products for the Indian market.

Product type: ${productType || "handcrafted artisan product"}

Suggest a fair price range in Indian Rupees (INR).

Consider:
- Type of craft (pottery, textiles, jewelry, woodwork, etc.)
- Quality and craftsmanship
- Materials typically used
- Time and skill required
- Indian market rates for similar handcrafted items
- Fair pricing that supports artisan livelihoods

Return ONLY a JSON object with minPrice and maxPrice as numbers.
Example: {"minPrice": 500, "maxPrice": 1500}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const jsonMatch = text.match(/\{[^}]+\}/);
    const result = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : getMockPrice(productType);

    return NextResponse.json(result);
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
