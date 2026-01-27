import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ChatClient } from "./ChatClient";

// Demo conversations for demo mode
const demoConversations = [
  {
    id: "demo-conv-1",
    otherParticipant: {
      id: "demo-user-1",
      name: "Ravi Kumar",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    },
    lastMessage:
      "Thank you for connecting! I'd love to collaborate on the website project.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "demo-conv-2",
    otherParticipant: {
      id: "demo-user-2",
      name: "Priya Sharma",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
    lastMessage:
      "I can help with the social media marketing. When can we discuss?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "demo-conv-3",
    otherParticipant: {
      id: "demo-user-3",
      name: "Lakshmi Devi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    },
    lastMessage: "The product photos look amazing! Thank you so much.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "demo-conv-4",
    otherParticipant: {
      id: "demo-artisan-ramesh",
      name: "Ramesh Joshi",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    },
    lastMessage: "I love this style! Can you make something similar?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
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
      messages: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
    },
    orderBy: { lastMessageAt: "desc" },
  });
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string }>;
}) {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";

  const user = await getUser();

  if (!user && !guestMode) redirect("/login");

  // Check for view mode cookie (demo mode)
  const viewMode = cookieStore.get("viewMode")?.value;
  const originalRole = user?.role?.toLowerCase() || "artisan";
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  const { conversation: selectedConversationId } = await searchParams;

  // In demo/guest mode, show demo conversations
  if (isDemo || !user) {
    return (
      <ChatClient
        userId="demo-user"
        userName="Demo User"
        conversations={demoConversations}
        initialConversationId={selectedConversationId}
        isDemo={true}
      />
    );
  }

  const conversations = await getConversations(user.id);

  // Transform conversations to include the "other" participant
  const transformedConversations = conversations.map((conv) => {
    const otherParticipant =
      conv.participant1Id === user.id ? conv.participant2 : conv.participant1;

    return {
      id: conv.id,
      otherParticipant,
      lastMessage: conv.lastMessageText,
      lastMessageAt: conv.lastMessageAt,
    };
  });

  // Add demo conversations if user has none
  const allConversations =
    transformedConversations.length > 0
      ? transformedConversations
      : demoConversations;

  return (
    <ChatClient
      userId={user.id}
      userName={user.name}
      conversations={allConversations}
      initialConversationId={selectedConversationId}
    />
  );
}
