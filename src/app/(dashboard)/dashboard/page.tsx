import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const currentRole = cookieStore.get("viewMode")?.value || "artisan";

  if (guestMode) {
    const demoNames = {
      artisan: "Lakshmi Devi",
      volunteer: "Priya Sharma",
      customer: "Demo Customer",
    };
    if (currentRole === "customer") redirect("/marketplace");

    const demoStats =
      currentRole === "artisan"
        ? { productCount: 2, projectCount: 5, messageCount: 28 }
        : { applicationCount: 8, collaborationCount: 3 };

    return (
      <DashboardClient
        userName={demoNames[currentRole] || "Demo User"}
        userRole={currentRole.toUpperCase()}
        stats={demoStats}
        isDemo={true}
        originalRole={currentRole}
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisanProfile: true, volunteerProfile: true },
  });

  if (!dbUser || !dbUser.profileComplete) redirect("/profile-setup");

  const userRole = dbUser.role?.toLowerCase() || "artisan";
  if (userRole === "customer") redirect("/marketplace");

  const stats =
    userRole === "artisan"
      ? await Promise.all([
          prisma.product.count({ where: { artisanId: user.id } }),
          prisma.project.count({ where: { postedById: user.id } }),
          prisma.message.count({
            where: {
              conversation: {
                OR: [{ participant1Id: user.id }, { participant2Id: user.id }],
              },
            },
          }),
        ]).then(([productCount, projectCount, messageCount]) => ({
          productCount,
          projectCount,
          messageCount,
        }))
      : await Promise.all([
          prisma.projectApplication.count({ where: { volunteerId: user.id } }),
          prisma.collaboration.count({ where: { volunteerId: user.id } }),
        ]).then(([applicationCount, collaborationCount]) => ({
          applicationCount,
          collaborationCount,
        }));

  return (
    <DashboardClient
      userName={dbUser.name}
      userRole={userRole.toUpperCase()}
      stats={stats}
      isDemo={false}
      originalRole={userRole}
    />
  );
}
