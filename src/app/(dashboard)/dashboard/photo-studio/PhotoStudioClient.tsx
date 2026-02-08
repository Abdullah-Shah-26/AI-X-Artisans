"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Sparkles, Lightbulb, Wand2 } from "lucide-react";

// Theme icons as SVG components
const CleanIcon = () => (
  <svg
    className="h-8 w-8 mb-2 mx-auto"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const FestiveIcon = () => (
  <svg
    className="h-8 w-8 mb-2 mx-auto"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const ArtisticIcon = () => (
  <svg
    className="h-8 w-8 mb-2 mx-auto"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
    />
  </svg>
);

const RusticIcon = () => (
  <svg
    className="h-8 w-8 mb-2 mx-auto"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0112 3c1.398 0 2.743.57 3.728 1.506C18.5 7 19 10 19 12c1 1 2.343 2.343 2.343 2.343a8 8 0 01-3.686 4.314z"
    />
  </svg>
);

const UploadIcon = () => (
  <svg
    className="mx-auto h-12 w-12"
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
);

// Social Media Icons - for platform selection (colored)
const InstagramIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
    <defs>
      <linearGradient
        id="instagram-gradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#833AB4" />
        <stop offset="50%" stopColor="#E1306C" />
        <stop offset="100%" stopColor="#FD1D1D" />
      </linearGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#000000">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// White icons for share buttons
const InstagramIconWhite = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIconWhite = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIconWhite = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="white">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIconWhite = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="white">
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

const themes = [
  {
    id: "clean",
    name: "Clean",
    description: "White background, studio lighting",
    icon: CleanIcon,
  },
  {
    id: "festive",
    name: "Festive",
    description: "Warm, celebratory mood",
    icon: FestiveIcon,
  },
  {
    id: "artistic",
    name: "Artistic",
    description: "Creative, unique style",
    icon: ArtisticIcon,
  },
  {
    id: "rustic",
    name: "Rustic",
    description: "Natural, handcrafted feel",
    icon: RusticIcon,
  },
];

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: InstagramIcon,
    iconWhite: InstagramIconWhite,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: FacebookIcon,
    iconWhite: FacebookIconWhite,
    color: "bg-blue-600",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: TwitterIcon,
    iconWhite: TwitterIconWhite,
    color: "bg-black",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: LinkedInIcon,
    iconWhite: LinkedInIconWhite,
    color: "bg-blue-700",
  },
];

