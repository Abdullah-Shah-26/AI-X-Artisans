"use client";

import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { useTheme } from "next-themes";

interface Certificate {
  id: string;
  artworkName: string;
  craftTradition: string;
  certifiedDate: Date;
  heritageStory: string | null;
  image: string | null;
  artist: {
    name: string;
  };
  product: {
    id: string;
    name: string;
  } | null;
}

export function CertificateView({
  certificate,
}: {
  certificate: Certificate;
}) {
  const { theme, setTheme } = useTheme();
  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/auth/${certificate.id}`
      : `https://aixartisans.com/verify/auth/${certificate.id}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/marketplace" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-emerald-500/30">
                <img
                  src="/image.png"
                  alt="AIxArtisans"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                AIxArtisans
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                {theme === "dark" ? (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              {certificate.product && (
                <Link
                  href={`/marketplace/${certificate.product.id}`}
                  className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition"
                >
                  View Product
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Certificate */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 relative">
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wide mb-1">
                CERTIFICATE OF AUTHENTICITY
              </h1>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium tracking-widest uppercase">
                Handcrafted Heritage
              </p>
            </div>

            {/* Artwork Image */}
            {certificate.image && (
              <div className="mb-6 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-zinc-800">
                <img
                  src={certificate.image}
                  alt={certificate.artworkName}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Main Content */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {certificate.artworkName}
              </h2>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-4">
                {certificate.craftTradition}
              </p>

              {certificate.heritageStory && (
                <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                    {certificate.heritageStory}
                  </p>
                </div>
              )}
            </div>

            {/* QR Code & Verification */}
            <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-lg">
                  <QRCodeSVG value={verificationUrl} size={80} level="M" />
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
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                      Verified Authentic
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-zinc-400 text-xs mb-2">
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
                  {certificate.artist.name}
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
                    }
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
            {certificate.product && (
              <Link
                href={`/marketplace/${certificate.product.id}`}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition text-sm font-medium"
              >
                View Product
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
