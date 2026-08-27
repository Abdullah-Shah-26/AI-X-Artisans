import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { MarketplaceClient } from "./MarketplaceClient";

async function getProducts(category?: string, search?: string) {
  return prisma.product.findMany({
    where: {
      ...(category && category !== "All" && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { craftTradition: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      artisan: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { dateAdded: "desc" },
  });
}

async function getCategories() {
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
    });
    const dbCategories = products.map((p) => p.category);

    // Merge with demo categories
    const demoCategories = [...new Set(demoProducts.map((p) => p.category))];
    const allCategories = [...new Set([...dbCategories, ...demoCategories])];

    return ["All", ...allCategories.sort()];
  } catch (error) {
    console.log("Database not available, using demo categories");
    // Return demo categories only
    const demoCategories = [...new Set(demoProducts.map((p) => p.category))];
    return ["All", ...demoCategories.sort()];
  }
}

async function getUserData(userId: string) {
  const [favorites, cartItems, profile] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      select: { productId: true },
    }),
    prisma.cartItem.findMany({
      where: { userId },
      select: { productId: true, quantity: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, avatar: true, role: true },
    }),
  ]);
  return {
    favoriteIds: favorites.map((f) => f.productId),
    cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    profile: profile || null,
  };
}

// Demo products for display
const demoProducts = [
  {
    id: "demo-1",
    name: "Handwoven Basket",
    description:
      "Vibrant handwoven basket with traditional geometric patterns made from natural fibers",
    price: 3500,
    image:
      "https://handmadecrafts.simdif.com/images/public/sd_64735c47e5d9c.jpg?no_cache=1685289084",
    category: "Home Decor",
    craftTradition: "Basket Weaving",
    artisan: {
      id: "demo-a3",
      name: "Meena Sharma",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    hasCertificate: true,
    isDemo: true,
  },
  {
    id: "demo-2",
    name: "Brass Oil Lamp",
    description: "Traditional handcrafted brass diya with intricate engravings",
    price: 850,
    image:
      "https://m.media-amazon.com/images/S/aplus-media/sc/600659ea-53c6-4da5-86d4-9ba14feea523.__CR0,210,1007,1007_PT0_SX300_V1___.jpg",
    category: "Metal Craft",
    craftTradition: "Brass Work",
    artisan: {
      id: "demo-a2",
      name: "Ravi Kumar",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    isDemo: true,
  },
  {
    id: "demo-3",
    name: "Ceramic Tea Set",
    description: "Hand-painted ceramic tea set with traditional patterns",
    price: 3200,
    image:
      "https://siggyhandmade.com/cdn/shop/products/CeramicTeaSet.jpg?v=1663196891",
    category: "Pottery",
    craftTradition: "Ceramic Art",
    artisan: {
      id: "demo-a1",
      name: "Lakshmi Devi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    },
    hasCertificate: true,
    isDemo: true,
  },
  {
    id: "demo-4",
    name: "Wooden Jewelry Box",
    description: "Intricately carved wooden box with brass inlay work",
    price: 2800,
    image:
      "https://i.etsystatic.com/37334871/r/il/7919ab/4350255523/il_570xN.4350255523_gv3a.jpg",
    category: "Woodwork",
    craftTradition: "Wood Carving",
    artisan: {
      id: "demo-a4",
      name: "Priya Singh",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
    isDemo: true,
  },
  {
    id: "demo-5",
    name: "Terracotta Planter",
    description: "Handmade terracotta planter with traditional motifs",
    price: 850,
    image:
      "https://m.media-amazon.com/images/I/71VhZ0bxLLL._AC_UF350,350_QL80_.jpg",
    category: "Pottery",
    craftTradition: "Terracotta",
    artisan: {
      id: "demo-a5",
      name: "Anjali Patel",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    },
    isDemo: true,
  },
  {
    id: "demo-6",
    name: "Bamboo Basket Set",
    description: "Set of handwoven bamboo baskets with natural finish",
    price: 2800,
    image:
      "https://www.nicobar.com/cdn/shop/products/1518630607A46A7142_ea3907a7-1284-4616-973b-3aecb49cf199.jpg?v=1710310859",
    category: "Home Decor",
    craftTradition: "Bamboo Craft",
    artisan: {
      id: "demo-a6",
      name: "Gopal Das",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
    hasCertificate: true,
    isDemo: true,
  },
  {
    id: "demo-7",
    name: "Handcrafted Clay Pot",
    description:
      "Traditional clay pot with hand-painted ethnic designs and natural finish",
    price: 650,
    image:
      "https://i.pinimg.com/736x/9f/1c/1e/9f1c1ed6528a3f362bacddc7cb181545.jpg",
    category: "Pottery",
    craftTradition: "Clay Pottery",
    artisan: {
      id: "demo-a7",
      name: "Kavita Reddy",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100",
    },
    isDemo: true,
  },
  {
    id: "demo-8",
    name: "Handwoven Cotton Rug",
    description: "Colorful handwoven cotton dhurrie with geometric patterns",
    price: 4500,
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=500",
    category: "Textiles",
    craftTradition: "Weaving",
    artisan: {
      id: "demo-a8",
      name: "Suresh Yadav",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
    },
    isDemo: true,
  },
  {
    id: "demo-9",
    name: "Handwoven Silk Saree",
    description:
      "Exquisite handwoven silk saree with traditional zari work and intricate patterns",
    price: 15000,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
    category: "Textiles",
    craftTradition: "Silk Weaving",
    artisan: {
      id: "demo-a1",
      name: "Lakshmi Devi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    },
    hasCertificate: true,
    isDemo: true,
  },
  {
    id: "demo-10",
    name: "Block Printed Table Runner",
    description: "Hand block printed cotton table runner with natural dyes",
    price: 980,
    image:
      "https://www.shopinnerchild.com/cdn/shop/files/ICstudio_-5.jpg?v=1749500538&width=2686",
    category: "Textiles",
    craftTradition: "Block Printing",
    artisan: {
      id: "demo-a9",
      name: "Ramesh Joshi",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    },
    isDemo: true,
  },
];

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;

  let dbProducts: any[] = [];
  let categories = ["All"];
  let user = null;
  let userData = {
    favoriteIds: [] as string[],
    cartCount: 0,
    profile: null as {
      name: string;
      avatar: string | null;
      role: string;
    } | null,
  };

  // Try to get data from database, but don't fail if it's not available
  try {
    [dbProducts, categories] = await Promise.all([
      getProducts(params.category, params.search),
      getCategories(),
    ]);
  } catch (error) {
    console.log("Database not available, using demo mode");
  }

  // Try to get user from Supabase, but don't fail if it's not available
  try {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;

    if (user) {
      userData = await getUserData(user.id);
    }
  } catch (error) {
    console.log("Auth not available, using guest mode");
  }

  // Check for guest mode cookie
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  // Filter out products with broken/mismatched images from old seed data
  const excludedProducts = [
    "wooden carved box",
    "brass dhokra elephant",
    "silver jhumka earrings",
    "wooden elephant sculpture",
    "warli art frame",
    "chikankari kurta",
    "kalamkari wall hanging",
    "bidri vase",
    "terracotta horse",
    "madhubani painting",
    "blue pottery vase",
    "handwoven silk saree", // Exclude database saree, use demo only
    "pashmina shawl", // Exclude database pashmina
    "embroidered cotton kurta", // Exclude database kurta
    "silver filigree earrings",
  ];
  const filteredDbProducts = dbProducts.filter(
    (p) => !excludedProducts.includes(p.name.toLowerCase()),
  );

  // Merge real products with demo products (filter out duplicates by name)
  const dbProductNames = new Set(
    filteredDbProducts.map((p) => p.name.toLowerCase()),
  );
  const filteredDemoProducts = demoProducts.filter(
    (demo) => !dbProductNames.has(demo.name.toLowerCase()),
  );
  const allProducts = [
    ...filteredDbProducts.map((p) => ({ ...p, isDemo: false })),
    ...filteredDemoProducts,
  ];

  const originalRole = (userData.profile?.role || "customer").toLowerCase();
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // Guest user data
  const guestUserData = {
    id: "guest-user",
    name: "Guest User",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    role: currentRole,
    originalRole: "customer",
    isDemo: true,
    isGuest: true,
  };

  return (
    <MarketplaceClient
      products={allProducts}
      categories={categories}
      initialCategory={params.category || "All"}
      initialSearch={params.search || ""}
      user={
        guestMode
          ? guestUserData
          : user
            ? {
                id: user.id,
                name: userData.profile?.name || "",
                avatar: userData.profile?.avatar || null,
                role: currentRole,
                originalRole,
                isDemo,
              }
            : null
      }
      favoriteIds={userData.favoriteIds}
      cartCount={userData.cartCount}
      isGuestMode={guestMode}
    />
  );
}
