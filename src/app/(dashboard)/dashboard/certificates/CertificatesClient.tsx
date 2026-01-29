"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface Certificate {
  id: string;
  title: string;
  description: string;
  issuedAt: Date;
  isDemo?: boolean;
  collaboration: {
    id: string;
    rating: number | null;
    project: {
      id: string;
      title: string;
      skillsNeeded?: string[];
    };
  };
  artisan?: {
    id: string;
    name: string;
    avatar: string | null;
  };
  volunteer?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface CertificatesClientProps {
  certificates: Certificate[];
  userRole: string;
  userName: string;
  isDemo?: boolean;
}

function CertificateModal({
  certificate,
  userName,
  onClose,
}: {
  certificate: Certificate;
  userName: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const issuer = certificate.artisan;
  const recipient = certificate.volunteer || { name: userName, avatar: null };
  const date = new Date(certificate.issuedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Generate verification URL
  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/${certificate.id}`
      : `https://aixartisans.com/verify/${certificate.id}`;

  const handleShare = async () => {
    const shareData = {
      title: `AIxArtisans Certificate - ${certificate.collaboration.project.title}`,
      text: `${recipient.name} earned a certificate for completing "${certificate.collaboration.project.title}" on AIxArtisans!`,
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
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Content */}
        <div className="p-4 sm:p-6 md:p-8 relative" id="certificate-content">
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
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide mb-1">
              AIxARTISANS
            </h1>
            <p className="text-emerald-400 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
              Certificate of Achievement
            </p>
          </div>

          {/* Main Content */}
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-zinc-400 text-xs sm:text-sm mb-1">
              This certifies that
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {recipient.name}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mb-3 sm:mb-4">
              has successfully completed
            </p>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-2">
                {certificate.collaboration.project.title}
              </h3>
              {certificate.collaboration.project.skillsNeeded && (
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  {certificate.collaboration.project.skillsNeeded
                    .slice(0, 4)
                    .map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] sm:text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Rating */}
            {certificate.collaboration.rating && (
              <div className="flex justify-center items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < certificate.collaboration.rating!
                        ? "text-amber-400"
                        : "text-zinc-700"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}
          </div>

          {/* QR Code & Verification */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="bg-white p-2 rounded-lg shrink-0">
                <QRCodeSVG
                  value={verificationUrl}
                  size={70}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                  className="sm:w-20 sm:h-20"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400"
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
                  <span className="text-emerald-400 font-medium text-xs sm:text-sm">
                    Verified Certificate
                  </span>
                </div>
                <p className="text-zinc-400 text-[10px] sm:text-xs mb-1.5 sm:mb-2">
                  Scan QR code to verify authenticity
                </p>
                <p className="text-zinc-600 text-[10px] sm:text-xs font-mono break-all">
                  ID: {certificate.id.slice(0, 12).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 sm:gap-0 pt-3 sm:pt-4 border-t border-zinc-800">
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wide mb-1">
                Issued By
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {issuer?.avatar ? (
                  <img
                    src={issuer.avatar}
                    alt=""
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-xs sm:text-sm font-medium">
                      {issuer?.name?.charAt(0) || "A"}
                    </span>
                  </div>
                )}
                <span className="text-white font-medium text-xs sm:text-sm">
                  {issuer?.name || "Artisan"}
                </span>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wide mb-1">
                Date Issued
              </p>
              <p className="text-white font-medium text-xs sm:text-sm">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-zinc-900 border-t border-zinc-800 p-3 sm:p-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 min-w-[100px] sm:min-w-[120px] px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium"
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
              className="flex-1 min-w-[100px] sm:min-w-[120px] px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium"
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
              onClick={handleCopyLink}
              className="flex-1 min-w-[100px] sm:min-w-[120px] px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium"
            >
              {copied ? (
                <>
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
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
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-full sm:flex-1 sm:min-w-[100px] px-3 sm:px-4 py-2 sm:py-2.5 border border-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition text-xs sm:text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificatesClient({
  certificates,
  userRole,
  userName,
}: CertificatesClientProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="px-4 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {userRole === "VOLUNTEER" ? "My Credentials" : "Issued Credentials"}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-zinc-400 mt-1">
          {userRole === "VOLUNTEER"
            ? "Credentials earned from completed projects"
            : "Credentials you've issued to volunteers"}
        </p>
      </div>

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-0">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 hover:border-emerald-500/50 hover:shadow-lg transition cursor-pointer group"
            >
              {/* Certificate Icon */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400"
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
                {cert.isDemo && (
                  <span className="text-xs bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
                    Demo
                  </span>
                )}
              </div>

              {/* Project Title */}
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {cert.collaboration.project.title}
              </h3>

              {/* Issuer/Recipient */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                {(cert.artisan || cert.volunteer) && (
                  <>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-200 dark:bg-emerald-500/30 flex items-center justify-center overflow-hidden shrink-0">
                      {cert.artisan?.avatar || cert.volunteer?.avatar ? (
                        <img
                          src={
                            cert.artisan?.avatar || cert.volunteer?.avatar || ""
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-emerald-800 dark:text-emerald-300 text-xs font-medium">
                          {(
                            cert.artisan?.name ||
                            cert.volunteer?.name ||
                            ""
                          ).charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 truncate">
                      {userRole === "VOLUNTEER"
                        ? `by ${cert.artisan?.name}`
                        : `to ${cert.volunteer?.name}`}
                    </span>
                  </>
                )}
              </div>

              {/* Rating */}
              {cert.collaboration.rating && (
                <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        i < cert.collaboration.rating!
                          ? "text-amber-400"
                          : "text-gray-300 dark:text-zinc-700"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}

              {/* Date */}
              <p className="text-xs text-gray-500 dark:text-zinc-500 mb-3 sm:mb-4">
                {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>

              {/* View Button */}
              <button className="w-full py-2 text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition">
                View Certificate
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 sm:p-12 text-center mx-4 sm:mx-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-zinc-600"
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
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Certificates Yet
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-zinc-400">
            {userRole === "VOLUNTEER"
              ? "Complete projects to earn certificates from artisans"
              : "Issue certificates when volunteers complete your projects"}
          </p>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          userName={userName}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}
