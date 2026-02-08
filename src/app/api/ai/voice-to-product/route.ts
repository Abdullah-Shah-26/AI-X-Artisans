import { Groq } from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { audioBase64, mimeType } = await request.json();

    if (!audioBase64) {
      return NextResponse.json(
        { error: "Audio data is required" },
        { status: 400 },
      );
    }

    // For demo purposes, simulate voice processing with predefined response
    // In a real implementation, you'd use speech-to-text then process with Groq

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return predefined saree data that matches the prefilled form
    const productData = {
      transcription:
        "I want to create a listing for my handwoven silk saree. It's a traditional Banarasi saree with intricate gold zari work and beautiful floral motifs. Each piece takes about 15 to 20 days to weave by master artisans. The price should be around 15000 rupees.",
      productName: "Handwoven Silk Saree",
      category: "Textiles",
      craftTradition: "Banarasi Weaving",
      shortDescription:
        "Traditional Banarasi silk saree with intricate gold zari work and floral motifs. Each piece takes 15-20 days to weave by master artisans.",
      detailedDescription:
        "This exquisite handwoven silk saree is a masterpiece of traditional Indian craftsmanship. Woven on traditional pit looms by skilled artisans, each thread tells a story of heritage spanning generations. The rich burgundy silk base is adorned with intricate gold zari work featuring traditional paisley and floral motifs. The elaborate border showcases geometric patterns that have been passed down through generations of master weavers. Each saree takes 15-20 days to complete, with artisans working meticulously to ensure every detail meets the highest standards of quality. The pallu features an exquisite design of intertwining vines and flowers, creating a stunning visual narrative. This saree represents the pinnacle of Banarasi weaving tradition, combining timeless elegance with exceptional craftsmanship.",
      minPrice: 12000,
      maxPrice: 18000,
    };

    return NextResponse.json(productData);
  } catch (error: any) {
    console.error("Voice-to-product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process voice input" },
      { status: 500 },
    );
  }
}
