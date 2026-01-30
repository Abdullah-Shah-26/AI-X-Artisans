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
                icon={<PlusIcon className="w-6 h-6" />}
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
                icon={<UsersIcon className="w-6 h-6" />}
                color="bg-blue-500"
              />
              <QuickAction
                href="/dashboard/finance-hub"
                label={t("dashboard.startCampaign")}
                description="Fund your next big project"
                icon={<DollarSignIcon className="w-6 h-6" />}
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
                icon={<FileTextIcon className="w-6 h-6" />}
                color="bg-blue-500"
              />
              <QuickAction
                href="/dashboard/connections"
                label={t("sidebar.messages")}
                description="Chat with artisans"
                icon={<MessageCircleIcon className="w-6 h-6" />}
                color="bg-purple-500"
              />
              <QuickAction
                href="/dashboard/profile"
                label={t("dashboard.updateProfile")}
                description="Keep your info up to date"
                icon={<UserIcon className="w-6 h-6" />}
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
        "bg-white dark:bg-zinc-900",
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
            bgStyles.split(" ")[2],
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
          color,
        )}
      ></div>

      <div
        className={cn(
          "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg text-white shadow-md transition-transform",
          color,
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
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
      <path
        fillRule="evenodd"
        d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M8.478 1.6a.75.75 0 01.273 1.025 3.72 3.72 0 00-.425 1.122c.058.057.118.114.18.168A4.491 4.491 0 0112 2.25c1.413 0 2.673.651 3.497 1.668.06-.054.12-.11.178-.167a3.717 3.717 0 00-.426-1.126.75.75 0 111.298-.75 5.22 5.22 0 01.671 2.045.75.75 0 01-.187.582c-.241.27-.505.52-.787.749a4.494 4.494 0 01.216 2.1c-.106.792-.753 1.295-1.417 1.403-.182.03-.364.057-.547.081.152.227.273.476.359.741a23.122 23.122 0 003.832-.802 23.241 23.241 0 00-.345-2.634.75.75 0 011.474-.28c.21 1.115.348 2.256.404 3.418a.75.75 0 01-.516.749c-1.527.499-3.119.854-4.76 1.049-.074.38-.22.735-.423 1.05 2.066.209 4.058.672 5.943 1.358a.75.75 0 01.492.75 24.665 24.665 0 01-1.189 6.25.75.75 0 01-1.425-.47 23.14 23.14 0 001.077-5.306c-.5-.169-1.009-.32-1.524-.454.068.234.104.484.104.746 0 1.06-.490 2.002-1.244 2.611-.024.016-.05.031-.078.044l-2.593 1.296a.75.75 0 01-.67-1.342l2.592-1.296a1.72 1.72 0 00.927-1.313c0-.25-.067-.49-.184-.702a.75.75 0 01-.207-.955c.166-.28.318-.577.453-.888a23.07 23.07 0 00-10.565.88c.134.311.286.608.452.888a.75.75 0 01-.207.955 1.72 1.72 0 00-.184.702c0 .588.296 1.111.927 1.313l2.592 1.296a.75.75 0 01-.67 1.342l-2.593-1.296a.179.179 0 01-.078-.044C2.739 15.748 2.25 14.806 2.25 13.746c0-.262.036-.512.104-.746-.515.134-1.024.285-1.524.454a23.14 23.14 0 001.077 5.306.75.75 0 01-1.425.47 24.665 24.665 0 01-1.19-6.25.75.75 0 01.493-.75 24.665 24.665 0 015.943-1.358 2.997 2.997 0 01-.423-1.05 24.665 24.665 0 01-4.76-1.049.75.75 0 01-.516-.749c.056-1.162.194-2.303.404-3.418a.75.75 0 011.474.28 23.241 23.241 0 00-.345 2.634c1.237.37 2.517.641 3.832.802.086-.265.207-.514.359-.741a18.994 18.994 0 01-.547-.081c-.664-.108-1.311-.611-1.417-1.403a4.535 4.535 0 01.217-2.103 6.788 6.788 0 01-.788-.751.75.75 0 01-.187-.583 5.22 5.22 0 01.67-2.04.75.75 0 011.026-.273z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CoinsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
        clipRule="evenodd"
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
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClipboardListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MessageSquareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        clipRule="evenodd"
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

// Simple, clean Lucide-style icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

function DollarSignIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}
