"use client";

import { Sidebar } from "./Sidebar";
import { Header, MobileSearchBar } from "./Header";
import { useMobileMenu } from "@/hooks";
import { usePathname } from "next/navigation";

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
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useMobileMenu();
  const pathname = usePathname();

  // Hide search bar on chat and connections pages
  const showSearchBar =
    isCustomer &&
    !pathname?.includes("/chat") &&
    !pathname?.includes("/connections");

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-black">
      {!isCustomer && (
        <Sidebar
          role={user.role}
          userName={user.name}
          userAvatar={user.avatar}
          isDemo={user.isDemo}
          isMobileMenuOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />
      )}

      {/* Mobile overlay backdrop when sidebar is open */}
      {isMobileMenuOpen && !isCustomer && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <div
        className={`${isCustomer ? "ml-0" : "ml-0 lg:ml-64"} flex flex-col h-screen`}
      >
        <Header
          userName={user.name}
          userAvatar={user.avatar}
          userRole={user.role}
          pendingRequestsCount={pendingRequestsCount}
          pendingApplicationsCount={pendingApplicationsCount}
          isDemo={user.isDemo}
          onMenuClick={openMobileMenu}
        />
        {/* Mobile search bar for customers only - hidden on chat/connections pages */}
        {showSearchBar && <MobileSearchBar />}
        <main className="flex-1 p-6 overflow-auto flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
