"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDemoProjects, saveDemoProject } from "@/lib/demoStorage";

interface Project {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  status: string;
  createdAt: Date;
  isDemo?: boolean;
}

interface ArtisanProjectsClientProps {
  projects: Project[];
  isDemo?: boolean;
}

export function ArtisanProjectsClient({
  projects: initialProjects,
  isDemo,
}: ArtisanProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  // Load demo projects from localStorage
  useEffect(() => {
    if (isDemo) {
      const demoProjects = getDemoProjects();
      if (demoProjects.length > 0) {
        setProjects([...demoProjects, ...initialProjects]);
      }
    }
  }, [isDemo, initialProjects]);

  const handleVoiceInput = async () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Speech Recognition not supported in your browser");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setDescription((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const skillsNeeded = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    try {
      // Demo mode - save to localStorage
      if (isDemo) {
        const projectId = `demo-project-${Date.now()}`;
        const newProject: Project = {
          id: projectId,
          title,
          description,
          skillsNeeded,
          status: "OPEN",
          createdAt: new Date(),
          isDemo: true,
        };

        // Save to localStorage
        saveDemoProject(newProject);

        setProjects([newProject, ...projects]);
        setShowCreateModal(false);
        resetForm();
        setLoading(false);
        return;
      }

      // Real mode - call API
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          skillsNeeded,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        resetForm();
        router.refresh();
      } else {
        alert("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSkillsInput("");
  };

  const handleDelete = async (projectId: string, isProjectDemo?: boolean) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    // Demo mode - remove from localStorage
    if (isProjectDemo) {
      const demoProjects = getDemoProjects();
      const updated = demoProjects.filter((p) => p.id !== projectId);
      localStorage.setItem("demo_projects", JSON.stringify(updated));
      setProjects(projects.filter((p) => p.id !== projectId));
      return;
    }

    // Real mode - call API
    try {
      const res = await fetch("/api/projects/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Projects
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-1">
            Post projects and find volunteers to help grow your business
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
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
          Post Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
                  {project.title}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    project.status === "OPEN"
                      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-zinc-300 mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                  Skills Needed
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.skillsNeeded.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-zinc-500 mb-4">
                Posted {new Date(project.createdAt).toLocaleDateString()}
              </p>

              <button
                onClick={() => handleDelete(project.id, project.isDemo)}
                className="w-full py-2 border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition text-sm"
              >
                Delete Project
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Projects Yet
          </h3>
          <p className="text-gray-500 dark:text-zinc-400 mb-6">
            Post your first project to find volunteers who can help grow your
            business
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Post Your First Project
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !loading && setShowCreateModal(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Post a Project
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={loading}
                  className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 p-1"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Social Media Marketing Help"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                    Description *
                  </label>
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    className={`${isListening ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"} hover:text-emerald-700 dark:hover:text-emerald-300 p-1 transition`}
                    title={
                      isListening
                        ? "Listening..."
                        : "Generate description using voice"
                    }
                  >
                    <svg
                      className={`w-5 h-5 ${isListening ? "animate-pulse" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14.828v2.828m0 0v2.828M12 17.656a3 3 0 100-6 3 3 0 000 6zm0-12a6 6 0 00-6 6v3h12v-3a6 6 0 00-6-6z"
                      />
                    </svg>
                  </button>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what help you need..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                  Skills Needed *
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g., Social Media, Marketing, Content Creation"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                  Separate skills with commas
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={loading}
                  className="flex-1 border border-gray-300 dark:border-zinc-700 dark:text-white py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 font-medium"
                >
                  {loading ? "Posting..." : "Post Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
