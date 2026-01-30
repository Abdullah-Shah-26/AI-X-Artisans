"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { CustomerHeader } from "@/components/layout/CustomerHeader";

type StyleType = "minimalist" | "bohemian" | "extravagant" | "classic";
type StylistStep = "select" | "generating" | "result";

interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string | null;
  price: number;
  image: string;
  category: string;
  craftTradition: string | null;
  dateAdded: Date;
  artisan: {
    id: string;
    name: string;
    avatar: string | null;
    artisanProfile: {
      location: string | null;
      bio: string | null;
      story: string | null;
      craftTypes: string[];
      yearsOfExperience: number | null;
    } | null;
    _count: { products: number };
  };
  certificate: { id: string; artworkName: string } | null;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  artisan: { name: string; avatar: string | null };
}

interface PriceOffer {
  id: string;
  offerAmount: number;
  status: string;
  counterAmount: number | null;
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: RelatedProduct[];
  user: { id: string; role: string | null } | null;
  userOffer: PriceOffer | null;
  isFavorite: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export function ProductDetailClient({
  product,
  relatedProducts,
  user,
  userOffer,
  isFavorite: initialFavorite,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [favorite, setFavorite] = useState(initialFavorite);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState(
    Math.round(product.price * 0.7),
  );
  const [offer, setOffer] = useState(userOffer);
  const [offerLoading, setOfferLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Prevent hydration mismatch and load cart/favorites count
  useEffect(() => {
    setMounted(true);

    // Load cart and favorites count from localStorage for guest users
    if (user?.id === "guest-user" && typeof window !== "undefined") {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartCount(guestCart.length);

      const guestFavorites = JSON.parse(
        localStorage.getItem("guestFavorites") || "[]",
      );
      setFavoritesCount(guestFavorites.length);
    }
  }, [user]);

  const minOffer = Math.round(product.price * 0.7);
  const maxOffer = product.price;

  // AI Stylist State
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [stylistStep, setStylistStep] = useState<StylistStep>("select");
  const [styledImageUrl, setStyledImageUrl] = useState<string | null>(null);
  const [stylistError, setStylistError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);

    // Guest mode simulation - store in localStorage
    if (user.id === "guest-user") {
      setTimeout(() => {
        // Get current cart from localStorage
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        // Add product if not already in cart
        if (!guestCart.includes(product.id)) {
          guestCart.push(product.id);
          localStorage.setItem("guestCart", JSON.stringify(guestCart));
          // Update cart count state
          setCartCount(guestCart.length);
        }

        setAddedToCart(true);
        setLoading(false);
        setTimeout(() => {
          setAddedToCart(false);
        }, 1000);
      }, 600);
      return;
    }

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
        // Refresh to update cart count
        router.refresh();
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const newFav = !favorite;
    setFavorite(newFav);

    // Guest mode simulation - store in localStorage
    if (user.id === "guest-user") {
      const guestFavorites = JSON.parse(
        localStorage.getItem("guestFavorites") || "[]",
      );
      if (newFav) {
        if (!guestFavorites.includes(product.id)) {
          guestFavorites.push(product.id);
        }
      } else {
        const index = guestFavorites.indexOf(product.id);
        if (index > -1) {
          guestFavorites.splice(index, 1);
        }
      }
      localStorage.setItem("guestFavorites", JSON.stringify(guestFavorites));
      // Update favorites count state
      setFavoritesCount(guestFavorites.length);
      return;
    }

    try {
      await fetch("/api/favorites", {
        method: newFav ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
    } catch (e) {
      setFavorite(!newFav);
      console.error(e);
    }
  };

  const handleSubmitOffer = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setOfferLoading(true);

    // Guest mode simulation
    if (user.id === "guest-user") {
      setTimeout(() => {
        setOffer({
          id: "guest-offer",
          offerAmount,
          status: "PENDING",
          counterAmount: null,
        });
        setShowOfferModal(false);
        setOfferLoading(false);
      }, 800);
      return;
    }

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          offerAmount,
          artisanId: product.artisan.id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOffer(data);
        setShowOfferModal(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOfferLoading(false);
    }
  };

  const handleMessageArtisan = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Guest mode simulation - redirect to demo connections
    if (user.id === "guest-user") {
      router.push("/dashboard/connections");
      return;
    }

    try {
      // Create or get conversation with artisan
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId: product.artisan.id }),
      });

