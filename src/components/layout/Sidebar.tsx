"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/contexts/LanguageContext";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

// Icons
const DashboardIcon = () => (
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const ProductsIcon = () => (
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
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const CameraIcon = () => (
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
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const VideoIcon = () => (
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
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const UsersIcon = () => (
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
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const LinkIcon = () => (
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
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

const ChatIcon = () => (
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
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const FundingIcon = () => (
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
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ProjectsIcon = () => (
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
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const CollabIcon = () => (
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
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

const TrainingIcon = () => (
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
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const CertificateIcon = () => (
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
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
);

const BargainIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-.879-1.172-2.303 0-3.182C10.536 11.219 11.268 11 12 11c.725 0 1.45-.22 2.003-.659 1.106-.879 1.106-2.303 0-3.182s-2.9-.879-4.006 0l-.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SunIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

// Nav items with translation keys
type NavItemConfig = {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
};

const artisanNavConfig: NavItemConfig[] = [
  {
    labelKey: "sidebar.dashboard",
    href: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    labelKey: "sidebar.myProducts",
    href: "/dashboard/products",
    icon: <ProductsIcon />,
  },
  {
    labelKey: "sidebar.authenticity",
    href: "/dashboard/authenticity-certificates",
    icon: <CertificateIcon />,
  },
  {
    labelKey: "sidebar.photoStudio",
    href: "/dashboard/photo-studio",
    icon: <CameraIcon />,
  },
  {
    labelKey: "sidebar.videoStudio",
    href: "/dashboard/video-studio",
    icon: <VideoIcon />,
  },
  {
    labelKey: "sidebar.collabHub",
    href: "/dashboard/volunteers",
    icon: <UsersIcon />,
  },
  {
    labelKey: "sidebar.messages",
    href: "/dashboard/chat",
    icon: <ChatIcon />,
  },
  {
    labelKey: "sidebar.connections",
    href: "/dashboard/connections",
    icon: <LinkIcon />,
  },
  {
    labelKey: "sidebar.negotiations",
    href: "/dashboard/negotiations",
    icon: <BargainIcon />,
  },
  {
    labelKey: "sidebar.financeHub",
    href: "/dashboard/finance-hub",
    icon: <FundingIcon />,
  },
];

const ArtisanIcon = () => (
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
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const volunteerNavConfig: NavItemConfig[] = [
  {
    labelKey: "sidebar.dashboard",
    href: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    labelKey: "sidebar.collabHub",
    href: "/dashboard/projects",
    icon: <UsersIcon />,
  },
  {
    labelKey: "sidebar.findArtisans",
    href: "/dashboard/artisans",
    icon: <ArtisanIcon />,
  },
  {
    labelKey: "sidebar.certificates",
    href: "/dashboard/certificates",
    icon: <CertificateIcon />,
  },
  {
    labelKey: "sidebar.messages",
    href: "/dashboard/chat",
    icon: <ChatIcon />,
  },
  {
    labelKey: "sidebar.connections",
    href: "/dashboard/connections",
    icon: <LinkIcon />,
  },
];

const customerNavConfig: NavItemConfig[] = [
  {
    labelKey: "sidebar.marketplace",
    href: "/marketplace",
    icon: <DashboardIcon />,
  },
  {
    labelKey: "sidebar.messages",
    href: "/dashboard/chat",
    icon: <ChatIcon />,
  },
  {
    labelKey: "sidebar.connections",
    href: "/dashboard/connections",
    icon: <LinkIcon />,
  },
  {
    labelKey: "sidebar.profile",
    href: "/profile",
    icon: <ArtisanIcon />,
  },
];

interface SidebarProps {
  role: "ARTISAN" | "VOLUNTEER" | "CUSTOMER";
  userName: string;
  userAvatar?: string | null;
  isDemo?: boolean;
  isMobileMenuOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  role,
  userName,
  userAvatar,
  isDemo = false,
  isMobileMenuOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navConfig =
    role === "ARTISAN"
      ? artisanNavConfig
      : role === "VOLUNTEER"
        ? volunteerNavConfig
        : customerNavConfig;

  const currentTheme = mounted ? resolvedTheme : "light";

  const toggleTheme = () => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    if (isDemo) {
      await fetch("/api/guest", { method: "DELETE" });
      router.push("/login");
      router.refresh();
    } else {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 w-64 bg-white dark:bg-black border-r border-gray-100 dark:border-zinc-900 h-screen flex flex-col z-50",
        "transform transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      )}
    >
      {/* Close button - mobile only */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg lg:hidden"
        aria-label="Close menu"
      >
        <XIcon />
      </button>

      {/* Logo */}
      <div className="h-16 px-6 border-b border-gray-100 dark:border-zinc-900 flex items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
            <img
              src="/image.png"
              alt="AIxArtisans"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            AIxArtisans
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navConfig.map((item) => {
          // Exact match for dashboard, prefix match for others
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative group",
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium shadow-sm"
                  : "text-gray-600 dark:text-zinc-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400",
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-600 dark:bg-emerald-400 rounded-r-full" />
              )}

              <span
                className={cn(
                  "transition-all duration-300",
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-400 dark:text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
                )}
              >
                {item.icon}
              </span>
              <span className="transition-all duration-300">
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}

        {/* Earnings/Impact Widget */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <div className="px-4 py-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {role === "ARTISAN" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                )}
              </svg>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                {role === "ARTISAN"
                  ? t("sidebar.earnings")
                  : t("sidebar.impact")}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {role === "ARTISAN" ? "₹12,450" : "3"}
                </span>
                <span className="text-xs text-gray-600 dark:text-zinc-300">
                  {role === "ARTISAN" ? "this month" : "projects"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <svg
                  className="w-3 h-3 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  +50%
                </span>
                <span className="text-gray-600 dark:text-zinc-300">
                  vs last month
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 dark:border-zinc-900 space-y-3">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-zinc-900 rounded-xl">
          <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">
            {t("sidebar.theme")}
          </span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 p-1 bg-white dark:bg-zinc-800 rounded-lg shadow-sm"
          >
            <span
              className={cn(
                "p-1.5 rounded-md transition-all",
                currentTheme === "light"
                  ? "bg-emerald-500 text-white"
                  : "text-gray-400 dark:text-zinc-500",
              )}
            >
              <SunIcon />
            </span>
            <span
              className={cn(
                "p-1.5 rounded-md transition-all",
                currentTheme === "dark"
                  ? "bg-emerald-500 text-black"
                  : "text-gray-400 dark:text-zinc-500",
              )}
            >
              <MoonIcon />
            </span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center overflow-hidden ring-2 ring-white dark:ring-zinc-800 shadow-md">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white dark:text-black font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-zinc-200 truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-500 capitalize">
                {role.toLowerCase()}
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}
