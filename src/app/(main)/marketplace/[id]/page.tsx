import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import { cookies } from "next/headers";

// Demo products matching marketplace
const demoProducts = [
  {
    id: "demo-1",
    name: "Handwoven Basket",
    description:
      "Vibrant handwoven basket with traditional geometric patterns made from natural fibers. Each piece is carefully crafted by skilled artisans using time-honored techniques passed down through generations.",
    longDescription: null,
    price: 3500,
    image:
      "https://handmadecrafts.simdif.com/images/public/sd_64735c47e5d9c.jpg?no_cache=1685289084",
    category: "Home Decor",
    craftTradition: "Basket Weaving",
    stock: 5,
    dateAdded: new Date(),
    artisan: {
      id: "demo-a1",
      name: "Lakshmi Devi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
      artisanProfile: {
        bio: "Master basket weaver with 20 years of experience in traditional craft",
        craftSpecialty: "Basket Weaving",
      },
      _count: { products: 8 },
    },
    certificate: {
      id: "cert-demo-1",
      productId: "demo-1",
      heritageStory:
        "This handwoven basket represents centuries of traditional craftsmanship, using natural fibers and geometric patterns unique to our region.",
      certificationDate: new Date(),
      qrCode: "demo-qr-1",
    },
  },
  {
    id: "demo-2",
    name: "Brass Oil Lamp",
    description:
      "Traditional handcrafted brass diya with intricate engravings. Perfect for festivals and daily worship, made using ancient metalworking techniques.",
    longDescription: null,
    price: 850,
    image:
      "https://m.media-amazon.com/images/S/aplus-media/sc/600659ea-53c6-4da5-86d4-9ba14feea523.__CR0,210,1007,1007_PT0_SX300_V1___.jpg",
    category: "Metal Craft",
    craftTradition: "Brass Work",
    stock: 12,
    dateAdded: new Date(),
    artisan: {
      id: "demo-a2",
      name: "Ravi Kumar",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      artisanProfile: {
        bio: "Third-generation brass artisan specializing in traditional oil lamps",
        craftSpecialty: "Brass Work",
      },
      _count: { products: 15 },
    },
    certificate: null,
  },
  {
    id: "demo-3",
    name: "Ceramic Tea Set",
    description:
      "Hand-painted ceramic tea set with traditional patterns. Includes teapot and 4 cups, each piece individually crafted and painted.",
    longDescription: null,
    price: 3200,
    image:
      "https://siggyhandmade.com/cdn/shop/products/CeramicTeaSet.jpg?v=1663196891",
    category: "Pottery",
    craftTradition: "Ceramic Art",
    stock: 6,
    dateAdded: new Date(),
    artisan: {
      id: "demo-a3",
      name: "Meena Sharma",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      artisanProfile: {
        bio: "Ceramic artist known for intricate hand-painted designs",
        craftSpecialty: "Ceramic Art",
      },
      _count: { products: 10 },
    },
    certificate: null,
  },
  {
    id: "demo-4",
    name: "Wooden Jewelry Box",
    description:
      "Intricately carved wooden box with brass inlay work. Features multiple compartments and a velvet-lined interior.",
    longDescription: null,
    price: 2800,
    image:
      "https://i.etsystatic.com/37334871/r/il/7919ab/4350255523/il_570xN.4350255523_gv3a.jpg",
    category: "Woodwork",
    craftTradition: "Wood Carving",
    stock: 8,
    dateAdded: new Date(),
    artisan: {
      id: "demo-a4",
      name: "Priya Singh",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      artisanProfile: {
        bio: "Expert wood carver specializing in decorative boxes and furniture",
        craftSpecialty: "Wood Carving",
      },
      _count: { products: 12 },
    },
    certificate: null,
  },
  {
    id: "demo-5",
    name: "Terracotta Planter",
    description:
      "Handmade terracotta planter with traditional motifs. Perfect for indoor and outdoor plants, naturally porous for healthy root growth.",
    longDescription: null,
    price: 850,
    image:
      "https://m.media-amazon.com/images/I/71VhZ0bxLLL._AC_UF350,350_QL80_.jpg",
    category: "Pottery",
    craftTradition: "Terracotta",
    stock: 20,
    dateAdded: new Date(),
    artisan: {
      id: "demo-a5",
      name: "Anjali Patel",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      artisanProfile: {
        bio: "Terracotta specialist creating functional and decorative pottery",
        craftSpecialty: "Terracotta",
      },
      _count: { products: 18 },
    },
    certificate: null,
  },
  {
    id: "demo-6",
    name: "Bamboo Basket Set",
    description:
      "Set of handwoven bamboo baskets with natural finish. Includes 3 sizes, perfect for storage and organization.",
    longDescription: null,
    price: 2800,
    image:
      "https://www.nicobar.com/cdn/shop/products/1518630607A46A7142_ea3907a7-1284-4616-973b-3aecb49cf199.jpg?v=1710310859",
    category: "Home Decor",
    craftTradition: "Bamboo Craft",
    stock: 10,
    dateAdded: new Date(),
    artisan: {
      id: "demo-a6",
      name: "Gopal Das",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      artisanProfile: {
        bio: "Bamboo craftsman creating sustainable and eco-friendly products",
        craftSpecialty: "Bamboo Craft",
      },
      _count: { products: 14 },
    },
    certificate: null,
  },
  {
    id: "demo-7",
    name: "Handcrafted Clay Pot",
    description:
      "Traditional clay pot with hand-painted ethnic designs and natural finish. Perfect for cooking and serving traditional dishes.",
    longDescription: null,
    price: 650,
    image:
      "https://i.pinimg.com/736x/9f/1c/1e/9f1c1ed6528a3f362bacddc7cb181545.jpg",
    category: "Pottery",
    craftTradition: "Clay Pottery",
    stock: 15,
    dateAdded: new Date(),
    artisan: {
      id: "demo-a7",
      name: "Kavita Reddy",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100",
      artisanProfile: {
        bio: "Traditional potter specializing in functional clay cookware",
        craftSpecialty: "Clay Pottery",
      },
      _count: { products: 11 },
    },
    certificate: null,
  },
  {
    id: "demo-8",
    name: "Handwoven Cotton Rug",
    description:
      "Colorful handwoven cotton dhurrie with geometric patterns. Reversible design, perfect for living rooms and bedrooms.",
    longDescription: null,
    price: 4500,
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=500",
    category: "Textiles",
    craftTradition: "Weaving",
    stock: 7,
    dateAdded: new Date(),
    artisan: {
      id: "demo-a8",
      name: "Suresh Yadav",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
      artisanProfile: {
        bio: "Master weaver creating traditional dhurries and rugs",
        craftSpecialty: "Weaving",
      },
      _count: { products: 9 },
    },
    certificate: null,
  },
  {
    id: "demo-9",
    name: "Handwoven Silk Saree",
    description:
      "Exquisite handwoven silk saree with traditional zari work and intricate patterns. Perfect for weddings and special occasions.",
    longDescription:
      "This exquisite handwoven silk saree is a masterpiece of traditional Indian craftsmanship. Woven on traditional pit looms by skilled artisans, each thread tells a story of heritage spanning generations. The rich burgundy silk base is adorned with intricate golden zari work featuring classic paisley and floral motifs. The pallu showcases elaborate traditional designs that shimmer beautifully in natural light. This saree represents hours of meticulous handwork, making it perfect for weddings, festivals, and special occasions. The pure silk fabric drapes elegantly and feels luxurious against the skin, embodying the timeless beauty of Indian textile art.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
    category: "Textiles",
    craftTradition: "Silk Weaving",
    stock: 3,
    dateAdded: new Date(),
    artisan: {
      id: "demo-a9",
      name: "Ramesh Joshi",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      artisanProfile: {
        location: "Varanasi, India",
        bio: "Master silk weaver with 25 years of experience in traditional Banarasi sarees",
        story:
          "Born into a family of traditional weavers in Varanasi, Ramesh learned the art of silk weaving from his grandfather. He specializes in creating intricate Banarasi sarees using traditional pit looms and authentic zari work techniques passed down through generations.",
        craftSpecialty: "Silk Weaving",
        craftTypes: ["Silk Weaving", "Zari Work"],
        yearsOfExperience: 25,
      },
      _count: { products: 16 },
    },
    certificate: null,
  },
  {
    id: "demo-10",
    name: "Block Printed Table Runner",
    description:
      "Hand block printed cotton table runner with natural dyes. Features traditional motifs and eco-friendly printing techniques.",
    longDescription: null,
    price: 980,
    image:
      "https://www.shopinnerchild.com/cdn/shop/files/ICstudio_-5.jpg?v=1749500538&width=2686",
    category: "Textiles",
    craftTradition: "Block Printing",
    stock: 12,
    dateAdded: new Date(),
    artisan: {
      id: "demo-a10",
      name: "Ramesh Joshi",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      artisanProfile: {
        bio: "Block printing expert using traditional wooden blocks and natural dyes",
        craftSpecialty: "Block Printing",
      },
      _count: { products: 13 },
    },
    certificate: null,
  },
];

