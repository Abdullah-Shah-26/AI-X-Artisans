"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { CustomerHeader } from "@/components/layout/CustomerHeader";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
  craftTradition: string | null;
  artisan: { id: string; name: string; avatar: string | null };
  hasCertificate?: boolean;
  isDemo?: boolean;
}

interface MarketplaceClientProps {
  products: Product[];
  categories: string[];
  initialCategory: string;
  initialSearch: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    originalRole?: string;
    isDemo?: boolean;
  } | null;
  favoriteIds: string[];
  cartCount: number;
  isGuestMode?: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

// SVG Icons for categories
const CategoryIcon = ({ category }: { category: string }) => {
  const icons: Record<string, React.ReactNode> = {
    All: (
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
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
    Pottery: (
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
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    Textiles: (
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
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
    Jewelry: (
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    "Home Decor": (
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    Paintings: (
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
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    Decor: (
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
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
    Sarees: (
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  };
  return icons[category] || icons.All;
};

export function MarketplaceClient({
  products,
  categories,
  initialCategory,
  initialSearch,
  user,
  favoriteIds: initialFavorites,
  cartCount: initialCartCount,
  isGuestMode = false,
}: MarketplaceClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [favorites, setFavorites] = useState<string[]>(initialFavorites);
  const [cartCount, setCartCount] = useState(initialCartCount);
  const [view, setView] = useState<"products" | "favorites" | "offers">(
    "products",
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);

    // Check URL for view parameter on client side only
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get("view");
      if (viewParam === "favorites") {
        setView("favorites");
      } else if (viewParam === "offers") {
        setView("offers");
      }
    }

    // Load guest cart and favorites from localStorage if in guest mode
    if (isGuestMode && typeof window !== "undefined") {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartCount(guestCart.length);

      const guestFavorites = JSON.parse(
        localStorage.getItem("guestFavorites") || "[]",
      );
      setFavorites(guestFavorites);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    // For offers view, we'll show an empty state since offers are tracked separately
    if (view === "offers") {
      return false;
    }

    const matchesView = view === "products" || favorites.includes(p.id);
    return matchesCategory && matchesSearch && matchesView;
  });

  const toggleFavorite = async (productId: string, isDemo?: boolean) => {
    if (!user) {
      router.push("/login");
      return;
    }
    const isFav = favorites.includes(productId);
    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== productId) : [...prev, productId],
    );

    // Guest mode - store in localStorage
    if (user.id === "guest-user" || user.id === "guest" || isDemo) {
      const guestFavorites = JSON.parse(
        localStorage.getItem("guestFavorites") || "[]",
      );
      if (isFav) {
        const index = guestFavorites.indexOf(productId);
        if (index > -1) {
          guestFavorites.splice(index, 1);
        }
      } else {
        if (!guestFavorites.includes(productId)) {
          guestFavorites.push(productId);
        }
      }
      localStorage.setItem("guestFavorites", JSON.stringify(guestFavorites));
      return;
    }

    // Real user - API call
    try {
      await fetch("/api/favorites", {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = async (productId: string, isDemo?: boolean) => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Guest mode - store in localStorage
    if (user.id === "guest-user" || user.id === "guest" || isDemo) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      if (!guestCart.includes(productId)) {
        guestCart.push(productId);
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartCount(guestCart.length);
      }
      return;
    }

    // Real user - API call
    setCartCount((prev) => prev + 1);
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <CustomerHeader
        user={user}
        cartCount={cartCount}
        favoritesCount={favorites.length}
        showViewToggle={true}
        currentView={view}
        onViewChange={setView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Mobile Search Bar - Below Header */}
      <div className="md:hidden sticky top-[57px] z-40 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="p-2.5 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition shrink-0"
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>

          <div className="relative flex-1">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search handcrafted products..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Cart Icon - Mobile only */}
          <Link
            href="/cart"
            className="p-2.5 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition relative shrink-0"
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
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Categories - Hidden on mobile, shown on desktop */}
        <div className="mb-10 hidden md:block">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-4 text-center">
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500"
                }`}
              >
                <CategoryIcon category={cat} />
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {view === "favorites"
                ? "Your Favorites"
                : activeCategory === "All"
                  ? "All Products"
                  : activeCategory}
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {view === "offers" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                )}
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {view === "favorites"
                ? "No favorites yet"
                : view === "offers"
                  ? "No offers yet"
                  : "No products found"}
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 text-sm">
              {view === "favorites"
                ? "Start adding products to your favorites!"
                : view === "offers"
                  ? "Make an offer on a product to see it here. Visit product details and use the 'Make an Offer' feature!"
                  : "Try a different category or search term"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={() =>
                  toggleFavorite(product.id, product.isDemo)
                }
                onAddToCart={() => addToCart(product.id, product.isDemo)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Filter Modal - Mobile Only */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilterModal(false)}
          />

          {/* Modal Content - Slides up from bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filter by Category
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
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

            {/* Category List */}
            <div className="p-4 space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setShowFilterModal(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all ${
                    activeCategory === cat
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  <CategoryIcon category={cat} />
                  <span className="text-base font-medium flex-1">{cat}</span>
                  {activeCategory === cat && (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
}) {
  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 hover:-translate-y-0.5 transition-all duration-300">
      <Link
        href={`/marketplace/${product.id}`}
        className="block relative aspect-4/3 overflow-hidden bg-gray-100 dark:bg-zinc-800"
      >
        <img
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/90 dark:bg-zinc-900/90 text-gray-600 dark:text-zinc-400 opacity-0 group-hover:opacity-100"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill={isFavorite ? "currentColor" : "none"}
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
        </button>

        {/* Craft Badge */}
        {product.craftTradition && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md">
            <span className="text-[10px] font-medium text-white">
              {product.craftTradition}
            </span>
          </div>
        )}

        {/* Certificate Badge */}
        {product.hasCertificate && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-emerald-600/90 backdrop-blur-sm rounded-md flex items-center gap-1">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <span className="text-[10px] font-medium text-white">
              Certified
            </span>
          </div>
        )}
      </Link>

      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
              {product.artisan.avatar ? (
                <img
                  src={product.artisan.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-[8px] font-medium text-gray-600 dark:text-zinc-400">
                  {product.artisan.name.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-500 dark:text-zinc-500 truncate max-w-[60px]">
              {product.artisan.name}
            </span>
          </div>
        </div>

        <h3 className="font-medium text-gray-900 dark:text-white text-sm leading-tight mb-2 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={onAddToCart}
            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
