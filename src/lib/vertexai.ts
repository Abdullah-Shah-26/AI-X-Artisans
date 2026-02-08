// Vertex AI stub - replace with real implementation when credentials are configured
// This file exists to prevent build errors when @/lib/vertexai is imported

export async function generateVideo(
  prompt: string,
  imageUrl?: string,
  style?: string,
): Promise<any> {
  throw new Error(
    "Vertex AI not configured. Please add your Google Cloud credentials.",
  );
}

export async function generateImage(
  prompt: string,
  style?: string,
): Promise<any> {
  throw new Error(
    "Vertex AI not configured. Please add your Google Cloud credentials.",
  );
}

export async function analyzeImage(
  imageUrl: string,
  orientation?: string,
): Promise<any> {
  throw new Error(
    "Vertex AI not configured. Please add your Google Cloud credentials.",
  );
}
