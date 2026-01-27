"use client";

import { useState } from "react";
import Link from "next/link";

interface Collaboration {
  id: string;
  status: string;
  startDate: Date;
  endDate?: Date | null;
  rating?: number | null;
  feedback?: string | null;
  project: {
    id: string;
    title: string;
    description: string;
  };
  artisan: {
    id: string;
    name: string;
    avatar: string | null;
  };
  certificate?: {
    id: string;
    title: string;
  } | null;
}

interface Application {
  id: string;
  status: string;
  applicationDate: Date;
  project: {
    id: string;
    title: string;
    description: string;
    status: string;
  };
  artisan: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface CollaborationsClientProps {
  collaborations: Collaboration[];
  applications: Application[];
  isDemo?: boolean;
}

export function CollaborationsClient({
  collaborations,
  applications,
  isDemo,
}: CollaborationsClientProps) {
  const [activeTab, setActiveTab] = useState<
    "active" | "completed" | "applications"
  >("active");

  const activeCollabs = collaborations.filter(
    (c) => c.status === "IN_PROGRESS"
  );
  const completedCollabs = collaborations.filter(
    (c) => c.status === "COMPLETED"
  );
  const pendingApps = applications.filter((a) => a.status === "PENDING");

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Work
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-1">
          Manage your collaborations and track your contributions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 ring-1 ring-gray-200 dark:ring-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeCollabs.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-zinc-500">
                Active Projects
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 ring-1 ring-gray-200 dark:ring-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
              <svg
                className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedCollabs.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-zinc-500">
                Completed
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 ring-1 ring-gray-200 dark:ring-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
              <svg
                className="w-5 h-5 text-amber-600 dark:text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingApps.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-zinc-500">
                Pending Apps
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 ring-1 ring-gray-200 dark:ring-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
              <svg
                className="w-5 h-5 text-purple-600 dark:text-purple-400"
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
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedCollabs.filter((c) => c.certificate).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-zinc-500">
                Certificates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === "active"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white"
          }`}
        >
          Active ({activeCollabs.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === "completed"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white"
          }`}
        >
          Completed ({completedCollabs.length})
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === "applications"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-white"
          }`}
        >
          Applications ({applications.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "active" &&
          (activeCollabs.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center ring-1 ring-gray-200 dark:ring-zinc-800">
              <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No active collaborations
              </h3>
              <p className="text-gray-500 dark:text-zinc-400 mb-4">
                Browse projects and apply to start helping artisans
              </p>
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
              >
                Browse Projects
              </Link>
            </div>
          ) : (
            activeCollabs.map((collab) => (
              <div
                key={collab.id}
                className="bg-white dark:bg-zinc-900 rounded-xl p-5 ring-1 ring-gray-200 dark:ring-zinc-800"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                    {collab.artisan.avatar ? (
                      <img
                        src={collab.artisan.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {collab.artisan.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {collab.project.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">
                          with {collab.artisan.name}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                        In Progress
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 line-clamp-2">
                      {collab.project.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500 dark:text-zinc-500">
                        Started {formatDate(collab.startDate)}
                      </span>
                      <Link
                        href={`/dashboard/chat`}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Message Artisan
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ))}

        {activeTab === "completed" &&
          (completedCollabs.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center ring-1 ring-gray-200 dark:ring-zinc-800">
              <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No completed collaborations yet
              </h3>
              <p className="text-gray-500 dark:text-zinc-400">
                Complete your first project to earn certificates
              </p>
            </div>
          ) : (
            completedCollabs.map((collab) => (
              <div
                key={collab.id}
                className="bg-white dark:bg-zinc-900 rounded-xl p-5 ring-1 ring-gray-200 dark:ring-zinc-800"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                    {collab.artisan.avatar ? (
                      <img
                        src={collab.artisan.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {collab.artisan.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {collab.project.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">
                          with {collab.artisan.name}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                        Completed
                      </span>
                    </div>
                    {collab.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < collab.rating!
                                ? "text-amber-400"
                                : "text-gray-300 dark:text-zinc-600"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-500 dark:text-zinc-500 ml-1">
                          {collab.rating}/5
                        </span>
                      </div>
                    )}
                    {collab.feedback && (
                      <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 italic">
                        "{collab.feedback}"
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500 dark:text-zinc-500">
                        {formatDate(collab.startDate)} -{" "}
                        {collab.endDate
                          ? formatDate(collab.endDate)
                          : "Present"}
                      </span>
                      {collab.certificate && (
                        <Link
                          href="/dashboard/certificates"
                          className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                        >
                          <svg
                            className="w-3.5 h-3.5"
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
                          View Certificate
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ))}

        {activeTab === "applications" &&
          (applications.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center ring-1 ring-gray-200 dark:ring-zinc-800">
              <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500 dark:text-zinc-400 mb-4">
                Find projects that match your skills and apply
              </p>
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
              >
                Browse Projects
              </Link>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-zinc-900 rounded-xl p-5 ring-1 ring-gray-200 dark:ring-zinc-800"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                    {app.artisan.avatar ? (
                      <img
                        src={app.artisan.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {app.artisan.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {app.project.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">
                          by {app.artisan.name}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          app.status === "PENDING"
                            ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                            : app.status === "ACCEPTED"
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 line-clamp-2">
                      {app.project.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500 dark:text-zinc-500">
                        Applied {formatDate(app.applicationDate)}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          app.project.status === "OPEN"
                            ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
                        }`}
                      >
                        Project {app.project.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ))}
      </div>
    </div>
  );
}
