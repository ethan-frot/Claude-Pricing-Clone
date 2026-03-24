"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SubscriptionStatusProps {
  isSubscribed: boolean;
  planName: string | null;
  interval: "monthly" | "yearly" | null;
  isCanceling: boolean;
  canUpgrade: boolean;
}

export function SubscriptionStatus({
  isSubscribed,
  isCanceling,
  canUpgrade,
}: SubscriptionStatusProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const router = useRouter();

  const handlePortal = async () => {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    setLoading("cancel");
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      if (res.ok) {
        setShowConfirmCancel(false);
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  };

  if (!isSubscribed) {
    return (
      <a
        href="/pricing"
        className="block w-full rounded-xl border border-[#555350] px-4 py-3.5 text-center text-[15px] font-medium text-[#f5f4ef] transition-colors hover:bg-[#3d3b37]"
      >
        Choose a plan
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {isCanceling && (
        <p className="mb-2 rounded-lg bg-[#3a2a1a] px-3 py-2 text-sm text-[#f59e0b]">
          Your subscription will be canceled at the end of the current period.
        </p>
      )}

      {canUpgrade && !isCanceling && (
        <button
          onClick={() => router.push("/pricing")}
          className="w-full rounded-xl bg-[#f5f4ef] px-4 py-3 text-[15px] font-medium text-[#2d2b27] transition-colors hover:bg-[#e5e4df]"
        >
          Upgrade to Max
        </button>
      )}

      <button
        onClick={handlePortal}
        disabled={loading === "portal"}
        className="w-full rounded-xl border border-[#555350] px-4 py-3 text-[15px] font-medium text-[#f5f4ef] transition-colors hover:bg-[#3d3b37] disabled:opacity-40"
      >
        {loading === "portal" ? "Redirecting..." : "Manage billing"}
      </button>

      {!isCanceling && (
        <>
          {showConfirmCancel ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={loading === "cancel"}
                className="flex-1 rounded-xl bg-[#7f1d1d] px-4 py-3 text-[15px] font-medium text-[#fca5a5] transition-colors hover:bg-[#991b1b] disabled:opacity-40"
              >
                {loading === "cancel" ? "Canceling..." : "Confirm cancel"}
              </button>
              <button
                onClick={() => setShowConfirmCancel(false)}
                className="flex-1 rounded-xl border border-[#555350] px-4 py-3 text-[15px] font-medium text-[#f5f4ef] transition-colors hover:bg-[#3d3b37]"
              >
                Keep plan
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmCancel(true)}
              className="w-full rounded-xl border border-[#555350] px-4 py-3 text-[15px] font-medium text-[#ef4444] transition-colors hover:bg-[#3d3b37]"
            >
              Cancel subscription
            </button>
          )}
        </>
      )}
    </div>
  );
}
