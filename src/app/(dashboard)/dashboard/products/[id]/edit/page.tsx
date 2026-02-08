import { createClient } from "@/lib/supabase/server";
import { EditProductForm } from "./EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if demo mode - allow access without authentication
  const isDemo =
    !user ||
    user.email?.includes("demo") ||
    user.email === "lakshmidevi@gmail.com";

  // Try to fetch product from database
  let product = null;
  let artisanStory = "";

  if (user && !isDemo) {
    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    product = productData;

    // Get artisan story
    const { data: profileData } = await supabase
      .from("profiles")
      .select("bio")
      .eq("id", user.id)
      .single();

    artisanStory = profileData?.bio || "";
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Product
        </h1>
        <p className="text-gray-500 dark:text-zinc-400">
          Update your product details
        </p>
      </div>

      <EditProductForm
        productId={id}
        initialProduct={product}
        artisanStory={artisanStory}
        isDemo={isDemo}
      />
    </div>
  );
}
