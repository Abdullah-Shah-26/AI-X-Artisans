"use client";

import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/common/ImageUpload";
import {
  getDemoCampaigns,
  saveDemoCampaign,
  updateDemoCampaign,
} from "@/lib/demoStorage";

interface Campaign {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  endDate: string;
  imageUrl: string | null;
  status: string;
}

interface CrowdfundClientProps {
  campaigns: Campaign[];
  isDemo?: boolean;
}

// Mock campaigns for demo
const mockCampaigns: Campaign[] = [
  {
    id: "camp-1",
    title: "New Pottery Kiln for Traditional Ceramics",
    description:
      "Help me upgrade my workshop with a professional electric kiln to create larger terracotta pieces and meet the growing demand for authentic handcrafted pottery.",
    goalAmount: 50000,
    currentAmount: 32500,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    imageUrl:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop",
    status: "ACTIVE",
  },
  {
    id: "camp-2",
    title: "Handloom Weaving Equipment Expansion",
    description:
      "Expanding my weaving workshop with two new traditional looms to train young artisans and preserve our ancestral Banarasi weaving patterns for future generations.",
    goalAmount: 75000,
    currentAmount: 48000,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    status: "ACTIVE",
  },
];

export default function CrowdfundClient({
  campaigns: initialCampaigns,
  isDemo,
}: CrowdfundClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>(
    initialCampaigns.length > 0 ? initialCampaigns : mockCampaigns,
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"my" | "discover">("my");

  // Load demo campaigns from localStorage
  useEffect(() => {
    if (isDemo) {
      const demoCampaigns = getDemoCampaigns();
      if (demoCampaigns.length > 0) {
        // Merge with initial campaigns
        setCampaigns([...demoCampaigns, ...initialCampaigns]);
      }
    }
  }, [isDemo, initialCampaigns]);

  // Form state - autofilled with demo data
  const [title, setTitle] = useState("Traditional Pottery Wheel & Kiln Setup");
  const [description, setDescription] = useState(
    "I'm raising funds to set up a modern electric pottery wheel and a small kiln for firing terracotta and ceramic pieces. This equipment will help me scale production of traditional earthenware while maintaining authentic craftsmanship and creating employment for 2 local artisans.",
  );
  const [goal, setGoal] = useState("55000");
  const [duration, setDuration] = useState("45");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=300&fit=crop",
  );

  const totalRaised = campaigns.reduce((sum, c) => sum + c.currentAmount, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;
  const totalBackers = 107; // Mock data

  const handleManageCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setTitle(campaign.title);
    setDescription(campaign.description);
    setGoal(campaign.goalAmount.toString());
    setImageUrl(campaign.imageUrl || "");
    // Calculate remaining days
    const daysLeft = Math.max(
      0,
      Math.ceil(
        (new Date(campaign.endDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      ),
    );
    setDuration(daysLeft.toString());
    setShowEditModal(true);
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    setLoading(true);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(duration));

    try {
      // Demo mode - update in localStorage
      if (isDemo) {
        const updatedCampaign: Campaign = {
          ...editingCampaign,
          title,
          description,
          goalAmount: parseFloat(goal),
          endDate: endDate.toISOString(),
          imageUrl: imageUrl || null,
        };

        // Update in localStorage
        updateDemoCampaign(editingCampaign.id, {
          ...updatedCampaign,
          createdAt: new Date(),
        });

        // Update in state
        setCampaigns(
          campaigns.map((c) =>
            c.id === editingCampaign.id ? updatedCampaign : c,
          ),
        );

        setShowEditModal(false);
        setEditingCampaign(null);
        resetForm();
        setLoading(false);
        return;
      }

      // Real mode - call API
      const res = await fetch(`/api/crowdfund/${editingCampaign.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          goalAmount: goal,
          endDate: endDate.toISOString(),
          imageUrl: imageUrl || null,
        }),
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditingCampaign(null);
        resetForm();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(duration));

    try {
      // Demo mode - save to localStorage
      if (isDemo) {
        const campaignId = `demo-campaign-${Date.now()}`;
        const newCampaign: Campaign = {
          id: campaignId,
          title,
          description,
          goalAmount: parseFloat(goal),
          currentAmount: 0,
          endDate: endDate.toISOString(),
          imageUrl: imageUrl || null,
          status: "ACTIVE",
        };

        // Save to localStorage
        saveDemoCampaign({
          ...newCampaign,
          createdAt: new Date(),
        });

        setCampaigns([newCampaign, ...campaigns]);
        setShowCreateModal(false);
        resetForm();
        setLoading(false);
        return;
      }

      const res = await fetch("/api/crowdfund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          goalAmount: goal,
          endDate: endDate.toISOString(),
          imageUrl: imageUrl || null,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        resetForm();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // Reset to demo data instead of empty
    setTitle("Traditional Pottery Wheel & Kiln Setup");
    setDescription(
      "I'm raising funds to set up a modern electric pottery wheel and a small kiln for firing terracotta and ceramic pieces. This equipment will help me scale production of traditional earthenware while maintaining authentic craftsmanship and creating employment for 2 local artisans.",
    );
    setGoal("55000");
    setDuration("45");
    setImageUrl(
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=300&fit=crop",
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1">Finance Hub</h1>
            <p className="text-emerald-100 text-sm sm:text-base">
              Fund your dreams, grow your craft
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-emerald-600 px-4 sm:px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-50 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Start Campaign
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
          <div>
            <p className="text-xl sm:text-3xl font-bold">
              ₹{totalRaised.toLocaleString()}
            </p>
            <p className="text-emerald-200 text-xs sm:text-sm mt-0.5">
              Total Raised
            </p>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-bold">{activeCampaigns}</p>
            <p className="text-emerald-200 text-xs sm:text-sm mt-0.5">
              Active Campaigns
            </p>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-bold">{totalBackers}</p>
            <p className="text-emerald-200 text-xs sm:text-sm mt-0.5">
              Total Backers
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl ring-1 ring-gray-200 dark:ring-zinc-800 p-1 flex gap-1">
        <button
          onClick={() => setActiveTab("my")}
          className={`flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition ${
            activeTab === "my"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
          }`}
        >
          My Campaigns
        </button>
        <button
          onClick={() => setActiveTab("discover")}
          className={`flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition ${
            activeTab === "discover"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
          }`}
        >
          Discover
        </button>
      </div>

      {/* Content */}
      {activeTab === "my" ? (
        <div>
          {campaigns.length === 0 ? (
            <EmptyState onCreateClick={() => setShowCreateModal(true)} />
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onManage={handleManageCampaign}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <DiscoverSection />
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCampaign}
          loading={loading}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          goal={goal}
          setGoal={setGoal}
          duration={duration}
          setDuration={setDuration}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
        />
      )}

      {/* Edit Campaign Modal */}
      {showEditModal && (
        <CreateCampaignModal
          onClose={() => {
            setShowEditModal(false);
            setEditingCampaign(null);
            resetForm();
          }}
          onSubmit={handleUpdateCampaign}
          loading={loading}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          goal={goal}
          setGoal={setGoal}
          duration={duration}
          setDuration={setDuration}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          isEdit={true}
        />
      )}
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 sm:p-12 text-center ring-1 ring-gray-200 dark:ring-zinc-800">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Launch Your First Campaign
      </h3>
      <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-base mb-6 max-w-md mx-auto">
        Need funds for new equipment, materials, or workshop expansion? Start a
        funding campaign and let your community support your craft.
      </p>
      <button
        onClick={onCreateClick}
        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-medium text-sm sm:text-base"
      >
        Create Your First Campaign
      </button>
    </div>
  );
}

function CampaignCard({
  campaign,
  onManage,
}: {
  campaign: Campaign;
  onManage?: (campaign: Campaign) => void;
}) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const progress = Math.round(
    (campaign.currentAmount / campaign.goalAmount) * 100,
  );
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.endDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/finance-hub/${campaign.id}`
      : "";
  const shareText = `Support my campaign: ${campaign.title}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      "_blank",
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText,
      )}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl,
      )}`,
      "_blank",
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800 overflow-hidden hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0">
          {campaign.imageUrl ? (
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
              <span className="text-4xl">💰</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm sm:text-base">
              {campaign.title}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                campaign.status === "ACTIVE"
                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
              }`}
            >
              {campaign.status}
            </span>
          </div>

          <p className="text-gray-500 dark:text-zinc-400 text-xs sm:text-sm mb-4 line-clamp-2">
            {campaign.description}
          </p>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{campaign.currentAmount.toLocaleString()}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mt-1">
              <span>of ₹{campaign.goalAmount.toLocaleString()}</span>
              <span>{daysLeft} days left</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onManage?.(campaign)}
              className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition text-xs sm:text-sm font-medium"
            >
              Manage
            </button>
            <button
              onClick={handleShare}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm flex items-center gap-1.5 font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span className="hidden sm:inline">Share</span>
            </button>
            <div className="relative">
              {/* Share Menu Dropdown */}
              {showShareMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 py-2 z-10">
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2 text-gray-700 dark:text-white"
                  >
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                  <button
                    onClick={shareToWhatsApp}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2 text-gray-700 dark:text-white"
                  >
                    <svg
                      className="w-4 h-4 text-green-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </button>
                  <button
                    onClick={shareToTwitter}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2 text-gray-700 dark:text-white"
                  >
                    <svg
                      className="w-4 h-4 text-black dark:text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter / X
                  </button>
                  <button
                    onClick={shareToFacebook}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2 text-gray-700 dark:text-white"
                  >
                    <svg
                      className="w-4 h-4 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoverSection() {
  const otherCampaigns = [
    {
      id: "other-1",
      artisan: "Meera Devi",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face",
      title: "Traditional Block Printing Workshop",
      raised: 28000,
      goal: 40000,
      image:
        "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=300&h=200&fit=crop",
    },
    {
      id: "other-2",
      artisan: "Rajan Kumar",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      title: "Brass Metalwork Tools Upgrade",
      raised: 15000,
      goal: 35000,
      image:
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop",
    },
    {
      id: "other-3",
      artisan: "Lakshmi Naidu",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      title: "Kalamkari Natural Dye Materials",
      raised: 22000,
      goal: 25000,
      image:
        "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=300&h=200&fit=crop",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-zinc-400 text-sm sm:text-base">
        Support fellow artisans in their journey
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {otherCampaigns.map((camp) => {
          const progress = Math.round((camp.raised / camp.goal) * 100);
          return (
            <div
              key={camp.id}
              className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800 hover:shadow-md transition"
            >
              <img
                src={camp.image}
                alt={camp.title}
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={camp.avatar}
                    alt={camp.artisan}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-500 dark:text-zinc-400">
                    {camp.artisan}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 line-clamp-1 text-sm sm:text-base">
                  {camp.title}
                </h4>
                <div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-900 dark:text-white font-medium">
                    ₹{camp.raised.toLocaleString()}
                  </span>
                  <span className="text-gray-500 dark:text-zinc-400">
                    {progress}% funded
                  </span>
                </div>
                <button className="w-full mt-3 py-2 border border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition text-sm font-medium">
                  Support
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CreateCampaignModal({
  onClose,
  onSubmit,
  loading,
  title,
  setTitle,
  description,
  setDescription,
  goal,
  setGoal,
  duration,
  setDuration,
  imageUrl,
  setImageUrl,
  isEdit = false,
}: {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  goal: string;
  setGoal: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
  imageUrl: string;
  setImageUrl: (v: string) => void;
  isEdit?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Edit Campaign" : "Start a Campaign"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 p-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
              Campaign Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., New Equipment for My Workshop"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what you need the funds for..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                Goal (₹)
              </label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="50000"
                min="1000"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="15">15 days</option>
                <option value="30">30 days</option>
                <option value="45">45 days</option>
                <option value="60">60 days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
              Campaign Image
            </label>
            <ImageUpload
              onUpload={setImageUrl}
              currentImage={imageUrl}
              bucket="images"
              folder="campaigns"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 dark:border-zinc-700 dark:text-white py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 font-medium"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Campaign"
                  : "Launch Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
