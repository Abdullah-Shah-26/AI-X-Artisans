"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    artisan: { id: string; name: string };
  };
}

interface CheckoutClientProps {
  items: CartItem[];
  user: { name: string; email: string } | null;
  isDemo?: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export function CheckoutClient({
  items: initialItems,
  user,
  isDemo = false,
}: CheckoutClientProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(initialItems);
  const [step, setStep] = useState<"shipping" | "payment" | "success">(
    "shipping",
  );

  // Load cart from localStorage for demo users
  useEffect(() => {
    if (isDemo && typeof window !== "undefined") {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

      // All demo products - must match CartClient
      const demoProducts = [
        {
          id: "demo-1",
          name: "Handwoven Basket",
          price: 3500,
          image:
            "https://handmadecrafts.simdif.com/images/public/sd_64735c47e5d9c.jpg?no_cache=1685289084",
          artisan: { id: "demo-a1", name: "Lakshmi Devi" },
        },
        {
          id: "demo-2",
          name: "Brass Oil Lamp",
          price: 850,
          image:
            "https://m.media-amazon.com/images/S/aplus-media/sc/600659ea-53c6-4da5-86d4-9ba14feea523.__CR0,210,1007,1007_PT0_SX300_V1___.jpg",
          artisan: { id: "demo-a2", name: "Ravi Kumar" },
        },
        {
          id: "demo-3",
          name: "Ceramic Tea Set",
          price: 3200,
          image:
            "https://siggyhandmade.com/cdn/shop/products/CeramicTeaSet.jpg?v=1663196891",
          artisan: { id: "demo-a3", name: "Meena Sharma" },
        },
        {
          id: "demo-4",
          name: "Wooden Jewelry Box",
          price: 2800,
          image:
            "https://i.etsystatic.com/37334871/r/il/7919ab/4350255523/il_570xN.4350255523_gv3a.jpg",
          artisan: { id: "demo-a4", name: "Priya Singh" },
        },
        {
          id: "demo-5",
          name: "Terracotta Planter",
          price: 850,
          image:
            "https://m.media-amazon.com/images/I/71VhZ0bxLLL._AC_UF350,350_QL80_.jpg",
          artisan: { id: "demo-a5", name: "Anjali Patel" },
        },
        {
          id: "demo-6",
          name: "Bamboo Basket Set",
          price: 2800,
          image:
            "https://www.nicobar.com/cdn/shop/products/1518630607A46A7142_ea3907a7-1284-4616-973b-3aecb49cf199.jpg?v=1710310859",
          artisan: { id: "demo-a6", name: "Gopal Das" },
        },
        {
          id: "demo-7",
          name: "Handcrafted Clay Pot",
          price: 650,
          image:
            "https://i.pinimg.com/736x/9f/1c/1e/9f1c1ed6528a3f362bacddc7cb181545.jpg",
          artisan: { id: "demo-a7", name: "Kavita Reddy" },
        },
        {
          id: "demo-8",
          name: "Handwoven Cotton Rug",
          price: 4500,
          image:
            "https://images.unsplash.com/photo-1600166898405-da9535204843?w=500",
          artisan: { id: "demo-a8", name: "Suresh Yadav" },
        },
        {
          id: "demo-9",
          name: "Handwoven Silk Saree",
          price: 15000,
          image:
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
          artisan: { id: "demo-a1", name: "Lakshmi Devi" },
        },
        {
          id: "demo-10",
          name: "Block Printed Table Runner",
          price: 980,
          image:
            "https://www.shopinnerchild.com/cdn/shop/files/ICstudio_-5.jpg?v=1749500538&width=2686",
          artisan: { id: "demo-a10", name: "Ramesh Joshi" },
        },
      ];

      const cartItems = guestCart
        .map((productId: string, index: number) => {
          const product = demoProducts.find((p) => p.id === productId);
          if (!product) return null;
          return {
            id: `guest-item-${index}`,
            quantity: 1,
            product,
          };
        })
        .filter(Boolean);

      if (cartItems.length > 0) {
        setItems(cartItems as CartItem[]);
      } else {
        // No items in cart, redirect back
        router.push("/cart");
      }
    }
  }, [isDemo, router]);

  // Form state
  const [fullName, setFullName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = 150;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));

    // Clear cart after "successful" payment
    if (isDemo) {
      // Clear localStorage cart for demo users
      localStorage.removeItem("guestCart");
    } else {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clearAll: true }),
        });
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    }

    setStep("success");
    setLoading(false);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full text-center ring-1 ring-gray-200 dark:ring-zinc-800">
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
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isDemo ? "Demo Order Complete!" : "Order Placed!"}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 mb-6">
            {isDemo ? (
              <>
                This is a demo checkout. Sign up to place real orders and
                support Indian artisans!
              </>
            ) : (
              <>
                Thank you for supporting Indian artisans. Your order #
                {Math.random().toString(36).substr(2, 9).toUpperCase()} has been
                confirmed.
              </>
            )}
          </p>
          <div className="space-y-3">
            {isDemo ? (
              <Link
                href="/signup"
                className="block w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium"
              >
                Sign Up Now
              </Link>
            ) : (
              <Link
                href="/profile"
                className="block w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium"
              >
                View Orders
              </Link>
            )}
            <Link
              href="/marketplace"
              className="block w-full px-6 py-3 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/marketplace" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-emerald-500/30">
                <img
                  src="/image.png"
                  alt="AIxArtisans"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                AIxArtisans
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                {theme === "dark" ? (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              <Link
                href="/cart"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Checkout
        </h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`flex items-center gap-2 ${
              step === "shipping"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "shipping"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              1
            </div>
            <span className="font-medium">Shipping</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
          <div
            className={`flex items-center gap-2 ${
              step === "payment"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "payment"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 dark:bg-zinc-800"
              }`}
            >
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <form
                onSubmit={handleShippingSubmit}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 ring-1 ring-gray-200 dark:ring-zinc-800"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Shipping Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-500 dark:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                      Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="123 Craft Lane, Artisan Colony"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Jaipur"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                      placeholder="302001"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium flex items-center justify-center gap-2"
                >
                  Continue to Payment
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </form>
            )}

            {step === "payment" && (
              <form
                onSubmit={handlePaymentSubmit}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 ring-1 ring-gray-200 dark:ring-zinc-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Payment Information
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Edit Shipping
                  </button>
                </div>
                {/* Shipping Summary */}
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 dark:text-zinc-400">
                    Shipping to:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {fullName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">
                    {address}, {city} - {pincode}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value.replace(/\D/g, "").slice(0, 16),
                        )
                      }
                      required
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) =>
                          setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
                        }
                        required
                        placeholder="123"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Pay {formatPrice(total)}
                    </>
                  )}
                </button>
                <p className="mt-4 text-xs text-center text-gray-500 dark:text-zinc-500">
                  Your payment is secured with 256-bit SSL encryption
                </p>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 ring-1 ring-gray-200 dark:ring-zinc-800 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                  <span>Shipping (est.)</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                  <span>Tax (est.)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-zinc-800 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
