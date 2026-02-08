import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CrowdfundClient from "./CrowdfundClient";

// Demo campaigns for demo mode
const demoCampaigns = [
  {
    id: "demo-campaign-2",
    title: "Traditional Weaving Loom",
    description:
      "Funding for a traditional handloom to preserve ancient weaving techniques and create authentic textiles.",
    goalAmount: 25000,
    currentAmount: 25000,
    endDate: "2026-01-27T00:00:00.000Z", // Fixed date
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    status: "COMPLETED",
  },
];

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  return dbUser;
}

async function getCampaigns(userId: string) {
  const artisan = await prisma.artisanProfile.findUnique({
    where: { userId },
  });

  if (!artisan) return [];

  const campaigns = await prisma.crowdfundCampaign.findMany({
    where: { artisanId: artisan.id },
    orderBy: { createdAt: "desc" },
  });

  return campaigns;
}

export default async function CrowdfundPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";

  const user = await getUser();

  if (!user && !guestMode) redirect("/login");

  // Check for view mode cookie (demo mode)
  const viewMode = cookieStore.get("viewMode")?.value;
  const originalRole = user?.role?.toLowerCase() || "artisan";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // Only artisans (real or demo) can access finance hub
  if (currentRole !== "artisan") redirect("/dashboard");

  // In demo/guest mode, show demo campaigns
  if (isDemo || !user) {
    return <CrowdfundClient campaigns={demoCampaigns} isDemo={true} />;
  }

  const campaigns = await getCampaigns(user.id);

  // Transform for client component
  const campaignsData = campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description || "",
    goalAmount: c.goalAmount,
    currentAmount: c.currentAmount,
    endDate: c.endDate.toISOString(),
    imageUrl: c.image,
    status: c.status,
  }));

  // Add demo campaigns if user has none
  const allCampaigns = campaignsData.length > 0 ? campaignsData : demoCampaigns;

  return <CrowdfundClient campaigns={allCampaigns} />;
}
