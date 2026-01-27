import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ConnectionsClient } from "./ConnectionsClient";

// Demo connection requests
const demoRequests = [
  {
    id: "demo-req-1",
    status: "PENDING",
    timestamp: new Date(),
    isDemo: true,
    sender: {
      id: "demo-artisan-1",
      name: "Lakshmi Devi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
      role: "ARTISAN" as const,
      artisanProfile: {
        location: "Jaipur, Rajasthan",
        bio: "Traditional block printing artisan with 15 years of experience.",
      },
    },
  },
];

// Demo connections (accepted)
const demoConnections = [
  {
    id: "demo-conn-1",
    name: "Ravi Kumar",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    role: "ARTISAN" as const,
    isDemo: true,
  },
  {
    id: "demo-conn-2",
    name: "Anita Sharma",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    role: "VOLUNTEER" as const,
    isDemo: true,
  },
];

// Demo conversations
const demoConversations = [
  {
    id: "demo-conv-1",
    isDemo: true,
    otherParticipant: {
      id: "demo-user-1",
      name: "Ravi Kumar",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    },
    lastMessage:
      "Thank you for connecting! I'd love to collaborate on the website project.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
  {
    id: "demo-conv-2",
    isDemo: true,
    otherParticipant: {
      id: "demo-user-2",
      name: "Anita Sharma",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    },
    lastMessage:
      "I can help with the social media marketing. When can we discuss?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
];

const customerDemoConnections = [
  {
    id: "cust-demo-conn-1",
    name: "Ramesh Kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    role: "ARTISAN" as const,
    isDemo: true,
  },
  {
    id: "cust-demo-conn-2",
    name: "Sunita Devi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    role: "ARTISAN" as const,
    isDemo: true,
  },
];

// Demo conversations for Customers
const customerDemoConversations = [
  {
    id: "cust-demo-conv-1",
    isDemo: true,
    otherParticipant: {
      id: "demo-artisan-1",
      name: "Ramesh Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      role: "ARTISAN" as const,
    },
    lastMessage:
      "The blue silk scarf is ready for shipping. It should reach you by Tuesday.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
  },
  {
    id: "cust-demo-conv-2",
    isDemo: true,
    otherParticipant: {
      id: "demo-artisan-2",
      name: "Sunita Devi",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      role: "ARTISAN" as const,
    },
    lastMessage:
      "Yes, I can certainly create a custom set of 6 dinner plates with that pattern.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
];

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.user.findUnique({ where: { id: user.id } });
}

async function getConnectionRequests(userId: string) {
  return prisma.connectionRequest.findMany({
    where: { receiverId: userId },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
          artisanProfile: {
            select: { location: true, bio: true },
          },
        },
      },
    },
    orderBy: { timestamp: "desc" },
  });
}

async function getAcceptedConnections(userId: string) {
  return prisma.connectionRequest.findMany({
    where: {
      OR: [
        { senderId: userId, status: "ACCEPTED" },
        { receiverId: userId, status: "ACCEPTED" },
      ],
    },
    include: {
      sender: { select: { id: true, name: true, avatar: true, role: true } },
      receiver: { select: { id: true, name: true, avatar: true, role: true } },
    },
    orderBy: { timestamp: "desc" },
  });
}

async function getConversations(userId: string) {
  return prisma.conversation.findMany({
    where: {
      OR: [{ participant1Id: userId }, { participant2Id: userId }],
    },
    include: {
      participant1: { select: { id: true, name: true, avatar: true } },
      participant2: { select: { id: true, name: true, avatar: true } },
      messages: { orderBy: { timestamp: "desc" }, take: 1 },
    },
    orderBy: { lastMessageAt: "desc" },
  });
}

export default async function ConnectionsPage() {
  const cookieStore = await cookies();
  const guestMode = cookieStore.get("guestMode")?.value === "true";

  const user = await getUser();

  if (!user && !guestMode) redirect("/login");

  // Check for view mode cookie (demo mode)
  const viewMode = cookieStore.get("viewMode")?.value;
  const originalRole = user?.role?.toLowerCase() || "artisan";
  const currentRole = viewMode || originalRole;
  const isDemo = guestMode || (!!viewMode && viewMode !== originalRole);

  // In demo/guest mode, show only demo data
  if (isDemo || !user) {
    const isCustomer = currentRole === "customer";
    return (
      <ConnectionsClient
        userId="demo-user"
        userRole={currentRole.toUpperCase()}
        pendingRequests={isCustomer ? [] : demoRequests}
        myConnections={isCustomer ? customerDemoConnections : demoConnections}
        pastRequests={[]}
        conversations={
          isCustomer ? customerDemoConversations : demoConversations
        }
        isDemo={true}
      />
    );
  }

  const [requests, connections, conversations] = await Promise.all([
    getConnectionRequests(user.id),
    getAcceptedConnections(user.id),
    getConversations(user.id),
  ]);

  const dbPendingRequests = requests.filter((r) => r.status === "PENDING");
  const dbConnectionsList = connections.map((c) => ({
    ...(c.senderId === user.id ? c.receiver : c.sender),
    isDemo: false,
  }));
  const pastRequests = requests.filter((r) => r.status !== "PENDING");

  // Transform conversations
  const transformedConversations = conversations.map((conv) => {
    const otherParticipant =
      conv.participant1Id === user.id ? conv.participant2 : conv.participant1;
    return {
      id: conv.id,
      isDemo: false,
      otherParticipant,
      lastMessage: conv.lastMessageText,
      lastMessageAt: conv.lastMessageAt,
    };
  });

  // Merge real data with demo data
  const pendingRequests = [
    ...dbPendingRequests.map((r) => ({ ...r, isDemo: false })),
    ...demoRequests,
  ];
  const myConnections = [...dbConnectionsList, ...demoConnections];
  const allConversations = [...transformedConversations, ...demoConversations];

  return (
    <ConnectionsClient
      userId={user.id}
      userRole={user.role}
      pendingRequests={pendingRequests}
      myConnections={myConnections}
      pastRequests={pastRequests}
      conversations={allConversations}
    />
  );
}
