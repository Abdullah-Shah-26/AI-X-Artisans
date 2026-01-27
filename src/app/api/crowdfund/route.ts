import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// GET - Fetch campaigns
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artisanId = searchParams.get("artisanId");
  const status = searchParams.get("status");

  try {
    const where: Record<string, unknown> = {};

    if (artisanId) {
      where.artisanId = artisanId;
    }

    if (status) {
      where.status = status;
    }

    const campaigns = await prisma.crowdfundCampaign.findMany({
      where,
      include: {
        artisan: {
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

// POST - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, goalAmount, endDate, imageUrl } = body;

    // Get artisan profile
    const artisan = await prisma.artisanProfile.findUnique({
      where: { userId: user.id },
    });

    if (!artisan) {
      return NextResponse.json(
        { error: "Artisan profile not found" },
        { status: 404 }
      );
    }

    const campaign = await prisma.crowdfundCampaign.create({
      data: {
        artisanId: artisan.id,
        title,
        description,
        goalAmount: parseFloat(goalAmount),
        currentAmount: 0,
        endDate: new Date(endDate),
        image: imageUrl || null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
