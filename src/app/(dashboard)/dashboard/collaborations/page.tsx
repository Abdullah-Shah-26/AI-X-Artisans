import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CollaborationsClient } from "./CollaborationsClient";
import { ArtisanProjectsClient } from "./ArtisanProjectsClient";

// Demo collaborations data
const demoCollaborations = [
  {
    id: "demo-collab-3",
    status: "COMPLETED",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-11-01"),
    rating: 5,
    feedback: "Excellent work! Very professional and timely delivery.",
    project: {
      id: "demo-proj-3",
      title: "Website Content Writing",
      description: "Write product descriptions for 50 handicraft items",
    },
    artisan: {
      id: "demo-artisan-3",
      name: "Meena Sharma",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    certificate: {
      id: "demo-cert-1",
      title: "Content Writing Excellence",
    },
  },
];

async function getCollaborations(userId: string) {
  return prisma.collaboration.findMany({
    where: { volunteerId: userId },
    include: {
      project: {
        select: { id: true, title: true, description: true },
      },
      artisan: {
        select: { id: true, name: true, avatar: true },
      },
      certificate: {
        select: { id: true, title: true },
      },
    },
    orderBy: { startDate: "desc" },
  });
}

async function getApplications(userId: string) {
  return prisma.projectApplication.findMany({
    where: { volunteerId: userId },
    include: {
      project: {
        select: { id: true, title: true, description: true, status: true },
      },
      artisan: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { applicationDate: "desc" },
  });
}

async function getArtisanProjects(userId: string) {
  return prisma.project.findMany({
    where: { postedById: userId },
    orderBy: { createdAt: "desc" },
  });
}

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, role: true },
  });
}

export default async function CollaborationsPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  // Allow access if logged in or in guest mode
  if (!authUser && !guestMode) redirect("/login");

  const user = authUser ? await getUser() : null;
  const originalRole = user?.role?.toLowerCase() || "volunteer";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // Artisan view - show their projects
  if (currentRole === "artisan") {
    if (isDemo || !user) {
      return <ArtisanProjectsClient projects={[]} isDemo={true} />;
    }

    const projects = await getArtisanProjects(user.id);
    return <ArtisanProjectsClient projects={projects} isDemo={false} />;
  }

  // Volunteer view - show collaborations
  const isVolunteerDemo = isDemo || viewMode === "volunteer";

  if (isVolunteerDemo) {
    return (
      <CollaborationsClient
        collaborations={demoCollaborations}
        applications={[
          {
            id: "demo-app-1",
            status: "PENDING",
            applicationDate: new Date(),
            project: {
              id: "demo-proj-4",
              title: "Video Editing for Craft Stories",
              description: "Edit short videos showcasing artisan stories",
              status: "OPEN",
            },
            artisan: {
              id: "demo-artisan-4",
              name: "Priya Singh",
              avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
            },
          },
        ]}
        isDemo={true}
      />
    );
  }

  const [collaborations, applications] = await Promise.all([
    getCollaborations(authUser!.id),
    getApplications(authUser!.id),
  ]);

  return (
    <CollaborationsClient
      collaborations={collaborations}
      applications={applications}
    />
  );
}
