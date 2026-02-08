"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface HeaderProps {
  userName: string;
  userAvatar?: string | null;
  userRole: "ARTISAN" | "VOLUNTEER" | "CUSTOMER";
  pendingRequestsCount?: number;
  pendingApplicationsCount?: number;
  isDemo?: boolean;
  onMenuClick?: () => void;
}

export function MobileSearchBar() {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-900 px-4 py-3">
      <div className="relative w-full max-w-2xl mx-auto">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
          placeholder={t("header.search")}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

export function Header({
  userName,
  userAvatar,
  userRole,
  pendingRequestsCount = 0,
  pendingApplicationsCount = 0,
  isDemo = false,
  onMenuClick,
}: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [switching, setSwitching] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    // Clear guest/demo cookies
    await fetch("/api/guest", { method: "DELETE" });

    // Sign out from Supabase (handles both guest and auth cases gracefully)
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  };

  const handleRoleSwitch = async (
    newRole: "ARTISAN" | "VOLUNTEER" | "CUSTOMER",
  ) => {
    if (newRole === userRole) return;
    setSwitching(true);
    try {
      // For demo mode, use the guest API to switch simulation role
      if (isDemo) {
        await fetch("/api/guest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole.toLowerCase() }),
        });
      } else {
        await fetch("/api/users/role", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole.toLowerCase() }),
        });
      }
      setShowRoleDropdown(false);
      if (newRole === "CUSTOMER") {
        router.push("/marketplace");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      alert("Error switching role");
    } finally {
      setSwitching(false);
    }
  };

  const roleLabels = {
    ARTISAN: t("role.artisan"),
    VOLUNTEER: t("role.volunteer"),
    CUSTOMER: t("role.customer"),
  };

  return (
    <header className="h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-900 flex items-center justify-between px-4 md:px-6">
      {/* Hamburger menu button - mobile only, hidden for customers */}
      {userRole !== "CUSTOMER" && (
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg mr-2"
          aria-label="Open menu"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Customer Navigation */}
      {userRole === "CUSTOMER" && (
        <nav className="hidden md:flex items-center gap-1 mr-6 bg-gray-100 dark:bg-zinc-800 p-1 rounded-full">
          <Link
            href="/marketplace"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              pathname === "/marketplace" || pathname === "/"
                ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Marketplace
          </Link>
          <Link
            href="/dashboard/chat"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              pathname?.startsWith("/dashboard/chat")
                ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Messages
          </Link>
        </nav>
      )}

      {/* Search - only for non-customers, hidden on mobile, hidden on chat/connections pages */}
      {userRole !== "CUSTOMER" &&
        !pathname?.includes("/chat") &&
        !pathname?.includes("/connections") && (
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                placeholder={t("header.search")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

      {/* Spacer for mobile */}
      <div className="flex-1 md:hidden"></div>

      {/* Spacer for desktop - pushes right side items to the right */}
      <div className="hidden md:block md:flex-1"></div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Switcher */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
          >
            <span className="text-sm font-medium">
              {language === "en" ? "EN" : "HI"}
            </span>
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-800 py-1 z-50">
              <button
                onClick={() => {
                  setLanguage("en");
                  setShowLangDropdown(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition ${
                  language === "en"
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
                    : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                🇬🇧 English
                {language === "en" && (
                  <svg
                    className="inline w-4 h-4 ml-2"
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
                onClick={() => {
                  setLanguage("hi");
                  setShowLangDropdown(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition ${
                  language === "hi"
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
                    : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                🇮🇳 हिंदी
                {language === "hi" && (
                  <svg
                    className="inline w-4 h-4 ml-2"
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

        {/* Role Switcher - Only for Demo users */}
        {isDemo && (
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              disabled={switching}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition disabled:opacity-50"
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
              <span className="text-sm font-medium">
                {roleLabels[userRole]}
              </span>
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-800 py-1 z-50">
                <div className="px-3 py-2 text-xs text-gray-500 dark:text-zinc-500 font-medium uppercase">
                  {t("header.switchRole")}
                </div>
                {(["ARTISAN", "VOLUNTEER", "CUSTOMER"] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    disabled={role === userRole || switching}
                    className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm transition ${
                      role === userRole
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
                        : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    } disabled:cursor-not-allowed`}
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {role === "ARTISAN" && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        )}
                        {role === "VOLUNTEER" && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        )}
                        {role === "CUSTOMER" && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        )}
                      </svg>
                      {roleLabels[role]}
                    </span>
                    {role === userRole && (
                      <svg
                        className="w-4 h-4"
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
            title={
              userRole === "ARTISAN" && pendingApplicationsCount > 0
                ? `${pendingApplicationsCount} new application(s)`
                : `${pendingRequestsCount} notification(s)`
            }
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                {pendingRequestsCount > 9 ? "9+" : pendingRequestsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Mobile centered dropdown */}
              <div className="md:hidden fixed inset-x-4 top-20 w-auto bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 py-2 z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>

                {/* Demo notifications based on user role */}
                {userRole === "CUSTOMER" ? (
                  <>
                    {/* Customer notifications */}
                    <Link
                      href="/dashboard/chat"
                      onClick={() => setShowNotifications(false)}
                      className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-500/20 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                            alt="Arjun Verma"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Arjun Verma
                          </p>
                          <p className="text-sm text-gray-600 dark:text-zinc-400 truncate">
                            When can we schedule the collaboration?
                          </p>
                          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Artisan/Volunteer notifications */}
                    <Link
                      href="/dashboard/chat"
                      onClick={() => setShowNotifications(false)}
                      className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-500/20 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200"
                            alt="Meera Patel"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Meera Patel
                          </p>
                          <p className="text-sm text-gray-600 dark:text-zinc-400 truncate">
                            I'd love to help with your marketing!
                          </p>
                          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                            1 day ago
                          </p>
                        </div>
                      </div>
                    </Link>
                  </>
                )}

                <div className="px-4 py-2 border-t border-gray-200 dark:border-zinc-800">
                  <Link
                    href="/dashboard/chat"
                    onClick={() => setShowNotifications(false)}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                  >
                    View all messages →
                  </Link>
                </div>
              </div>

              {/* Desktop right-aligned dropdown */}
              <div className="hidden md:block absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 py-2 z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>

                {/* Demo notifications based on user role */}
                {userRole === "CUSTOMER" ? (
                  <>
                    {/* Customer notifications */}
                    <Link
                      href="/dashboard/chat"
                      onClick={() => setShowNotifications(false)}
                      className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-500/20 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                            alt="Arjun Verma"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Arjun Verma
                          </p>
                          <p className="text-sm text-gray-600 dark:text-zinc-400 truncate">
                            When can we schedule the collaboration?
                          </p>
                          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Artisan/Volunteer notifications */}
                    <Link
                      href="/dashboard/chat"
                      onClick={() => setShowNotifications(false)}
                      className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-500/20 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200"
                            alt="Meera Patel"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Meera Patel
                          </p>
                          <p className="text-sm text-gray-600 dark:text-zinc-400 truncate">
                            I'd love to help with your marketing!
                          </p>
                          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                            1 day ago
                          </p>
                        </div>
                      </div>
                    </Link>
                  </>
                )}

                <div className="px-4 py-2 border-t border-gray-200 dark:border-zinc-800">
                  <Link
                    href="/dashboard/chat"
                    onClick={() => setShowNotifications(false)}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                  >
                    View all messages →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500 flex items-center justify-center overflow-hidden">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white dark:text-black font-semibold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <svg
              className="w-4 h-4 text-gray-600 dark:text-zinc-400 hidden sm:block"
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

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl py-1 z-50">
              {/* User info header */}
              <div className="px-3 py-2 border-b border-zinc-800">
                <p className="text-sm font-medium text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-zinc-500 capitalize">
                  {userRole.toLowerCase()}
                </p>
              </div>

              {/* Favorites - Only for Customers */}
              {userRole === "CUSTOMER" && (
                <Link
                  href="/marketplace?view=favorites"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  onClick={() => setShowDropdown(false)}
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Favorites
                </Link>
              )}

              {/* Messages - Only for Customers */}
              {userRole === "CUSTOMER" && (
                <Link
                  href="/dashboard/chat"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  onClick={() => setShowDropdown(false)}
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
              )}

              {/* My Offers - Only for Customers */}
              {userRole === "CUSTOMER" && (
                <Link
                  href="/marketplace?view=offers"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  onClick={() => setShowDropdown(false)}
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
                  My Offers
                </Link>
              )}

              {userRole === "CUSTOMER" && (
                <hr className="my-1 border-zinc-800" />
              )}

              {/* Profile link */}
              <Link
                href={
                  userRole === "CUSTOMER" ? "/profile" : "/dashboard/profile"
                }
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                onClick={() => setShowDropdown(false)}
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

              {/* Dashboard - Only for non-customers */}
              {userRole !== "CUSTOMER" && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                  onClick={() => setShowDropdown(false)}
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  Dashboard
                </Link>
              )}

              <hr className="my-1 border-zinc-800" />

              {/* Language Switcher - Mobile only */}
              <div className="sm:hidden px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">Language</span>
                  <button
                    onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        language === "hi" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                    <span className="absolute left-1.5 text-[10px] font-medium text-zinc-400">
                      EN
                    </span>
                    <span className="absolute right-1.5 text-[10px] font-medium text-zinc-400">
                      HI
                    </span>
                  </button>
                </div>
              </div>

              <hr className="my-1 border-zinc-800 sm:hidden" />

              {/* Sign out */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-zinc-800"
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
      </div>
    </header>
  );
}
