"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

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
          artworkName: "Handwoven Silk Saree",
          craftTradition: "Banarasi Weaving",
          certifiedDate: new Date("2024-01-15"),
          heritageStory:
            "This exquisite Banarasi silk saree represents the pinnacle of Indian textile artistry, a craft tradition that has flourished in Varanasi for over 400 years. Each thread is carefully selected and dyed using natural pigments, then meticulously woven on traditional pit looms by master artisans who have inherited this sacred knowledge from their ancestors. The intricate gold zari work, featuring delicate floral patterns and paisley motifs, requires exceptional skill and patience - a single saree can take anywhere from 15 days to 6 months to complete, depending on the complexity of the design. This piece embodies the spiritual essence of Varanasi, where the art of weaving is not merely a profession but a devotional practice, connecting the weaver to centuries of cultural heritage and artistic excellence.",
          image:
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
          product: {
            id: "demo-product-001",
            name: "Handwoven Silk Saree",
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

  // Form state - Autofilled with demo data
  const [image, setImage] = useState<string | null>(null);
  const [artworkName, setArtworkName] = useState("Handwoven Silk Saree");
  const [craftTradition, setCraftTradition] = useState("Banarasi Weaving");
  const [itemDescription, setItemDescription] = useState(
    "A traditional Banarasi silk saree featuring intricate gold zari work and floral motifs, handwoven using centuries-old techniques passed down through generations.",
  );
  const [heritageStory, setHeritageStory] = useState(
    "This exquisite Banarasi silk saree represents the pinnacle of Indian textile artistry, a craft tradition that has flourished in Varanasi for over 400 years. Each thread is carefully selected and dyed using natural pigments, then meticulously woven on traditional pit looms by master artisans who have inherited this sacred knowledge from their ancestors. The intricate gold zari work, featuring delicate floral patterns and paisley motifs, requires exceptional skill and patience - a single saree can take anywhere from 15 days to 6 months to complete, depending on the complexity of the design. This piece embodies the spiritual essence of Varanasi, where the art of weaving is not merely a profession but a devotional practice, connecting the weaver to centuries of cultural heritage and artistic excellence.",
  );
  const [generatingStory, setGeneratingStory] = useState(false);

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
    if (!artworkName || !craftTradition) {
      alert("Please fill in artwork name and craft tradition first");
      return;
    }

    setGeneratingStory(true);
    try {
      const response = await fetch("/api/ai/generate-heritage-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artisanName: userName,
          itemName: artworkName,
          itemDescription,
          craftTradition,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate story");
      }

      const data = await response.json();
      setHeritageStory(data.heritageStory);
    } catch (error: any) {
      alert(error.message || "Failed to generate heritage story");
    } finally {
      setGeneratingStory(false);
    }
  };

  const handleCreate = async () => {
    if (!artworkName || !craftTradition || !heritageStory) {
      alert("Please fill in all required fields");
      return;
    }

    setCreating(true);
    try {
      // Demo mode - create certificate locally
      if (isDemo) {
        const newCert: Certificate = {
          id: `demo-cert-${Date.now()}`,
          artworkName,
          craftTradition,
          heritageStory,
          image,
          certifiedDate: new Date(),
          product: null,
        };

        setCertificates([newCert, ...certificates]);

        // Reset form to autofilled values
        setShowCreateModal(false);
        setImage(null);
        setArtworkName("Handwoven Silk Saree");
        setCraftTradition("Banarasi Weaving");
        setItemDescription(
          "A traditional Banarasi silk saree featuring intricate gold zari work and floral motifs, handwoven using centuries-old techniques passed down through generations.",
        );
        setHeritageStory(
          "This exquisite Banarasi silk saree represents the pinnacle of Indian textile artistry, a craft tradition that has flourished in Varanasi for over 400 years. Each thread is carefully selected and dyed using natural pigments, then meticulously woven on traditional pit looms by master artisans who have inherited this sacred knowledge from their ancestors. The intricate gold zari work, featuring delicate floral patterns and paisley motifs, requires exceptional skill and patience - a single saree can take anywhere from 15 days to 6 months to complete, depending on the complexity of the design. This piece embodies the spiritual essence of Varanasi, where the art of weaving is not merely a profession but a devotional practice, connecting the weaver to centuries of cultural heritage and artistic excellence.",
        );

        // Show the new certificate
        setSelectedCert(newCert);
        return;
      }

      // Real mode - call API
      const response = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkName,
          craftTradition,
          heritageStory,
          image,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create certificate");
      }

      const newCert = await response.json();
      setCertificates([newCert, ...certificates]);

      // Reset form to autofilled values
      setShowCreateModal(false);
      setImage(null);
      setArtworkName("Handwoven Silk Saree");
      setCraftTradition("Banarasi Weaving");
      setItemDescription(
        "A traditional Banarasi silk saree featuring intricate gold zari work and floral motifs, handwoven using centuries-old techniques passed down through generations.",
      );
      setHeritageStory(
        "This exquisite Banarasi silk saree represents the pinnacle of Indian textile artistry, a craft tradition that has flourished in Varanasi for over 400 years. Each thread is carefully selected and dyed using natural pigments, then meticulously woven on traditional pit looms by master artisans who have inherited this sacred knowledge from their ancestors. The intricate gold zari work, featuring delicate floral patterns and paisley motifs, requires exceptional skill and patience - a single saree can take anywhere from 15 days to 6 months to complete, depending on the complexity of the design. This piece embodies the spiritual essence of Varanasi, where the art of weaving is not merely a profession but a devotional practice, connecting the weaver to centuries of cultural heritage and artistic excellence.",
      );

      // Show the new certificate
      setSelectedCert(newCert);
    } catch (error: any) {
      alert(error.message || "Failed to create certificate");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Authenticity Certificates
          </h1>
          <p className="text-gray-500 dark:text-zinc-400">
            Create certificates to prove the authenticity of your handcrafted
            products
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
        >
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
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/50 hover:shadow-lg transition cursor-pointer group"
            >
              {cert.image && (
                <div className="h-40 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                  <img
                    src={cert.image}
                    alt={cert.artworkName}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  {cert.artworkName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">
                  {cert.craftTradition}
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-500 mb-3">
                  #{cert.id.slice(0, 12).toUpperCase()}
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
                Document the heritage and craftsmanship of your artwork
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
                  <input
                    type="text"
                    value={craftTradition}
                    onChange={(e) => setCraftTradition(e.target.value)}
                    placeholder="e.g., Jaipur Blue Pottery"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Item Description (Optional)
                  </label>
                  <textarea
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="Brief description to help generate the heritage story..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                      Heritage Story *
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateStory}
                      disabled={
                        generatingStory || !artworkName || !craftTradition
                      }
                      className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                    >
                      {generatingStory ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
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
                    value={heritageStory}
                    onChange={(e) => setHeritageStory(e.target.value)}
                    placeholder="A story about the craft tradition, skill, and heritage..."
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
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
                disabled={
                  creating || !artworkName || !craftTradition || !heritageStory
                }
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
  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/auth/${certificate.id}`
      : `https://aixartisans.com/verify/auth/${certificate.id}`;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          {/* Decorative Border */}
          <div className="absolute inset-4 border-2 border-emerald-500/30 rounded-xl pointer-events-none" />
          <div className="absolute inset-6 border border-emerald-500/20 rounded-lg pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6 relative">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-emerald-400"
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
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide mb-1">
              CERTIFICATE OF AUTHENTICITY
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium tracking-widest uppercase">
              Handcrafted Heritage
            </p>
          </div>

          {/* Artwork Image */}
          {certificate.image && (
            <div className="mb-4 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-zinc-800">
              <img
                src={certificate.image}
                alt={certificate.artworkName}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {certificate.artworkName}
            </h2>
            <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-3">
              {certificate.craftTradition}
            </p>

            {certificate.heritageStory && (
              <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 mb-3">
                <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">
                  {certificate.heritageStory}
                </p>
              </div>
            )}
          </div>

          {/* QR Code & Verification */}
          <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={verificationUrl} size={70} level="M" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
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
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                    Verified Authentic
                  </span>
                </div>
                <p className="text-gray-600 dark:text-zinc-400 text-xs mb-1">
                  Scan QR code to verify authenticity
                </p>
                <p className="text-gray-500 dark:text-zinc-500 text-xs font-mono">
                  ID: {certificate.id.slice(0, 12).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end pt-4 border-t border-gray-200 dark:border-zinc-800">
            <div className="text-left">
              <p className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-1">
                Artisan
              </p>
              <p className="text-gray-900 dark:text-white font-medium text-sm">
                {userName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-1">
                Certified Date
              </p>
              <p className="text-gray-900 dark:text-white font-medium text-sm">
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
        <div className="bg-gray-50 dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-800 p-4 flex justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 text-sm font-medium"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
