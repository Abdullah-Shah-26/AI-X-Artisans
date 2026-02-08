"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();

  const handleDemoMode = async (demoRole: string) => {
    setDemoLoading(true);
    await fetch("/api/guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: demoRole }),
    });
    router.push(demoRole === "customer" ? "/marketplace" : "/dashboard");
    setDemoLoading(false);
    setShowDemoModal(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (email && password) {
      // Determine role from email or default to artisan
      const role = email.includes("volunteer")
        ? "volunteer"
        : email.includes("customer")
          ? "customer"
          : "artisan";

      await fetch("/api/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      router.push(role === "customer" ? "/marketplace" : "/dashboard");
    } else {
      setError("Please enter email and password");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    // Set demo mode as artisan by default
    await fetch("/api/guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "artisan" }),
    });

    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1920&q=80')",
        }}
      />
      {/* Dark Overlay with Blur */}
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />
      {/* Demo Mode Button - Top Right */}
      <button
        onClick={() => setShowDemoModal(true)}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
      >
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
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        Try Demo Mode
      </button>

      {/* Demo Mode Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black dark:text-white">
                Explore as Guest
              </h2>
              <button
                onClick={() => setShowDemoModal(false)}
                className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
            <p className="text-black dark:text-zinc-300 text-sm mb-6">
              Experience AIxArtisans without creating an account. Choose a role
              to explore:
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleDemoMode("artisan")}
                disabled={demoLoading}
                className="w-full flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition ring-1 ring-amber-200 dark:ring-amber-500/30"
              >
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div className="text-left">
                  <p className="font-semibold text-black dark:text-white">
                    Artisan
                  </p>
                  <p className="text-xs text-black dark:text-zinc-300">
                    Sell products, manage orders, get AI tools
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleDemoMode("volunteer")}
                disabled={demoLoading}
                className="w-full flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition ring-1 ring-blue-200 dark:ring-blue-500/30"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div className="text-left">
                  <p className="font-semibold text-black dark:text-white">
                    Volunteer
                  </p>
                  <p className="text-xs text-black dark:text-zinc-300">
                    Help artisans, join projects, earn certificates
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleDemoMode("customer")}
                disabled={demoLoading}
                className="w-full flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition ring-1 ring-emerald-200 dark:ring-emerald-500/30"
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-black dark:text-white">
                    Customer
                  </p>
                  <p className="text-xs text-black dark:text-zinc-300">
                    Browse marketplace, buy products, bargain
                  </p>
                </div>
              </button>
            </div>
            <p className="text-xs text-center text-black dark:text-zinc-400 mt-4">
              You can switch roles anytime in demo mode
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-zinc-800">
        <h1 className="text-3xl font-bold text-center mb-2 text-emerald-700 dark:text-emerald-400">
          Welcome to AIxArtisans
        </h1>
        <p className="text-center text-black dark:text-zinc-400 mb-8">
          Empowering artisans with AI
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-zinc-700"></div>
          <span className="px-4 text-black dark:text-zinc-400 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300 dark:border-zinc-700"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition flex items-center justify-center gap-2 text-black dark:text-white"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center mt-6 text-black dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
