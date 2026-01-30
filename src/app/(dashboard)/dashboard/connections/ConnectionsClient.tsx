"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { ConnectionRequestCard } from "./ConnectionRequestCard";
import { ConnectionCard } from "./ConnectionCard";

interface ConnectionRequest {
  id: string;
  status: string;
  timestamp: Date;
  isDemo?: boolean;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
    role: "ARTISAN" | "VOLUNTEER" | "CUSTOMER";
    artisanProfile?: {
      location: string | null;
      bio: string | null;
    } | null;
  };
}

interface Connection {
  id: string;
  name: string;
  avatar: string | null;
  role: "ARTISAN" | "VOLUNTEER" | "CUSTOMER";
  isDemo?: boolean;
}

interface ConnectionsClientProps {
  userId: string;
  userRole: string;
  pendingRequests: ConnectionRequest[];
  myConnections: Connection[];
  pastRequests: ConnectionRequest[];
  isDemo?: boolean;
}

export function ConnectionsClient({
  userId,
  userRole,
  pendingRequests,
  myConnections,
  pastRequests,
}: ConnectionsClientProps) {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
          title="Go back"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("connections.title")}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            {t("connections.subtitle")}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
        <RequestsView
          userRole={userRole}
          pendingRequests={pendingRequests}
          myConnections={myConnections}
          pastRequests={pastRequests}
        />
      </div>
    </div>
  );
}

// Requests View Component
function RequestsView({
  userRole,
  pendingRequests,
  myConnections,
  pastRequests,
}: {
  userRole: string;
  pendingRequests: ConnectionRequest[];
  myConnections: Connection[];
  pastRequests: ConnectionRequest[];
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center text-sm font-bold">
              {pendingRequests.length}
            </span>
            {t("connections.pendingRequests")}
          </h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <ConnectionRequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}

      {/* My Connections */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("connections.myConnections")} ({myConnections.length})
        </h2>

        {myConnections.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-zinc-400">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="mb-2">{t("connections.noConnections")}</p>
            <p className="text-sm">
              {userRole === "ARTISAN"
                ? t("connections.connectVolunteers")
                : t("connections.artisansWillSend")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myConnections.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        )}
      </div>

      {/* Past Requests */}
      {pastRequests.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("connections.pastRequests")}
          </h2>
          <div className="space-y-3">
            {pastRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
                    {request.sender.avatar ? (
                      <img
                        src={request.sender.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 dark:text-zinc-300">
                        {request.sender.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {request.sender.name}
                  </span>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    request.status === "ACCEPTED"
                      ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                  }`}
                >
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
