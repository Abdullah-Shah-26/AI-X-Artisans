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
      id: "demo-artisan-2",
      name: "Meera Patel",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200",
      role: "ARTISAN" as const,
      artisanProfile: {
        location: "Ahmedabad, Gujarat",
        bio: "Textile weaving specialist creating beautiful handloom fabrics.",
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

const customerDemoConnections = [
  {
    id: "cust-demo-conn-1",
    name: "Ramesh Kumar",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    role: "ARTISAN" as const,
    isDemo: true,
  },
  {
    id: "cust-demo-conn-2",
    name: "Sunita Devi",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    role: "ARTISAN" as const,
    isDemo: true,
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
        isDemo={true}
      />
    );
  }

  const [requests, connections] = await Promise.all([
    getConnectionRequests(user.id),
    getAcceptedConnections(user.id),
  ]);

  const dbPendingRequests = requests.filter((r) => r.status === "PENDING");
  const dbConnectionsList = connections.map((c) => ({
    ...(c.senderId === user.id ? c.receiver : c.sender),
    isDemo: false,
  }));
  const pastRequests = requests.filter((r) => r.status !== "PENDING");

  // Merge real data with demo data
  const pendingRequests = [
    ...dbPendingRequests.map((r) => ({ ...r, isDemo: false })),
    ...demoRequests,
  ];
  const myConnections = [...dbConnectionsList, ...demoConnections];

  return (
    <ConnectionsClient
      userId={user.id}
      userRole={user.role}
      pendingRequests={pendingRequests}
      myConnections={myConnections}
      pastRequests={pastRequests}
    />
  );
}
