"use client";

import { useState } from "react";
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
    artisan: { id: string; name: string; avatar: string | null };
  };
}

interface CartClientProps {
  initialItems: CartItem[];
  isGuest?: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export function CartClient({ initialItems, isGuest = false }: CartClientProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState<string | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 150 : 0;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(productId);
    
    // Guest mode simulation
    if (isGuest) {
      setTimeout(() => {
        setItems((prev) =>
          prev.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        setLoading(null);
      }, 300);
      return;
    }

    try {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const removeItem = async (productId: string) => {
    setLoading(productId);

    // Guest mode simulation
    if (isGuest) {
      setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
        setLoading(null);
      }, 300);
      return;
    }

    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

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
                href="/marketplace"
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
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center ring-1 ring-gray-200 dark:ring-zinc-800">
            <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 mb-6">
              Discover unique handcrafted products from skilled artisans
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-4 ring-1 ring-gray-200 dark:ring-zinc-800 flex gap-4"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-28 h-28 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-500">
                          by {item.product.artisan.name}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        disabled={loading === item.product.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          disabled={
                            loading === item.product.id || item.quantity <= 1
                          }
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50"
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
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={loading === item.product.id}
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50"
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
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 ring-1 ring-gray-200 dark:ring-zinc-800 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                    <span>
                      Subtotal ({items.reduce((s, i) => s + i.quantity, 0)}{" "}
                      items)
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                    <span>Shipping (est.)</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                    <span>Tax (12%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition"
                >
                  Proceed to Checkout
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
                </Link>
                <p className="mt-4 text-xs text-center text-gray-500 dark:text-zinc-500">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
