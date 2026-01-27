import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET - Get artisan's certificates
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const certificates = await prisma.certificate.findMany({
      where: { artistId: user.id },
      include: {
        product: {
          select: { id: true, name: true },
        },
      },
      orderBy: { certifiedDate: "desc" },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// POST - Create a new certificate
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { artworkName, craftTradition, heritageStory, image } =
      await request.json();

    // Validate required fields
    if (!artworkName || !craftTradition) {
      return NextResponse.json(
        { error: "Artwork name and craft tradition are required" },
        { status: 400 }
      );
    }

    // Verify user is an artisan
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (dbUser?.role !== "ARTISAN") {
      return NextResponse.json(
        { error: "Only artisans can create certificates" },
        { status: 403 }
      );
    }

    const certificate = await prisma.certificate.create({
      data: {
        artworkName,
        craftTradition,
        heritageStory,
        image,
        artistId: user.id,
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      { error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a certificate (only if not assigned to product)
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { certificateId } = await request.json();

    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { product: true },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (certificate.artistId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check if assigned to product
    if (certificate.product) {
      return NextResponse.json(
        { error: "Cannot delete certificate assigned to a product" },
        { status: 400 }
      );
    }

    await prisma.certificate.delete({
      where: { id: certificateId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      { error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}