export function PhotoStudioClient() {
  const { t, language } = useLanguage();
  const [imageFile, setImageFile] = useState<{
    b64: string;
    mime: string;
    url: string;
  } | null>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [price, setPrice] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    imageUrl?: string;
    description?: string;
    productName?: string;
    postContent?: string;
    hashtags?: string[];
    message?: string;
  } | null>(null);

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
        setPrompt((prev) => (prev ? prev + " " + transcript : transcript));
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
        const dataUrl = reader.result as string;
        setImageFile({
          b64: dataUrl.split(",")[1],
          mime: file.type,
          url: dataUrl,
        });
        setResult(null);
        setError(null);
        setSuggestedPrice(null);
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
        body: JSON.stringify({ imageUrl: imageFile.url, productType: prompt }),
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

  const handleGenerate = async () => {
    if (!imageFile || (!prompt && !selectedTheme)) return;
    setIsLoading(true);
    setResult(null);
    setError(null);

    const themePrompts: Record<string, string> = {
      clean:
        "Place this product on a clean white background with soft, professional studio lighting",
      festive:
        "Add festive decorations with warm golden lighting, celebration mood",
      artistic: "Create an artistic, creative composition with unique styling",
      rustic:
        "Place on rustic wooden surface with natural textures and warm lighting",
    };

    const themePrompt = selectedTheme ? themePrompts[selectedTheme] : "";
    const finalPrompt = prompt
      ? themePrompt
        ? `${themePrompt}. Additionally, ${prompt}`
        : prompt
      : themePrompt;

    try {
      // Add realistic delay for demo mode (2-4 seconds)
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 2000),
      );

      // First, upload image to get a URL
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64: imageFile.b64,
          mimeType: imageFile.mime,
          folder: "photo-studio",
        }),
      });

      let imageUrl = imageFile.url;
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url || imageFile.url;
      }

      // Run enhancement and content generation in parallel
      const [enhanceRes, contentRes] = await Promise.allSettled([
        fetch("/api/ai/photo-enhance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl,
            theme: selectedTheme || "clean",
            customPrompt: finalPrompt,
          }),
        }).then((r) => r.json()),
        fetch("/api/ai/generate-description", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl,
            productType: prompt,
            platform: selectedPlatform,
          }),
        }).then((r) => r.json()),
      ]);

      const enhanceData =
        enhanceRes.status === "fulfilled" ? enhanceRes.value : null;
      const enhancedUrl = enhanceData?.enhancedUrl || imageUrl;
      const content =
        contentRes.status === "fulfilled" ? contentRes.value : null;

      setResult({
        imageUrl: enhancedUrl,
        description: content?.description,
        productName: content?.productName,
        postContent: content?.postContent,
        hashtags: content?.hashtags,
        message: enhanceData?.message,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show brief feedback
      const el = document.createElement("div");
      el.textContent = "Copied!";
      el.className =
        "fixed top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    });
  };
  const shareToSocial = (platform: string) => {
    const priceText = price ? `\n\nPrice: ₹${price}` : "";
    const text = encodeURIComponent(
      `${result?.postContent || result?.description || ""}${priceText}\n\n${
        result?.hashtags?.map((t) => `#${t}`).join(" ") || ""
      }`,
    );
    const imageUrl = encodeURIComponent(result?.imageUrl || "");

    const urls: Record<string, string> = {
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing via URL
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${imageUrl}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          {t("photoStudio.title")}
        </h2>
        <p className="text-gray-500 dark:text-zinc-400 mt-1">
          {t("photoStudio.subtitle")}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Left: Controls */}
          <div className="space-y-6">
            {/* Upload */}
            <div>
              <label className="font-semibold text-gray-700 dark:text-zinc-300 block mb-2">
                {t("photoStudio.uploadImage")}
              </label>
              <div className="relative w-full h-56 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                {imageFile ? (
                  <img
                    src={imageFile.url}
                    alt="Upload preview"
                    className="h-full w-full object-contain p-2 rounded-lg"
                  />
                ) : (
                  <div className="text-center text-gray-500 dark:text-zinc-400">
                    <UploadIcon />
                    <p className="mt-2">{t("photoStudio.clickOrDrag")}</p>
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

            {/* Theme Selection */}
            <div>
              <label className="font-semibold text-gray-700 dark:text-zinc-300 block mb-2">
                {t("photoStudio.chooseTheme")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.id}
                      onClick={() =>
                        setSelectedTheme(
                          theme.id === selectedTheme ? null : theme.id,
                        )
                      }
                      className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                        selectedTheme === theme.id
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-lg"
                          : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 hover:bg-gray-50 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <div
                        className={
                          selectedTheme === theme.id
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-gray-400 dark:text-zinc-500"
                        }
                      >
                        <Icon />
                      </div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">
                        {theme.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                        {theme.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="font-semibold text-gray-900 dark:text-zinc-300 block mb-2">
                {t("photoStudio.targetPlatform")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-1.5 ${
                        selectedPlatform === platform.id
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                          : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400"
                      }`}
                    >
                      <Icon />
                      <span className="text-xs font-medium text-gray-700 dark:text-zinc-300 text-center">
                        {platform.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-900 dark:text-zinc-300">
                  {t("photoStudio.price")}
                </label>
                <button
                  type="button"
                  onClick={suggestPrice}
                  disabled={!imageFile || loadingPrice}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingPrice ? (
                    <>
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
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
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                  disabled={isLoading}
                />
              </div>
              {suggestedPrice && (
                <div className="mt-2 space-y-2">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5 mb-2">
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
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                {t("photoStudio.priceHint")}
              </p>
            </div>

            {/* Custom Prompt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700 dark:text-zinc-300 block">
                  {selectedTheme
                    ? t("photoStudio.additionalInstructions")
                    : t("photoStudio.customInstructions")}
                </label>
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`text-xs flex items-center gap-1 font-medium transition-colors ${
                    isListening
                      ? "text-red-500 animate-pulse"
                      : "text-emerald-600 hover:text-emerald-700"
                  }`}
                >
                  <MicIcon />
                  {isListening ? "Listening..." : "Voice Input"}
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("photoStudio.describePlaceholder")}
                className="w-full p-3 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-xl h-24 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !imageFile || (!prompt && !selectedTheme)}
              className="w-full py-4 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("photoStudio.generating")}
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  {t("photoStudio.generate")}
                </>
              )}
            </button>
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 dark:text-zinc-300">
              {t("photoStudio.result")}
            </h3>

            {/* Image Result */}
            <div className="w-full aspect-square border border-gray-200 dark:border-zinc-700 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 relative overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  {/* Subtle animated background gradient - full coverage */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 animate-pulse"></div>

                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-br-full"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-teal-500/10 to-transparent rounded-tl-full"></div>

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
                          className="text-emerald-600 dark:text-emerald-400"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 blur-2xl bg-emerald-500/20 animate-pulse"></div>
                    </div>

                    {/* Clean text with more presence */}
                    <div className="relative text-center space-y-3 max-w-md">
                      <p className="text-2xl font-semibold text-gray-800 dark:text-zinc-200">
                        Enhancing your image
                      </p>
                      <p className="text-base text-gray-500 dark:text-zinc-400">
                        AI is working its magic...
                      </p>
                    </div>

                    {/* Minimal progress dots */}
                    <div className="flex gap-3">
                      <div
                        className="w-3 h-3 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0ms",
                          animationDuration: "1s",
                        }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "200ms",
                          animationDuration: "1s",
                        }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "400ms",
                          animationDuration: "1s",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Bottom decorative line */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent rounded-full"></div>
                </div>
              )}

              {error && !isLoading && (
                <p className="text-red-500 p-4 text-center">{error}</p>
              )}

              {result?.imageUrl && !isLoading && (
                <img
                  src={result.imageUrl}
                  alt="Enhanced result"
                  className="h-full w-full object-contain p-2 rounded-lg"
                />
              )}

              {!isLoading && !result && !error && (
                <p className="text-gray-400 dark:text-zinc-500">
                  {t("photoStudio.resultPlaceholder")}
                </p>
              )}
            </div>

            {/* Generated Content */}
            {result && !isLoading && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                {result.productName && (
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white text-lg">
                      {result.productName}
                    </h4>
                  </div>
                )}

                {result.description && (
                  <div>
                    <div className="mb-1">
                      <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                        Product Description
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 p-3 rounded-lg border border-gray-200 dark:border-zinc-700">
                      {result.description}
                    </p>
                  </div>
                )}

                {result.postContent && (
                  <div>
                    <div className="mb-1">
                      <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                        {platforms.find((p) => p.id === selectedPlatform)?.name}{" "}
                        Post
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 whitespace-pre-wrap">
                      {result.postContent}
                    </p>
                  </div>
                )}

                {result.hashtags && result.hashtags.length > 0 && (
                  <div>
                    <div className="mb-1">
                      <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                        Hashtags
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags.map((tag, i) => (
                        <span
                          key={i}
                          onClick={() => copyToClipboard(`#${tag}`)}
                          className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <a
                    href={result.imageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 text-center text-sm font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                  >
                    Download Image
                  </a>
                  <button
                    onClick={() => {
                      const priceText = price ? `\n\nPrice: ₹${price}` : "";
                      const text = `${
                        result.postContent || result.description || ""
                      }${priceText}\n\n${
                        result.hashtags?.map((t) => `#${t}`).join(" ") || ""
                      }`;
                      copyToClipboard(text);
                    }}
                    className="flex-1 py-2.5 text-center text-sm font-medium border border-gray-300 dark:border-zinc-700 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                  >
                    Copy All Content
                  </button>
                </div>

                {/* Share Buttons */}
                <div className="pt-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                    Share directly
                  </p>
                  <div className="flex gap-2">
                    {platforms.map((platform) => {
                      const IconWhite = platform.iconWhite;
                      return (
                        <button
                          key={platform.id}
                          onClick={() => shareToSocial(platform.id)}
                          className={`flex-1 py-2.5 rounded-lg text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 ${platform.color}`}
                        >
                          <IconWhite />
                          <span className="text-xs font-medium hidden sm:inline">
                            {platform.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
