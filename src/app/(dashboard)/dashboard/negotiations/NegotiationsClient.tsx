"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
// import { toast } from "sonner"; // Removed as not installed
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export interface Offer {
  id: string;
  offerAmount: number;
  status: string;
  createdAt: Date;
  counterAmount?: number;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  customer: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface NegotiationsClientProps {
  initialOffers: Offer[];
  isDemo?: boolean;
}

export function NegotiationsClient({
  initialOffers,
  isDemo,
}: NegotiationsClientProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [loading, setLoading] = useState<string | null>(null);
  const [counterValue, setCounterValue] = useState<{ [key: string]: string }>({});

  const handleAction = async (offerId: string, action: string, counterAmount?: number) => {
    if (isDemo) {
      setLoading(offerId);
      setTimeout(() => {
        const statusMap: any = {
          accept: "ACCEPTED",
          reject: "REJECTED",
          counter: "COUNTERED",
        };
        
        setOffers(prev => prev.map(o => 
          o.id === offerId 
            ? { ...o, status: statusMap[action], ...(action === 'counter' && { counterAmount }) } 
            : o
        ));
        setLoading(null);
        console.log(`Offer ${action}ed successfully (Demo Mode)`);
      }, 800);
      return;
    }

    try {
      setLoading(offerId);
      const res = await fetch("/api/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, action, counterAmount }),
      });

      if (res.ok) {
        console.log(`Offer ${action}ed successfully`);
        router.refresh();
      } else {
        const error = await res.json();
        console.error(error.error || "Failed to respond to offer");
      }
    } catch (err) {
      console.error("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("negotiations.title")}
        </h1>
        <p className="text-gray-500 dark:text-zinc-400">
          {t("negotiations.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {offers.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 text-center border border-dashed border-gray-200 dark:border-zinc-800">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("negotiations.noNegotiations")}</h3>
            <p className="text-gray-500 dark:text-zinc-400 mt-1">{t("negotiations.noNegotiationsDesc")}</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 transition-all hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Product Info */}
                <div className="flex items-center gap-4 w-full lg:w-1/3">
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 relative group">
                    <img
                      src={offer.product.image}
                      alt={offer.product.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{offer.product.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">{t("photoStudio.price")}: {formatPrice(offer.product.price)}</p>
                    <div className="mt-1">
                       <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        offer.status === 'PENDING' ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                        offer.status === 'ACCEPTED' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                        offer.status === 'REJECTED' ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
                        "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                      )}>
                        {offer.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer */}
                <div className="flex items-center gap-3 lg:border-l lg:pl-6 dark:border-zinc-800 w-full lg:w-1/4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 ring-2 ring-gray-50 dark:ring-zinc-800 flex-shrink-0 text-[0]">
                    <img
                      src={offer.customer.avatar || `https://ui-avatars.com/api/?name=${offer.customer.name}`}
                      alt={offer.customer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{offer.customer.name}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer">{t("negotiations.viewProfile")}</p>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="flex-1 w-full lg:border-l lg:pl-6 dark:border-zinc-800 flex flex-col justify-center">
                  <p className="text-xs text-gray-400 dark:text-zinc-500 uppercase font-bold tracking-tight mb-0.5">{t("negotiations.customerOffered")}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(offer.offerAmount)}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {Math.round((1 - (offer.offerAmount / offer.product.price)) * 100)}% {t("negotiations.discountRequested")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 lg:ml-auto">
                  {offer.status === 'PENDING' ? (
                    <>
                      <div className="relative w-full sm:w-40 group">
                        <input
                          type="number"
                          placeholder={`${t("negotiations.counter")} ₹`}
                          value={counterValue[offer.id] || ""}
                          onChange={(e) => setCounterValue({ ...counterValue, [offer.id]: e.target.value })}
                          className="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                        />
                        <button
                          onClick={() => handleAction(offer.id, 'counter', Number(counterValue[offer.id]))}
                          disabled={loading === offer.id || !counterValue[offer.id]}
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={() => handleAction(offer.id, 'accept')}
                        disabled={loading === offer.id}
                        className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        {loading === offer.id ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : t("negotiations.accept")}
                      </button>

                      <button
                        onClick={() => handleAction(offer.id, 'reject')}
                        disabled={loading !== null}
                        className="w-full sm:w-auto px-5 py-2 bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-bold rounded-lg transition-all active:scale-95"
                      >
                        {t("negotiations.reject")}
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center lg:items-end gap-1 px-4">
                      {offer.status === 'COUNTERED' && (
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {t("negotiations.counter")}: {formatPrice(offer.counterAmount || 0)}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-black">Offer Resolved</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
