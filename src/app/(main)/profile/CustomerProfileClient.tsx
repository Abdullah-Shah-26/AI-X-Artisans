"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { CustomerHeader } from "@/components/layout/CustomerHeader";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  createdAt: Date;
}

interface CustomerProfileClientProps {
  user: User;
  ordersCount: number;
  favoritesCount: number;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

// Demo data
const demoOrders = [
  {
    id: "ORD-001",
    product: "Handwoven Silk Saree",
    price: 10500,
    status: "Delivered",
    date: "Dec 15, 2024",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100",
  },
  {
    id: "ORD-002",
    product: "Blue Pottery Vase",
    price: 2800,
    status: "In Transit",
    date: "Dec 12, 2024",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=100",
  },
  {
    id: "ORD-003",
    product: "Brass Dhokra Elephant",
    price: 3500,
    status: "Processing",
    date: "Dec 10, 2024",
    image:
      "https://coshal.com/cdn/shop/files/Dhokra_Brass_Elephant_With_Bells_CD88_4.png?v=1701164800&width=100",
  },
];

const demoFavorites = [
  {
    id: "demo-10",
    name: "Block Printed Table Runner",
    price: 980,
    image:
      "https://www.shopinnerchild.com/cdn/shop/files/ICstudio_-5.jpg?v=1749500538&width=2686",
  },
  {
    id: "demo-2",
    name: "Brass Oil Lamp",
    price: 850,
    image:
      "https://m.media-amazon.com/images/S/aplus-media/sc/600659ea-53c6-4da5-86d4-9ba14feea523.__CR0,210,1007,1007_PT0_SX300_V1___.jpg",
  },
];

const demoBargains = [
  {
    id: "OFF-001",
    product: "Handpainted Terracotta Vase",
    originalPrice: 1300,
    offerPrice: 1180,
    status: "Accepted",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300",
  },
  {
    id: "OFF-002",
    product: "Carved Wooden Elephant",
    originalPrice: 2500,
    offerPrice: 2100,
    status: "Pending",
    image:
      "https://coshal.com/cdn/shop/files/Dhokra_Brass_Elephant_With_Bells_CD88_4.png?v=1701164800&width=100",
  },
  {
    id: "OFF-003",
    product: "Handwoven Silk Saree",
    originalPrice: 15000,
    offerPrice: 10500,
    status: "Accepted",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100",
  },
];

export function CustomerProfileClient({
  user,
  ordersCount,
  favoritesCount,
}: CustomerProfileClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "favorites" | "settings" | "offers"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle URL parameter for tab navigation
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (
      tab &&
      ["profile", "orders", "favorites", "settings", "offers"].includes(tab)
    ) {
      setActiveTab(
        tab as "profile" | "orders" | "favorites" | "settings" | "offers",
      );
    }
  }, [searchParams]);

  // Form state
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Initialize from props and localStorage
  useEffect(() => {
    // Guest mode
    if (user.id === "guest-user") {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartCount(guestCart.length);
      const guestFavorites = JSON.parse(
        localStorage.getItem("guestFavorites") || "[]",
      );
      // Merge with demo favorites for display if needed, but for now just use storage
      setFavorites(guestFavorites);
    }
  }, [user.id]);

  const handleAddToCart = async (productId: string) => {
    if (user.id === "guest-user" || productId.startsWith("demo-")) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      if (!guestCart.includes(productId)) {
        guestCart.push(productId);
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartCount(guestCart.length);
      }
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        setCartCount((prev) => prev + 1);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    const isFav = favorites.includes(productId);
    const newFavorites = isFav
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(newFavorites);

    if (user.id === "guest-user" || productId.startsWith("demo-")) {
      localStorage.setItem("guestFavorites", JSON.stringify(newFavorites));
      return;
    }

    try {
      await fetch("/api/favorites", {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
      setFavorites(favorites); // Revert
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address, city, pincode }),
      });
      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      }
    } catch {
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <CustomerHeader
        user={{
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role.toLowerCase(),
        }}
        cartCount={cartCount}
        favoritesCount={favorites.length || favoritesCount}
        showViewToggle={false}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Profile Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-28 h-28 rounded-full mx-auto overflow-hidden ring-4 ring-emerald-500/20">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-3 border-white dark:border-zinc-900">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Valued Customer
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                {user.email}
              </p>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800 overflow-hidden">
              <nav className="divide-y divide-gray-100 dark:divide-zinc-800">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left transition ${
                    activeTab === "profile"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-medium text-sm">
                    Profile Information
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left transition ${
                    activeTab === "orders"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="font-medium text-sm">Orders</span>
                  <span className="ml-auto bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {ordersCount}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left transition ${
                    activeTab === "favorites"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="font-medium text-sm">Favorites</span>
                  <span className="ml-auto bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {favoritesCount || demoFavorites.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("offers")}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left transition ${
                    activeTab === "offers"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="font-medium text-sm">Offers</span>
                  <span className="ml-auto bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {demoBargains.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left transition ${
                    activeTab === "settings"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-medium text-sm">Account Settings</span>
                </button>
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-4">
                Quick Stats
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">
                    Total Orders
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {ordersCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">
                    Total Spent
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(3500)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">
                    Member Since
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {memberSince}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Profile Information
                    </h3>
                    {!isEditing && user.id !== "guest-user" && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <p className="px-4 py-3 bg-gray-100 dark:bg-zinc-800/50 rounded-xl text-gray-500 dark:text-zinc-500">
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-900 dark:text-white">
                            {phone || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Shipping Details
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Address
                        </label>
                        {isEditing ? (
                          <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="123 Craft Lane, Artisan Colony"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-900 dark:text-white">
                            {address || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                            City
                          </label>
                          {isEditing ? (
                            <input
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="Jaipur"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-900 dark:text-white">
                              {city || "Not provided"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-2">
                            Pincode
                          </label>
                          {isEditing ? (
                            <input
                              value={pincode}
                              onChange={(e) => setPincode(e.target.value)}
                              placeholder="302001"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-900 dark:text-white">
                              {pincode || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-5 py-2.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Recent Orders
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {demoOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition"
                    >
                      <img
                        src={order.image}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {order.product}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">
                          {order.id} • {order.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatPrice(order.price)}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                              : order.status === "In Transit"
                                ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                                : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {demoOrders.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-500 dark:text-zinc-400 mb-4">
                      Start shopping to see your orders here
                    </p>
                    <Link
                      href="/marketplace"
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
                    >
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Favorites
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {demoFavorites.map((item) => (
                      <Link
                        key={item.id}
                        href={`/marketplace/${item.id}`}
                        className="group"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-2 relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <button
                            onClick={() => handleToggleFavorite(item.id)}
                            className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm transition ${
                              favorites.includes(item.id) ||
                              user.id === "guest-user"
                                ? "bg-red-500 text-white"
                                : "bg-white dark:bg-zinc-900 text-gray-400"
                            }`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                          {formatPrice(item.price)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Offers Tab */}
            {activeTab === "offers" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Offers & Requests
                    </h3>
                  </div>

                  <div className="p-6 space-y-8">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                        Accepted Offers
                      </h4>
                      <div className="space-y-4">
                        {demoBargains
                          .filter((b) => b.status === "Accepted")
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700 gap-4"
                            >
                              <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-zinc-700 shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.product}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h5 className="font-semibold text-gray-900 dark:text-white">
                                    {item.product}
                                  </h5>
                                  <div className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                                    <span>
                                      Original:{" "}
                                      <span className="line-through">
                                        {formatPrice(item.originalPrice)}
                                      </span>
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                      Your Offer: {formatPrice(item.offerPrice)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
                                  Accepted
                                </span>
                                <button
                                  onClick={() =>
                                    handleAddToCart(
                                      item.product === "Handwoven Silk Saree"
                                        ? "demo-9"
                                        : "demo-5",
                                    )
                                  }
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition whitespace-nowrap"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          ))}
                        {demoBargains.filter((b) => b.status === "Accepted")
                          .length === 0 && (
                          <p className="text-gray-500 dark:text-zinc-500 text-sm">
                            No accepted offers yet.
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                        Offer History
                      </h4>
                      <div className="space-y-4">
                        {demoBargains
                          .filter((b) => b.status !== "Accepted")
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 gap-4"
                            >
                              <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-zinc-700 shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.product}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h5 className="font-semibold text-gray-900 dark:text-white">
                                    {item.product}
                                  </h5>
                                  <div className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                                    <span>
                                      Original:{" "}
                                      <span className="line-through">
                                        {formatPrice(item.originalPrice)}
                                      </span>
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                      Your Offer: {formatPrice(item.offerPrice)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="w-full sm:w-auto flex justify-end">
                                <span
                                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                    item.status === "Pending"
                                      ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                                      : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        {demoBargains.filter((b) => b.status !== "Accepted")
                          .length === 0 && (
                          <p className="text-gray-500 dark:text-zinc-500 text-sm">
                            No offer history.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-zinc-800">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Account Settings
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">
                          Receive order updates and promotions
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-zinc-800">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          SMS Notifications
                        </p>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">
                          Get delivery updates via SMS
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-zinc-700">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-500/10 rounded-2xl p-6 ring-1 ring-red-200 dark:ring-red-500/20">
                  <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-400/80 mb-4">
                    Once you delete your account, there is no going back.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
