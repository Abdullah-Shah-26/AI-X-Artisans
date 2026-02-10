"use client";

import { useState } from "react";
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
  "Banarasi Weaving",
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
  // Start with empty fields to make the voice demo more impactful
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [craftTradition, setCraftTradition] = useState("");
  const [createCertificate, setCreateCertificate] = useState(true);


  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const router = useRouter();

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      return; // Already recording
    }

    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsRecording(false);
      setAiLoading(true);

      try {
        const response = await fetch("/api/ai/voice-to-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcription: transcript }),
        });

        if (response.ok) {
          const data = await response.json();
          // Update all form fields from AI response
          if (data.productName) setName(data.productName);
          if (data.category) setCategory(data.category);
          if (data.craftTradition) setCraftTradition(data.craftTradition);
          if (data.price) setPrice(data.price.toString());
          if (data.shortDescription) setDescription(data.shortDescription);
          if (data.detailedStory) setLongDescription(data.detailedStory);
        } else {
          alert("Could not process voice input. Please try again or fill manually.");
        }
      } catch (error) {
        alert("An error occurred during voice processing.");
      } finally {
        setAiLoading(false);
      }
    };

    recognition.onerror = (event: any) => {
      // Ignore 'aborted' if it's not a real error (e.g. system being touchy)
      if (event.error !== "no-speech" && event.error !== "aborted") {
        alert(`Voice recognition error: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    try {
      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const generateDescription = async () => {
    if (!name || !craftTradition) {
      alert("Please enter product name and craft tradition first");
      return;
    }

    // Post-demo safety: simulate quota exceeded
    alert("AI Storyteller Quota Exceeded: You have reached the usage limit for AI-generated stories. Please upgrade to Pro for unlimited access.");
    return;

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
            heritageStory: null,
            craftTradition: craftTradition || "Traditional Craft",
            createdAt: new Date(),
            image,
          });
        }

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
      } else {
        alert("Failed to create product. Please try again.");
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Product
        </h1>
        <button
          type="button"
          onClick={handleVoiceInput}
          disabled={aiLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all shadow-sm ${
            isRecording
              ? "bg-red-500 text-white animate-pulse shadow-red-500/20"
              : "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/20"
          }`}
        >
          {aiLoading ? (
            <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
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
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          )}
          <span className="text-sm">
            {isRecording
              ? "Listening..."
              : aiLoading
                ? "Processing..."
                : "Fill form with Voice"}
          </span>
        </button>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-6 shadow-sm space-y-6"
      >
        {/* Two-column layout for desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
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
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-6">
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                  Short Description *
                </label>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description for product cards..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Full-width sections below */}
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
