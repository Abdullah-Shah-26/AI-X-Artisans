"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { ConnectionRequestCard } from "./ConnectionRequestCard";
import { ConnectionCard } from "./ConnectionCard";
import { createClient } from "@/lib/supabase/client";

interface ConnectionRequest {
  id: string;
  status: string;
  timestamp: Date;
  isDemo?: boolean;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
    role: "ARTISAN" | "VOLUNTEER" | "CUSTOMER";
    artisanProfile?: {
      location: string | null;
      bio: string | null;
    } | null;
  };
}

interface Connection {
  id: string;
  name: string;
  avatar: string | null;
  role: "ARTISAN" | "VOLUNTEER" | "CUSTOMER";
  isDemo?: boolean;
}

interface ConversationPreview {
  id: string;
  isDemo?: boolean;
  otherParticipant: {
    id: string;
    name: string;
    avatar: string | null;
  };
  lastMessage: string | null;
  lastMessageAt: Date | null;
}

interface Message {
  id: string;
  text: string | null;
  imageUrl: string | null;
  senderId: string;
  timestamp: Date;
}

interface ConnectionsClientProps {
  userId: string;
  userRole: string;
  pendingRequests: ConnectionRequest[];
  myConnections: Connection[];
  pastRequests: ConnectionRequest[];
  conversations: ConversationPreview[];
  isDemo?: boolean;
}

