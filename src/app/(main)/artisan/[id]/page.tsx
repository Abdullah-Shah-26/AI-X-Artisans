import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

// Demo artisans matching the demo products
const demoArtisans: Record<string, any> = {
  "demo-a1": {
    id: "demo-a1",
    name: "Lakshmi Devi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    artisanProfile: {
      bio: "Master silk weaver with 25 years of experience in traditional Banarasi sarees and basket weaving.",
      location: "Varanasi, India",
      craftTypes: [
        "Silk Weaving",
        "Zari Work",
        "Basket Weaving",
        "Natural Fiber Work",
      ],
      story:
        "Born into a family of traditional weavers in Varanasi, I learned the art of silk weaving from my grandmother. I specialize in creating intricate Banarasi sarees using traditional pit looms and authentic zari work techniques passed down through generations. I also create beautiful handwoven baskets using natural fibers.",
      yearsOfExperience: 25,
    },
    products: [],
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
  "demo-a3": {
    id: "demo-a3",
    name: "Meena Sharma",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    artisanProfile: {
      bio: "Ceramic artist known for intricate hand-painted designs and traditional pottery techniques.",
      location: "Rajasthan, India",
      craftTypes: ["Ceramic Art", "Pottery"],
      story:
        "I create beautiful ceramic pieces using traditional pottery techniques. Each piece is hand-painted with intricate designs inspired by our rich cultural heritage.",
      yearsOfExperience: 12,
    },
    products: [],
  },
  "demo-a4": {
    id: "demo-a4",
    name: "Priya Singh",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    artisanProfile: {
      bio: "Expert wood carver specializing in decorative boxes and furniture with brass inlay work.",
      location: "Karnataka, India",
      craftTypes: ["Wood Carving", "Brass Inlay"],
      story:
        "I specialize in creating intricate wooden jewelry boxes and decorative items. My work combines traditional wood carving with beautiful brass inlay patterns.",
      yearsOfExperience: 18,
    },
    products: [],
  },
  "demo-a5": {
    id: "demo-a5",
    name: "Anjali Patel",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    artisanProfile: {
      bio: "Terracotta specialist creating functional and decorative pottery using traditional methods.",
      location: "Gujarat, India",
      craftTypes: ["Terracotta", "Clay Work"],
      story:
        "I work with terracotta clay to create both functional and decorative pieces. My planters and pottery items are made using traditional techniques that have been in my family for generations.",
      yearsOfExperience: 14,
    },
    products: [],
  },
  "demo-a6": {
    id: "demo-a6",
    name: "Gopal Das",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    artisanProfile: {
      bio: "Bamboo craftsman creating sustainable and eco-friendly products using traditional techniques.",
      location: "Assam, India",
      craftTypes: ["Bamboo Craft", "Eco-friendly Products"],
      story:
        "I create beautiful and functional bamboo products that are both sustainable and artistic. My work promotes eco-friendly living while preserving traditional bamboo crafting techniques.",
      yearsOfExperience: 16,
    },
    products: [],
  },
  "demo-a7": {
    id: "demo-a7",
    name: "Kavita Reddy",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    artisanProfile: {
      bio: "Traditional potter specializing in functional clay cookware and decorative items.",
      location: "Telangana, India",
      craftTypes: ["Clay Pottery", "Traditional Cookware"],
      story:
        "I create traditional clay pots and cookware that are both beautiful and functional. My work preserves ancient pottery techniques while creating items for modern kitchens.",
      yearsOfExperience: 22,
    },
    products: [],
  },
  "demo-a8": {
    id: "demo-a8",
    name: "Suresh Yadav",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    artisanProfile: {
      bio: "Master weaver creating traditional dhurries and rugs using handloom techniques.",
      location: "Rajasthan, India",
      craftTypes: ["Weaving", "Handloom"],
      story:
        "I am a master weaver specializing in traditional dhurries and cotton rugs. Each piece is woven on traditional handlooms using techniques passed down through generations.",
      yearsOfExperience: 25,
    },
    products: [],
  },
  "demo-a9": {
    id: "demo-a9",
    name: "Ramesh Joshi",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    artisanProfile: {
      bio: "Master silk weaver with 25 years of experience in traditional Banarasi sarees and silk textiles.",
      location: "Varanasi, India",
      craftTypes: ["Silk Weaving", "Zari Work", "Banarasi Sarees"],
      story:
        "Born into a family of traditional weavers in Varanasi, I learned the art of silk weaving from my grandfather. I specialize in creating intricate Banarasi sarees using traditional pit looms and authentic zari work techniques passed down through generations. Each saree I create is a masterpiece that takes weeks to complete.",
      yearsOfExperience: 25,
    },
    products: [],
  },
  "demo-a10": {
    id: "demo-a10",
    name: "Ramesh Joshi",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    artisanProfile: {
      bio: "Block printing expert using traditional wooden blocks and natural dyes for textile art.",
      location: "Rajasthan, India",
      craftTypes: ["Block Printing", "Natural Dyes", "Textile Art"],
      story:
        "I am an expert in traditional block printing techniques using hand-carved wooden blocks and natural dyes. My work preserves the ancient art of block printing while creating beautiful textile pieces for modern homes.",
      yearsOfExperience: 20,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-emerald-700">
              AIxArtisans
            </Link>
            <Link
              href="/marketplace"
              className="text-gray-600 hover:text-emerald-600"
            >
              ← Back to Marketplace
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Demo Banner */}
        {isDemo && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-emerald-800">Demo Profile</p>
              <p className="text-sm text-emerald-600">
                This is a sample artisan profile for demonstration.
              </p>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="bg-linear-to-r from-emerald-600 to-teal-600 h-32" />
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-2xl bg-white shadow-lg overflow-hidden border-4 border-white">
                {artisan.avatar ? (
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-emerald-700">
                      {artisan.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {artisan.name}
                </h1>
                {artisan.artisanProfile?.location && (
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
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
                  <p className="text-2xl font-bold text-gray-900">
                    {artisan.products?.length || 0}
                  </p>
                  <p className="text-sm text-gray-500">Products</p>
                </div>
                {artisan.artisanProfile?.yearsOfExperience && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {artisan.artisanProfile.yearsOfExperience}
                    </p>
                    <p className="text-sm text-gray-500">Years Exp.</p>
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
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600">{artisan.artisanProfile.bio}</p>
              </div>
            )}

            {/* Craft Types */}
            {artisan.artisanProfile?.craftTypes &&
              artisan.artisanProfile.craftTypes.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-semibold text-gray-900 mb-3">
                    Specializations
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {artisan.artisanProfile.craftTypes.map((craft: string) => (
                      <span
                        key={craft}
                        className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                      >
                        {craft}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Story */}
            {artisan.artisanProfile?.story && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-3">My Story</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {artisan.artisanProfile.story}
                </p>
              </div>
            )}

            {/* Contact Button */}
            <button className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2">
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
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">
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
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                        <img
                          src={product.image || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition">
                        {product.name}
                      </h3>
                      <p className="text-emerald-600 font-semibold">
                        {formatPrice(product.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
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