async function getProduct(id: string) {
  // Check if it's a demo product
  if (id.startsWith("demo-")) {
    return demoProducts.find((p) => p.id === id) || null;
  }

  return prisma.product.findUnique({
    where: { id },
    include: {
      artisan: {
        include: {
          artisanProfile: true,
          _count: { select: { products: true } },
        },
      },
      certificate: true,
    },
  });
}

async function getRelatedProducts(category: string, excludeId: string) {
  // Get demo products of same category
  const demoCategoryProducts = demoProducts
    .filter((p) => p.category === category && p.id !== excludeId)
    .slice(0, 4);

  // If we have enough demo products, return them
  if (demoCategoryProducts.length >= 4) {
    return demoCategoryProducts;
  }

  // Excluded products list (same as marketplace)
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

  // Get from database
  const dbProducts = await prisma.product.findMany({
    where: {
      category,
      id: { not: excludeId },
    },
    include: { artisan: { select: { name: true, avatar: true } } },
    take: 10, // Get more than needed to account for filtering
  });

  // Filter out excluded products after fetching
  const filteredDbProducts = dbProducts
    .filter((p) => !excludedProducts.includes(p.name.toLowerCase()))
    .slice(0, 4 - demoCategoryProducts.length);

  return [...demoCategoryProducts, ...filteredDbProducts];
}

async function getUserOffer(productId: string, userId: string) {
  return prisma.priceOffer.findUnique({
    where: { productId_customerId: { productId, customerId: userId } },
  });
}

async function checkFavorite(productId: string, userId: string) {
  const fav = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  return !!fav;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(
    product.category,
    product.id,
  );

  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userOffer = null;
  let isFavorite = false;
  let userRole = null;
  let userId = user?.id;

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    userRole = dbUser?.role?.toLowerCase() || null;
  } else if (guestMode || viewMode === "customer") {
    // Guest/Demo mode handling
    userId = "guest-user";
    userRole = viewMode || "customer";
  }

  // Only fetch data if we have a valid user and it's not the guest user (unless we want to support mock data later)
  if (userId && userId !== "guest-user") {
    [userOffer, isFavorite] = await Promise.all([
      getUserOffer(product.id, userId),
      checkFavorite(product.id, userId),
    ]);
  }

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      user={userId ? { id: userId, role: userRole } : null}
      userOffer={userOffer}
      isFavorite={isFavorite}
    />
  );
}
