"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/common/ImageUpload";

const categories = [
  "Textiles",
  "Pottery",
  "Jewelry",
  "Woodwork",
  "Metalwork",
  "Leather",
  "Paintings",
  "Sculptures",
  "Basketry",
  "Other",
];

const craftTraditions = [
  "Handloom",
  "Block Print",
  "Embroidery",
  "Terracotta",
  "Brass Work",
  "Woodcarving",
  "Lacquerware",
  "Papier-mâché",
  "Dhokra",
  "Bidri",
  "Kalamkari",
  "Madhubani",
  "Warli",
  "Pattachitra",
  "Other",
];

interface ProductFormProps {
  artisanStory: string;
  isDemo?: boolean;
}

export function ProductForm({ artisanStory, isDemo }: ProductFormProps) {
  // Pre-fill with demo data if in demo mode
  const [name, setName] = useState(isDemo ? "Hand-woven Silk Saree" : "");
  const [description, setDescription] = useState(
    isDemo ? "Exquisite handloom silk saree with traditional motifs" : "",
  );
  const [longDescription, setLongDescription] = useState(
    isDemo
      ? "This stunning silk saree is a masterpiece of traditional Indian craftsmanship. Woven on a handloom using pure mulberry silk, it features intricate traditional motifs inspired by ancient temple architecture. Each thread is carefully selected and dyed using natural colors, ensuring vibrant hues that last for generations. The saree takes approximately 15-20 days to complete, with skilled artisans dedicating their expertise to every detail. The pallu showcases elaborate peacock designs, a symbol of grace and beauty in Indian culture. This saree represents not just a garment, but a piece of living heritage, connecting the wearer to centuries of textile tradition."
      : "",
  );
  const [price, setPrice] = useState(isDemo ? "8500" : "");
  const [image, setImage] = useState(isDemo ? "/demo/saree-classic.png" : "");
  const [category, setCategory] = useState(isDemo ? "Textiles" : "");
  const [craftTradition, setCraftTradition] = useState(
    isDemo ? "Handloom" : "",
  );
  const [createCertificate, setCreateCertificate] = useState(
    isDemo ? true : false,
  );

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const router = useRouter();

  const generateDescription = async () => {
    if (!name || !craftTradition) {
      alert("Please enter product name and craft tradition first");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/product-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: name,
          craftTradition,
          artisanStory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLongDescription(data.description);
      }
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleVoiceToProduct = async () => {
    if (!audioBlob) return;

    setVoiceLoading(true);
    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      await new Promise((resolve) => {
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(",")[1];

          const response = await fetch("/api/ai/voice-to-product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audioBase64: base64Audio,
              mimeType: audioBlob.type,
              imageUrl: image || undefined,
            }),
          });

          if (response.ok) {
            const data = await response.json();

            // Fill form with AI-generated data
            setName(data.productName || "");
            setCategory(data.category || "");
            setCraftTradition(data.craftTradition || "");
            setDescription(data.shortDescription || "");
            setLongDescription(data.detailedDescription || "");

            // Set price to average of suggested range
            if (data.minPrice && data.maxPrice) {
              const avgPrice = (data.minPrice + data.maxPrice) / 2;
              setPrice(avgPrice.toString());
            }

            setShowVoiceModal(false);
            setAudioBlob(null);
            alert(
              "Product details generated from your voice! Review and adjust as needed.",
            );
          } else {
            throw new Error("Failed to process voice input");
          }

          resolve(null);
        };
      });
    } catch (error) {
      console.error("Error processing voice:", error);
      alert("Failed to process voice input. Please try again.");
    } finally {
      setVoiceLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In demo mode, save to localStorage
      if (isDemo) {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

        // Dynamically import to avoid SSR issues
        const { saveDemoProduct, saveDemoCertificate } =
          await import("@/lib/demoStorage");

        // Generate unique ID
        const productId = `demo-${Date.now()}`;

        // Save product to localStorage
        saveDemoProduct({
          id: productId,
          name,
          description,
          longDescription,
          price: parseFloat(price),
          image,
          category,
          craftTradition,
          dateAdded: new Date(),
        });

        // Save certificate if requested
        if (createCertificate) {
          saveDemoCertificate({
            id: `cert-${productId}`,
            productId,
            productName: name,
            heritageStory: longDescription || description || "",
            craftTradition: craftTradition || "Traditional Craft",
            createdAt: new Date(),
          });
        }

        alert(
          `Product "${name}" created successfully!${createCertificate ? " Certificate generated." : ""}`,
        );
        router.push("/dashboard/products");
        router.refresh();
        return;
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          longDescription,
          price: parseFloat(price),
          image,
          category,
          craftTradition,
          createCertificate,
        }),
      });

      if (response.ok) {
        router.push("/dashboard/products");
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Voice Input Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                🎤 Voice to Product
              </h3>
              <button
                onClick={() => {
                  setShowVoiceModal(false);
                  setAudioBlob(null);
                  handleStopRecording();
                }}
                className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                {!audioBlob
                  ? "Describe your product in your own words. Include details about materials, craftsmanship, and cultural significance."
                  : "Recording complete! Click 'Generate Product' to create your listing."}
              </p>

              {/* Recording Button */}
              <button
                onClick={
                  isRecording ? handleStopRecording : handleStartRecording
                }
                disabled={voiceLoading || audioBlob !== null}
                className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : audioBlob
                      ? "bg-green-500 text-white"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                } disabled:opacity-50`}
              >
                <svg
                  className="w-12 h-12"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7v2h6v-2h-2v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <p className="font-semibold text-gray-700 dark:text-zinc-300">
                {isRecording
                  ? "🔴 Recording... Click to stop"
                  : audioBlob
                    ? "✅ Recording saved"
                    : "Click to start recording"}
              </p>

              {/* Optional: Upload image first */}
              {!image && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-lg p-3">
                  <p className="text-xs text-amber-800 dark:text-amber-400">
                    💡 Tip: Upload a product image first for better AI analysis!
                  </p>
                </div>
              )}

              {/* Generate Button */}
              {audioBlob && (
                <button
                  onClick={handleVoiceToProduct}
                  disabled={voiceLoading}
                  className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {voiceLoading ? (
                    <>
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      AI Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Generate Product
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-6 shadow-sm space-y-6"
      >
        {/* Voice Input Button - Top of form */}
        <div className="bg-linear-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-2 border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7v2h6v-2h-2v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
                Create with Voice
              </h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                Describe your product in your language - AI will fill the form!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowVoiceModal(true)}
              className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7v2h6v-2h-2v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
              Start Voice Input
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Hand-woven Silk Saree"
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
              Craft Tradition
            </label>
            <select
              value={craftTradition}
              onChange={(e) => setCraftTradition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Select tradition</option>
              {craftTraditions.map((craft) => (
                <option key={craft} value={craft}>
                  {craft}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            Price (₹) *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            Product Image *
          </label>
          <ImageUpload
            onUpload={setImage}
            currentImage={image}
            bucket="images"
            folder="products"
          />
          <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
            Use Photo Studio to enhance your product images after uploading
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            Short Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description for product cards..."
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        {/* AI Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Detailed Story
            </label>
            <button
              type="button"
              onClick={generateDescription}
              disabled={aiLoading}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate with AI
                </>
              )}
            </button>
          </div>
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            placeholder="Tell the story of this product, its cultural significance, and craftsmanship..."
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
            AI will generate a compelling story based on your product and craft
            tradition
          </p>
        </div>

        {/* Certificate Option */}
        <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 border border-emerald-200 dark:border-emerald-500/30">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={createCertificate}
              onChange={(e) => setCreateCertificate(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                Create Digital Authenticity Certificate
              </span>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                Generate an AI-powered certificate with heritage story and QR
                code. Customers can verify authenticity and learn about your
                craft tradition.
              </p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </>
  );
}
