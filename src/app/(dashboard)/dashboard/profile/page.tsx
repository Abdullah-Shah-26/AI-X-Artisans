import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileClient } from "./ProfileClient";

// Demo artisan profile
const demoArtisanProfile = {
  id: "demo-artisan",
  name: "Lakshmi Devi",
  email: "demo@artisan.com",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
  role: "ARTISAN" as const,
  profileComplete: true,
  createdAt: new Date(),
  artisanProfile: {
    id: "demo-artisan-profile",
    userId: "demo-artisan",
    bio: "Traditional artisan specializing in handcrafted pottery and ceramics with over 15 years of experience.",
    location: "Jaipur, Rajasthan",
    craftTypes: ["Pottery", "Ceramics", "Blue Pottery"],
    story:
      "I learned this craft from my grandmother who was a master potter in our village.",
    yearsOfExperience: 15,
  },
  volunteerProfile: null,
  products: [
    {
      id: "demo-prod-1",
      name: "Blue Pottery Vase",
      price: 2800,
      image:
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400",
    },
    {
      id: "demo-prod-2",
      name: "Ceramic Bowl Set",
      price: 1500,
      image:
        "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400",
    },
  ],
};

// Demo volunteer profile
const demoVolunteerProfile = {
  id: "demo-volunteer",
  name: "Demo Volunteer",
  email: "demo@volunteer.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  role: "VOLUNTEER" as const,
  profileComplete: true,
  createdAt: new Date(),
  artisanProfile: null,
  volunteerProfile: {
    id: "demo-volunteer-profile",
    userId: "demo-volunteer",
    bio: "Digital marketing specialist passionate about promoting traditional crafts and helping artisans grow their businesses.",
    skills: [
      "Social Media Marketing",
      "Photography",
      "Content Writing",
      "Web Development",
    ],
    projectsCompleted: 12,
  },
  products: [],
};

// Demo customer profile
const demoCustomerProfile = {
  id: "demo-customer",
  name: "Demo Customer",
  email: "customer@demo.com",
  avatar: null,
  role: "CUSTOMER" as const,
  profileComplete: true,
  createdAt: new Date(),
  artisanProfile: null,
  volunteerProfile: null,
  customerProfile: {
    id: "demo-cust-profile",
    userId: "demo-customer",
    address: "123 Demo Street",
    city: "Mumbai",
    pincode: "400001",
    phone: "+91 98765 43210",
  },
  products: [],
};

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.user.findUnique({
    where: { id: user.id },
    include: {
      artisanProfile: true,
      volunteerProfile: true,
      products: {
        take: 6,
        orderBy: { dateAdded: "desc" },
      },
    },
  });
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";

  const user = await getUser();

  if (!user && !guestMode) redirect("/login");

  // Check for view mode cookie (demo mode)
  const viewMode = cookieStore.get("viewMode")?.value;
  const originalRole = user?.role?.toLowerCase() || "artisan";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // In demo/guest mode, show demo profile based on current role
  if (isDemo || !user) {
    let demoProfile;
    if (currentRole === "artisan") {
      demoProfile = demoArtisanProfile;
    } else if (currentRole === "volunteer") {
      demoProfile = demoVolunteerProfile;
    } else {
      demoProfile = demoCustomerProfile;
    }
    return <ProfileClient user={demoProfile} isDemo={true} />;
  }

  return <ProfileClient user={user} />;
}
