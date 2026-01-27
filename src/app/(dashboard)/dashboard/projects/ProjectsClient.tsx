"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  status: string;
  createdAt: Date;
  isDemo?: boolean;
  postedBy: {
    id: string;
    name: string;
    avatar: string | null;
    artisanProfile: { location: string | null } | null;
  };
  applications: { id: string; volunteerId: string; status: string }[];
};

type Application = {
  id: string;
  status: string;
  applicationDate: Date;
  project: {
    id: string;
    title: string;
    description: string;
    postedBy: { id: string; name: string; avatar: string | null };
  };
};

type Collaboration = {
  id: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  rating: number | null;
  feedback: string | null;
  project: {
    id: string;
    title: string;
    description: string;
    postedBy: { id: string; name: string; avatar: string | null };
  };
  artisan: { id: string; name: string; avatar: string | null };
};

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
  user: any;
  projects: Project[];
  applications: Application[];
  collaborations: Collaboration[];
  artisans: Artisan[];
  connectionMap: Record<string, string>;
  isDemo?: boolean;
}

export function ProjectsClient({
  user,
  projects,
  applications,
  collaborations,
  artisans,
  connectionMap,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | "projects"
    | "applications"
    | "collaborations"
    | "certifications"
    | "artisans"
  >("projects");
  const [applying, setApplying] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  const [demoApplied, setDemoApplied] = useState<string[]>([]);

  const handleApply = async (projectId: string, isDemo?: boolean) => {
    setApplying(projectId);

    // For demo projects, just simulate the apply
    if (isDemo) {
      setTimeout(() => {
        setDemoApplied((prev) => [...prev, projectId]);
        setApplying(null);
      }, 500);
      return;
    }

    try {
      const res = await fetch("/api/projects/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to apply");
      }
    } catch {
      alert("Error applying");
    } finally {
      setApplying(null);
    }
  };

  const [demoConnected, setDemoConnected] = useState<string[]>([]);

  const handleConnect = async (artisanId: string, isDemo?: boolean) => {
    setConnecting(artisanId);

    // For demo artisans, just simulate the connection
    if (isDemo) {
      setTimeout(() => {
        setDemoConnected((prev) => [...prev, artisanId]);
        setConnecting(null);
      }, 500);
      return;
    }

    try {
      const res = await fetch("/api/connections/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: artisanId }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to send connection request");
      }
    } catch {
      alert("Error sending request");
    } finally {
      setConnecting(null);
    }
  };

  const hasApplied = (projectId: string) =>
    applications.some((app) => app.project.id === projectId) ||
    demoApplied.includes(projectId);

  const activeCollabs = collaborations.filter(
    (c) => c.status === "IN_PROGRESS"
  );
  const completedCollabs = collaborations.filter(
    (c) => c.status === "COMPLETED"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Find Projects
        </h1>
        <p className="text-gray-600 dark:text-zinc-400 mt-1">
          Find projects, collaborate with artisans, and make an impact
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-zinc-800">
        <nav className="-mb-px flex space-x-6">
          {[
            { id: "projects", label: "Available Projects" },
            { id: "applications", label: "My Applications" },
            { id: "collaborations", label: "Collaborations" },
            { id: "certifications", label: "Certifications" },
            { id: "artisans", label: "Find Artisans" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => {
              const applied = hasApplied(project.id);
              return (
                <div
                  key={project.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 flex flex-col hover:shadow-md transition"
                >
                  <div className="p-6 flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <Link
                      href={`/artisan/${project.postedBy.id}`}
                      className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400 mb-3 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                        {project.postedBy.avatar ? (
                          <img
                            src={project.postedBy.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                            {project.postedBy.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span>Posted by {project.postedBy.name}</span>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-zinc-300 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                        Skills Needed
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.skillsNeeded.map((skill) => (
                          <span
                            key={skill}
                            className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-b-xl">
                    <button
                      onClick={() => handleApply(project.id, project.isDemo)}
                      disabled={applied || applying === project.id}
                      className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition"
                    >
                      {applying === project.id
                        ? "Applying..."
                        : applied
                        ? "Applied"
                        : "Apply Now"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-zinc-400">
                No open projects available
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "applications" && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {app.project.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                      Applied on{" "}
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      app.status === "ACCEPTED"
                        ? "bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400"
                        : app.status === "PENDING"
                        ? "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400"
                        : "bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400"
                    }`}
                  >
                    {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-zinc-400 text-center py-8">
                You haven't applied to any projects yet
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "collaborations" && (
        <div className="space-y-6">
          {/* Active */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Active Collaborations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCollabs.length > 0 ? (
                activeCollabs.map((collab) => (
                  <div
                    key={collab.id}
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6"
                  >
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                      {collab.project.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-zinc-300">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                        {collab.artisan.avatar ? (
                          <img
                            src={collab.artisan.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                            {collab.artisan.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span>With {collab.artisan.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
                      Started {new Date(collab.startDate).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-zinc-400 col-span-full">
                  No active collaborations
                </p>
              )}
            </div>
          </div>

          {/* Completed */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Completed
            </h3>
            <div className="space-y-4">
              {completedCollabs.length > 0 ? (
                completedCollabs.map((collab) => (
                  <div
                    key={collab.id}
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                          {collab.project.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-zinc-300 mt-1">
                          With {collab.artisan.name}
                        </p>
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
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-zinc-400">
                        {collab.endDate &&
                          new Date(collab.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    {collab.feedback && (
                      <p className="text-sm text-gray-600 dark:text-zinc-300 mt-3 italic">
                        "{collab.feedback}"
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-zinc-400">
                  No completed collaborations yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "certifications" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedCollabs.length > 0 ? (
              completedCollabs.map((collab) => (
                <div
                  key={collab.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 relative overflow-hidden group hover:shadow-md transition-all"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-emerald-500 to-teal-600" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.74Z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        Verified Certificate
                      </div>
                      {collab.endDate && (
                        <span className="text-xs text-gray-400 dark:text-zinc-500 font-mono">
                          {new Date(collab.endDate).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {collab.project.title}
                    </h3>

                    <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg mt-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden ring-2 ring-white dark:ring-zinc-800 shrink-0">
                        {collab.artisan.avatar ? (
                          <img
                            src={collab.artisan.avatar}
                            alt={collab.artisan.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                            {collab.artisan.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wide font-medium">
                          Issued by
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {collab.artisan.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < (collab.rating || 0)
                                ? "text-amber-400"
                                : "text-gray-200 dark:text-zinc-700"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    <button className="w-full mt-5 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 text-sm font-medium transition shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Credential
                    </button>
                  </div>
                </div>
              ))
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
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-zinc-400">
                  No certificates yet
                </p>
                <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">
                  Complete collaborations to earn certificates
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "artisans" && (
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
                        href={`/dashboard/chat?user=${artisan.id}`}
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
                        onClick={() =>
                          handleConnect(artisan.id, artisan.isDemo)
                        }
                        disabled={connecting === artisan.id}
                        className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium transition"
                      >
                        {connecting === artisan.id
                          ? "Connecting..."
                          : "Connect"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-zinc-400">
                No artisans found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
