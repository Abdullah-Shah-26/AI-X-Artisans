"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

type Role = "ARTISAN" | "VOLUNTEER" | "CUSTOMER";

function ProfileSetupContent() {
  const [role, setRole] = useState<Role | null>(null);
  const [step, setStep] = useState(0); // 0 = role selection, 1-2 = profile steps
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Artisan fields
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [story, setStory] = useState("");

  // Volunteer fields
  const [skills, setSkills] = useState<string[]>([]);
  const [motivation, setMotivation] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      // Check for role in metadata or URL params
      const userRole = user.user_metadata?.role as Role;
      const urlRole = searchParams.get("role")?.toUpperCase() as Role;

      if (userRole) {
        setRole(userRole);
        if (userRole === "CUSTOMER") {
          await completeProfile("CUSTOMER", {});
        } else {
          setStep(1);
        }
      } else if (
        urlRole &&
        ["ARTISAN", "VOLUNTEER", "CUSTOMER"].includes(urlRole)
      ) {
        setRole(urlRole);
        if (urlRole === "CUSTOMER") {
          await completeProfile("CUSTOMER", {});
        } else {
          setStep(1);
        }
      } else {
        // No role found - show role selection
        setStep(0);
      }

      setLoading(false);
    };
    getUser();
  }, []);

  const selectRole = async (selectedRole: Role) => {
    setRole(selectedRole);

    if (selectedRole === "CUSTOMER") {
      await completeProfile("CUSTOMER", {});
    } else {
      setStep(1);
    }
  };

  const completeProfile = async (
    userRole: Role,
    profileData: Record<string, unknown>
  ) => {
    setLoading(true);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: userRole,
          ...profileData,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const errorData = await response.json();
        console.error("Profile update failed:", errorData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error completing profile:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "ARTISAN") {
      await completeProfile("ARTISAN", { location, bio, story });
    } else if (role === "VOLUNTEER") {
      await completeProfile("VOLUNTEER", { skills, bio, motivation });
    }
  };

  const skillOptions = [
    "Photography",
    "Video Editing",
    "Social Media",
    "Copywriting",
    "Web Design",
    "Marketing",
    "Translation",
    "Accounting",
  ];

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Loading state
  if (loading && step === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Role selection step
  if (step === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
            Welcome to AIxArtisans!
          </h1>
          <p className="text-center text-gray-600 mb-8">
            How would you like to use the platform?
          </p>

          <div className="space-y-4">
            <button
              onClick={() => selectRole("ARTISAN")}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700">
                    I&apos;m an Artisan
                  </h3>
                  <p className="text-sm text-gray-500">
                    Sell my handcrafted products and grow my business
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => selectRole("VOLUNTEER")}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700">
                    I&apos;m a Volunteer
                  </h3>
                  <p className="text-sm text-gray-500">
                    Help artisans with my professional skills
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => selectRole("CUSTOMER")}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700">
                    I&apos;m a Customer
                  </h3>
                  <p className="text-sm text-gray-500">
                    Browse and buy unique handcrafted items
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile setup form
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Complete Your Profile
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {role === "ARTISAN" && "Tell us about your craft and story"}
          {role === "VOLUNTEER" && "Share your skills and motivation"}
        </p>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div
            className={`h-1 flex-1 rounded ${
              step >= 1 ? "bg-emerald-500" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-1 flex-1 rounded ${
              step >= 2 ? "bg-emerald-500" : "bg-gray-200"
            }`}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === "ARTISAN" && (
            <>
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Jaipur, Rajasthan"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="A brief introduction about yourself..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
                  >
                    Next
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Craft Story
                    </label>
                    <textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="Share the story of your craft tradition, how you learned it, what makes it special..."
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This helps customers connect with your heritage
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition text-black"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Complete Setup"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {role === "VOLUNTEER" && (
            <>
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1 rounded-full text-sm transition ${
                            skills.includes(skill)
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell artisans about yourself..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={skills.length === 0}
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Why do you want to help artisans?
                    </label>
                    <textarea
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Share your motivation for volunteering..."
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition text-black"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Complete Setup"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default function ProfileSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ProfileSetupContent />
    </Suspense>
  );
}
