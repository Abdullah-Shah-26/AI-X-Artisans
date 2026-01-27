import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CartClient } from "./CartClient";
import { cookies } from "next/headers";

async function getCartItems(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          artisan: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
    },
  });
}

// Mock items for guest mode
const GUEST_CART_ITEMS = [
  {
    id: "guest-item-1",
    quantity: 1,
    product: {
      id: "prod-1",
      name: "Handwoven Silk Scarf",
      price: 2500,
      image:
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800",
      artisan: {
        id: "art-1",
        name: "Lakshmi Devi",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
      },
    },
  },
];

export default async function CartPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !(guestMode && viewMode === "customer")) {
    redirect("/login");
  }

  let cartItems = [];
  if (user) {
    cartItems = await getCartItems(user.id);
  } else if (guestMode) {
    cartItems = GUEST_CART_ITEMS as any;
  }

  return <CartClient initialItems={cartItems} isGuest={!user && guestMode} />;
}
