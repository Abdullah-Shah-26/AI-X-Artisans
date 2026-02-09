import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ChatClient } from "./ChatClient";

// Demo conversations for guest/demo mode
const demoConversations = [
  {
    id: "demo-conv-2",
    otherParticipant: {
      id: "demo-user-2",
      name: "Arjun Verma",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    },
    lastMessage: "When can we schedule the collaboration?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "demo-conv-3",
    otherParticipant: {
      id: "demo-user-3",
      name: "Meera Patel",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    },
    lastMessage: "I'd love to help with your marketing!",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

// Customer-specific demo conversations (with Lakshmi Devi about sarees)
const customerDemoConversations = [
  {
    id: "demo-conv-lakshmi",
    otherParticipant: {
      id: "lakshmi-devi",
      name: "Lakshmi Devi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    },
    lastMessage: "I'd love to create a custom design for your saree!",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
];

// Volunteer-specific demo conversations (with Lakshmi Devi about collaboration)
const volunteerDemoConversations = [
  {
    id: "demo-conv-lakshmi-volunteer",
    otherParticipant: {
      id: "lakshmi-devi",
      name: "Lakshmi Devi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    },
    lastMessage: "I saw your application for the collaboration project. Let's discuss!",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
];

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      avatar: true,
      role: true,
    },
  });
}

async function getConversations(userId: string) {
  return prisma.conversation.findMany({
    where: {
      OR: [{ participant1Id: userId }, { participant2Id: userId }],
    },
    include: {
      participant1: {
        select: { id: true, name: true, avatar: true },
      },
      participant2: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { lastMessageAt: "desc" },
  });
}

export default async function ChatPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";
  const viewMode = cookieStore.get("viewMode")?.value;

  const user = await getUser();

  if (!user && !guestMode) redirect("/login");

  const originalRole = user?.role?.toLowerCase() || "artisan";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // In demo/guest mode, show demo conversations
  if (isDemo || !user) {
    // Use role-specific conversations
    const conversationsToShow =
      currentRole === "customer"
        ? customerDemoConversations
        : currentRole === "volunteer"
          ? volunteerDemoConversations
          : demoConversations;

    return (
      <ChatClient
        currentUser={{
          id: "demo-current-user",
          name:
            currentRole === "customer"
              ? "Demo Customer"
              : currentRole === "volunteer"
                ? "Priya Sharma"
                : "Demo User",
          avatar: null,
          role: currentRole.toUpperCase() as any,
        }}
        conversations={conversationsToShow}
        isDemo={true}
      />
    );
  }

  const conversations = await getConversations(user.id);

  // Transform conversations to include otherParticipant
  const transformed = conversations.map((conv) => ({
    id: conv.id,
    otherParticipant:
      conv.participant1Id === user.id ? conv.participant2 : conv.participant1,
    lastMessage: conv.lastMessageText,
    lastMessageAt: conv.lastMessageAt,
  }));

  return <ChatClient currentUser={user} conversations={transformed} />;
}
