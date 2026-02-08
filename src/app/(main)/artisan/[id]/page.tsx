import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { BackButton } from "./BackButton";

// Demo artisans matching the demo products
const demoArtisans: Record<string, any> = {
  "demo-artisan-1": {
    id: "demo-artisan-1",
    name: "Lakshmi Devi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    artisanProfile: {
      bio: "Master weaver specializing in traditional Banarasi silk sarees with 1 year of experience in handloom weaving.",
      location: "Varanasi, Uttar Pradesh",
      craftTypes: ["Silk Weaving", "Banarasi Sarees", "Handloom Textiles"],
      story:
        "I learned the art of Banarasi weaving from my grandmother who was a master weaver in our family tradition spanning four generations. My work preserves ancient techniques while creating timeless pieces that celebrate India's rich textile heritage.",
      yearsOfExperience: 1,
    },
    products: [
      {
        id: "demo-prod-1",
        name: "Handwoven Silk Saree",
        price: 15000,
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
      },
      {
        id: "demo-prod-kanjivaram",
        name: "Traditional Kanjivaram Silk Saree",
        price: 18500,
        image:
          "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2lsayUyMHNhcmVlfGVufDB8fDB8fHww",
      },
    ],
  },
  "demo-artisan-3": {
    id: "demo-artisan-3",
    name: "Kavita Singh",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    artisanProfile: {
      bio: "Specializing in intricate brass artifacts and home decor.",
      location: "Moradabad, UP",
      craftTypes: ["Brass Work", "Metal Crafts"],
      story:
        "I specialize in creating intricate brass artifacts and home decor items. My work showcases the traditional metalworking techniques of Moradabad, creating beautiful pieces that blend tradition with modern aesthetics.",
      yearsOfExperience: 1,
    },
    products: [],
  },
  "demo-a1": {
    id: "demo-a1",
    name: "Lakshmi Devi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    artisanProfile: {
      bio: "Master silk weaver with 1 year of experience in traditional Banarasi sarees and basket weaving.",
      location: "Varanasi, India",
      craftTypes: [
        "Silk Weaving",
        "Zari Work",
        "Basket Weaving",
        "Natural Fiber Work",
      ],
      story:
        "Born into a family of traditional weavers in Varanasi, I learned the art of silk weaving from my grandmother. I specialize in creating intricate Banarasi sarees using traditional pit looms and authentic zari work techniques passed down through generations. I also create beautiful handwoven baskets using natural fibers.",
      yearsOfExperience: 1,
    },
    products: [
      {
        id: "demo-prod-kanjivaram",
        name: "Traditional Kanjivaram Silk Saree",
        price: 18500,
        image:
          "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2lsayUyMHNhcmVlfGVufDB8fDB8fHww",
      },
    ],
  },
  "demo-a2": {
    id: "demo-a2",
    name: "Ravi Kumar",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    artisanProfile: {
      bio: "Third-generation brass artisan specializing in traditional oil lamps and metalwork.",
      location: "Uttar Pradesh, India",
      craftTypes: ["Brass Work", "Metal Craft"],
      story:
        "My family has been working with brass for three generations. I specialize in creating traditional diyas and decorative brass items using ancient techniques.",
      yearsOfExperience: 15,
    },
    products: [],
  },
};

async function getArtisan(id: string) {
  // Check for demo ID first
  if (id.startsWith("demo-")) {
    return demoArtisans[id] || null;
  }

  return prisma.user.findUnique({
    where: { id, role: "ARTISAN" },
    include: {
      artisanProfile: true,
      products: {
        take: 8,
        orderBy: { dateAdded: "desc" },
      },
    },
  });
}

export default async function ArtisanProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artisan = await getArtisan(id);

  if (!artisan) {
    notFound();
  }

  const isDemo = id.startsWith("demo-");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-emerald-700 dark:text-emerald-400"
            >
              AIxArtisans
            </Link>
            <BackButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden mb-8 border border-gray-200 dark:border-zinc-800">
          <div className="bg-linear-to-r from-emerald-600 to-teal-600 h-32" />
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg overflow-hidden border-4 border-white dark:border-zinc-900">
                {artisan.avatar ? (
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                      {artisan.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {artisan.name}
                </h1>
                {artisan.artisanProfile?.location && (
                  <p className="text-gray-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {artisan.artisanProfile.location}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {artisan.products?.length || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    Products
                  </p>
                </div>
                {artisan.artisanProfile?.yearsOfExperience && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {artisan.artisanProfile.yearsOfExperience}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                      Years Exp.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - About */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bio */}
            {artisan.artisanProfile?.bio && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                  About
                </h2>
                <p className="text-gray-600 dark:text-zinc-400">
                  {artisan.artisanProfile.bio}
                </p>
              </div>
            )}

            {/* Craft Types */}
            {artisan.artisanProfile?.craftTypes &&
              artisan.artisanProfile.craftTypes.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800">
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Specializations
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {artisan.artisanProfile.craftTypes.map((craft: string) => (
                      <span
                        key={craft}
                        className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm"
                      >
                        {craft}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Story */}
            {artisan.artisanProfile?.story && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                  My Story
                </h2>
                <p className="text-gray-600 dark:text-zinc-400 whitespace-pre-line">
                  {artisan.artisanProfile.story}
                </p>
              </div>
            )}

            {/* Contact Button */}
            <button className="w-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black py-3 rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-400 transition font-medium flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Contact Artisan
            </button>
          </div>

          {/* Right Column - Products */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                Products by {artisan.name}
              </h2>

              {artisan.products && artisan.products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {artisan.products.map((product: any) => (
                    <Link
                      key={product.id}
                      href={isDemo ? "#" : `/marketplace/${product.id}`}
                      className="group"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-2">
                        <img
                          src={product.image || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {product.name}
                      </h3>
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatPrice(product.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-zinc-400">
                  <p>No products listed yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
