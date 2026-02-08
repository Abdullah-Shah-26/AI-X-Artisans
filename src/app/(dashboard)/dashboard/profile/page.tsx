import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileClient } from "./ProfileClient";

// Demo artisan profile
const demoArtisanProfile = {
  id: "demo-artisan",
  name: "Lakshmi Devi",
  email: "lakshmidevi@gmail.com",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
  role: "ARTISAN" as const,
  profileComplete: true,
  createdAt: new Date(),
  artisanProfile: {
    id: "demo-artisan-profile",
    userId: "demo-artisan",
    bio: "Master weaver specializing in traditional Banarasi silk sarees with 1 year of experience in handloom weaving.",
    location: "Varanasi, Uttar Pradesh",
    craftTypes: ["Silk Weaving", "Banarasi Sarees", "Handloom Textiles"],
    story:
      "I learned the art of Banarasi weaving from my grandmother who was a master weaver in our family tradition spanning four generations.",
    yearsOfExperience: 1,
  },
  volunteerProfile: null,
  products: [
    {
      id: "demo-prod-1",
      name: "Handwoven Silk Saree",
      price: 15000,
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
    },
    {
      id: "demo-prod-kanjivaram",
      name: "Traditional Kanjivaram Silk Saree",
      price: 18500,
      image:
        "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2lsayUyMHNhcmVlfGVufDB8fDB8fHww",
    },
  ],
};

// Demo volunteer profile
const demoVolunteerProfile = {
  id: "demo-volunteer",
  name: "Priya Sharma",
  email: "priyasharma@gmail.com",
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

  // Redirect customers to their dedicated profile page
  if (!isDemo && user && user.role.toUpperCase() === "CUSTOMER") {
    redirect("/profile");
  }

  // In demo/guest mode, show demo profile based on current role
  if (isDemo || !user) {
    let demoProfile;
    if (currentRole === "artisan") {
      demoProfile = demoArtisanProfile;
    } else if (currentRole === "volunteer") {
      demoProfile = demoVolunteerProfile;
    } else {
      // Customer in demo mode should also redirect
      redirect("/profile");
    }
    return <ProfileClient user={demoProfile} isDemo={true} />;
  }

  return <ProfileClient user={user} />;
}
