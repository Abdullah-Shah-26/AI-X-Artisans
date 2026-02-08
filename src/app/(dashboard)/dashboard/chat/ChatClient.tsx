"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Search, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface User {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
}

interface Conversation {
  id: string;
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
  text: string;
  senderId: string;
  timestamp: Date;
  imageUrl?: string;
}

interface ChatClientProps {
  currentUser: User;
  conversations: Conversation[];
  isDemo?: boolean;
}

// Demo messages for each conversation
const demoMessages: Record<string, Message[]> = {
  "demo-conv-1": [
    {
      id: "msg-1",
      text: "Hi! I'm interested in your blue pottery vase",
      senderId: "demo-user-1",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: "msg-2",
      text: "Hello! Thank you for your interest. It's handcrafted with traditional techniques.",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
    },
    {
      id: "msg-3",
      text: "That's wonderful! Can you tell me more about the design?",
      senderId: "demo-user-1",
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
    },
    {
      id: "msg-4",
      text: "Of course! The blue pottery is a traditional craft from Jaipur. Each piece is unique and hand-painted.",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 35),
    },
    {
      id: "msg-5",
      text: "Thank you for the beautiful pottery!",
      senderId: "demo-user-1",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
  ],
  "demo-conv-2": [
    {
      id: "msg-6",
      text: "Hello! I saw your project posting and I'd like to collaborate",
      senderId: "demo-user-2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: "msg-7",
      text: "That's great! What skills can you bring to the project?",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    },
    {
      id: "msg-8",
      text: "I specialize in pottery and ceramics with 18 years of experience",
      senderId: "demo-user-2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.2),
    },
    {
      id: "msg-9",
      text: "When can we schedule the collaboration?",
      senderId: "demo-user-2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ],
  "demo-conv-3": [
    {
      id: "msg-10",
      text: "Hi! I'm a volunteer with marketing skills",
      senderId: "demo-user-3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
    },
    {
      id: "msg-11",
      text: "Welcome! We'd love to have your help",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5),
    },
    {
      id: "msg-12",
      text: "I'd love to help with your marketing!",
      senderId: "demo-user-3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ],
};

// Customer-specific demo messages
const customerDemoMessages: Record<string, Message[]> = {
  "demo-conv-lakshmi": [
    {
      id: "msg-c1",
      text: "Hello Lakshmi! I saw your beautiful handwoven sarees on the marketplace.",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "msg-c2",
      text: "Namaste! Thank you so much. I've been weaving sarees for over 25 years. How can I help you today?",
      senderId: "lakshmi-devi",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9),
    },
    {
      id: "msg-c3",
      text: "I have a silk saree that I'd like to get styled differently. Can you help with custom designs?",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8),
    },
    {
      id: "msg-c4",
      text: "Absolutely! I specialize in custom saree designs. I can create beautiful patterns - traditional, modern, or fusion styles. Could you share an image of your saree?",
      senderId: "lakshmi-devi",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.7),
    },
    {
      id: "msg-c5",
      text: "Here's my saree. I'm thinking of a minimalist style with subtle patterns.",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      imageUrl:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
    },
    {
      id: "msg-c6",
      text: "Beautiful silk! The color is gorgeous. For a minimalist design, I suggest delicate floral motifs along the border with fine zari work. It will highlight the silk's natural elegance without overwhelming it.",
      senderId: "lakshmi-devi",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.3),
    },
    {
      id: "msg-c7",
      text: "That sounds perfect! How long would it take?",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.2),
    },
    {
      id: "msg-c8",
      text: "For this design, it would take about 2-3 weeks. I hand-weave each pattern with care. The price would be ₹8,500 including materials and my craftsmanship.",
      senderId: "lakshmi-devi",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.1),
    },
    {
      id: "msg-c9",
      text: "That's reasonable! Can you show me some examples of your previous minimalist work?",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: "msg-c10",
      text: "Of course! Here's a recent minimalist saree I created. Notice the subtle geometric patterns.",
      senderId: "lakshmi-devi",
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      imageUrl: "/demo/saree-minimalist.png",
    },
    {
      id: "msg-c11",
      text: "Wow, that's exactly the style I want! Can we proceed with the order?",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: "msg-c12",
      text: "Wonderful! I'd love to create a custom design for your saree! I'll need a 50% advance to start. Once you confirm, I'll begin working on your piece right away.",
      senderId: "lakshmi-devi",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
  ],
};

