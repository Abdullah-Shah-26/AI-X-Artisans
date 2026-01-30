import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArtisansClient } from "./ArtisansClient";

// Demo artisans with profile pics
const demoArtisans = [
  {
    id: "demo-artisan-1",
    name: "Lakshmi Devi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    isDemo: true,
    artisanProfile: {
      location: "Jaipur, Rajasthan",
      craftTypes: ["Pottery", "Ceramics", "Blue Pottery"],
      bio: "Traditional artisan specializing in handcrafted pottery and ceramics with over 15 years of experience.",
    },
  },
  {
    id: "demo-artisan-2",
    name: "Arjun Verma",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    isDemo: true,
    artisanProfile: {
      location: "Varanasi, UP",
      craftTypes: ["Pottery", "Ceramics"],
      bio: "Master potter creating traditional and modern ceramic pieces.",
    },
  },
  {
    id: "demo-artisan-3",
    name: "Kavita Singh",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
    isDemo: true,
    artisanProfile: {
      location: "Moradabad, UP",
      craftTypes: ["Brass Work", "Metal Crafts"],
      bio: "Specializing in intricate brass artifacts and home decor.",
    },
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
    },
  });
}

async function getArtisans(currentUserId: string) {
  return prisma.user.findMany({
    where: {
      role: "ARTISAN",
      id: { not: currentUserId },
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

export default async function ArtisansPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const user = await getUser();

  if (!user && !guestMode) redirect("/login");

  const originalRole = user?.role?.toLowerCase() || "volunteer";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // Only volunteers can access this page
  if (currentRole !== "volunteer") redirect("/dashboard");

  // In demo/guest mode, show only demo data
  if (isDemo || !user) {
    return (
      <ArtisansClient
        artisans={demoArtisans}
        connectionMap={{}}
        isDemo={true}
      />
    );
  }

  const [artisans, sentConnections] = await Promise.all([
    getArtisans(user.id),
    getSentConnections(user.id),
  ]);

  const connectionMap = Object.fromEntries(
    sentConnections.map((c) => [c.receiverId, c.status]),
  );

  // Only show artisans with profile pics, plus demo artisans
  const artisansWithPics = artisans.filter((a) => a.avatar);
  const allArtisans = [...artisansWithPics, ...demoArtisans];

  return (
    <ArtisansClient artisans={allArtisans} connectionMap={connectionMap} />
  );
}
