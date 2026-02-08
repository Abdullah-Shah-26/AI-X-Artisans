import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CertificatesClient } from "./CertificatesClient";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.user.findUnique({ where: { id: user.id } });
}

async function getCertificates(userId: string, role: string) {
  // For volunteers - get certificates they received
  // For artisans - get certificates they issued
  if (role === "VOLUNTEER") {
    return prisma.volunteerCertificate.findMany({
      where: { volunteerId: userId },
      include: {
        collaboration: {
          include: {
            project: true,
          },
        },
        artisan: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { issuedAt: "desc" },
    });
  } else {
    return prisma.volunteerCertificate.findMany({
      where: { artisanId: userId },
      include: {
        collaboration: {
          include: {
            project: true,
          },
        },
        volunteer: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { issuedAt: "desc" },
    });
  }
}

// Demo certificates for display
const demoCertificates = [
  {
    id: "demo-cert-1",
    title: "E-commerce Website Development - Completion Certificate",
    description:
      "Successfully completed the project E-commerce Website Development",
    issuedAt: new Date("2026-01-07T00:00:00.000Z"), // Date object
    isDemo: true,
    collaboration: {
      id: "demo-collab-1",
      rating: 5,
      project: {
        id: "demo-proj-1",
        title: "E-commerce Website Development",
        skillsNeeded: ["Web Development", "React", "Next.js", "E-commerce"],
      },
    },
    artisan: {
      id: "demo-artisan-1",
      name: "Lakshmi Devi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    },
  },
];

export default async function CertificatesPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";

  const user = await getUser();

  if (!user && !guestMode) redirect("/login");

  // Check for view mode cookie (demo mode)
  const viewMode = cookieStore.get("viewMode")?.value;
  const originalRole = user?.role?.toLowerCase() || "volunteer";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // In demo/guest mode as volunteer, show demo certificates
  if ((isDemo || !user) && currentRole === "volunteer") {
    return (
      <CertificatesClient
        certificates={demoCertificates}
        userRole="VOLUNTEER"
        userName="Priya Sharma"
        isDemo={true}
      />
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let certificates: any[] = [];

  if (user) {
    try {
      const dbCerts = await getCertificates(user.id, user.role);
      certificates = dbCerts.map((c) => ({
        ...c,
        isDemo: false,
      }));
    } catch {
      // Certificate model not available yet
      console.log("Certificate model not available");
    }

    // Add demo certificates for volunteers
    if (user.role === "VOLUNTEER") {
      certificates = [...certificates, ...demoCertificates];
    }
  }

  return (
    <CertificatesClient
      certificates={certificates}
      userRole={user?.role || "VOLUNTEER"}
      userName={user?.name || "Priya Sharma"}
      isDemo={isDemo}
    />
  );
}
