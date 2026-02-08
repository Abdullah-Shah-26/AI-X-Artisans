import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProductsClient } from "./ProductsClient";

// Demo products to show in demo mode or when user has no products
const demoProducts = [
  {
    id: "demo-default-saree",
    name: "Traditional Kanjivaram Silk Saree",
    description:
      "Exquisite handwoven Kanjivaram silk saree with traditional temple border and rich gold zari work.",
    price: 18500,
    category: "Textiles",
    craftTradition: "Banarasi Weaving",
    image: "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2lsayUyMHNhcmVlfGVufDB8fDB8fHww",
    dateAdded: new Date("2024-01-15"),
  },
];

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

async function getProducts(userId: string) {
  return prisma.product.findMany({
    where: { artisanId: userId },
    include: {
      certificate: {
        select: {
          id: true,
          artworkName: true,
        },
      },
    },
    orderBy: { dateAdded: "desc" },
  });
}

export default async function ProductsPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const user = await getUser();

  if (!user && !guestMode) redirect("/login");

  const originalRole = user?.role?.toLowerCase() || "artisan";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // Only artisans (real or demo) can access products page
  if (currentRole !== "artisan") redirect("/dashboard");

  // In demo/guest mode, always show demo products
  if (isDemo || !user) {
    return <ProductsClient products={demoProducts} isDemo={true} />;
  }

  // For real artisans, fetch their products
  const dbProducts = await getProducts(user.id);
  const products = dbProducts.length > 0 ? dbProducts : demoProducts;

  return (
    <ProductsClient products={products} isDemo={dbProducts.length === 0} />
  );
}
