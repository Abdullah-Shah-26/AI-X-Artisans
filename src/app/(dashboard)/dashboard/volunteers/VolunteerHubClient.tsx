"use client";

import { useState } from "react";
import { VolunteerCard } from "./VolunteerCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface Collaboration {
  id: string;
  status: string;
  rating: number | null;
  feedback: string | null;
  volunteer: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface Project {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  status: string;
  applications: {
    id: string;
    status: string;
    volunteer: {
      name: string;
      avatar: string | null;
    };
  }[];
  collaborations?: Collaboration[];
}

interface Volunteer {
  id: string;
  name: string;
  avatar: string | null;
  volunteerProfile: {
    skills: string[];
    bio: string | null;
    projectsCompleted: number;
  } | null;
}

interface VolunteerHubClientProps {
  projects: Project[];
  volunteers: Volunteer[];
  connectionMap: Record<string, string>;
  isDemo?: boolean;
}

type TabType = "projects" | "volunteers";

// Application Card Component
function ApplicationCard({
  application,
}: {
  application: {
    id: string;
    status: string;
    volunteer: { name: string; avatar: string | null };
  };
}) {
  const [responding, setResponding] = useState(false);
  const [status, setStatus] = useState(application.status);

  const handleRespond = async (action: "ACCEPTED" | "DECLINED") => {
    setResponding(true);
    try {
      const res = await fetch("/api/projects/applications/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: application.id, action }),
      });
      if (res.ok) {
        setStatus(action);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResponding(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-200 dark:bg-emerald-500/30 flex items-center justify-center overflow-hidden">
          {application.volunteer.avatar ? (
            <img
              src={application.volunteer.avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-emerald-800 dark:text-emerald-300 font-medium">
              {application.volunteer.name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            {application.volunteer.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Volunteer</p>
        </div>
      </div>
      {status === "PENDING" ? (
        <div className="flex gap-2">
          <button
            onClick={() => handleRespond("ACCEPTED")}
            disabled={responding}
            className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            Accept
          </button>
          <button
            onClick={() => handleRespond("DECLINED")}
            disabled={responding}
            className="px-3 py-1.5 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 disabled:opacity-50"
          >
            Decline
          </button>
        </div>
      ) : (
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            status === "ACCEPTED"
              ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
              : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
          }`}
        >
          {status === "ACCEPTED" ? "Accepted" : "Declined"}
        </span>
      )}
    </div>
  );
}

// Collaboration Card Component
function CollaborationCard({
  collaboration,
  projectTitle,
  onComplete,
}: {
  collaboration: Collaboration;
  projectTitle: string;
  onComplete: (collab: Collaboration) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-500/30 flex items-center justify-center overflow-hidden">
          {collaboration.volunteer.avatar ? (
            <img
              src={collaboration.volunteer.avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-blue-800 dark:text-blue-300 font-medium">
              {collaboration.volunteer.name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            {collaboration.volunteer.name}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            {collaboration.status === "IN_PROGRESS"
              ? "Working on project"
              : "Completed"}
          </p>
        </div>
      </div>
      {collaboration.status === "IN_PROGRESS" ? (
        <button
          onClick={() => onComplete(collaboration)}
          className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700"
        >
          Mark Complete
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {collaboration.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < collaboration.rating!
                      ? "text-amber-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
            Completed
          </span>
        </div>
      )}
    </div>
  );
}

export function VolunteerHubClient({
  projects,
  volunteers,
  connectionMap,
}: VolunteerHubClientProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("volunteers");
  const [showProjectModal, setShowProjectModal] = useState(false);
  // Autofilled with demo data
  const [projectForm, setProjectForm] = useState({
    title: "Traditional Pottery Workshop Assistant Needed",
    description:
      "Looking for a skilled volunteer to help organize and conduct pottery workshops for local youth. You'll assist in teaching basic pottery techniques, managing materials, and documenting the learning process. Perfect for someone passionate about preserving traditional crafts and community education.",
    skills: "Teaching, Pottery, Community Outreach",
  });
  const [posting, setPosting] = useState(false);

  // Complete collaboration modal state
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedCollab, setSelectedCollab] = useState<
    (Collaboration & { projectTitle: string }) | null
  >(null);
  const [completeForm, setCompleteForm] = useState({
    rating: 5,
    feedback: "",
    issueCertificate: true,
    certificateTitle: "",
  });
  const [completing, setCompleting] = useState(false);

  // Delete project state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleOpenCompleteModal = (
    collab: Collaboration,
    projectTitle: string,
  ) => {
    setSelectedCollab({ ...collab, projectTitle });
    setCompleteForm({
      rating: 5,
      feedback: "",
      issueCertificate: true,
      certificateTitle: `${projectTitle} - Completion Certificate`,
    });
    setShowCompleteModal(true);
  };

  const handleCompleteCollaboration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollab) return;

    setCompleting(true);
    try {
      const res = await fetch("/api/collaborations/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collaborationId: selectedCollab.id,
          rating: completeForm.rating,
          feedback: completeForm.feedback,
          issueCertificate: completeForm.issueCertificate,
          certificateTitle: completeForm.certificateTitle,
        }),
      });

      if (res.ok) {
        setShowCompleteModal(false);
        setSelectedCollab(null);
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to complete collaboration");
      }
    } catch {
      alert("Error completing collaboration");
    } finally {
      setCompleting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/delete?id=${projectToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShowDeleteModal(false);
        setProjectToDelete(null);
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete project");
      }
    } catch {
      alert("Error deleting project");
    } finally {
      setDeleting(false);
    }
  };

  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectForm.title,
          description: projectForm.description,
          skillsNeeded: projectForm.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        setShowProjectModal(false);
        setProjectForm({ title: "", description: "", skills: "" });
        window.location.reload();
      } else {
        alert("Failed to post project");
      }
    } catch {
      alert("Error posting project");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("volunteers.title")}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base mt-1">
            {t("volunteers.subtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowProjectModal(true)}
          className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 font-medium text-sm sm:text-base whitespace-nowrap"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          {t("volunteers.postProject")}
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800">
        {/* Tabs */}
        <div className="p-2 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("volunteers")}
              className={`flex-1 py-3 px-4 text-center font-medium transition rounded-lg ${
                activeTab === "volunteers"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
                <span className="hidden sm:inline">
                  {t("volunteers.availableVolunteers")}
                </span>
                <span className="sm:hidden">Volunteers</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === "volunteers"
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300"
                  }`}
                >
                  {volunteers.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex-1 py-3 px-4 text-center font-medium transition rounded-lg ${
                activeTab === "projects"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
                <span className="hidden sm:inline">
                  {t("volunteers.myProjects")}
                </span>
                <span className="sm:hidden">Projects</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === "projects"
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300"
                  }`}
                >
                  {projects.length}
                </span>
                {projects.reduce(
                  (count, p) =>
                    count +
                    p.applications.filter((a) => a.status === "PENDING").length,
                  0,
                ) > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {projects.reduce(
                      (count, p) =>
                        count +
                        p.applications.filter((a) => a.status === "PENDING")
                          .length,
                      0,
                    )}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "volunteers" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {volunteers.map((volunteer) => (
                <VolunteerCard
                  key={volunteer.id}
                  volunteer={volunteer}
                  connectionStatus={connectionMap[volunteer.id] || null}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 dark:border-zinc-800 rounded-lg p-4 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              project.status === "OPEN"
                                ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                                : project.status === "IN_PROGRESS"
                                  ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                                  : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
                            }`}
                          >
                            {project.status.replace("_", " ")}
                          </span>
                          <button
                            onClick={() => {
                              setProjectToDelete(project.id);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                            title="Delete project"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-500 dark:text-zinc-400 text-sm line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.skillsNeeded.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Active Collaborations */}
                  {project.collaborations &&
                    project.collaborations.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                            Active Collaborations (
                            {project.collaborations.length})
                          </span>
                        </div>
                        <div className="space-y-2">
                          {project.collaborations.map((collab) => (
                            <CollaborationCard
                              key={collab.id}
                              collaboration={collab}
                              projectTitle={project.title}
                              onComplete={(c) =>
                                handleOpenCompleteModal(c, project.title)
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Applications */}
                  {project.applications.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          Applications ({project.applications.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {project.applications.map((app) => (
                          <ApplicationCard key={app.id} application={app} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Project Card */}
              <button
                onClick={() => setShowProjectModal(true)}
                className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 hover:border-emerald-400 dark:hover:border-emerald-500 transition flex items-center justify-center gap-3 text-gray-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 w-full"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="font-medium">
                  {t("volunteers.postNewProject")}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("volunteers.postNewProject")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                {t("volunteers.subtitle")}
              </p>
            </div>
            <form onSubmit={handlePostProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  {t("volunteers.projectTitle")}
                </label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  placeholder="e.g., Website Development for Online Store"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  {t("volunteers.description")}
                </label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe what help you need..."
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  {t("volunteers.skillsNeeded")}
                </label>
                <input
                  type="text"
                  value={projectForm.skills}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, skills: e.target.value })
                  }
                  placeholder="e.g., Web Development, SEO, Social Media (comma separated)"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                  Separate multiple skills with commas
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium"
                >
                  {t("volunteers.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={posting}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
                >
                  {posting
                    ? t("volunteers.posting")
                    : t("volunteers.postProject")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Collaboration Modal */}
      {showCompleteModal && selectedCollab && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Complete Collaboration
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                Rate {selectedCollab.volunteer.name}'s work on "
                {selectedCollab.projectTitle}"
              </p>
            </div>
            <form
              onSubmit={handleCompleteCollaboration}
              className="p-6 space-y-5"
            >
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setCompleteForm({ ...completeForm, rating: star })
                      }
                      className="p-1 transition hover:scale-110"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= completeForm.rating
                            ? "text-amber-400"
                            : "text-gray-300 dark:text-zinc-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  Feedback (optional)
                </label>
                <textarea
                  value={completeForm.feedback}
                  onChange={(e) =>
                    setCompleteForm({
                      ...completeForm,
                      feedback: e.target.value,
                    })
                  }
                  placeholder="Share your experience working with this volunteer..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Issue Certificate */}
              <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={completeForm.issueCertificate}
                    onChange={(e) =>
                      setCompleteForm({
                        ...completeForm,
                        issueCertificate: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Issue Certificate
                    </span>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      Award a certificate to recognize their contribution
                    </p>
                  </div>
                </label>
                {completeForm.issueCertificate && (
                  <input
                    type="text"
                    value={completeForm.certificateTitle}
                    onChange={(e) =>
                      setCompleteForm({
                        ...completeForm,
                        certificateTitle: e.target.value,
                      })
                    }
                    placeholder="Certificate title"
                    className="mt-3 w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCompleteModal(false);
                    setSelectedCollab(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={completing}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
                >
                  {completing ? "Completing..." : "Complete & Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Delete Project
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-zinc-400 mb-6">
                Are you sure you want to delete this project? All applications
                and collaborations will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProjectToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                >
                  {deleting ? "Deleting..." : "Delete Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
