"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface ConnectionRequest {
  id: string;
  status: string;
  timestamp: Date;
  isDemo?: boolean;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    artisanProfile?: {
      location: string | null;
      bio: string | null;
    } | null;
  };
}

export function ConnectionRequestCard({
  request,
}: {
  request: ConnectionRequest;
}) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);
  const [handled, setHandled] = useState(false);
  const router = useRouter();

  const handleResponse = async (status: "ACCEPTED" | "REJECTED") => {
    setLoading(status === "ACCEPTED" ? "accept" : "reject");

    // For demo requests, just hide the card
    if (request.isDemo) {
      setTimeout(() => {
        setHandled(true);
        setLoading(null);
      }, 500);
      return;
    }

    try {
      const res = await fetch("/api/connections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId: request.id, status }),
      });

      if (res.ok) {
        setHandled(true);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update request");
      }
    } catch (error) {
      console.error("Error updating connection:", error);
    } finally {
      setLoading(null);
    }
  };

  if (handled) {
    return null;
  }

  return (
    <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-4 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-200 dark:bg-emerald-500/30 flex items-center justify-center overflow-hidden shrink-0">
          {request.sender.avatar ? (
            <img
              src={request.sender.avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-emerald-800 dark:text-emerald-300 font-semibold text-lg">
              {request.sender.name.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {request.sender.name}
            </h3>
            <span className="text-xs bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full capitalize">
              {request.sender.role.toLowerCase()}
            </span>
          </div>

          {request.sender.artisanProfile?.location && (
            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-1">
              📍 {request.sender.artisanProfile.location}
            </p>
          )}

          {request.sender.artisanProfile?.bio && (
            <p className="text-sm text-gray-600 dark:text-zinc-300 line-clamp-2">
              {request.sender.artisanProfile.bio}
            </p>
          )}

          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2">
            Sent {new Date(request.timestamp).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => handleResponse("ACCEPTED")}
          disabled={loading !== null}
          className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading === "accept" ? (
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
              ...
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {t("connections.accept")}
            </>
          )}
        </button>

        <button
          onClick={() => handleResponse("REJECTED")}
          disabled={loading !== null}
          className="flex-1 py-2.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading === "reject" ? (
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
              ...
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {t("connections.decline")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
