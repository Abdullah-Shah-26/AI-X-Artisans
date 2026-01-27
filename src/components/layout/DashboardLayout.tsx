"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    avatar?: string | null;
    role: "ARTISAN" | "VOLUNTEER" | "CUSTOMER";
    isDemo?: boolean;
    originalRole?: string;
  };
  pendingRequestsCount?: number;
  pendingApplicationsCount?: number;
}

export function DashboardLayout({
  children,
  user,
  pendingRequestsCount = 0,
  pendingApplicationsCount = 0,
}: DashboardLayoutProps) {
  const isCustomer = user.role === "CUSTOMER";

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-black">
      {!isCustomer && (
        <Sidebar
          role={user.role}
          userName={user.name}
          userAvatar={user.avatar}
          isDemo={user.isDemo}
        />
      )}
      <div
        className={`${isCustomer ? "ml-0" : "ml-64"} flex flex-col h-screen`}
      >
        <Header
          userName={user.name}
          userAvatar={user.avatar}
          userRole={user.role}
          pendingRequestsCount={pendingRequestsCount}
          pendingApplicationsCount={pendingApplicationsCount}
          isDemo={user.isDemo}
        />
        <main className="flex-1 p-6 overflow-auto flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
