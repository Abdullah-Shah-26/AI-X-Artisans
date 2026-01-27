// Google Gemini AI service
// Move AI calls to server-side API routes to protect your API key

export async function generateProductDescription(
  productName: string,
  craftTradition: string,
  artisanStory: string
): Promise<string> {
  const response = await fetch("/api/ai/product-description", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productName, craftTradition, artisanStory }),
  });

  if (!response.ok) throw new Error("Failed to generate description");
  const data = await response.json();
  return data.description;
}

export async function generateCertificateText(
  artworkName: string,
  artistName: string,
  craftTradition: string
): Promise<string> {
  const response = await fetch("/api/ai/certificate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ artworkName, artistName, craftTradition }),
  });

  if (!response.ok) throw new Error("Failed to generate certificate");
  const data = await response.json();
  return data.certificateText;
}

export async function generateDesignIdeas(
  craftType: string,
  targetAudience: string
): Promise<
  {
    conceptName: string;
    description: string;
    colorPalette: { name: string; hex: string }[];
    suggestedPatterns: string[];
  }[]
> {
  const response = await fetch("/api/ai/design-ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ craftType, targetAudience }),
  });

  if (!response.ok) throw new Error("Failed to generate design ideas");
  const data = await response.json();
  return data.ideas;
}
