import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VideoStudioClient } from "./VideoStudioClient";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return prisma.user.findUnique({
    where: { id: user.id },
  });
}

export default async function VideoStudioPage() {
  // Check for guest mode first
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const user = await getUser();

  // Only redirect to login if not in guest mode
  if (!user && !guestMode) redirect("/login");

  const originalRole = user?.role?.toLowerCase() || "artisan";
  const currentRole = viewMode || originalRole;

  // Only artisans (real or demo) can access video studio
  if (currentRole !== "artisan") redirect("/dashboard");

  return <VideoStudioClient />;
}
