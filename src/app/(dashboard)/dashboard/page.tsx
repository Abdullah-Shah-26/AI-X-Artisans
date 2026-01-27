import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      artisanProfile: true,
      volunteerProfile: true,
    },
  });

  return dbUser;
}

async function getArtisanStats(userId: string) {
  const [productCount, projectCount, messageCount] = await Promise.all([
    prisma.product.count({ where: { artisanId: userId } }),
    prisma.project.count({ where: { postedById: userId } }),
    prisma.message.count({
      where: {
        conversation: {
          OR: [{ participant1Id: userId }, { participant2Id: userId }],
        },
      },
    }),
  ]);

  return { productCount, projectCount, messageCount };
}

async function getVolunteerStats(userId: string) {
  const [applicationCount, collaborationCount] = await Promise.all([
    prisma.projectApplication.count({ where: { volunteerId: userId } }),
    prisma.collaboration.count({ where: { volunteerId: userId } }),
  ]);

  return { applicationCount, collaborationCount };
}

export default async function DashboardPage() {
  // Check for guest mode first
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const user = await getUser();

  // Only redirect to login if not in guest mode
  if (!user && !guestMode) {
    redirect("/login");
  }

  // Only check profile completion for real users
  if (user && !user.profileComplete) {
    redirect("/profile-setup");
  }

  const originalRole = user?.role?.toLowerCase() || "artisan";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // Redirect customers to marketplace (only if not in demo mode viewing as artisan/volunteer)
  if (currentRole === "customer") {
    redirect("/marketplace");
  }

  const isArtisan = currentRole === "artisan";
  const isVolunteer = currentRole === "volunteer";

  // Demo profile names based on role
  const demoNames: Record<string, string> = {
    artisan: "Lakshmi Devi",
    volunteer: "Priya Sharma",
  };

  // If in demo/guest mode, show demo stats; otherwise fetch real stats
  const stats =
    isDemo || !user
      ? isArtisan
        ? { productCount: 12, projectCount: 5, messageCount: 28 }
        : { applicationCount: 8, collaborationCount: 3 }
      : isArtisan
      ? await getArtisanStats(user.id)
      : isVolunteer
      ? await getVolunteerStats(user.id)
      : null;

  return (
    <DashboardClient
      userName={
        isDemo || !user ? demoNames[currentRole] || "Demo User" : user.name
      }
      userRole={currentRole.toUpperCase()}
      stats={stats}
      isDemo={isDemo}
      originalRole={originalRole}
    />
  );
}
