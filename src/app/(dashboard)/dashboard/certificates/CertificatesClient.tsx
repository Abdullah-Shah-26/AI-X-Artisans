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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Content */}
        <div className="p-8 relative" id="certificate-content">
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
            <h1 className="text-xl font-bold text-white tracking-wide mb-1">
              AIxARTISANS
            </h1>
            <p className="text-emerald-400 text-xs font-medium tracking-widest uppercase">
              Certificate of Achievement
            </p>
          </div>

          {/* Main Content */}
          <div className="text-center mb-6">
            <p className="text-zinc-400 text-sm mb-1">This certifies that</p>
            <h2 className="text-2xl font-bold text-white mb-1">
              {recipient.name}
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              has successfully completed
            </p>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-4">
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                {certificate.collaboration.project.title}
              </h3>
              {certificate.collaboration.project.skillsNeeded && (
                <div className="flex flex-wrap justify-center gap-2">
                  {certificate.collaboration.project.skillsNeeded
                    .slice(0, 4)
                    .map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Rating */}
            {certificate.collaboration.rating && (
              <div className="flex justify-center items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
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
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG
                  value={verificationUrl}
                  size={80}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    className="w-4 h-4 text-emerald-400"
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
                  <span className="text-emerald-400 font-medium text-sm">
                    Verified Certificate
                  </span>
                </div>
                <p className="text-zinc-400 text-xs mb-2">
                  Scan QR code to verify authenticity
                </p>
                <p className="text-zinc-600 text-xs font-mono">
                  ID: {certificate.id.slice(0, 12).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end pt-4 border-t border-zinc-800">
            <div className="text-left">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                Issued By
              </p>
              <div className="flex items-center gap-2">
                {issuer?.avatar ? (
                  <img
                    src={issuer.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm font-medium">
                      {issuer?.name?.charAt(0) || "A"}
                    </span>
                  </div>
                )}
                <span className="text-white font-medium text-sm">
                  {issuer?.name || "Artisan"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                Date Issued
              </p>
              <p className="text-white font-medium text-sm">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-zinc-900 border-t border-zinc-800 p-4 flex justify-center gap-3">
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
            onClick={handleShare}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition flex items-center gap-2 text-sm font-medium"
          >
            {copied ? (
              <>
                <svg
                  className="w-4 h-4 text-emerald-400"
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
                  className="w-4 h-4"
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
                Copy Link
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition text-sm font-medium"
          >
            Close
          </button>
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {userRole === "VOLUNTEER" ? "My Certificates" : "Issued Certificates"}
        </h1>
        <p className="text-gray-500 dark:text-zinc-400">
          {userRole === "VOLUNTEER"
            ? "Certificates earned from completed projects"
            : "Certificates you've issued to volunteers"}
        </p>
      </div>

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 hover:border-emerald-500/50 hover:shadow-lg transition cursor-pointer group"
            >
              {/* Certificate Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
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
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {cert.collaboration.project.title}
              </h3>

              {/* Issuer/Recipient */}
              <div className="flex items-center gap-2 mb-3">
                {(cert.artisan || cert.volunteer) && (
                  <>
                    <div className="w-6 h-6 rounded-full bg-emerald-200 dark:bg-emerald-500/30 flex items-center justify-center overflow-hidden">
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
                    <span className="text-sm text-gray-600 dark:text-zinc-400">
                      {userRole === "VOLUNTEER"
                        ? `by ${cert.artisan?.name}`
                        : `to ${cert.volunteer?.name}`}
                    </span>
                  </>
                )}
              </div>

              {/* Rating */}
              {cert.collaboration.rating && (
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
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
              <p className="text-xs text-gray-500 dark:text-zinc-500">
                {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>

              {/* View Button */}
              <button className="mt-4 w-full py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition">
                View Certificate
              </button>
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
          <p className="text-gray-500 dark:text-zinc-400">
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
