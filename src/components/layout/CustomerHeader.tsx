"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";

interface CustomerHeaderProps {
  user: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    isDemo?: boolean;
  } | null;
  cartCount?: number;
  favoritesCount?: number;
  showViewToggle?: boolean;
  currentView?: "products" | "favorites" | "offers";
  onViewChange?: (view: "products" | "favorites" | "offers") => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function CustomerHeader({
  user,
  cartCount = 0,
  favoritesCount = 0,
  showViewToggle = false,
  currentView = "products",
  onViewChange,
  searchQuery = "",
  onSearchChange,
}: CustomerHeaderProps) {
  const router = useRouter();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchRole = async (newRole: string) => {
    setShowRoleMenu(false);
    try {
      if (user?.isDemo) {
        await fetch("/api/guest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        });
      } else {
        await fetch("/api/users/role", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        });
      }

      if (newRole === "customer") {
        router.push("/marketplace");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
      <div className="max-w-[1800px] mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Left Section - Logo + All Products Label OR Back Button */}
          <div className="flex items-center gap-3 shrink-0 md:w-64">
            {/* Back Button - Show when NOT on marketplace */}
            {!showViewToggle && (
              <Link
                href="/marketplace"
                className="p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
                title="Back to Marketplace"
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
              </Link>
            )}

            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-emerald-500/30">
                <img
                  src="/image.png"
                  alt="AIxArtisans"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 hidden lg:block">
                AIxArtisans
              </span>
            </Link>

            {/* All Products Label - Only show on marketplace page */}
            {showViewToggle && (
              <div className="hidden lg:flex items-center px-3 py-1.5 bg-gray-100 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  All Products
                </span>
              </div>
            )}
          </div>

          {/* Center Section - Desktop ONLY Search Bar (only on marketplace) */}
          {showViewToggle && (
            <div className="hidden md:flex flex-1 justify-center">
              <div className="relative w-full max-w-2xl">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="Search handcrafted products..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Spacer for mobile */}
          <div className="flex-1 md:hidden"></div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 md:gap-1 shrink-0 md:w-64 justify-end">
            {/* Messages - Hidden on mobile */}
            {user && (
              <Link
                href="/dashboard/connections"
                className="hidden md:block p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
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
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </Link>
            )}

            {/* Favorites - Hidden on mobile */}
            {user && onViewChange && (
              <button
                onClick={() =>
                  onViewChange(
                    currentView === "favorites" ? "products" : "favorites",
                  )
                }
                className="hidden md:block p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition relative"
              >
                <svg
                  className="w-5 h-5"
                  fill={currentView === "favorites" ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {favoritesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart - Hidden on mobile */}
            {user && (
              <Link
                href="/cart"
                className="hidden md:block p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition relative"
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <>
                {/* Role Switch */}
                <div className="relative">
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center gap-1 md:gap-1.5 px-2 md:px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-xs font-medium capitalize">
                      {user.role}
                    </span>
                    <svg
                      className={`w-3 h-3 transition-transform ${
                        showRoleMenu ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {showRoleMenu && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl py-1 z-50">
                      <button
                        onClick={() => switchRole("artisan")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs w-full hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                          user.role === "artisan"
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                            : "text-gray-700 dark:text-zinc-300"
                        }`}
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
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Artisan
                        {user.role === "artisan" && (
                          <svg
                            className="w-3 h-3 ml-auto"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => switchRole("volunteer")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs w-full hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                          user.role === "volunteer"
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                            : "text-gray-700 dark:text-zinc-300"
                        }`}
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Volunteer
                        {user.role === "volunteer" && (
                          <svg
                            className="w-3 h-3 ml-auto"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => switchRole("customer")}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs w-full hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                          user.role === "customer"
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                            : "text-gray-700 dark:text-zinc-300"
                        }`}
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
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        Customer
                        {user.role === "customer" && (
                          <svg
                            className="w-3 h-3 ml-auto"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
                  title={
                    mounted
                      ? theme === "dark"
                        ? "Light Mode"
                        : "Dark Mode"
                      : "Toggle Theme"
                  }
                >
                  {!mounted ? (
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
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  ) : theme === "dark" ? (
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
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
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
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border-2 border-gray-300 dark:border-zinc-700 hover:border-emerald-500 transition"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl py-1 z-50">
                      {user.name && user.name !== "Guest User" && (
                        <div className="px-3 py-2 border-b border-zinc-800">
                          <p className="text-sm font-medium text-white truncate">
                            {user.name}
                          </p>
                        </div>
                      )}

                      {/* Profile - First */}
                      <Link
                        href="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </Link>

                      {/* Mobile-only: Messages */}
                      <Link
                        href="/dashboard/connections"
                        onClick={() => setShowProfileMenu(false)}
                        className="md:hidden flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
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
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        Messages
                      </Link>

                      {/* Mobile-only: Favorites */}
                      {onViewChange && (
                        <button
                          onClick={() => {
                            onViewChange(
                              currentView === "favorites"
                                ? "products"
                                : "favorites",
                            );
                            setShowProfileMenu(false);
                          }}
                          className="md:hidden flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 w-full"
                        >
                          <svg
                            className="w-4 h-4"
                            fill={
                              currentView === "favorites"
                                ? "currentColor"
                                : "none"
                            }
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          Favorites
                          {favoritesCount > 0 && (
                            <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                              {favoritesCount}
                            </span>
                          )}
                        </button>
                      )}

                      {/* Offers */}
                      <Link
                        href="/profile?tab=offers"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
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
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Offers
                      </Link>

                      <hr className="md:hidden border-zinc-800 my-1" />

                      <hr className="border-zinc-800 my-1" />

                      <button
                        onClick={async () => {
                          setShowProfileMenu(false);
                          await supabase.auth.signOut();
                          router.push("/");
                          router.refresh();
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 w-full"
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
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="ml-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
