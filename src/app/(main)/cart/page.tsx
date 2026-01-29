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

// Mock items for guest mode - empty by default
const GUEST_CART_ITEMS: any[] = [];

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
