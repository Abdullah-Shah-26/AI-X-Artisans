"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  userName: string;
  userAvatar?: string | null;
  userRole: "ARTISAN" | "VOLUNTEER" | "CUSTOMER";
  pendingRequestsCount?: number;
  pendingApplicationsCount?: number;
  isDemo?: boolean;
}

export function Header({
  userName,
  userAvatar,
  userRole,
  pendingRequestsCount = 0,
  pendingApplicationsCount = 0,
  isDemo = false,
}: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
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
    newRole: "ARTISAN" | "VOLUNTEER" | "CUSTOMER"
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
    <header className="h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-900 flex items-center justify-between px-6">
      {/* Demo Mode Badge */}
      {isDemo && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-full ring-1 ring-purple-500/30 mr-4">
          <svg
            className="w-4 h-4 text-purple-500"
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
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
            Demo Mode
          </span>
        </div>
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
            href="/dashboard/connections"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              pathname?.startsWith("/dashboard/connections")
                ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Connections
          </Link>
        </nav>
      )}

      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
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

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="relative">
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
                    className={`block w-full text-left px-4 py-2 text-sm transition ${
                      role === userRole
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
                        : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    } disabled:cursor-not-allowed`}
                  >
                    {roleLabels[role]}
                    {role === userRole && (
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
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        <Link
          href={
            userRole === "ARTISAN" && pendingApplicationsCount > 0
              ? "/dashboard/volunteers"
              : "/dashboard/connections"
          }
          className="relative p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
          title={
            userRole === "ARTISAN" && pendingApplicationsCount > 0
              ? `${pendingApplicationsCount} new application(s)`
              : `${pendingRequestsCount} notification(s)`
          }
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {pendingRequestsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
              {pendingRequestsCount > 9 ? "9+" : pendingRequestsCount}
            </span>
          )}
        </Link>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center overflow-hidden">
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
              className="w-4 h-4 text-gray-600 dark:text-zinc-400"
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
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-800 py-1 z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                onClick={() => setShowDropdown(false)}
              >
                {t("header.myProfile")}
              </Link>

              <hr className="my-1 border-gray-200 dark:border-zinc-800" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                {t("header.signOut")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
