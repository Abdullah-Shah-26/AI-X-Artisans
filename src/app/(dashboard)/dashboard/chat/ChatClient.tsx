"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";

interface Participant {
  id: string;
  name: string;
  avatar: string | null;
}

interface ConversationPreview {
  id: string;
  otherParticipant: Participant;
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

interface ChatClientProps {
  userId: string;
  userName: string;
  conversations: ConversationPreview[];
  initialConversationId?: string;
  isDemo?: boolean;
}

// Mock conversations for demo
const mockConversations: ConversationPreview[] = [
  {
    id: "conv-1",
    otherParticipant: {
      id: "user-priya",
      name: "Priya Sharma",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
    lastMessage: "I'd love to help with your product photos!",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "conv-2",
    otherParticipant: {
      id: "user-rahul",
      name: "Rahul Verma",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    lastMessage: "The silk saree is beautiful! Is it still available?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "conv-3",
    otherParticipant: {
      id: "user-anita",
      name: "Anita Desai",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    lastMessage: "Thank you for the quick delivery!",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

// Mock messages for each conversation
const mockMessages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      text: "Hi! I saw your pottery collection on the marketplace. The craftsmanship is amazing!",
      imageUrl: null,
      senderId: "user-priya",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: "msg-2",
      text: "Thank you so much! I've been practicing this craft for over 20 years.",
      imageUrl: null,
      senderId: "current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
    },
    {
      id: "msg-3",
      text: "I'm a photographer and I volunteer to help artisans with product photography. Would you be interested?",
      imageUrl: null,
      senderId: "user-priya",
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
    },
    {
      id: "msg-4",
      text: "That would be wonderful! My photos could definitely use some professional help.",
      imageUrl: null,
      senderId: "current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: "msg-5",
      text: "I'd love to help with your product photos!",
      imageUrl: null,
      senderId: "user-priya",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
  ],
  "conv-2": [
    {
      id: "msg-6",
      text: "Hello! I'm interested in the hand-woven silk saree you have listed.",
      imageUrl: null,
      senderId: "user-rahul",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: "msg-7",
      text: "Hi! Yes, it's a traditional Banarasi weave. Each one takes about 2 weeks to complete.",
      imageUrl: null,
      senderId: "current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    },
    {
      id: "msg-8",
      text: "I love this style! Can you make something similar?",
      imageUrl: "/demo/saree-bohemian.png",
      senderId: "user-rahul",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.2),
    },
    {
      id: "msg-9",
      text: "The silk saree is beautiful! Is it still available?",
      imageUrl: null,
      senderId: "user-rahul",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ],
  "conv-3": [
    {
      id: "msg-9",
      text: "Hi, I just received my order. The packaging was so thoughtful!",
      imageUrl: null,
      senderId: "user-anita",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
    },
    {
      id: "msg-10",
      text: "I'm so glad you liked it! I always try to add a personal touch.",
      imageUrl: null,
      senderId: "current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5),
    },
    {
      id: "msg-11",
      text: "Thank you for the quick delivery!",
      imageUrl: null,
      senderId: "user-anita",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ],
  "demo-conv-4": [
    {
      id: "msg-12",
      text: "Hello! I'm interested in your silk saree work. The craftsmanship is incredible!",
      imageUrl: null,
      senderId: "current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "msg-13",
      text: "Thank you so much! I've been weaving for over 15 years. Each piece tells a story.",
      imageUrl: null,
      senderId: "demo-artisan-ramesh",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8),
    },
    {
      id: "msg-14",
      text: "I love this style! Can you make something similar?",
      imageUrl: "/demo/saree-bohemian.png",
      senderId: "current-user",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
    },
  ],
};

export function ChatClient({
  userId,
  conversations: initialConversations,
  initialConversationId,
}: ChatClientProps) {
  const { t } = useLanguage();
  const conversations =
    initialConversations.length > 0 ? initialConversations : mockConversations;

  // Use initialConversationId if provided, otherwise use first conversation
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(
    initialConversationId ||
      (conversations.length > 0 ? conversations[0].id : null),
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const filteredConversations = conversations.filter((conv) =>
    conv.otherParticipant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // Check if conversation is a mock one
  const isMockConversation = (convId: string) => {
    return convId.startsWith("conv-");
  };

  const loadMessages = async (conversationId: string) => {
    // For mock conversations, use mock messages
    if (isMockConversation(conversationId) && mockMessages[conversationId]) {
      const msgs = mockMessages[conversationId].map((msg) => ({
        ...msg,
        senderId: msg.senderId === "current-user" ? userId : msg.senderId,
      }));
      setMessages(msgs);
      return;
    }

    // For real conversations, fetch from API
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

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  // Subscribe to real-time messages for real conversations
  useEffect(() => {
    if (!selectedConversation || isMockConversation(selectedConversation))
      return;

    const channel = supabase
      .channel(`conversation:${selectedConversation}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `conversationId=eq.${selectedConversation}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((msg) => msg.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // For mock conversations, just add locally
    if (isMockConversation(selectedConversation)) {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        text: newMessage || null,
        imageUrl: selectedImage,
        senderId: userId,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      setSelectedImage(null);
      return;
    }

    // For real conversations, send to API
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
        const message = await response.json();
        setMessages((prev) => [...prev, message]);
        setNewMessage("");
        setSelectedImage(null);
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

    if (diffDays === 0) {
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatMessageTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-zinc-800">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-100 dark:border-zinc-800 flex flex-col bg-gray-50/50 dark:bg-zinc-900">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-black">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {t("chat.title")}
          </h2>
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500"
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
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-800 dark:text-white border-0 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-zinc-700 transition"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">{t("chat.noConversations")}</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredConversations.map((conv) => {
                const isSelected = selectedConversation === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition text-left ${
                      isSelected
                        ? "bg-emerald-50 border-r-2 border-emerald-500 dark:bg-emerald-600/20"
                        : "hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100">
                        {conv.otherParticipant.avatar ? (
                          <img
                            src={conv.otherParticipant.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-emerald-700 font-semibold">
                            {conv.otherParticipant.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
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
                          <span className="text-xs text-gray-400 ml-2">
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
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-black">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-black">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-500/20">
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
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
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
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition">
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-linear-to-b from-gray-50 dark:from-zinc-900 to-white dark:to-black">
              {messages.map((message, index) => {
                const isOwn = message.senderId === userId;
                const showAvatar =
                  !isOwn &&
                  (index === 0 ||
                    messages[index - 1].senderId !== message.senderId);

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isOwn && (
                      <div className="w-8 mr-2">
                        {showAvatar && selectedConv.otherParticipant.avatar && (
                          <img
                            src={selectedConv.otherParticipant.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                      </div>
                    )}
                    <div className={`max-w-[65%] ${isOwn ? "order-1" : ""}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          isOwn
                            ? "bg-emerald-600 text-white rounded-br-md"
                            : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-bl-md shadow-sm border border-gray-100 dark:border-zinc-700"
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
                          <p className="text-[15px] leading-relaxed">
                            {message.text}
                          </p>
                        )}
                      </div>
                      <p
                        className={`text-[11px] mt-1 ${
                          isOwn
                            ? "text-right text-gray-400 dark:text-zinc-500"
                            : "text-gray-400 dark:text-zinc-500 ml-1"
                        }`}
                      >
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-black">
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

              <form onSubmit={sendMessage} className="flex items-center gap-3">
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
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition disabled:opacity-50"
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
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t("chat.typeMessage")}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 dark:text-white border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-zinc-700 transition pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading || (!newMessage.trim() && !selectedImage)}
                  className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 flex items-center justify-center bg-linear-to-b from-gray-50 dark:from-zinc-900 to-white dark:to-black">
      <div className="text-center px-6">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-emerald-600 dark:text-emerald-400"
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
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t("chat.yourMessages")}
        </h3>
        <p className="text-gray-500 dark:text-zinc-400 max-w-sm">
          {t("chat.selectConversation")}
        </p>
      </div>
    </div>
  );
}
