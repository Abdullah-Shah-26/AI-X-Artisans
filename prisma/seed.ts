import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "Handwoven Silk Saree",
    description:
      "Traditional Banarasi silk saree with intricate gold zari work and floral motifs. Each piece takes 15-20 days to weave by master artisans.",
    price: 15000,
    category: "Textiles",
    craftTradition: "Banarasi Weaving",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
  },
  {
    name: "Ceramic Decorative Plate",
    description:
      "Hand-painted ceramic plate with traditional floral patterns and vibrant colors.",
    price: 2500,
    category: "Pottery",
    craftTradition: "Ceramic Art",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
  },
  {
    name: "Pashmina Shawl",
    description:
      "Luxurious hand-embroidered Kashmiri Pashmina shawl with traditional paisley design.",
    price: 18000,
    category: "Textiles",
    craftTradition: "Kashmiri Embroidery",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800",
  },
  {
    name: "Traditional Wall Art",
    description:
      "Hand-painted canvas depicting traditional folk art motifs with natural pigments.",
    price: 4500,
    category: "Paintings",
    craftTradition: "Folk Art",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800",
  },
  {
    name: "Handcrafted Wooden Bowl",
    description:
      "Beautifully carved wooden bowl with natural finish, perfect for serving or display.",
    price: 1800,
    category: "Home Decor",
    craftTradition: "Wood Carving",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
  },
  {
    name: "Silver Filigree Earrings",
    description:
      "Delicate silver filigree earrings featuring intricate floral patterns.",
    price: 2200,
    category: "Jewelry",
    craftTradition: "Silver Filigree",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
  },
  {
    name: "Embroidered Cotton Kurta",
    description:
      "Elegant white cotton kurta with delicate hand embroidery work.",
    price: 2800,
    category: "Textiles",
    craftTradition: "Hand Embroidery",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
  },
];

const sampleArtisans = [
  {
    name: "Ramesh Kumar",
    email: "ramesh@example.com",
    bio: "Third-generation Banarasi weaver.",
    location: "Varanasi, UP",
  },
  {
    name: "Lakshmi Devi",
    email: "lakshmi@example.com",
    bio: "Master artisan in Jaipur Blue Pottery.",
    location: "Jaipur, Rajasthan",
  },
  {
    name: "Mohan Das",
    email: "mohan@example.com",
    bio: "Tribal artist preserving Dhokra tradition.",
    location: "Bastar, Chhattisgarh",
  },
  {
    name: "Fatima Begum",
    email: "fatima@example.com",
    bio: "Award-winning Kashmiri embroidery artist.",
    location: "Srinagar, Kashmir",
  },
  {
    name: "Sita Devi",
    email: "sita@example.com",
    bio: "Madhubani artist carrying family tradition.",
    location: "Madhubani, Bihar",
  },
  {
    name: "Gopal Pal",
    email: "gopal@example.com",
    bio: "Traditional Bankura terracotta craftsman.",
    location: "Bankura, West Bengal",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  const createdArtisans = [];
  for (const artisan of sampleArtisans) {
    const user = await prisma.user.upsert({
      where: { email: artisan.email },
      update: {},
      create: {
        email: artisan.email,
        name: artisan.name,
        role: "ARTISAN",
        artisanProfile: {
          create: {
            bio: artisan.bio,
            location: artisan.location,
          },
        },
      },
    });
    createdArtisans.push(user);
    console.log(`✅ Created artisan: ${artisan.name}`);
  }

  for (let i = 0; i < sampleProducts.length; i++) {
    const product = sampleProducts[i];
    const artisan = createdArtisans[i % createdArtisans.length];

    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        craftTradition: product.craftTradition,
        image: product.image,
        artisanId: artisan.id,
      },
    });
    console.log(`✅ Created product: ${product.name}`);
  }

  console.log("\n Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
