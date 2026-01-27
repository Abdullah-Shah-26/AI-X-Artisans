import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST - Add accepted offer to cart at negotiated price
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { offerId } = await request.json();

    // Get the offer
    const offer = await prisma.priceOffer.findUnique({
      where: { id: offerId },
      include: { product: true },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Verify customer owns this offer
    if (offer.customerId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if offer is accepted and not expired
    if (offer.status !== "ACCEPTED") {
      return NextResponse.json(
        { error: "Offer must be accepted to add to cart" },
        { status: 400 }
      );
    }

    if (offer.expiresAt && offer.expiresAt < new Date()) {
      // Mark as expired
      await prisma.priceOffer.update({
        where: { id: offerId },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json({ error: "Offer has expired" }, { status: 400 });
    }

    // Check if product is still available
    if (!offer.product) {
      return NextResponse.json(
        { error: "Product no longer available" },
        { status: 404 }
      );
    }

    // Add to cart with the negotiated price
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: offer.productId,
        },
      },
      update: {
        offerPrice: offer.finalPrice,
        offerId: offer.id,
        quantity: 1, // Negotiated items are typically single quantity
      },
      create: {
        userId: user.id,
        productId: offer.productId,
        quantity: 1,
        offerPrice: offer.finalPrice,
        offerId: offer.id,
      },
      include: {
        product: {
          include: {
            artisan: {
              select: { name: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      cartItem,
      message: "Added to cart at negotiated price",
    });
  } catch (error) {
    console.error("Error adding offer to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}