export function ConnectionsClient({
  userId,
  userRole,
  pendingRequests,
  myConnections,
  pastRequests,
  conversations: initialConversations,
}: ConnectionsClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"messages" | "requests">(
    "messages",
  );
  const [conversations, setConversations] = useState(initialConversations);

  // Fetch conversations on mount if empty
  useEffect(() => {
    if (initialConversations.length === 0) {
      fetch("/api/chat")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setConversations(data);
        })
        .catch(console.error);
    }
  }, [initialConversations]);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header with Tabs */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
          title="Go back"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("connections.title")}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            {t("connections.subtitle")}
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl w-fit shrink-0">
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "messages"
              ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
              : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          {t("connections.messages")}
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            activeTab === "requests"
              ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
              : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          {t("connections.requests")}
          {pendingRequests.length > 0 && (
            <span className="w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        {activeTab === "messages" ? (
          <MessagesView userId={userId} conversations={conversations} />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <RequestsView
              userRole={userRole}
              pendingRequests={pendingRequests}
              myConnections={myConnections}
              pastRequests={pastRequests}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Messages View Component
function MessagesView({
  userId,
  conversations,
}: {
  userId: string;
  conversations: ConversationPreview[];
}) {
  const { t } = useLanguage();
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(conversations.length > 0 ? conversations[0].id : null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false); // New state for mobile view
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const filteredConversations = conversations.filter((conv) =>
    conv.otherParticipant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (!selectedConversation) return;
    const interval = setInterval(() => {
      loadMessages(selectedConversation);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedConversation]);

  // Demo messages for demo conversations
  const getDemoMessages = (convId: string): Message[] => {
    if (convId === "demo-conv-1") {
      return [
        {
          id: "dm1",
          text: "Hi! I saw your profile and I'm interested in collaborating.",
          imageUrl: null,
          senderId: "demo-user-1",
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
        },
        {
          id: "dm2",
          text: "Hello! Yes, I'd love to work together on the website project.",
          imageUrl: null,
          senderId: userId,
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
        },
        {
          id: "dm3",
          text: "Thank you for connecting! I'd love to collaborate on the website project.",
          imageUrl: null,
          senderId: "demo-user-1",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
      ];
    }
    if (convId === "demo-conv-2") {
      return [
        {
          id: "dm4",
          text: "Hi there! I noticed you need help with marketing.",
          imageUrl: null,
          senderId: "demo-user-2",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        },
        {
          id: "dm5",
          text: "Yes! I'm looking for someone to help with social media.",
          imageUrl: null,
          senderId: userId,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        },
        {
          id: "dm6",
          text: "I can help with the social media marketing. When can we discuss?",
          imageUrl: null,
          senderId: "demo-user-2",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
      ];
    }
    // Customer Demo Chat 1: Ramesh Kumar (Silk Scarf)
    if (convId === "cust-demo-conv-1") {
      return [
        {
          id: "cdm1",
          text: "Hi, I just ordered the Blue Silk Scarf. Can you confirm if it's in stock?",
          imageUrl: null,
          senderId: userId,
          timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        },
        {
          id: "cdm2",
          text: "Namaste! Yes, it is available. I am packing it now.",
          imageUrl: null,
          senderId: "demo-artisan-1", // Ramesh
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        },
        {
          id: "cdm3",
          text: "The blue silk scarf is ready for shipping. It should reach you by Tuesday.",
          imageUrl: null,
          senderId: "demo-artisan-1",
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
        },
      ];
    }
    // Customer Demo Chat 2: Sunita Devi (Pottery)
    if (convId === "cust-demo-conv-2") {
      return [
        {
          id: "cdm4",
          text: "I love your blue pottery vases. Do you make matching dinner plates?",
          imageUrl: null,
          senderId: userId,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        },
        {
          id: "cdm5",
          text: "Hello! Thank you. Yes, we do make dinner sets on order.",
          imageUrl: null,
          senderId: "demo-artisan-2", // Sunita
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        },
        {
          id: "cdm6",
          text: "I love this style! Can you make something similar?",
          imageUrl: "/demo/saree-bohemian.png",
          senderId: userId,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        },
        {
          id: "cdm7",
          text: "Yes, I can certainly create a custom set with that pattern. Beautiful design!",
          imageUrl: null,
          senderId: "demo-artisan-2",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
      ];
    }
    return [];
  };

  const loadMessages = async (conversationId: string) => {
    // Check if it's a demo conversation
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv?.isDemo) {
      setMessages(getDemoMessages(conversationId));
      return;
    }

    try {
      const response = await fetch(`/api/chat/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `chat/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(data.path);

      setSelectedImage(urlData.publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !selectedConversation) return;

    // Optimistic update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      text: newMessage || null,
      imageUrl: selectedImage,
      senderId: userId,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");
    setSelectedImage(null);

    // Check if it's a demo conversation - just keep the optimistic update
    const conv = conversations.find((c) => c.id === selectedConversation);
    if (conv?.isDemo) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/chat/${selectedConversation}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: newMessage || null,
            imageUrl: selectedImage,
          }),
        },
      );
      if (response.ok) {
        // Reload to get server-confirmed message
        loadMessages(selectedConversation);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0)
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7)
      return d.toLocaleDateString("en-US", { weekday: "short" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex h-full bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-zinc-800">
      {/* Sidebar - Hidden on mobile when chat is open */}
      <div
        className={`w-full md:w-80 border-r border-gray-100 dark:border-zinc-800 flex flex-col bg-gray-50/50 dark:bg-zinc-900 ${showChatOnMobile ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-black">
          {/* Search - Hidden on mobile */}
          <div className="relative hidden md:block">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={t("chat.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-800 dark:text-white border-0 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {filteredConversations.map((conv) => {
            const isSelected = selectedConversation === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv.id);
                  setShowChatOnMobile(true); // Show chat on mobile when conversation is selected
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition text-left ${
                  isSelected
                    ? "bg-emerald-50 dark:bg-emerald-600/20 border-r-2 border-emerald-500"
                    : "hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-500/20">
                    {conv.otherParticipant.avatar ? (
                      <img
                        src={conv.otherParticipant.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-semibold">
                        {conv.otherParticipant.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p
                      className={`font-medium truncate ${
                        isSelected
                          ? "text-emerald-900 dark:text-emerald-200"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {conv.otherParticipant.name}
                    </p>
                    {conv.lastMessageAt && (
                      <span className="text-xs text-gray-400">
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-sm text-gray-500 dark:text-zinc-400 truncate">
                      {conv.lastMessage}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area - Full screen on mobile when chat is open */}
      <div
        className={`flex-1 flex flex-col bg-white dark:bg-black ${showChatOnMobile ? "flex" : "hidden md:flex"}`}
      >
        {selectedConv ? (
          <>
            <div className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-3">
              {/* Back button - Mobile only */}
              <button
                onClick={() => setShowChatOnMobile(false)}
                className="md:hidden p-2 -ml-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-500/20">
                {selectedConv.otherParticipant.avatar ? (
                  <img
                    src={selectedConv.otherParticipant.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-semibold">
                    {selectedConv.otherParticipant.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedConv.otherParticipant.name}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  {t("chat.online")}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderId === userId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[65%] px-4 py-2.5 rounded-2xl ${
                        isOwn
                          ? "bg-emerald-600 text-white rounded-br-md"
                          : "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-bl-md"
                      }`}
                    >
                      {message.imageUrl && (
                        <div className="mb-2">
                          <img
                            src={message.imageUrl}
                            alt="Shared image"
                            className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition"
                            style={{ maxHeight: "200px" }}
                            onClick={() =>
                              window.open(message.imageUrl!, "_blank")
                            }
                          />
                        </div>
                      )}
                      {message.text && (
                        <p className="text-[15px]">{message.text}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 md:p-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-black">
              {/* Image Preview */}
              {selectedImage && (
                <div className="mb-3 relative inline-block">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-h-20 rounded-lg border border-gray-200 dark:border-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              )}

              <form
                onSubmit={sendMessage}
                className="flex items-center gap-2 md:gap-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition disabled:opacity-50"
                  title="Attach image"
                >
                  {uploadingImage ? (
                    <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t("chat.typeMessage")}
                  className="flex-1 min-w-0 px-3 md:px-4 py-2.5 md:py-3 bg-gray-100 dark:bg-zinc-800 dark:text-white border-0 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || (!newMessage.trim() && !selectedImage)}
                  className="shrink-0 p-2.5 md:p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition"
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-zinc-400">
                {t("chat.selectConversation")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Requests View Component
function RequestsView({
  userRole,
  pendingRequests,
  myConnections,
  pastRequests,
}: {
  userRole: string;
  pendingRequests: ConnectionRequest[];
  myConnections: Connection[];
  pastRequests: ConnectionRequest[];
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center text-sm font-bold">
              {pendingRequests.length}
            </span>
            {t("connections.pendingRequests")}
          </h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <ConnectionRequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}

      {/* My Connections */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("connections.myConnections")} ({myConnections.length})
        </h2>

        {myConnections.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-zinc-400">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="mb-2">{t("connections.noConnections")}</p>
            <p className="text-sm">
              {userRole === "ARTISAN"
                ? t("connections.connectVolunteers")
                : t("connections.artisansWillSend")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myConnections.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        )}
      </div>

      {/* Past Requests */}
      {pastRequests.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("connections.pastRequests")}
          </h2>
          <div className="space-y-3">
            {pastRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
                    {request.sender.avatar ? (
                      <img
                        src={request.sender.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 dark:text-zinc-300">
                        {request.sender.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {request.sender.name}
                  </span>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    request.status === "ACCEPTED"
                      ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                  }`}
                >
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