      if (res.ok) {
        const conversation = await res.json();
        // Redirect to connections with this conversation
        router.push(`/dashboard/connections?conversation=${conversation.id}`);
      }
    } catch (e) {
      console.error(e);
      // Fallback to general connections page
      router.push("/dashboard/connections");
    }
  };

  // AI Stylist handlers
  const imageUrlToBase64 = async (
    url: string,
  ): Promise<{ b64: string; mime: string }> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = (reader.result as string).split(",")[1];
        resolve({ b64: base64data, mime: blob.type });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleStyleSelect = async (style: StyleType) => {
    setStylistStep("generating");
    setStylistError(null);

    // Hardcoded demo styled images for demo products
    const demoStyledImages: Record<string, Record<StyleType, string>> = {
      "demo-9": {
        // Handwoven Silk Saree - Design transformations
        minimalist: "/demo/saree-minimalist.png",
        bohemian: "/demo/saree-bohemian.png",
        extravagant: "/demo/saree-extravagant.png",
        classic: "/demo/saree-classic.png",
      },
    };

    // Check if this is a demo product with hardcoded images
    if (product.id.startsWith("demo-") && demoStyledImages[product.id]) {
      // Simulate API delay for realism
      setTimeout(() => {
        setStyledImageUrl(demoStyledImages[product.id][style]);
        setStylistStep("result");
      }, 2000);
      return;
    }

    try {
      const res = await fetch("/api/ai/style-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: product.image,
          style,
          productName: product.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to style image");
      }

      if (data.imageUrl) {
        setStyledImageUrl(data.imageUrl);
        setStylistStep("result");
      } else {
        throw new Error("No image returned");
      }
    } catch (error: any) {
      console.error("AI Stylist Error:", error);
      setStylistError(
        error.message || "Failed to style image. Please try again.",
      );
      setStylistStep("select");
    }
  };

  const handleCloseStylist = () => {
    setIsStylistOpen(false);
    setTimeout(() => {
      setStylistStep("select");
      setStyledImageUrl(null);
      setStylistError(null);
    }, 300);
  };

  const getOfferStatusBadge = () => {
    if (!offer) return null;
    const statusColors: Record<string, string> = {
      PENDING:
        "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400",
      ACCEPTED:
        "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
      REJECTED: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
      COUNTERED:
        "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          statusColors[offer.status]
        }`}
      >
        {offer.status === "COUNTERED"
          ? `Counter: ${formatPrice(offer.counterAmount!)}`
          : offer.status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back button + Logo */}
            <div className="flex items-center gap-3">
              {/* Back button */}
              <Link
                href="/marketplace"
                className="p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
                title="Back to Marketplace"
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
              </Link>

              {/* Logo */}
              <Link href="/marketplace" className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg overflow-hidden border border-emerald-500/30">
                  <img
                    src="/image.png"
                    alt="AIxArtisans"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-base md:text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  AIxArtisans
                </span>
              </Link>
            </div>

            {/* Right: Favorite + Cart */}
            <div className="flex items-center gap-2">
              {/* Favorite button - Links to marketplace favorites */}
              {user && (
                <Link
                  href="/marketplace?view=favorites"
                  className="p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition relative"
                  title="View Favorites"
                >
                  <svg
                    className="w-5 h-5"
                    fill={favorite ? "currentColor" : "none"}
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
                  {favoritesCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart button */}
              {user && (
                <Link
                  href="/cart"
                  className="p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition relative"
                  title="View Cart"
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
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900 ring-1 ring-gray-200 dark:ring-zinc-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.certificate && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl ring-1 ring-emerald-200 dark:ring-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0"
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
                    <div>
                      <p className="font-medium text-emerald-700 dark:text-emerald-400">
                        Authenticity Certified
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-500">
                        This product has a heritage certificate
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/verify/auth/${product.certificate.id}`}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium whitespace-nowrap"
                  >
                    View Certificate
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {product.craftTradition && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-full">
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {product.craftTradition}
              </span>
            )}
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-500 mb-1">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  <defs>
                    <linearGradient
                      id="partialStar"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="80%" stopColor="currentColor" />
                      <stop offset="80%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
                  4.8
                </span>
                <span className="text-sm text-gray-400 dark:text-zinc-600 mx-1">
                  •
                </span>
                <span className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-medium">
                  128 reviews
                </span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatPrice(product.price)}
            </div>

            {/* Artisan Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 ring-1 ring-gray-200 dark:ring-zinc-800">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <img
                    src={
                      product.artisan.avatar ||
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200"
                    }
                    alt={product.artisan.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {product.artisan.name}
                  </h3>
                  {product.artisan.artisanProfile?.location && (
                    <p className="text-sm text-gray-500 dark:text-zinc-500 flex items-center gap-1">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {product.artisan.artisanProfile.location}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-zinc-500">
                    <span>{product.artisan._count.products} Products</span>
                    {product.artisan.artisanProfile?.yearsOfExperience && (
                      <span>
                        {product.artisan.artisanProfile.yearsOfExperience}+
                        Years Exp
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/artisan/${product.artisan.id}`}
                  className="px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition"
                >
                  View Profile
                </Link>
              </div>
              {product.artisan.artisanProfile?.bio && (
                <p className="mt-3 text-sm text-gray-600 dark:text-zinc-400 line-clamp-2">
                  {product.artisan.artisanProfile.bio}
                </p>
              )}
            </div>

            {/* Bargain Section */}
            {(user?.role?.toLowerCase() === "customer" ||
              user?.id === "guest-user") && (
              <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 rounded-2xl p-5 ring-1 ring-purple-200 dark:ring-purple-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Make an Offer
                  </h3>
                  {offer && getOfferStatusBadge()}
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                  This item supports bargaining. The artisan's price is{" "}
                  {formatPrice(product.price)}. Offer what you feel is fair.
                </p>
                {offer ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl">
                      <span className="text-sm text-gray-600 dark:text-zinc-400">
                        Your Offer
                      </span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {formatPrice(offer.offerAmount)}
                      </span>
                    </div>
                    {offer.status === "ACCEPTED" && (
                      <button
                        onClick={handleAddToCart}
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium flex items-center justify-center gap-2"
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
                        Buy at {formatPrice(offer.offerAmount)}
                      </button>
                    )}
                    {offer.status === "COUNTERED" && (
                      <button className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">
                        Accept Counter Offer:{" "}
                        {formatPrice(offer.counterAmount!)}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500 dark:text-zinc-500">
                          {formatPrice(minOffer)}
                        </span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          Your Offer: {formatPrice(offerAmount)}
                        </span>
                        <span className="text-gray-500 dark:text-zinc-500">
                          {formatPrice(maxOffer)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={minOffer}
                        max={maxOffer}
                        step={10}
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>
                    <button
                      onClick={handleSubmitOffer}
                      disabled={offerLoading}
                      className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {offerLoading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
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
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Submit Offer
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* AI Stylist Button */}
            {(user?.role?.toLowerCase() === "customer" ||
              user?.id === "guest-user") && (
              <button
                onClick={() => setIsStylistOpen(true)}
                className="w-full py-3.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                {product.category === "Textiles" &&
                product.name.toLowerCase().includes("saree")
                  ? "AI Stylist - Transform Saree Design"
                  : "AI Stylist - Visualize in Your Space"}
              </button>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={loading || addedToCart}
                className={`flex-1 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
                  addedToCart
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                } disabled:opacity-50`}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : addedToCart ? (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Added!
                  </>
                ) : (
                  <>
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
                    Add to Cart
                  </>
                )}
              </button>

              {/* Message Artisan Button */}
              {user && (
                <button
                  onClick={handleMessageArtisan}
                  className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition"
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Message Artisan</span>
                  <span className="sm:hidden">Message</span>
                </button>
              )}

              <button
                onClick={handleToggleFavorite}
                className={`sm:w-auto w-full py-3.5 px-4 rounded-xl ring-1 transition flex items-center justify-center gap-2 ${
                  favorite
                    ? "bg-red-50 dark:bg-red-500/10 ring-red-200 dark:ring-red-500/30 text-red-500"
                    : "ring-gray-200 dark:ring-zinc-700 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
                title={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <svg
                  className="w-5 h-5"
                  fill={favorite ? "currentColor" : "none"}
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
                <span className="sm:hidden font-medium">
                  {favorite ? "Remove from Favorites" : "Add to Favorites"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Story */}
        {(product.longDescription || product.artisan.artisanProfile?.story) && (
          <div className="mt-12 bg-white dark:bg-zinc-900 rounded-2xl p-8 ring-1 ring-gray-200 dark:ring-zinc-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              The Story Behind This Craft
            </h2>
            {product.longDescription && (
              <p className="text-gray-600 dark:text-zinc-400 leading-relaxed mb-6">
                {product.longDescription}
              </p>
            )}
            {product.artisan.artisanProfile?.story && (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-6">
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
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
                  About {product.artisan.name}
                </h3>
                <p className="text-gray-600 dark:text-zinc-400">
                  {product.artisan.artisanProfile.story}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              More from {product.category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/marketplace/${related.id}`}
                  className="group bg-white dark:bg-zinc-900 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-zinc-800 hover:ring-emerald-500/50 transition"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {related.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">
                      by {related.artisan.name}
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      {formatPrice(related.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* AI Stylist Modal */}
      {isStylistOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800">
            {/* Clean Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    AI Stylist
                  </h2>
                  <p className="text-sm text-purple-100">
                    Transform your product design with AI
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseStylist}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(90vh-88px)]">
              {stylistStep === "select" && (
                <div className="space-y-6">
                  {stylistError && (
                    <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-500/20 flex items-start gap-3">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{stylistError}</span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Choose Your Style
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
                      Select a design aesthetic to transform your product
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        id: "minimalist",
                        name: "Minimalist",
                        desc: "Clean lines, subtle patterns",
                        icon: (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                          </svg>
                        ),
                        color:
                          "bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400",
                      },
                      {
                        id: "bohemian",
                        name: "Bohemian",
                        desc: "Rich textures, artistic flair",
                        icon: (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                            />
                          </svg>
                        ),
                        color:
                          "bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
                      },
                      {
                        id: "extravagant",
                        name: "Extravagant",
                        desc: "Luxurious, ornate details",
                        icon: (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                          </svg>
                        ),
                        color:
                          "bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400",
                      },
                      {
                        id: "classic",
                        name: "Classic",
                        desc: "Traditional, timeless beauty",
                        icon: (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ),
                        color:
                          "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                      },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => handleStyleSelect(style.id as StyleType)}
                        className="group p-6 rounded-xl border-2 border-gray-200 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg text-center transition-all duration-200 bg-white dark:bg-zinc-800"
                      >
                        <div
                          className={`w-12 h-12 mx-auto mb-3 rounded-xl ${style.color} flex items-center justify-center transition-transform group-hover:scale-110`}
                        >
                          {style.icon}
                        </div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                          {style.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-zinc-500">
                          {style.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {stylistStep === "generating" && (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="relative mb-8">
                    <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Creating your styled product
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">
                    This may take a moment...
                  </p>
                </div>
              )}

              {stylistStep === "result" && styledImageUrl && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      Your Transformed Product
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-zinc-400">
                      Compare the original design with your AI-styled version
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Original Image */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        <h4 className="font-medium text-xs text-gray-700 dark:text-zinc-300">
                          Original Design
                        </h4>
                      </div>
                      <div className="relative bg-gray-50 dark:bg-zinc-800 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                        <img
                          src={product.image}
                          alt="Original"
                          className="w-full h-auto max-h-[50vh] object-contain"
                        />
                      </div>
                    </div>

                    {/* Styled Image */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <h4 className="font-medium text-xs text-purple-700 dark:text-purple-400">
                          AI Styled Design
                        </h4>
                      </div>
                      <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-500/5 dark:to-indigo-500/5 rounded-lg overflow-hidden border-2 border-purple-200 dark:border-purple-500/30">
                        <img
                          src={styledImageUrl}
                          alt="Styled"
                          className="w-full h-auto max-h-[50vh] object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3 border-t border-gray-200 dark:border-zinc-800">
                    <button
                      onClick={() => setStylistStep("select")}
                      className="px-5 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 font-medium transition-colors flex items-center justify-center gap-2 text-sm"
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Try Another Style
                    </button>
                    <a
                      href={styledImageUrl}
                      download={`${product.name}-styled.png`}
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download Styled Image
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
