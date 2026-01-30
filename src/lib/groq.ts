// Groq API for fast Llama inference (text only - no image generation)

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function generateWithGroq(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    // Try to parse JSON error if possible
    let errorMessage = errorText;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error?.message || errorText;
    } catch {}

    if (response.status === 429) {
      console.warn("⚠️ Groq API: Quota/Rate limit exceeded");
    } else {
      console.error(`Groq API error (${response.status}): ${errorMessage}`);
    }
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

export async function generateProductContentWithGroq(
  productDescription: string,
  platform: string
): Promise<{
  productName: string;
  category: string;
  description: string;
  postContent: string;
  hashtags: string[];
}> {
  const platformInstructions: Record<string, string> = {
    instagram:
      "Create an engaging Instagram post with emojis, storytelling, and a call-to-action.",
    facebook:
      "Create a conversational Facebook post that encourages engagement and shares.",
    linkedin:
      "Create a professional LinkedIn post focusing on craftsmanship and business value.",
    twitter: "Create a concise, impactful tweet under 280 characters.",
  };

  const prompt = `You are a marketing expert for artisan products. Based on this product description, generate marketing content.

Product: ${productDescription || "A handcrafted artisan product"}

Platform: ${platform}
Instructions: ${
    platformInstructions[platform] || platformInstructions.instagram
  }

Respond with ONLY a valid JSON object (no markdown, no explanation) with these exact keys:
{
  "productName": "catchy product name",
  "category": "product category like Pottery, Textiles, Jewelry, etc.",
  "description": "2-3 sentence product description",
  "postContent": "the social media post content",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
}`;

  const systemPrompt =
    "You are a JSON generator. Always respond with valid JSON only, no markdown formatting, no code blocks, no explanation.";

  const result = await generateWithGroq(prompt, systemPrompt);

  // Parse JSON from response
  try {
    // Try to extract JSON if wrapped in code blocks
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(result);
  } catch {
    console.warn("⚠️ Groq Response Parsing Failed: Invalid JSON format");
    // Return fallback
    return {
      productName: "Artisan Creation",
      category: "Handcrafted",
      description:
        productDescription ||
        "A beautiful handcrafted piece made with care and tradition.",
      postContent: `Discover this amazing handcrafted piece! Made with love and tradition. ${
        platform === "instagram" ? "✨🎨" : ""
      }`,
      hashtags: [
        "handmade",
        "artisan",
        "handcrafted",
        "shopsmall",
        "supportlocal",
      ],
    };
  }
}
