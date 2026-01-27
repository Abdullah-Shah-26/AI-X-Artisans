"use client";

import { useState } from "react";

interface Collaboration {
  id: string;
  status: string;
  project: { id: string; title: string };
  artisan: { id: string; name: string; avatar: string | null };
}

interface Volunteer {
  id: string;
  name: string;
  avatar: string | null;
  isDemo?: boolean;
  volunteerProfile: {
    skills: string[];
    bio: string | null;
    projectsCompleted: number;
  } | null;
  collaborationsAsVolunteer?: Collaboration[];
}

interface VolunteerCardProps {
  volunteer: Volunteer;
  connectionStatus: string | null;
}

const demoCompletedProjects = [
  {
    id: "cp1",
    name: "Mobile App Development",
    artisan: "Lakshmi Devi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
  },
  {
    id: "cp2",
    name: "Cross-Platform App",
    artisan: "Ramesh Kumar",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  },
  {
    id: "cp3",
    name: "E-commerce App",
    artisan: "Anita Sharma",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  },
];

export function VolunteerCard({
  volunteer,
  connectionStatus,
}: VolunteerCardProps) {
  const [status, setStatus] = useState<string | null>(
    volunteer.isDemo ? "DEMO" : connectionStatus
  );
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const sendConnectionRequest = async () => {
    if (volunteer.isDemo) {
      setStatus("PENDING");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: volunteer.id }),
      });
      if (res.ok) setStatus("PENDING");
      else {
        const data = await res.json();
        alert(data.error || "Failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const projectCount = volunteer.volunteerProfile?.projectsCompleted || 0;
  const skills = volunteer.volunteerProfile?.skills || [];

  return (
    <>
      <div className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
        {/* Header with gradient */}
        <div className="h-16 bg-linear-to-r from-emerald-500/20 via-teal-500/10 to-emerald-500/20 relative">
          <div className="absolute -bottom-8 left-4">
            <div className="w-16 h-16 rounded-xl bg-white dark:bg-zinc-800 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-[10px] bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center overflow-hidden">
                {volunteer.avatar ? (
                  <img
                    src={volunteer.avatar}
                    alt={volunteer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xl">
                    {volunteer.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Status badge */}
          {status === "ACCEPTED" && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Connected
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-10 px-4 pb-4">
          {/* Name & Stats */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
              {volunteer.name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-zinc-400">
                <svg
                  className="w-4 h-4 text-emerald-500"
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
                <span className="font-medium">{projectCount}</span> projects
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-zinc-400">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span className="font-medium">{skills.length}</span> skills
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-2.5 py-1 rounded-lg font-medium"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg font-medium">
                +{skills.length - 3}
              </span>
            )}
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-2 mb-4 min-h-[40px]">
            {volunteer.volunteerProfile?.bio ||
              "Passionate volunteer ready to help artisans succeed."}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowProfile(true)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
            >
              View Profile
            </button>
            <button
              onClick={sendConnectionRequest}
              disabled={loading || (status !== null && status !== "DEMO")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 ${
                status === "PENDING"
                  ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                  : status === "ACCEPTED"
                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  : status === "REJECTED"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
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
              ) : status === "PENDING" ? (
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Pending
                </>
              ) : status === "ACCEPTED" ? (
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
                  Connected
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Connect
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative h-24 bg-linear-to-r from-emerald-600 to-teal-500">
              <button
                onClick={() => setShowProfile(false)}
                className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/30 rounded-full transition"
              >
                <svg
                  className="w-5 h-5 text-white"
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
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-zinc-800 p-1 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center overflow-hidden">
                    {volunteer.avatar ? (
                      <img
                        src={volunteer.avatar}
                        alt={volunteer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold text-2xl">
                        {volunteer.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="pt-14 px-6 pb-6 overflow-y-auto max-h-[calc(90vh-96px)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {volunteer.name}
                  </h2>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                    Volunteer
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/20 px-3 py-1.5 rounded-full">
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
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    {projectCount}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2">
                  About
                </h4>
                <p className="text-gray-700 dark:text-zinc-300 text-sm leading-relaxed">
                  {volunteer.volunteerProfile?.bio ||
                    "Passionate volunteer ready to help artisans succeed."}
                </p>
              </div>

              {/* Skills */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 dark:text-zinc-500 text-sm">
                      No skills listed
                    </span>
                  )}
                </div>
              </div>

              {/* Completed Projects */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wide mb-2">
                  Project History
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {volunteer.isDemo ? (
                    demoCompletedProjects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl"
                      >
                        <img
                          src={p.avatar}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-zinc-400">
                            with {p.artisan}
                          </p>
                        </div>
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg">
                          Done
                        </span>
                      </div>
                    ))
                  ) : volunteer.collaborationsAsVolunteer &&
                    volunteer.collaborationsAsVolunteer.length > 0 ? (
                    volunteer.collaborationsAsVolunteer.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl"
                      >
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center overflow-hidden">
                          {c.artisan.avatar ? (
                            <img
                              src={c.artisan.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                              {c.artisan.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {c.project.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-zinc-400">
                            with {c.artisan.name}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-lg ${
                            c.status === "COMPLETED"
                              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                              : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                          }`}
                        >
                          {c.status === "COMPLETED" ? "Done" : "Active"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-zinc-500 text-center py-4">
                      No projects yet
                    </p>
                  )}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  sendConnectionRequest();
                  setShowProfile(false);
                }}
                disabled={loading || (status !== null && status !== "DEMO")}
                className={`w-full py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                  status === "PENDING"
                    ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                    : status === "ACCEPTED"
                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {status === "PENDING"
                  ? "Request Pending"
                  : status === "ACCEPTED"
                  ? "Already Connected"
                  : "Send Connection Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
