import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ProjectsClient } from "./ProjectsClient";

// Demo artisans with profile pics
const demoArtisans = [
  {
    id: "demo-artisan-1",
    name: "Ravi Kumar",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    isDemo: true,
    artisanProfile: {
      location: "Varanasi, UP",
      craftTypes: ["Pottery", "Ceramics"],
      bio: "Master potter creating traditional and modern ceramic pieces.",
    },
  },
  {
    id: "demo-artisan-2",
    name: "Meena Sharma",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    isDemo: true,
    artisanProfile: {
      location: "Moradabad, UP",
      craftTypes: ["Brass Work", "Metal Crafts"],
      bio: "Specializing in intricate brass artifacts and home decor.",
    },
  },
];

// Demo projects for volunteers to see
const demoProjects = [
  {
    id: "demo-proj-1",
    title: "E-commerce Website Development",
    description:
      "Need help building a modern e-commerce website to sell my handwoven textiles globally. Looking for someone with React/Next.js experience.",
    skillsNeeded: ["Web Development", "E-commerce", "React"],
    status: "OPEN",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    isDemo: true,
    postedBy: {
      id: "demo-artisan-1",
      name: "Lakshmi Devi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
      artisanProfile: { location: "Jaipur, Rajasthan" },
    },
    applications: [],
  },
  {
    id: "demo-proj-3",
    title: "Product Photography Session",
    description:
      "Need professional photos of my brass artifacts for marketplace listings. Looking for someone with photography skills and basic editing.",
    skillsNeeded: ["Photography", "Photo Editing", "Lighting"],
    status: "OPEN",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    isDemo: true,
    postedBy: {
      id: "demo-artisan-3",
      name: "Meena Sharma",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
      artisanProfile: { location: "Moradabad, UP" },
    },
    applications: [],
  },
];

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.user.findUnique({
    where: { id: user.id },
    include: {
      volunteerProfile: true,
      artisanProfile: true,
    },
  });
}

async function getProjects() {
  return prisma.project.findMany({
    where: { status: "OPEN" },
    include: {
      postedBy: {
        select: {
          id: true,
          name: true,
          avatar: true,
          artisanProfile: {
            select: {
              location: true,
            },
          },
        },
      },
      applications: {
        select: {
          id: true,
          volunteerId: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getMyApplications(userId: string) {
  return prisma.projectApplication.findMany({
    where: { volunteerId: userId },
    include: {
      project: {
        include: {
          postedBy: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
    orderBy: { applicationDate: "desc" },
  });
}

async function getMyCollaborations(userId: string) {
  return prisma.collaboration.findMany({
    where: { volunteerId: userId },
    include: {
      project: {
        include: {
          postedBy: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      artisan: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { startDate: "desc" },
  });
}

async function getArtisans(currentUserId: string) {
  return prisma.user.findMany({
    where: {
      role: "ARTISAN",
      id: { not: currentUserId }, // Don't show yourself
    },
    include: {
      artisanProfile: {
        select: {
          location: true,
          craftTypes: true,
          bio: true,
        },
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

// Demo applications for demo mode
const demoApplications: any[] = [];

// Demo collaborations for demo mode
const demoCollaborations = [
  {
    id: "demo-collab-2",
    status: "COMPLETED",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    rating: 5,
    feedback:
      "Excellent work! The website looks amazing and has helped increase my online sales significantly.",
    project: {
      id: "demo-proj-completed",
      title: "E-commerce Website Development",
      description: "Built a modern e-commerce website for handwoven textiles.",
      postedBy: {
        id: "demo-artisan-1",
        name: "Lakshmi Devi",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
      },
    },
    artisan: {
      id: "demo-artisan-1",
      name: "Lakshmi Devi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    },
  },
];

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const user = await getUser();

  if (!user && !guestMode) redirect("/login");

  const originalRole = user?.role?.toLowerCase() || "volunteer";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // Only volunteers (real or demo) can access projects page
  if (currentRole !== "volunteer") redirect("/dashboard");

  // In demo/guest mode, show only demo data
  if (isDemo || !user) {
    const demoUser = {
      id: "demo-volunteer",
      name: "Priya Sharma",
      email: "priyasharma@gmail.com",
      role: "VOLUNTEER" as const,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      profileComplete: true,
      createdAt: new Date(),
      volunteerProfile: null,
      artisanProfile: null,
    };
    return (
      <ProjectsClient
        user={demoUser}
        projects={demoProjects}
        applications={demoApplications}
        collaborations={demoCollaborations}
        artisans={demoArtisans}
        connectionMap={{}}
        isDemo={true}
      />
    );
  }

  const [projects, applications, collaborations, artisans, sentConnections] =
    await Promise.all([
      getProjects(),
      getMyApplications(user.id),
      getMyCollaborations(user.id),
      getArtisans(user.id),
      getSentConnections(user.id),
    ]);

  const connectionMap = Object.fromEntries(
    sentConnections.map((c) => [c.receiverId, c.status]),
  );

  // Merge real projects with demo projects
  const allProjects = [...projects, ...demoProjects];

  // Only show artisans with profile pics, plus demo artisans
  const artisansWithPics = artisans.filter((a) => a.avatar);
  const allArtisans = [...artisansWithPics, ...demoArtisans];

  return (
    <ProjectsClient
      user={user}
      projects={allProjects}
      applications={applications}
      collaborations={collaborations}
      artisans={allArtisans}
      connectionMap={connectionMap}
    />
  );
}
