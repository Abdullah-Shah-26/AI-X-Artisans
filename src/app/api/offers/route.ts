import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET - Get user's offers
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    // Check for expired accepted offers and mark them
    await prisma.priceOffer.updateMany({
      where: {
        status: "ACCEPTED",
        expiresAt: { lt: new Date() },
      },
      data: { status: "EXPIRED" },
    });

    // If customer, get their offers. If artisan, get offers on their products
    const offers =
      dbUser?.role === "ARTISAN"
        ? await prisma.priceOffer.findMany({
            where: { artisanId: user.id },
            include: {
              product: {
                select: { id: true, name: true, image: true, price: true },
              },
              customer: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: "desc" },
          })
        : await prisma.priceOffer.findMany({
            where: { customerId: user.id },
            include: {
              product: {
                select: { id: true, name: true, image: true, price: true },
              },
              artisan: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: "desc" },
          });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

// POST - Create a new offer (customer)
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, offerAmount, artisanId } = await request.json();

    // Validate offer amount
    if (offerAmount <= 0) {
      return NextResponse.json(
        { error: "Offer amount must be positive" },
        { status: 400 }
      );
    }

    // Get product to validate
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if offer is reasonable (at least 30% of original price)
    if (offerAmount < product.price * 0.3) {
      return NextResponse.json(
        {
          error:
            "Offer too low. Please offer at least 30% of the listed price.",
        },
        { status: 400 }
      );
    }

    const offer = await prisma.priceOffer.upsert({
      where: { productId_customerId: { productId, customerId: user.id } },
      update: {
        offerAmount,
        status: "PENDING",
        counterAmount: null,
        expiresAt: null,
        finalPrice: null,
      },
      create: {
        productId,
        customerId: user.id,
        artisanId,
        offerAmount,
      },
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}

// PATCH - Respond to offer (artisan) or accept counter (customer)
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { offerId, action, counterAmount } = await request.json();

    const offer = await prisma.priceOffer.findUnique({
      where: { id: offerId },
      include: { product: true },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Check authorization
    const isArtisan = offer.artisanId === user.id;
    const isCustomer = offer.customerId === user.id;

    if (!isArtisan && !isCustomer) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    let updateData: any = {};

    // Artisan actions
    if (isArtisan && offer.status === "PENDING") {
      if (action === "accept") {
        // Accept customer's offer - set 48 hour expiry
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
        updateData = {
          status: "ACCEPTED",
          finalPrice: offer.offerAmount,
          expiresAt,
        };
      } else if (action === "reject") {
        updateData = { status: "REJECTED" };
      } else if (action === "counter" && counterAmount) {
        // Validate counter amount
        if (counterAmount <= 0) {
          return NextResponse.json(
            { error: "Counter amount must be positive" },
            { status: 400 }
          );
        }
        if (counterAmount < offer.product.price * 0.5) {
          return NextResponse.json(
            { error: "Counter offer too low" },
            { status: 400 }
          );
        }
        updateData = {
          status: "COUNTERED",
          counterAmount,
        };
      }
    }

    // Customer actions - accepting counter offer
    if (
      isCustomer &&
      offer.status === "COUNTERED" &&
      action === "acceptCounter"
    ) {
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
      updateData = {
        status: "ACCEPTED",
        finalPrice: offer.counterAmount,
        expiresAt,
      };
    }

    // Customer rejecting counter offer
    if (
      isCustomer &&
      offer.status === "COUNTERED" &&
      action === "rejectCounter"
    ) {
      updateData = { status: "REJECTED" };
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Invalid action for current offer status" },
        { status: 400 }
      );
    }

    const updated = await prisma.priceOffer.update({
      where: { id: offerId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error responding to offer:", error);
    return NextResponse.json(
      { error: "Failed to respond to offer" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel offer (customer only, before artisan responds)
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { offerId } = await request.json();

    const offer = await prisma.priceOffer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Only customer can cancel, and only if pending
    if (offer.customerId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    if (offer.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only cancel pending offers" },
        { status: 400 }
      );
    }

    await prisma.priceOffer.delete({
      where: { id: offerId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error canceling offer:", error);
    return NextResponse.json(
      { error: "Failed to cancel offer" },
      { status: 500 }
    );
  }
}
