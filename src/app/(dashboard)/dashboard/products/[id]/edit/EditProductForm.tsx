"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/common/ImageUpload";
import { getDemoProducts, updateDemoProduct } from "@/lib/demoStorage";

const categories = [
  "Textiles",
  "Pottery",
  "Jewelry",
  "Woodwork",
  "Metalwork",
  "Leather",
  "Paintings",
  "Sculptures",
  "Basketry",
  "Other",
];

const craftTraditions = [
  "Handloom",
  "Block Print",
  "Embroidery",
  "Terracotta",
  "Brass Work",
  "Woodcarving",
  "Lacquerware",
  "Papier-mâché",
  "Dhokra",
  "Bidri",
  "Kalamkari",
  "Madhubani",
  "Warli",
  "Pattachitra",
  "Banarasi Weaving",
  "Other",
];

interface Product {
  id: string;
  name: string;
  description: string | null;
  longDescription?: string | null;
  price: number;
  category: string | null;
  craftTradition: string | null;
  image: string | null;
  dateAdded: Date;
}

interface EditProductFormProps {
  productId: string;
  initialProduct: Product | null;
  artisanStory: string;
  isDemo?: boolean;
}

export function EditProductForm({
  productId,
  initialProduct,
  artisanStory,
  isDemo,
}: EditProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(initialProduct);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [craftTradition, setCraftTradition] = useState("");

  // Load product data and populate form
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    let productToLoad: Product | null = initialProduct;

    // If demo mode, try to load from localStorage
    if (isDemo) {
      const demoProducts = getDemoProducts();
      const demoProduct = demoProducts.find((p) => p.id === productId);
      if (demoProduct) {
        productToLoad = demoProduct;
      }
    }

    // Populate form fields if we have a product
    if (productToLoad) {
      setProduct(productToLoad);
      setName(productToLoad.name);
      setDescription(productToLoad.description || "");
      setLongDescription(productToLoad.longDescription || "");
      setPrice(productToLoad.price.toString());
      setImage(productToLoad.image || "");
      setCategory(productToLoad.category || "");
      setCraftTradition(productToLoad.craftTradition || "");
    }
  }, [isDemo, productId, initialProduct]);

  const generateDescription = async () => {
    if (!name || !craftTradition) {
      alert("Please enter product name and craft tradition first");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/product-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: name,
          craftTradition,
          artisanStory:
            artisanStory ||
            "A skilled artisan dedicated to preserving traditional crafts",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", data);
        throw new Error(data.error || "Failed to generate description");
      }

      setLongDescription(data.description);
    } catch (error: any) {
      console.error("Error generating description:", error);
      alert(
        `Failed to generate description: ${error.message}\n\nPlease check the browser console and terminal for more details.`,
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In demo mode, update in localStorage
      if (isDemo) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

        updateDemoProduct(productId, {
          name,
          description,
          longDescription,
          price: parseFloat(price),
          image,
          category,
          craftTradition,
          dateAdded: product?.dateAdded || new Date(),
          id: productId,
        });

        alert(`Product "${name}" updated successfully!`);
        router.push("/dashboard/products");
        router.refresh();
        return;
      }

      // Real mode - call API
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          longDescription,
          price: parseFloat(price),
          image,
          category,
          craftTradition,
        }),
      });

      if (response.ok) {
        router.push("/dashboard/products");
        router.refresh();
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!product && !isDemo) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 text-center">
        <p className="text-gray-500 dark:text-zinc-400">Product not found</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-6 shadow-sm space-y-6"
    >
      {/* Basic Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
          Product Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Hand-woven Silk Saree"
          className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            Craft Tradition
          </label>
          <select
            value={craftTradition}
            onChange={(e) => setCraftTradition(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Select tradition</option>
            {craftTraditions.map((craft) => (
              <option key={craft} value={craft}>
                {craft}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
          Price (₹) *
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
          Product Image *
        </label>
        <ImageUpload
          onUpload={setImage}
          currentImage={image}
          bucket="images"
          folder="products"
        />
        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
          Use Photo Studio to enhance your product images after uploading
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
          Short Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description for product cards..."
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        />
      </div>

      {/* AI Description */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
            Detailed Story
          </label>
          <button
            type="button"
            onClick={generateDescription}
            disabled={aiLoading}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 disabled:opacity-50"
          >
            {aiLoading ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full" />
                Generating...
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Generate with AI
              </>
            )}
          </button>
        </div>
        <textarea
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          placeholder="Tell the story of this product, its cultural significance, and craftsmanship..."
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
          AI will generate a compelling story based on your product and craft
          tradition
        </p>
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </div>
    </form>
  );
}
