import { GoogleGenAI, Modality, Part, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey });
};

// Generate product description from image
export async function generateProductDescription(
  imageUrl: string,
  productHints?: string
): Promise<{
  description: string;
  productName: string;
  category: string;
  hashtags: string[];
}> {
  const ai = getAI();

  // Fetch image and convert to base64
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString("base64");
  const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

  const prompt = `You are an AI assistant for artisans. Analyze this product image and generate:
1. A compelling product description (2-3 sentences highlighting craftsmanship, materials, and uniqueness)
2. A catchy product name
3. A product category (e.g., Pottery, Textiles, Jewelry, Home Decor, Woodwork)
4. 5-7 relevant hashtags for social media

${productHints ? `Additional context from the artisan: "${productHints}"` : ""}

Return ONLY a JSON object with keys: description, productName, category, hashtags (array of strings without #)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.0-flash",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            productName: { type: Type.STRING },
            category: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (
      errorMessage.includes("429") ||
      errorMessage.toLowerCase().includes("quota")
    ) {
      console.warn("⚠️ Gemini Description: Quota exceeded");
      throw new Error("QUOTA_EXCEEDED");
    }

    console.error(`Gemini Description error: ${errorMessage.split("\n")[0]}`);
    throw error;
  }
}

// Edit/enhance image with AI - uses gemini-2.5-flash-image (same as original project)
// NOTE: This model requires your API key to be allowlisted by Google for image generation
export async function enhanceImageWithAI(
  imageUrl: string,
  prompt: string
): Promise<{ enhancedImageBase64: string; mimeType: string } | null> {
  const ai = getAI();

  // Fetch image and convert to base64
  let base64Image: string;
  let mimeType: string;

  if (imageUrl.startsWith("data:")) {
    // Already a data URL
    const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1];
      base64Image = matches[2];
    } else {
      throw new Error("Invalid data URL format");
    }
  } else {
    // Fetch from URL
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    base64Image = Buffer.from(imageBuffer).toString("base64");
    mimeType = imageResponse.headers.get("content-type") || "image/jpeg";
  }

  // Use the same model as the original project: gemini-2.5-flash-image
  // This model can generate/edit images but requires API key allowlisting
  try {
    console.log("Trying image enhancement with gemini-2.5-flash-image");

    const response = await ai.models.generateContent({
      model: "gemini-3.0-flash-image",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      console.log("No candidates from gemini-2.5-flash-image");
      return null;
    }

    const imagePart = response.candidates[0].content?.parts?.find(
      (part: Part) => part.inlineData
    );

    if (imagePart?.inlineData?.data && imagePart.inlineData.mimeType) {
      console.log("Success with gemini-2.5-flash-image!");
      return {
        enhancedImageBase64: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
      };
    }

    console.log("No image data in response");
    return null;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Clean logs for common errors
    if (
      errorMessage.includes("429") ||
      errorMessage.toLowerCase().includes("quota")
    ) {
      console.warn("⚠️ Gemini Image Enhancement: Quota exceeded");
      throw new Error("QUOTA_EXCEEDED");
    }

    if (
      errorMessage.includes("not found") ||
      errorMessage.includes("permission") ||
      errorMessage.includes("not supported")
    ) {
      console.warn(
        "⚠️ Gemini Image Enhancement: Model permission/availability issue"
      );
    } else {
      console.error(
        `Gemini Image Enhancement failed: ${errorMessage.split("\n")[0]}`
      );
    }

    return null;
  }
}

// Generate text content
export async function generateText(prompt: string): Promise<string> {
  const ai = getAI();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.0-flash",
      contents: prompt,
    });
    return response.text || "";
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (
      errorMessage.includes("429") ||
      errorMessage.toLowerCase().includes("quota")
    ) {
      console.warn("⚠️ Gemini Text: Quota exceeded");
      throw new Error("QUOTA_EXCEEDED");
    }

    console.error(`Gemini Text error: ${errorMessage.split("\n")[0]}`);
    throw error;
  }
}
