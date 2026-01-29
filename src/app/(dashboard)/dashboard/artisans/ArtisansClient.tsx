"use client";

import { useState } from "react";
import Link from "next/link";

type Artisan = {
  id: string;
  name: string;
  avatar: string | null;
  isDemo?: boolean;
  artisanProfile: {
    location: string | null;
    craftTypes: string[];
    bio: string | null;
  } | null;
};

interface Props {
  artisans: Artisan[];
  connectionMap: Record<string, string>;
  isDemo?: boolean;
}

export function ArtisansClient({ artisans, connectionMap, isDemo }: Props) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [demoConnected, setDemoConnected] = useState<string[]>([]);

  const handleConnect = async (artisanId: string, isDemoArtisan?: boolean) => {
    setConnecting(artisanId);

    // For demo artisans, just simulate the connection
    if (isDemoArtisan || isDemo) {
      setTimeout(() => {
        setDemoConnected([...demoConnected, artisanId]);
        setConnecting(null);
      }, 1000);
      return;
    }

    try {
      const res = await fetch("/api/connections/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: artisanId }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to send connection request");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending connection request");
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Find Artisans
        </h1>
        <p className="text-gray-600 dark:text-zinc-400 mt-1">
          Connect with artisans and offer your skills to help them grow
        </p>
      </div>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.length > 0 ? (
          artisans.map((artisan) => {
            const connectionStatus = connectionMap[artisan.id];
            return (
              <div
                key={artisan.id}
                className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 flex flex-col hover:shadow-md transition"
              >
                <div className="p-6 flex-1 text-center">
                  <Link href={`/artisan/${artisan.id}`}>
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200 dark:bg-zinc-700 ring-4 ring-emerald-100 dark:ring-emerald-500/20 cursor-pointer hover:ring-emerald-200 dark:hover:ring-emerald-500/30 transition">
                      {artisan.avatar ? (
                        <img
                          src={artisan.avatar}
                          alt={artisan.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                          {artisan.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </Link>
                  <Link href={`/artisan/${artisan.id}`}>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">
                      {artisan.name}
                    </h3>
                  </Link>
                  {artisan.artisanProfile?.location && (
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                      {artisan.artisanProfile.location}
                    </p>
                  )}
                  {artisan.artisanProfile?.craftTypes &&
                    artisan.artisanProfile.craftTypes.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mt-3">
                        {artisan.artisanProfile.craftTypes
                          .slice(0, 3)
                          .map((craft) => (
                            <span
                              key={craft}
                              className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-0.5 rounded"
                            >
                              {craft}
                            </span>
                          ))}
                      </div>
                    )}
                  {artisan.artisanProfile?.bio && (
                    <p className="text-sm text-gray-600 dark:text-zinc-300 mt-3 line-clamp-2">
                      {artisan.artisanProfile.bio}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-b-xl">
                  {connectionStatus === "ACCEPTED" ||
                  demoConnected.includes(artisan.id) ? (
                    <Link
                      href={`/dashboard/connections?user=${artisan.id}`}
                      className="block w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium text-center transition"
                    >
                      Message
                    </Link>
                  ) : connectionStatus === "PENDING" ? (
                    <button
                      disabled
                      className="w-full bg-gray-300 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                    >
                      Request Sent
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(artisan.id, artisan.isDemo)}
                      disabled={connecting === artisan.id}
                      className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium transition"
                    >
                      {connecting === artisan.id ? "Connecting..." : "Connect"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-zinc-400">
              No artisans found
            </p>
            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">
              Check back later for new artisans to connect with
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
