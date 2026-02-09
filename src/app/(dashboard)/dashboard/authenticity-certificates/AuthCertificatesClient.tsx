"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  getDemoCertificates,
  saveDemoCertificate,
  type DemoCertificate,
} from "@/lib/demoStorage";

interface Certificate {
  id: string;
  artworkName: string;
  craftTradition: string;
  certifiedDate: Date;
  heritageStory: string | null;
  image: string | null;
  product: {
    id: string;
    name: string;
  } | null;
}

interface AuthCertificatesClientProps {
  certificates: Certificate[];
  userName: string;
  isDemo?: boolean;
}

export function AuthCertificatesClient({
  certificates: initialCertificates,
  userName,
  isDemo = false,
}: AuthCertificatesClientProps) {
  // Add demo certificate if in demo mode
  const demoCertificates: Certificate[] = isDemo
    ? [
        {
          id: "demo-cert-001",
          artworkName: "Traditional Kanjivaram Silk Saree",
          craftTradition: "Kanjivaram Weaving",
          certifiedDate: new Date("2024-01-15"),
          heritageStory: null,
          image:
            "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?w=500",
          product: {
            id: "demo-product-001",
            name: "Traditional Kanjivaram Silk Saree",
          },
        },
      ]
    : [];

  const [certificates, setCertificates] = useState([
    ...demoCertificates,
    ...initialCertificates,
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [creating, setCreating] = useState(false);

  // Certificate AI Animation
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [certStep, setCertStep] = useState(0);
  const certSteps = [
    "Initiating AI Authenticity Engine...",
    "Scanning artwork for craft markers...",
    "Cross-referencing heritage database...",
    "Verifying geographic tradition...",
    "Generating secure authenticity hash...",
    "Issuing permanent heritage seal...",
  ];

  // Load demo certificates from localStorage
  useEffect(() => {
    if (isDemo) {
      const storedCerts = getDemoCertificates();
      if (storedCerts.length > 0) {
        // Convert stored certificates to Certificate format
        const convertedCerts: Certificate[] = storedCerts.map(
          (cert: DemoCertificate) => ({
            id: cert.id,
            artworkName: cert.productName,
            craftTradition: cert.craftTradition,
            heritageStory: cert.heritageStory,
            certifiedDate: cert.createdAt,
            image: cert.image || null,
            product: {
              id: cert.productId,
              name: cert.productName,
            },
          }),
        );

        // Merge with demo certificates
        setCertificates([
          ...demoCertificates,
          ...convertedCerts,
          ...initialCertificates,
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo]);

  // Form state - Empty by default
  const [image, setImage] = useState<string | null>(null);
  const [artworkName, setArtworkName] = useState("");
  const [craftTradition, setCraftTradition] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGenerateStory = async () => {
    // Removed - heritage story no longer needed
  };

  const handleCreate = async () => {
    if (!artworkName || !craftTradition) {
      alert("Please fill in all required fields");
      return;
    }

    setCreating(true);
    setShowCreateModal(false); // Close modal immediately so animation is visible
    setIsGeneratingCert(true);
    setCertStep(0);

    // Simulate AI steps delay for animation
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < certSteps.length) {
        setCertStep(step);
      } else {
        clearInterval(interval);
      }
    }, 800);

    try {
      if (isDemo) {
        // Wait for animation steps and then finish
        await new Promise((resolve) =>
          setTimeout(resolve, certSteps.length * 800),
        );
        setIsGeneratingCert(false);

        const certId = `demo-cert-${Date.now()}`;
        const productId = `demo-product-${Date.now()}`;

        const newCert: Certificate = {
          id: certId,
          artworkName,
          craftTradition,
          heritageStory: null,
          image,
          certifiedDate: new Date(),
          product: null,
        };

        // Save to localStorage
        saveDemoCertificate({
          id: certId,
          productId,
          productName: artworkName,
          heritageStory: null,
          craftTradition,
          createdAt: new Date(),
          image,
        });

        setCertificates([newCert, ...certificates]);
        setShowCreateModal(false);
        setImage(null);
        setArtworkName("");
        setCraftTradition("");
        setSelectedCert(newCert);
        return;
      }

      // Real mode - call API after a minimum animation time
      const apiPromise = fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkName,
          craftTradition,
          image,
        }),
      });

      // Wait for both API and animation (minimum 3s)
      const [response] = await Promise.all([
        apiPromise,
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create certificate");
      }

      const newCert = await response.json();
      setCertificates([newCert, ...certificates]);
      setIsGeneratingCert(false);
      setShowCreateModal(false);
      setImage(null);
      setArtworkName("");
      setCraftTradition("");
      setSelectedCert(newCert);
    } catch (error: any) {
      setIsGeneratingCert(false);
      alert(error.message || "Failed to create certificate");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Authenticity Certificates
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-zinc-400 mt-1">
            Create certificates to prove the authenticity of your handcrafted
            products
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 text-sm sm:text-base shrink-0"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Certificate
        </button>
      </div>

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              {cert.image && (
                <div className="h-56 overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                  <img
                    src={cert.image}
                    alt={cert.artworkName}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {cert.artworkName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">
                  {cert.craftTradition}
                </p>
                {cert.product ? (
                  <div className="text-xs bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full inline-block">
                    Linked to: {cert.product.name}
                  </div>
                ) : (
                  <div className="text-xs bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full inline-block">
                    Available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-zinc-600"
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
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Certificates Yet
          </h3>
          <p className="text-gray-500 dark:text-zinc-400 mb-4">
            Create your first authenticity certificate to prove the heritage and
            craftsmanship of your products
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Create Your First Certificate
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => !creating && setShowCreateModal(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Authenticity Certificate
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                AI will generate a professional certificate for your artwork
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Image Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Artwork Image
                  </label>
                  <div className="relative w-full h-64 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                    {image ? (
                      <div className="relative w-full h-full">
                        <img
                          src={image}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
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
                          <p className="text-sm">Click to upload image</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Artwork Name *
                  </label>
                  <input
                    type="text"
                    value={artworkName}
                    onChange={(e) => setArtworkName(e.target.value)}
                    placeholder="e.g., Blue Pottery Vase"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Craft Tradition *
                  </label>
                  <select
                    value={craftTradition}
                    onChange={(e) => setCraftTradition(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Select craft tradition</option>
                    <option value="Kanjivaram Weaving">
                      Kanjivaram Weaving
                    </option>
                    <option value="Banarasi Weaving">Banarasi Weaving</option>
                    <option value="Pashmina Weaving">Pashmina Weaving</option>
                    <option value="Chanderi Weaving">Chanderi Weaving</option>
                    <option value="Jaipur Blue Pottery">
                      Jaipur Blue Pottery
                    </option>
                    <option value="Madhubani Painting">
                      Madhubani Painting
                    </option>
                    <option value="Warli Art">Warli Art</option>
                    <option value="Pattachitra">Pattachitra</option>
                    <option value="Kalamkari">Kalamkari</option>
                    <option value="Block Printing">Block Printing</option>
                    <option value="Bandhani">Bandhani (Tie & Dye)</option>
                    <option value="Chikankari">Chikankari Embroidery</option>
                    <option value="Zardozi">Zardozi Work</option>
                    <option value="Phulkari">Phulkari Embroidery</option>
                    <option value="Bamboo Craft">Bamboo Craft</option>
                    <option value="Cane Craft">Cane & Rattan Work</option>
                    <option value="Wood Carving">Wood Carving</option>
                    <option value="Stone Carving">Stone Carving</option>
                    <option value="Metal Craft">Metal Craft</option>
                    <option value="Brass Work">Brass Work</option>
                    <option value="Terracotta">Terracotta</option>
                    <option value="Leather Craft">Leather Craft</option>
                    <option value="Jewelry Making">Traditional Jewelry</option>
                    <option value="Carpet Weaving">Carpet Weaving</option>
                    <option value="Dhokra Art">Dhokra Art</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !artworkName || !craftTradition}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Certificate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Certificate Modal */}
      {selectedCert && (
        <CertificateViewModal
          certificate={selectedCert}
          userName={userName}
          onClose={() => setSelectedCert(null)}
        />
      )}

      {/* AI Certificate Generation Overlay */}
      {isGeneratingCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md transition-all duration-500">
          <div className="max-w-md w-full px-6 text-center">
            <div className="relative mb-8 flex justify-center">
              {/* Outer spinning ring */}
              <div className="w-24 h-24 border-4 border-emerald-500/20 rounded-full animate-[spin_2s_linear_infinite] border-t-emerald-500" />
              {/* Inner pulsing core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-500/10 rounded-full animate-pulse flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              AI Authenticity Engine
            </h2>

            <div className="h-4 flex items-center justify-center">
              <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm transition-all duration-300">
                {certSteps[certStep]}
              </p>
            </div>

            <div className="mt-8 w-full bg-gray-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500 ease-out"
                style={{
                  width: `${((certStep + 1) / certSteps.length) * 100}%`,
                }}
              />
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-zinc-500 italic text-center">
              AI is currently cross-referencing artisan records and geographic
              heritage data...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CertificateViewModal({
  certificate,
  userName,
  onClose,
}: {
  certificate: Certificate;
  userName: string;
  onClose: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/auth/${certificate.id}`
      : `https://aixartisans.com/verify/auth/${certificate.id}`;

  const handleUploadToMarketplace = async () => {
    setUploading(true);
    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setToast({ message: "Uploaded to marketplace!", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ message: "Failed to upload to marketplace", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Certificate of Authenticity - ${certificate.artworkName}`,
      text: `Check out this authentic ${certificate.craftTradition} artwork: ${certificate.artworkName}`,
      url: verificationUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(verificationUrl);
      setToast({ message: "Link copied to clipboard!", type: "success" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 relative">
          {/* Decorative Border */}
          <div className="absolute inset-3 sm:inset-4 border-2 border-emerald-500/30 rounded-xl pointer-events-none" />
          <div className="absolute inset-4 sm:inset-6 border border-emerald-500/20 rounded-lg pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-4 sm:mb-6 relative">
            <div className="flex justify-center mb-2 sm:mb-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400"
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
              </div>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white tracking-wide mb-1">
              CERTIFICATE OF AUTHENTICITY
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
              Handcrafted Heritage
            </p>
          </div>

          {/* Artwork Image */}
          {certificate.image && (
            <div className="mb-4 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800">
              <img
                src={certificate.image}
                alt={certificate.artworkName}
                className="w-full h-80 sm:h-96 object-contain"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="text-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              {certificate.artworkName}
            </h2>
            <p className="text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-medium mb-3">
              {certificate.craftTradition}
            </p>
          </div>

          {/* QR Code & Verification */}
          <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="bg-white p-2 rounded-lg shrink-0">
                <QRCodeSVG value={verificationUrl} size={70} level="M" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs sm:text-sm">
                    Verified Authentic
                  </span>
                </div>
                <p className="text-gray-600 dark:text-zinc-400 text-[10px] sm:text-xs mb-1">
                  Scan QR code to verify authenticity
                </p>
                <p className="text-gray-500 dark:text-zinc-500 text-[10px] sm:text-xs font-mono break-all">
                  ID: {certificate.id.slice(0, 12).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-200 dark:border-zinc-800">
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-1">
                Artisan
              </p>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                {userName}
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-1">
                Certified Date
              </p>
              <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                {new Date(certificate.certifiedDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-800 p-3 sm:p-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>
          <button
            onClick={handleUploadToMarketplace}
            disabled={uploading}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
          >
            {uploading ? (
              <>
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload to Marketplace
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition text-xs sm:text-sm font-medium"
          >
            Close
          </button>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4">
            <div
              className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium ${
                toast.type === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {toast.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {toast.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
