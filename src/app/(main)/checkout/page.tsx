import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckoutClient } from "./CheckoutClient";
import { cookies } from "next/headers";

async function getCartItems(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          artisan: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });
}

async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });
}

// Mock items for demo mode
const DEMO_CART_ITEMS = [
  {
    id: "demo-item-1",
    quantity: 1,
    product: {
      id: "prod-1",
      name: "Handwoven Silk Scarf",
      price: 2500,
      image:
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800",
      artisan: { id: "art-1", name: "Lakshmi Devi" },
    },
  },
];

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow demo mode customers to checkout
  const isDemo = !user && guestMode && viewMode === "customer";

  if (!user && !isDemo) {
    redirect("/login");
  }

  let cartItems: string | any[];
  let profile;

  if (user) {
    [cartItems, profile] = await Promise.all([
      getCartItems(user.id),
      getUserProfile(user.id),
    ]);

    if (cartItems.length === 0) {
      redirect("/cart");
    }
  } else {
    // Demo mode - CheckoutClient will load from localStorage
    cartItems = [];
    profile = { name: "Guest User", email: "guest@example.com" };
  }

  return (
    <CheckoutClient items={cartItems as any} user={profile} isDemo={isDemo} />
  );
}
