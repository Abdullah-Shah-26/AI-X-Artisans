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
    "projects" | "applications" | "collaborations"
  >("projects");
  const [applying, setApplying] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [localApplications, setLocalApplications] = useState(applications);

  const [demoApplied, setDemoApplied] = useState<string[]>([]);
  const [localCollaborations, setLocalCollaborations] = useState(collaborations);

  const handleMarkComplete = (collabId: string) => {
    setLocalCollaborations((prev) =>
      prev.map((c) =>
        c.id === collabId
          ? { ...c, status: "COMPLETED", endDate: new Date() }
          : c,
      ),
    );
  };

  const handleApply = async (projectId: string, isDemo?: boolean) => {
    setApplying(projectId);

    // For demo projects, just simulate the apply
    if (isDemo) {
      setTimeout(() => {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          const newApp = {
            id: `demo-app-${Date.now()}`,
            status: "PENDING",
            applicationDate: new Date(),
            project: {
              id: project.id,
              title: project.title,
              description: project.description,
              postedBy: project.postedBy,
            },
          };
          setLocalApplications((prev) => [newApp, ...prev]);
        }
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
    localApplications.some((app) => app.project.id === projectId) ||
    demoApplied.includes(projectId);

  const activeCollabs = localCollaborations.filter(
    (c) => c.status === "IN_PROGRESS",
  );
  const completedCollabs = localCollaborations.filter(
    (c) => c.status === "COMPLETED",
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
            {localApplications.length > 0 ? (
              localApplications.map((app) => (
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
                    <button
                      onClick={() => handleMarkComplete(collab.id)}
                      className="mt-4 w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium transition"
                    >
                      Mark as Complete
                    </button>
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
    </div>
  );
}
