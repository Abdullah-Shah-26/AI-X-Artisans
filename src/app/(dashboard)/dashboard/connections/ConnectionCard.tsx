"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface Connection {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
}

interface ConnectionCardProps {
  connection: Connection;
}

export function ConnectionCard({ connection }: ConnectionCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId: connection.id }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/connections?conversation=${data.id}`);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to start conversation");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-4 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-emerald-200 dark:bg-emerald-500/30 flex items-center justify-center overflow-hidden">
          {connection.avatar ? (
            <img
              src={connection.avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-emerald-800 dark:text-emerald-300 font-semibold">
              {connection.name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {connection.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 capitalize">
            {connection.role.toLowerCase()}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="flex-1 py-2 text-sm border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
          {t("connections.viewProfile")}
        </button>
        <button
          onClick={handleMessage}
          disabled={loading}
          className="flex-1 py-2 text-sm bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition flex items-center justify-center gap-1"
        >
          {loading ? (
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
          ) : (
            t("connections.message")
          )}
        </button>
      </div>
    </div>
  );
}
