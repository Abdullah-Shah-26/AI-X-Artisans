import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProductsClient } from "./ProductsClient";

// Demo products to show in demo mode or when user has no products
const demoProducts = [
  {
    id: "demo-1",
    name: "Handwoven Silk Saree",
    description:
      "Traditional Banarasi silk saree with intricate gold zari work and floral motifs. Each piece takes 15-20 days to weave by master artisans.",
    price: 15000,
    category: "Textiles",
    craftTradition: "Banarasi Weaving",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
    dateAdded: new Date("2024-12-01"),
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
  