// Volunteer-specific demo messages (conversations with artisans)
const volunteerDemoMessages: Record<string, Message[]> = {
  "demo-conv-2": [
    {
      id: "msg-v1",
      text: "Hello! I saw you're looking for help with marketing. I'm a volunteer with digital marketing experience.",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    },
    {
      id: "msg-v2",
      text: "That's wonderful! I really need help reaching more customers online.",
      senderId: "demo-user-2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5),
    },
    {
      id: "msg-v3",
      text: "I can help you set up social media profiles and create content showcasing your beautiful pottery work.",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: "msg-v4",
      text: "That would be amazing! I have some photos of my recent pieces.",
      senderId: "demo-user-2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.8),
    },
    {
      id: "msg-v5",
      text: "Perfect! Could you share them? I'll create some promotional posts.",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    },
    {
      id: "msg-v6",
      text: "Here's one of my latest ceramic tea sets",
      senderId: "demo-user-2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.3),
      imageUrl:
        "https://siggyhandmade.com/cdn/shop/products/CeramicTeaSet.jpg?v=1663196891",
    },
    {
      id: "msg-v7",
      text: "Beautiful craftsmanship! This will look great on Instagram. When can we schedule the collaboration?",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ],
  "demo-conv-3": [
    {
      id: "msg-v8",
      text: "Hi! I'm a volunteer interested in helping artisans with business development.",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26),
    },
    {
      id: "msg-v9",
      text: "Hello! That's very kind of you. I could use some guidance on pricing my products.",
      senderId: "demo-user-3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25.5),
    },
    {
      id: "msg-v10",
      text: "I'd be happy to help! Tell me about your craft and current pricing strategy.",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
    },
    {
      id: "msg-v11",
      text: "I do brass work - traditional lamps and decorative pieces. I'm not sure if my prices are competitive.",
      senderId: "demo-user-3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5),
    },
    {
      id: "msg-v12",
      text: "I'd love to help with your marketing! Let's analyze your costs and market positioning.",
      senderId: "demo-current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ],
};

export function ChatClient({
  currentUser,
  conversations: initialConversations,
  isDemo = false,
}: ChatClientProps) {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<string>("disconnected");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time conversation updates
  useEffect(() => {
    if (isDemo) return;

    const supabase = createClient();
    console.log(
      "Setting up real-time conversation subscription for user:",
      currentUser.id,
    );

    // Subscribe to conversation updates for current user
    const channel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Conversation",
        },
        (payload) => {
          console.log("Conversation updated:", payload);
          // Check if this conversation involves the current user
          const conversation = payload.new || payload.old;
          if (
            conversation &&
            ((conversation as any).participant1Id === currentUser.id ||
              (conversation as any).participant2Id === currentUser.id)
          ) {
            console.log("Refreshing conversations for current user");
            // Refresh conversations when there's an update
            fetch("/api/chat")
              .then((res) => res.json())
              .then((data) => setConversations(data))
              .catch((err) =>
                console.error("Failed to refresh conversations:", err),
              );
          }
        },
      )
      .subscribe((status) => {
        console.log("Conversation subscription status:", status);
        setRealtimeStatus(status);
      });

    return () => {
      console.log("Cleaning up conversation subscription");
      supabase.removeChannel(channel);
    };
  }, [currentUser.id, isDemo]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    if (isDemo) {
      // Load demo messages - use role-specific messages
      let messagesToUse = demoMessages;

      if (currentUser.role.toLowerCase() === "customer") {
        messagesToUse = customerDemoMessages;
      } else if (currentUser.role.toLowerCase() === "volunteer") {
        messagesToUse = volunteerDemoMessages;
      }

      setMessages(messagesToUse[selectedConversation.id] || []);
    } else {
      // Load real messages from API
      fetch(`/api/chat/${selectedConversation.id}/messages`)
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error("Failed to load messages:", err));
    }
  }, [selectedConversation, isDemo, currentUser.role]);

  // Real-time message subscription
  useEffect(() => {
    if (!selectedConversation || isDemo) return;

    const supabase = createClient();
    console.log(
      "Setting up real-time message subscription for conversation:",
      selectedConversation.id,
    );

    // Subscribe to new messages in this conversation
    const channel = supabase
      .channel(`messages:${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `conversationId=eq.${selectedConversation.id}`,
        },
        (payload) => {
          console.log("New message received:", payload);
          const newMessage = {
            id: payload.new.id,
            text: payload.new.text,
            senderId: payload.new.senderId,
            timestamp: new Date(payload.new.timestamp),
            imageUrl: payload.new.imageUrl,
          };

          // Only add if it's not from current user (to avoid duplicates)
          if (payload.new.senderId !== currentUser.id) {
            console.log("Adding message from other user:", newMessage);
            setMessages((prev) => [...prev, newMessage]);
          } else {
            console.log("Ignoring own message to avoid duplicate");
          }
        },
      )
      .subscribe((status) => {
        console.log("Message subscription status:", status);
      });

    return () => {
      console.log(
        "Cleaning up message subscription for conversation:",
        selectedConversation.id,
      );
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, isDemo, currentUser.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedConversation(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedImage) || !selectedConversation) return;

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      text: newMessage,
      senderId: currentUser.id,
      timestamp: new Date(),
      imageUrl: imagePreview || undefined,
    };

    // Optimistically add message
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    handleRemoveImage();

    if (!isDemo) {
      // Send to API
      try {
        await fetch(`/api/chat/${selectedConversation.id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newMessage, imageUrl: imagePreview }),
        });
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherParticipant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List - Hidden on mobile when chat is open */}
      <div
        className={`${
          showChat ? "hidden" : "flex"
        } md:flex w-full md:w-80 bg-white dark:bg-zinc-900 md:rounded-2xl md:shadow-sm md:border border-gray-200 dark:border-zinc-800 flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Messages
          </h2>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-zinc-400">
              <p>No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className="w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-b border-gray-100 dark:border-zinc-800"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center overflow-hidden shrink-0">
                  {conv.otherParticipant.avatar ? (
                    <img
                      src={conv.otherParticipant.avatar}
                      alt={conv.otherParticipant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {conv.otherParticipant.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {conv.otherParticipant.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-zinc-400 shrink-0 ml-2">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 truncate">
                    {conv.lastMessage || "No messages yet"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area - Full screen on mobile, side panel on desktop */}
      {selectedConversation && (
        <div
          className={`${
            showChat ? "flex" : "hidden"
          } md:flex flex-1 bg-white dark:bg-zinc-900 md:rounded-2xl md:shadow-sm md:border border-gray-200 dark:border-zinc-800 flex-col md:ml-6`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-3">
            {/* Back button - Mobile only */}
            <button
              onClick={handleBackToList}
              className="md:hidden p-2 -ml-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center overflow-hidden">
              {selectedConversation.otherParticipant.avatar ? (
                <img
                  src={selectedConversation.otherParticipant.avatar}
                  alt={selectedConversation.otherParticipant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {selectedConversation.otherParticipant.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {selectedConversation.otherParticipant.name}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Active now
                </p>
                {!isDemo && (
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        realtimeStatus === "SUBSCRIBED"
                          ? "bg-green-500"
                          : realtimeStatus === "CHANNEL_ERROR"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    <span className="text-xs text-gray-500 dark:text-zinc-400">
                      {realtimeStatus === "SUBSCRIBED"
                        ? "Real-time"
                        : realtimeStatus === "CHANNEL_ERROR"
                          ? "Offline"
                          : "Connecting..."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-zinc-400">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.senderId === currentUser.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] md:max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-emerald-600 text-white rounded-br-sm"
                          : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-bl-sm shadow-sm"
                      }`}
                    >
                      {message.imageUrl && (
                        <div className="mb-2">
                          <img
                            src={message.imageUrl}
                            alt="Shared image"
                            className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                          />
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn
                            ? "text-emerald-100"
                            : "text-gray-500 dark:text-zinc-400"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 md:p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-32 rounded-lg border-2 border-emerald-500"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* Image upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 md:p-3 text-gray-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                title="Attach image"
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>

              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-2.5 md:py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white text-sm md:text-base"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && !selectedImage}
                className="p-2.5 md:p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state for desktop when no conversation selected */}
      {!selectedConversation && (
        <div className="hidden md:flex flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 items-center justify-center ml-6">
          <div className="text-center text-gray-500 dark:text-zinc-400">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-lg font-medium mb-2">No conversation selected</p>
            <p className="text-sm">
              Choose a conversation from the list to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
