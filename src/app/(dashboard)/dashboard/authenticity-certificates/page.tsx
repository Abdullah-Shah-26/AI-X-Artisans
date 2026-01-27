import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AuthCertificatesClient } from "./AuthCertificatesClient";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, role: true },
  });

  return dbUser;
}

async function getCertificates(userId: string) {
  const certificates = await prisma.certificate.findMany({
    where: { artistId: userId },
    include: {
      product: {
        select: { id: true, name: true },
      },
    },
    orderBy: { certifiedDate: "desc" },
  });

  return certificates;
}

export default async function AuthCertificatesPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const user = await getUser();

  // Allow demo mode
  if (!user && !guestMode) redirect("/login");

  // Demo mode
  if (guestMode || !user) {
    const currentRole = viewMode || "artisan";
    if (currentRole !== "artisan") redirect("/dashboard");

    return (
      <AuthCertificatesClient
        certificates={[]}
        userName="Lakshmi Devi"
        isDemo={true}
      />
    );
  }

  // Only artisans can access this page
  if (user.role !== "ARTISAN") redirect("/dashboard");

  const certificates = await getCertificates(user.id);

  return (
    <AuthCertificatesClient certificates={certificates} userName={user.name} />
  );
}
