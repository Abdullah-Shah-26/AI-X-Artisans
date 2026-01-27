"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ApplyButtonProps {
  projectId: string;
  artisanId: string;
}

export function ApplyButton({ projectId, artisanId }: ApplyButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApply = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/projects/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, artisanId }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error applying:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
    >
      {loading ? "Applying..." : "Apply"}
    </button>
  );
}
