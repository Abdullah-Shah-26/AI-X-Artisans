import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CustomerProfileClient } from "./CustomerProfileClient";
import { cookies } from "next/headers";

async function getUser() {
  const cookieStore = await cookies();
  const isGuest = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  if (isGuest && viewMode === "customer") {
    return {
      id: "guest-user",
      name: "Guest Customer",
      email: "guest@example.com",
      avatar: null,
      role: "CUSTOMER",
      createdAt: new Date(),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
  });
}

async function getOrdersCount(userId: string) {
  // For now return demo count - implement when orders table exists
  return 3;
}

async function getFavoritesCount(userId: string) {
  if (userId === "guest-user") return 5;
  return prisma.favorite.count({
    where: { userId },
  });
}

export default async function CustomerProfilePage() {
  const user = await getUser();
  if (!user) redirect("/login");

  // If not a customer, redirect to dashboard profile
  if (user.role.toUpperCase() !== "CUSTOMER") {
    redirect("/dashboard/profile");
  }

  const [ordersCount, favoritesCount] = await Promise.all([
    getOrdersCount(user.id),
    getFavoritesCount(user.id),
  ]);

  return (
    <CustomerProfileClient
      user={user}
      ordersCount={ordersCount}
      favoritesCount={favoritesCount}
    />
  );
}
