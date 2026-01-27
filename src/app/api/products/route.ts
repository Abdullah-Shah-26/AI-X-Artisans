import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const artisanId = searchParams.get("artisanId");

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(category && { category }),
        ...(artisanId && { artisanId }),
      },
      include: {
        artisan: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        certificate: true,
      },
      orderBy: { dateAdded: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      description,
      longDescription,
      price,
      image,
      category,
      craftTradition,
      storyVideoUrl,
      createCertificate,
    } = body;

    // Validate price is not negative
    if (price < 0) {
      return NextResponse.json(
        { error: "Price cannot be negative" },
        { status: 400 },
      );
    }

    let certificateId = null;

    // Create certificate if requested
    if (createCertificate && craftTradition) {
      // Generate heritage story using AI
      let heritageStory = null;
      try {
        const storyResponse = await fetch(
          `${request.url.replace("/api/products", "/api/ai/generate-heritage-story")}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productName: name,
              craftTradition,
              description: longDescription || description,
            }),
          },
        );
        if (storyResponse.ok) {
          const storyData = await storyResponse.json();
          heritageStory = storyData.story;
        }
      } catch (error) {
        console.error("Error generating heritage story:", error);
      }

      // Create the certificate
      const certificate = await prisma.certificate.create({
        data: {
          artworkName: name,
          craftTradition,
          heritageStory,
          image,
          artistId: user.id,
        },
      });
      certificateId = certificate.id;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        longDescription,
        price: Math.max(0, price),
        image,
        category,
        craftTradition,
        storyVideoUrl,
        artisanId: user.id,
        certificateId,
      },
      include: {
        artisan: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        certificate: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
