"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { formatPrice, formatDate } from "@/lib/utils";
import { getDemoProducts } from "@/lib/demoStorage";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  craftTradition: string | null;
  image: string | null;
  dateAdded: Date;
  certificateId?: string | null;
  certificate?: { id: string; artworkName: string } | null;
}

interface ProductsClientProps {
  products: Product[];
  isDemo: boolean;
}

export function ProductsClient({
  products: initialProducts,
  isDemo,
}: ProductsClientProps) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadedProducts, setUploadedProducts] = useState<Set<string>>(
    new Set(),
  );

  const handleMarketplaceUpload = async (productId: string) => {
    setUploadingId(productId);
    try {
      // Dummy marketplace upload - simulates uploading to marketplace
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUploadedProducts((prev) => new Set([...prev, productId]));
      alert("Product successfully uploaded to marketplace!");
    } catch (error) {
      console.error("Error uploading to marketplace:", error);
      alert("Failed to upload product to marketplace");
    } finally {
      setUploadingId(null);
    }
  };

  useEffect(() => {
    // Load demo products from localStorage if in demo mode
    if (isDemo) {
      const demoProducts = getDemoProducts();
      if (demoProducts.length > 0) {
        // Merge with initial products, demo products first
        setProducts([...demoProducts, ...initialProducts]);
      }
    }
  }, [isDemo, initialProducts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("products.title")}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400">
            {`${products.length} ${t("products.productsListed")}`}
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
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
          {t("products.addProduct")}
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <div className="h-48 bg-gray-100 dark:bg-zinc-800 relative">
              <img
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              {product.craftTradition && (
                <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                  {product.craftTradition}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1 line-clamp-1 text-gray-900 dark:text-white">
                {product.name}
              </h3>
              <p className="text-gray-500 dark:text-zinc-400 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-gray-400 dark:text-zinc-500">
                  {formatDate(product.dateAdded)}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Link
                  href={`/dashboard/products/${product.id}/edit`}
                  className="flex-1 text-center py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition text-sm"
                >
                  {t("products.edit")}
                </Link>
                <Link
                  href={`/marketplace/${product.id}`}
                  className="flex-1 text-center py-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition text-sm"
                >
                  {t("products.view")}
                </Link>
              </div>

              {/* Marketplace Upload Section - Only show if product has certificate */}
              {product.certificate && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-800">
                  {uploadedProducts.has(product.id) ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Uploaded to Marketplace</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarketplaceUpload(product.id)}
                      disabled={uploadingId === product.id}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition text-sm font-medium flex items-center justify-center gap-2"
                    >
                      {uploadingId === product.id ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
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
                          Uploading...
                        </>
                      ) : (
                        <>
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
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          Upload to Marketplace
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
