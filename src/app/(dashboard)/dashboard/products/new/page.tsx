import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProductForm } from "./ProductForm";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return prisma.user.findUnique({
    where: { id: user.id },
    include: { artisanProfile: true },
  });
}

export default async function NewProductPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";

  const user = await getUser();

  if (!user && !guestMode) redirect("/login");

  // Check for view mode cookie (demo mode)
  const viewMode = cookieStore.get("viewMode")?.value;
  const originalRole = user?.role?.toLowerCase() || "artisan";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // Only artisans (real or demo) can add products
  if (currentRole !== "artisan") redirect("/dashboard");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      {(isDemo || !user) && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Demo Mode: Products created here won&apos;t be saved.
          </p>
        </div>
      )}
      <ProductForm
        artisanStory={user?.artisanProfile?.story || ""}
        isDemo={isDemo || !user}
      />
    </div>
  );
}
