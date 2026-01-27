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

    // Use Groq directly (no vision, but better rate limits)
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

    const platform = body?.platform || "instagram";
    const productType = body?.productType || "";
    
    return NextResponse.json(getMockContent(platform, productType));
  }
}


function getMockContent(platform: string, productType: string) {
  const keywords = (productType || "").toLowerCase();

  let productName = "Handcrafted Artisan Creation";
  let category = "Artisan Crafts";
  let description =
    "This remarkable handcrafted piece showcases the dedication of traditional artisans. Created using time-honored techniques, it represents the perfect blend of functionality and artistic expression.";

  if (
    keywords.includes("silk") ||
    keywords.includes("textile") ||
    keywords.includes("scarf")
  ) {
    productName = "Heritage Silk Weave";
    category = "Textiles";
    description =
      "Luxurious handwoven textile showcasing traditional weaving mastery. Each thread carefully selected by skilled artisans, embodying elegance and cultural heritage.";
  } else if (keywords.includes("pottery") || keywords.includes("ceramic")) {
    productName = "Artisan Clay Vessel";
    category = "Pottery";
    description =
      "Crafted from locally-sourced clay, this ceramic piece represents the pinnacle of artisan pottery with organic forms and earthy glazes.";
  } else if (keywords.includes("jewelry") || keywords.includes("silver")) {
    productName = "Handforged Silver Piece";
    category = "Jewelry";
    description =
      "Exquisite handcrafted jewelry combining traditional metalworking with contemporary design. Each element carefully shaped by master artisans.";
  }

  const postContents: Record<string, string> = {
    instagram: `✨ Discover the magic of handcrafted artistry! ✨\n\nThis ${productName.toLowerCase()} tells a story of tradition, skill, and passion. Every piece is unique, made with love by talented artisans.\n\n🌿 Sustainable • 🤝 Fair Trade • 💫 One-of-a-kind\n\nSupport artisan communities! 🛒`,
    facebook: `🎨 Meet the hands behind the craft!\n\nThis beautiful ${productName.toLowerCase()} carries the soul of traditional craftsmanship. When you choose handmade, you're supporting families and preserving traditions.\n\n💬 What draws you to handcrafted items?`,
    linkedin: `Proud to showcase this exceptional ${productName.toLowerCase()} from our artisan partners.\n\n✅ Sustainable production\n✅ Fair wages for craftspeople\n✅ Preservation of traditional techniques\n\nSupporting artisan communities is good ethics and good business.`,
    twitter: `✨ Handcrafted with love. This ${productName.toLowerCase()} proves traditional craftsmanship never goes out of style. Support artisans! 🛒`,
  };

  const hashtags = [
    "handmade",
    "artisan",
    "handcrafted",
    "supportlocal",
    "sustainablefashion",
    "traditionalcraft",
    "madewithlove",
    "ethicalfashion",
  ];

  return {
    productName,
    category,
    description,
    postContent: postContents[platform] || postContents.instagram,
    hashtags: hashtags.slice(0, platform === "twitter" ? 5 : 8),
  };
}
