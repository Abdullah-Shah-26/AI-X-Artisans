import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NegotiationsClient } from "./NegotiationsClient";

async function getOffers(userId: string) {
  return prisma.priceOffer.findMany({
    where: { artisanId: userId },
    include: {
      product: {
        select: { id: true, name: true, image: true, price: true },
      },
      customer: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function NegotiationsPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let offers = [];
  if (user && !guestMode) {
    offers = await getOffers(user.id);
  } else if (guestMode || (user && guestMode)) {
    // Demo offers for Lakshmi Devi
    offers = [
      {
        id: "demo-offer-1",
        offerAmount: 12500,
        status: "PENDING",
        createdAt: new Date(),
        product: {
          id: "demo-9",
          name: "Kanjivaram Silk Saree",
          image: "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2lsayUyMHNhcmVlfGVufDB8fDB8fHww",
          price: 15000,
        },
        customer: {
          id: "demo-c1",
          name: "Aditi Rao",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
        },
      }
    ];
  }

  return <NegotiationsClient initialOffers={offers as any} isDemo={guestMode} />;
}
