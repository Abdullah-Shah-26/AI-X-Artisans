// Re-export Prisma types for convenience
export type {
  User,
  ArtisanProfile,
  VolunteerProfile,
  Product,
  Certificate,
  Project,
  ProjectApplication,
  Collaboration,
  Conversation,
  Message,
  ConnectionRequest,
  CartItem,
  Favorite,
  CrowdfundCampaign,
  PriceOffer,
  VolunteerCertificate,
} from "@prisma/client";

export {
  Role,
  ProjectStatus,
  ApplicationStatus,
  CollaborationStatus,
  ConnectionStatus,
  OfferStatus,
} from "@prisma/client";

// Extended types with relations
export type UserWithProfile = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: "ARTISAN" | "VOLUNTEER" | "CUSTOMER";
  profileComplete: boolean;
  artisanProfile?: {
    location: string | null;
    bio: string | null;
    story: string | null;
    storyVideoUrl: string | null;
  } | null;
  volunteerProfile?: {
    skills: string[];
    bio: string | null;
    motivation: string | null;
    projectsCompleted: number;
  } | null;
};

export type ProductWithArtisan = {
  id: string;
  name: string;
  description: string;
  longDescription: string | null;
  price: number;
  image: string;
  category: string;
  craftTradition: string | null;
  storyVideoUrl: string | null;
  dateAdded: Date;
  artisan: {
    id: string;
    name: string;
    avatar: string | null;
  };
  certificate?: {
    id: string;
    artworkName: string;
    craftTradition: string;
  } | null;
};

// Page types
export type Page =
  | "dashboard"
  | "marketplace"
  | "volunteers"
  | "finance"
  | "nft"
  | "training"
  | "chat"
  | "photo-studio"
  | "cart"
  | "customer-marketplace"
  | "customer-cart"
  | "customer-favorites"
  | "customer-profile"
  | "customer-checkout"
  | "customer-chat"
  | "customer-orders"
  | "customer-offers";
