import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VolunteerHubClient } from "./VolunteerHubClient";

// Demo volunteers - marked with isDemo so client won't make real API calls
const demoVolunteers = [
  {
    id: "demo-v1",
    name: "Priya Sharma",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    isDemo: true,
    volunteerProfile: {
      skills: ["Social Media Marketing", "Photography", "Content Writing"],
      bio: "Digital marketing specialist passionate about promoting traditional crafts.",
      projectsCompleted: 12,
    },
  },
  {
    id: "demo-v2",
    name: "Arjun Patel",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    isDemo: true,
    volunteerProfile: {
      skills: ["Web Development", "UI/UX Design", "SEO"],
      bio: "Full-stack developer helping artisans build their online presence.",
      projectsCompleted: 8,
    },
  },
  {
    id: "demo-v3",
    name: "Meera Krishnan",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    isDemo: true,
    volunteerProfile: {
      skills: [
        "Business Strategy",
        "Financial Planning",
        "Export Documentation",
      ],
      bio: "MBA graduate helping artisans scale their businesses internationally.",
      projectsCompleted: 15,
    },
  },
];

// Demo projects
const demoProjects = [
  {
    id: "demo-p1",
    title: "Website Development for Online Store",
    description:
      "Need help building a professional e-commerce website to sell my handwoven textiles globally.",
    skillsNeeded: ["Web Development", "E-commerce", "Payment Integration"],
    status: "OPEN",
    applications: [],
  },
  {
    id: "demo-p2",
    title: "Social Media Marketing Campaign",
    description:
      "Looking for someone to help create and manage social media presence for my pottery business.",
    skillsNeeded: ["Social Media", "Content Creation", "Photography"],
    status: "IN_PROGRESS",
    applications: [],
  },
];

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.user.findUnique({ where: { id: user.id } });
}

async function getArtisanProjects(userId: string) {
  return prisma.project.findMany({
    where: { postedById: userId },
    include: {
      applications: {
        include: { volunteer: { include: { volunteerProfile: true } } },
      },
      collaborations: { include: { volunteer: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getAvailableVolunteers(currentUserId: string) {
  return prisma.user.findMany({
    where: {
      role: "VOLUNTEER",
      id: { not: currentUserId }, // Don't show yourself
    },
    include: {
      volunteerProfile: true,
      collaborationsAsVolunteer: {
        include: {
          project: true,
          artisan: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { startDate: "desc" },
      },
    },
    take: 20,
  });
}

async function getSentConnections(userId: string) {
  return prisma.connectionRequest.findMany({
    where: { senderId: userId },
    select: { receiverId: true, status: true },
  });
}

export default async function VolunteersPage() {
  // Check for guest mode first
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const user = await getUser();

  // Only redirect to login if not in guest mode
  if (!user && !guestMode) redirect("/login");

  const originalRole = user?.role?.toLowerCase() || "artisan";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // Only artisans (real or demo) can access volunteers page
  if (currentRole !== "artisan") redirect("/dashboard");

  // In demo/guest mode, show only demo data
  if (isDemo || !user) {
    return (
      <VolunteerHubClient
        projects={demoProjects}
        volunteers={demoVolunteers}
        connectionMap={{}}
        isDemo={true}
      />
    );
  }

  const [dbProjects, dbVolunteers, sentConnections] = await Promise.all([
    getArtisanProjects(user.id),
    getAvailableVolunteers(user.id),
    getSentConnections(user.id),
  ]);

  // Merge real data with demo data - real volunteers first, then demo
  const realVolunteersWithFlag = dbVolunteers.map((v) => ({
    ...v,
    isDemo: false,
  }));
  const volunteers = [...realVolunteersWithFlag, ...demoVolunteers];

  // Merge projects - real first, then demo
  const projects = [...dbProjects, ...demoProjects];

  // Convert to object for client component
  const connectionMap = Object.fromEntries(
    sentConnections.map((c) => [c.receiverId, c.status])
  );

  return (
    <VolunteerHubClient
      projects={projects}
      volunteers={volunteers}
      connectionMap={connectionMap}
    />
  );
}
