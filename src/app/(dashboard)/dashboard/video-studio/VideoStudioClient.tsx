"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Sparkles, Lightbulb, Coins, Wand2, Info } from "lucide-react";

// Social Media Icons
const InstagramIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const MicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

// Professional SVG Icons
const SlideshowIcon = () => (
  <svg
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
    />
  </svg>
);

const ZoomIcon = () => (
  <svg
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
    />
  </svg>
);

const RotateIcon = () => (
  <svg
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

const StoryIcon = () => (
  <svg
    className="w-7 h-7"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
    />
  </svg>
);

const videoStyles = [
  {
    id: "slideshow",
    name: "Slideshow",
    desc: "Smooth transitions",
    Icon: SlideshowIcon,
  },
  { id: "zoom", name: "Zoom Effect", desc: "Dynamic zoom", Icon: ZoomIcon },
  {
    id: "rotate",
    name: "360° View",
    desc: "Product rotation",
    Icon: RotateIcon,
  },
  {
    id: "story",
    name: "Story Mode",
    desc: "Social media style",
    Icon: StoryIcon,
  },
];

const aspectRatios = [
  { id: "9:16", name: "Vertical", desc: "TikTok" },
  { id: "1:1", name: "Square", desc: "Instagram" },
  { id: "16:9", name: "Horizontal", desc: "YouTube" },
];

const socialPlatforms = [
  {
    id: "instagram",
    name: "Instagram",
    Icon: InstagramIcon,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "facebook",
    name: "Facebook",
    Icon: FacebookIcon,
    color: "bg-blue-600",
  },
  { id: "twitter", name: "X", Icon: TwitterIcon, color: "bg-black" },
  {
    id: "linkedin",
    name: "LinkedIn",
    Icon: LinkedInIcon,
    color: "bg-blue-700",
  },
];

export function VideoStudioClient() {
  const { language } = useLanguage();
  const [imageFile, setImageFile] = useState<{ url: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("slideshow");
  const [selectedRatio, setSelectedRatio] = useState("9:16");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [description, setDescription] = useState("");
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const handleVoiceInput = () => {
    // If already listening, stop the current session
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      newRecognition.lang = language === "hi" ? "hi-IN" : "en-US";
      newRecognition.continuous = false;
      newRecognition.interimResults = false;

      newRecognition.onstart = () => {
        setIsListening(true);
        setRecognition(newRecognition);
      };

      newRecognition.onend = () => {
        setIsListening(false);
        setRecognition(null);
      };

      newRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription((prev) => (prev ? prev + " " + transcript : transcript));
      };

      newRecognition.onerror = (event: any) => {
        // Silently handle common errors that aren't actual problems
        if (event.error !== "aborted" && event.error !== "no-speech") {
          console.error("Speech recognition error", event.error);
        }
        setIsListening(false);
        setRecognition(null);
      };

      try {
        newRecognition.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
        setIsListening(false);
        setRecognition(null);
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile({ url: reader.result as string });
        setVideoResult(null);
        setSuggestedPrice(null);
        setDescription("");
      };
      reader.readAsDataURL(file);
    }
  };

  const suggestPrice = async () => {
    if (!imageFile) return;
    setLoadingPrice(true);
    try {
      const res = await fetch("/api/ai/suggest-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageFile.url,
          productType: productName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestedPrice({ min: data.minPrice, max: data.maxPrice });
        // Auto-fill with minimum price
        setPrice(data.minPrice.toString());
      }
    } catch (err) {
      console.error("Price suggestion failed:", err);
    } finally {
      setLoadingPrice(false);
    }
  };

  const generateDescription = async () => {
    if (!imageFile) return;
    setLoadingDescription(true);
    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageFile.url,
          productType: productName,
          platform: "instagram",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDescription(data.postContent || data.description || "");
      }
    } catch (err) {
      console.error("Description generation failed:", err);
    } finally {
      setLoadingDescription(false);
    }
  };

  const shareToSocial = (platform: string) => {
    const priceText = price ? `\n\nPrice: ₹${price}` : "";
    const text = encodeURIComponent(`${description}${priceText}`);
    const urls: Record<string, string> = {
      instagram: "https://www.instagram.com/",
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        videoResult || "",
      )}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  const generateVideo = async () => {
    if (!imageFile) return;

    setIsGenerating(true);
    setVideoResult(null);

    try {
      // Add realistic delay for demo mode (3-5 seconds for video)
      await new Promise((resolve) =>
        setTimeout(resolve, 3000 + Math.random() * 2000),
      );

      // Start video generation
      const res = await fetch("/api/ai/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageFile.url,
          style: selectedStyle,
          story:
            description ||
            `Showcasing handcrafted ${productName || "artisan product"}`,
          productName,
        }),
      });

      const data = await res.json();

      if (data.error) {
        console.error("Video generation error:", data.error);
        alert(data.error);
        setIsGenerating(false);
        return;
      }

      // Check if video is already completed (demo mode)
      if (data.status === "completed" && data.videoUrl) {
        setVideoResult(data.videoUrl);
        setIsGenerating(false);
        return;
      }

      // Otherwise, poll for completion (real mode)
      if (data.status === "started" && data.requestId) {
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch("/api/ai/generate-video", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "check",
                requestId: data.requestId,
              }),
            });

            const statusData = await statusRes.json();

            if (statusData.status === "completed" && statusData.videoUrl) {
              clearInterval(pollInterval);
              setVideoResult(statusData.videoUrl);
              setIsGenerating(false);
            } else if (statusData.status === "failed") {
              clearInterval(pollInterval);
              alert(
                "Video generation failed: " +
                  (statusData.error || "Unknown error"),
              );
              setIsGenerating(false);
            }
          } catch (pollErr) {
            console.error("Polling error:", pollErr);
          }
        }, 3000);

        // Timeout after 3 minutes
        setTimeout(
          () => {
            clearInterval(pollInterval);
            setIsGenerating(false);
          },
          3 * 60 * 1000,
        );
      }
    } catch (err) {
      console.error("Video generation error:", err);
      alert("Failed to start video generation");
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          AI Video Studio
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-1">
          Create promotional videos from your product images
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Upload Product Image
            </h3>
            <div className="relative w-full h-64 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800 cursor-pointer">
              {imageFile ? (
                <img
                  src={imageFile.url}
                  alt="Preview"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div className="text-center text-gray-500 dark:text-zinc-400">
                  <svg
                    className="mx-auto h-12 w-12 mb-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p>Click or drag to upload</p>
                </div>
              )}
              <input
                type="file"
                className="absolute w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>
          </div>

          {/* Video Style */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Video Style
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {videoStyles.map((style) => {
                const IconComponent = style.Icon;
                return (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      selectedStyle === style.id
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                        : "border-gray-200 dark:border-zinc-700 hover:border-emerald-400"
                    }`}
                  >
                    <div
                      className={`flex justify-center mb-2 ${
                        selectedStyle === style.id
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-400 dark:text-zinc-500"
                      }`}
                    >
                      <IconComponent />
                    </div>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">
                      {style.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      {style.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-4 sm:p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">
              Aspect Ratio
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setSelectedRatio(ratio.id)}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-center ${
                    selectedRatio === ratio.id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-gray-200 dark:border-zinc-700 hover:border-emerald-400"
                  }`}
                >
                  <p className="font-semibold text-gray-800 dark:text-white text-xs sm:text-sm">
                    {ratio.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    {ratio.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Product Name (Optional)
            </h3>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name for text overlay..."
              className="w-full p-3 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Price Input */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Price
              </h3>
              <button
                type="button"
                onClick={suggestPrice}
                disabled={!imageFile || loadingPrice}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loadingPrice ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Suggest Price
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-zinc-400">
                ₹
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {suggestedPrice && (
              <div className="mt-3 space-y-2">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Suggested: ₹{suggestedPrice.min.toLocaleString()} - ₹
                    {suggestedPrice.max.toLocaleString()}
                  </p>
                  {/* Price Slider */}
                  <div className="space-y-1 relative">
                    {/* Optimal price marker */}
                    <div
                      className="absolute top-0 w-0.5 h-2 bg-amber-500 z-10"
                      style={{
                        left: `${(((suggestedPrice.min + suggestedPrice.max) / 2 - suggestedPrice.min) / (suggestedPrice.max - suggestedPrice.min)) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                      title="Optimal market price"
                    />
                    <input
                      type="range"
                      min={suggestedPrice.min}
                      max={suggestedPrice.max}
                      value={price || suggestedPrice.min}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-2 bg-emerald-200 dark:bg-emerald-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                      <span>₹{suggestedPrice.min.toLocaleString()}</span>
                      <span className="font-semibold">
                        ₹{parseInt(price || "0").toLocaleString()}
                      </span>
                      <span>₹{suggestedPrice.max.toLocaleString()}</span>
                    </div>
                    {/* Market indicator */}
                    <div className="flex items-center justify-center gap-1 text-xs mt-1">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        Best for selling: ₹
                        {Math.round(
                          (suggestedPrice.min + suggestedPrice.max) / 2,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              Price will be included when sharing to social media
            </p>
          </div>

          {/* AI Description */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Description
                </h3>
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  title={isListening ? "Listening..." : "Voice Input"}
                  className={`p-1.5 rounded-lg transition-all ${
                    isListening
                      ? "text-red-500 bg-red-50 dark:bg-red-500/10 animate-pulse"
                      : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                  }`}
                >
                  <MicIcon />
                </button>
              </div>
              <button
                type="button"
                onClick={generateDescription}
                disabled={!imageFile || loadingDescription}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loadingDescription ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    AI Generate
                  </>
                )}
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for social media sharing..."
              className="w-full p-3 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-xl h-24 focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Right: Preview & Generator */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 sticky top-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Video Generator
            </h3>

            {/* Generate Button moved here */}
            <button
              onClick={generateVideo}
              disabled={!imageFile || isGenerating}
              className="w-full mb-6 py-4 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating Video...
                </>
              ) : (
                <> Generate Video</>
              )}
            </button>

            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Preview
            </h3>
            <div
              className={`border border-gray-200 dark:border-zinc-700 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800 overflow-hidden ${
                selectedRatio === "9:16"
                  ? "aspect-9/16"
                  : selectedRatio === "1:1"
                    ? "aspect-square"
                    : "aspect-video"
              }`}
            >
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  {/* Subtle animated background gradient - full coverage */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 animate-pulse"></div>

                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-br-full"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-tl-full"></div>

                  {/* Main content centered */}
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-12">
                    {/* Large elegant spinner */}
                    <div className="relative">
                      <svg
                        className="animate-spin h-24 w-24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-10"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          className="text-purple-600 dark:text-purple-400"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 blur-2xl bg-purple-500/20 animate-pulse"></div>
                    </div>

                    {/* Clean text with more presence */}
                    <div className="relative text-center space-y-3 max-w-md">
                      <p className="text-2xl font-semibold text-gray-800 dark:text-zinc-200">
                        Creating your video
                      </p>
                      <p className="text-base text-gray-500 dark:text-zinc-400">
                        Applying {selectedStyle} style...
                      </p>
                    </div>

                    {/* Minimal progress dots */}
                    <div className="flex gap-3">
                      <div
                        className="w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0ms",
                          animationDuration: "1s",
                        }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "200ms",
                          animationDuration: "1s",
                        }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "400ms",
                          animationDuration: "1s",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Bottom decorative line */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent rounded-full"></div>
                </div>
              ) : videoResult ? (
                <video
                  src={videoResult}
                  controls
                  className="w-full h-full object-contain"
                  poster={imageFile?.url}
                />
              ) : (
                <div className="text-center p-4">
                  <svg
                    className="w-16 h-16 text-gray-300 dark:text-zinc-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-400 dark:text-zinc-500">
                    Video preview here
                  </p>
                </div>
              )}
            </div>

            {videoResult && (
              <div className="mt-4 space-y-4">
                <a
                  href={videoResult}
                  download
                  className="block w-full py-2.5 text-center text-sm font-medium bg-gray-800 dark:bg-zinc-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-zinc-600"
                >
                  Download Video
                </a>

                {/* Social Sharing */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Share to Social Media
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {socialPlatforms.map((platform) => {
                      const IconComponent = platform.Icon;
                      return (
                        <button
                          key={platform.id}
                          onClick={() => shareToSocial(platform.id)}
                          className={`${platform.color} text-white p-2.5 rounded-lg hover:opacity-90 transition flex items-center justify-center`}
                          title={platform.name}
                        >
                          <IconComponent />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description Preview */}
                {description && (
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">
                      Post Caption:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-zinc-300 line-clamp-3">
                      {description}
                    </p>
                    {price && (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> ₹{price}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
              <h4 className="font-medium text-emerald-800 dark:text-emerald-300 text-sm mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                Tips
              </h4>
              <ul className="text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
                <li>• Use high-quality product images</li>
                <li>• Vertical videos work best for social</li>
                <li>• Add product name for text overlays</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
