import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
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

    // Check for expired offers and remove offer pricing
    const updatedItems = await Promise.all(
      cartItems.map(async (item) => {
        if (item.offerId) {
          const offer = await prisma.priceOffer.findUnique({
            where: { id: item.offerId },
          });

          // If offer expired or no longer accepted, remove offer pricing
          if (
            !offer ||
            offer.status !== "ACCEPTED" ||
            (offer.expiresAt && offer.expiresAt < new Date())
          ) {
            await prisma.cartItem.update({
              where: { id: item.id },
              data: { offerPrice: null, offerId: null },
            });
            return { ...item, offerPrice: null, offerId: null };
          }
        }
        return item;
      })
    );

    return NextResponse.json(updatedItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity = 1 } = await request.json();

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if there's an accepted offer for this product
    const acceptedOffer = await prisma.priceOffer.findFirst({
      where: {
        productId,
        customerId: user.id,
        status: "ACCEPTED",
        expiresAt: { gt: new Date() },
      },
    });

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
        // If there's an accepted offer, use it
        ...(acceptedOffer && {
          offerPrice: acceptedOffer.finalPrice,
          offerId: acceptedOffer.id,
        }),
      },
      create: {
        userId: user.id,
        productId,
        quantity,
        // If there's an accepted offer, use it
        ...(acceptedOffer && {
          offerPrice: acceptedOffer.finalPrice,
          offerId: acceptedOffer.id,
        }),
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity } = await request.json();

    if (quantity < 1) {
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      });
      return NextResponse.json({ success: true, deleted: true });
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
      data: { quantity },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, clearAll } = await request.json();

    if (clearAll) {
      await prisma.cartItem.deleteMany({
        where: { userId: user.id },
      });
      return NextResponse.json({ success: true, cleared: true });
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}
