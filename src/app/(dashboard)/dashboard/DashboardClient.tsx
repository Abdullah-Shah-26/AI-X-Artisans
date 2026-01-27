"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface DashboardClientProps {
  userName: string;
  userRole: string;
  stats: {
    productCount?: number;
    projectCount?: number;
    messageCount?: number;
    applicationCount?: number;
    collaborationCount?: number;
  } | null;
  isDemo?: boolean;
  originalRole?: string;
}

export function DashboardClient({
  userName,
  userRole,
  stats,
  isDemo,
  originalRole,
}: DashboardClientProps) {
  const { t } = useLanguage();
  const isArtisan = userRole.toUpperCase() === "ARTISAN";
  const isVolunteer = userRole.toUpperCase() === "VOLUNTEER";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full">
            <svg
              className="w-5 h-5 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Demo Mode - Exploring as{" "}
              {userRole.charAt(0) + userRole.slice(1).toLowerCase()}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              You&apos;re previewing with sample data. Sign up to create your
              own!
            </p>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-800 p-8 text-white shadow-xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-black/10 blur-3xl"></div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            {t("dashboard.welcome")}, {userName}!{" "}
            <span className="inline-block"></span>
          </h1>
          <p className="text-lg text-emerald-50 font-medium leading-relaxed opacity-90">
            {isArtisan && t("dashboard.artisanMessage")}
            {isVolunteer && t("dashboard.volunteerMessage")}
            {userRole === "CUSTOMER" && t("dashboard.customerMessage")}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {isArtisan && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title={t("dashboard.productsListed")}
            value={6}
            icon={<PackageIcon className="h-6 w-6" />}
            trend="+12% from last month"
            variant="emerald"
          />
          <StatCard
            title={t("dashboard.activeProjects")}
            value={2}
            icon={<BriefcaseIcon className="h-6 w-6" />}
            trend="+2 active now"
            variant="blue"
          />
          <StatCard
            title={t("dashboard.messages")}
            value={10}
            icon={<MessageCircleIcon className="h-6 w-6" />}
            trend="5 new today"
            variant="purple"
          />
        </div>
      )}

      {isVolunteer && stats && "applicationCount" in stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title={t("dashboard.applicationsSent")}
            value={stats.applicationCount || 0}
            icon={<SendIcon className="h-6 w-6" />}
            variant="emerald"
          />
          <StatCard
            title={t("dashboard.collaborations")}
            value={stats.collaborationCount || 0}
            icon={<UsersIcon className="h-6 w-6" />}
            variant="blue"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <LightningIcon className="w-5 h-5 text-amber-500" />
          {t("dashboard.quickActions")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isArtisan && (
            <>
              <QuickAction
                href="/dashboard/products/new"
                label={t("dashboard.addProduct")}
                description="List a new item for sale"
                icon={<PlusCircleIcon className="w-6 h-6" />}
                color="bg-emerald-500"
              />
              <QuickAction
                href="/dashboard/photo-studio"
                label={t("sidebar.photoStudio")}
                description="AI-powered product photography"
                icon={<CameraIcon className="w-6 h-6" />}
                color="bg-purple-500"
              />
              <QuickAction
                href="/dashboard/volunteers"
                label={t("dashboard.findHelp")}
                description="Connect with skilled volunteers"
                icon={<HandshakeIcon className="w-6 h-6" />}
                color="bg-blue-500"
              />
              <QuickAction
                href="/dashboard/finance-hub"
                label={t("dashboard.startCampaign")}
                description="Fund your next big project"
                icon={<CoinsIcon className="w-6 h-6" />}
                color="bg-amber-500"
              />
            </>
          )}
          {isVolunteer && (
            <>
              <QuickAction
                href="/dashboard/projects"
                label={t("dashboard.browseProjects")}
                description="Find projects to support"
                icon={<SearchIcon className="w-6 h-6" />}
                color="bg-emerald-500"
              />
              <QuickAction
                href="/dashboard/projects"
                label={t("dashboard.myWork")}
                description="Manage your contributions"
                icon={<ClipboardListIcon className="w-6 h-6" />}
                color="bg-blue-500"
              />
              <QuickAction
                href="/dashboard/chat"
                label={t("sidebar.messages")}
                description="Chat with artisans"
                icon={<MessageSquareIcon className="w-6 h-6" />}
                color="bg-purple-500"
              />
              <QuickAction
                href="/dashboard/profile"
                label={t("dashboard.updateProfile")}
                description="Keep your info up to date"
                icon={<UserCircleIcon className="w-6 h-6" />}
                color="bg-zinc-500"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  variant,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  variant: "emerald" | "blue" | "purple";
}) {
  const variants = {
    emerald:
      "from-emerald-500/10 to-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    blue: "from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400",
    purple:
      "from-purple-500/10 to-purple-500/5 border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400",
  };

  const bgStyles = variants[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-linear-to-br p-6 transition-all hover:shadow-lg",
        bgStyles,
        "bg-white dark:bg-zinc-900"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-70 mb-1">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          {trend && (
            <p className="text-xs font-medium mt-2 opacity-80 flex items-center gap-1">
              <TrendingUpIcon className="w-3 h-3" /> {trend}
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-lg bg-white/50 dark:bg-white/10 backdrop-blur-sm shadow-sm",
            bgStyles.split(" ")[2]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  label,
  description,
  icon,
  color,
}: {
  href: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between overflow-hidden rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 shadow-sm transition-all hover:shadow-md hover:border-transparent"
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
          color
        )}
      ></div>

      <div
        className={cn(
          "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg text-white shadow-md transition-transform",
          color
        )}
      >
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {label}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 group-hover:text-gray-600 dark:group-hover:text-zinc-300">
            {description}
          </p>
        )}
      </div>

      <div className="absolute right-4 top-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <ArrowRightIcon className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
}

// Icons
function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function MessageCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CoinsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function ClipboardListIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  );
}

function MessageSquareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
      />
    </svg>
  );
}

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}
