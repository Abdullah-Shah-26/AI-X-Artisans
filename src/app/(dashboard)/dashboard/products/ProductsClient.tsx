"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice, formatDate } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  craftTradition: string | null;
  image: string | null;
  dateAdded: Date;
}

interface ProductsClientProps {
  products: Product[];
  isDemo: boolean;
}

export function ProductsClient({ products, isDemo }: ProductsClientProps) {
  const { t } = useLanguage();

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
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("products.addProduct")}
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="aspect-video bg-gray-100 dark:bg-zinc-800 relative">
              <img src={product.image || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover" />
              {product.craftTradition && (
                <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                  {product.craftTradition}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1 line-clamp-1 text-gray-900 dark:text-white">{product.name}</h3>
              <p className="text-gray-500 dark:text-zinc-400 text-sm mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(product.price)}</span>
                <span className="text-xs text-gray-400 dark:text-zinc-500">{formatDate(product.dateAdded)}</span>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
