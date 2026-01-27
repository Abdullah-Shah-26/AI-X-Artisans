import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
    },
  });
}

async function getPendingRequestsCount(userId: string) {
  return prisma.connectionRequest.count({
    where: {
      receiverId: userId,
      status: "PENDING",
    },
  });
}

async function getPendingApplicationsCount(userId: string) {
  return prisma.projectApplication.count({
    where: {
      artisanId: userId,
      status: "PENDING",
    },
  });
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const user = await getUser();

  // If no user and not in guest mode, redirect to login
  if (!user && !guestMode) redirect("/login");

  // Determine current role and demo status
  const originalRole = user?.role?.toLowerCase() || "artisan";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // If viewing as customer, redirect to marketplace
  // if (currentRole === "customer") {
  //   redirect("/marketplace");
  // }

  const [pendingRequestsCount, pendingApplicationsCount] = await Promise.all([
    isDemo || !user ? 3 : getPendingRequestsCount(user.id),
    isDemo || !user
      ? 2
      : currentRole === "artisan"
      ? getPendingApplicationsCount(user.id)
      : 0,
  ]);

  // Total notifications = connection requests + project applications (for artisans)
  const totalNotifications = pendingRequestsCount + pendingApplicationsCount;

  // Demo profile names based on role
  const demoNames: Record<string, string> = {
    artisan: "Lakshmi Devi",
    volunteer: "Priya Sharma",
  };
  const demoAvatars: Record<string, string> = {
    artisan: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    volunteer:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  };

  return (
    <DashboardLayout
      user={{
        name: isDemo
          ? demoNames[currentRole] || "Demo User"
          : user?.name || "User",
        avatar: isDemo
          ? demoAvatars[currentRole] || null
          : user?.avatar || null,
        role: currentRole.toUpperCase() as "ARTISAN" | "VOLUNTEER" | "CUSTOMER",
        isDemo,
        originalRole,
      }}
      pendingRequestsCount={totalNotifications}
      pendingApplicationsCount={pendingApplicationsCount}
    >
      {children}
    </DashboardLayout>
  );
}
