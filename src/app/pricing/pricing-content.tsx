"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PlanDisplayData, BillingInterval } from "@/lib/plans";

interface PricingContentProps {
  email: string;
  currentPriceId: string | null;
  plans: PlanDisplayData[];
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M3 8.5l3.5 3.5L13 5"
        stroke="#a89968"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProIcon() {
  return (
    <svg className="h-14 w-14" viewBox="0 0 56 56" fill="none">
      {/* Center trunk */}
      <line x1="28" y1="10" x2="28" y2="48" stroke="#c8c5be" strokeWidth="1.5" />
      {/* Top node */}
      <circle cx="28" cy="8" r="3.5" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="28" cy="8" r="1" fill="#c8c5be" />
      {/* Left branch 1 */}
      <line x1="28" y1="22" x2="16" y2="22" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="14" cy="22" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
      {/* Right branch 1 */}
      <line x1="28" y1="22" x2="40" y2="22" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="42" cy="22" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
      {/* Left branch 2 */}
      <line x1="28" y1="34" x2="18" y2="34" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="16" cy="34" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
      {/* Right branch 2 */}
      <line x1="28" y1="34" x2="38" y2="34" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="40" cy="34" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
    </svg>
  );
}

function MaxIcon() {
  return (
    <svg className="h-14 w-14" viewBox="0 0 56 56" fill="none">
      {/* Center trunk */}
      <line x1="28" y1="8" x2="28" y2="50" stroke="#c8c5be" strokeWidth="1.5" />
      {/* Top node */}
      <circle cx="28" cy="6" r="3.5" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="28" cy="6" r="1" fill="#c8c5be" />
      {/* Level 1 branches */}
      <line x1="28" y1="16" x2="14" y2="16" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="12" cy="16" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
      <line x1="28" y1="16" x2="42" y2="16" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="44" cy="16" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
      {/* Level 2 branches */}
      <line x1="28" y1="25" x2="10" y2="25" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="8" cy="25" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
      <line x1="28" y1="25" x2="46" y2="25" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="48" cy="25" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
      {/* Level 3 branches */}
      <line x1="28" y1="34" x2="14" y2="34" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="12" cy="34" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
      <line x1="28" y1="34" x2="42" y2="34" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="44" cy="34" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
      {/* Level 4 branches */}
      <line x1="28" y1="43" x2="18" y2="43" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="16" cy="43" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
      <line x1="28" y1="43" x2="38" y2="43" stroke="#c8c5be" strokeWidth="1.5" />
      <circle cx="40" cy="43" r="2.5" stroke="#c8c5be" strokeWidth="1.5" />
    </svg>
  );
}

export function PricingContent({
  email,
  currentPriceId,
  plans,
}: PricingContentProps) {
  const [interval, setInterval] = useState<BillingInterval>("yearly");
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (priceId: string) => {
    setLoading(priceId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };

  const handleUpgrade = async (priceId: string) => {
    setLoading(priceId);
    try {
      const res = await fetch("/api/stripe/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (res.ok) {
        router.push("/success");
      }
    } finally {
      setLoading(null);
    }
  };

  const getCurrentTier = (): number => {
    if (!currentPriceId) return 0;
    const current = plans.find(
      (p) =>
        p.monthlyPriceId === currentPriceId ||
        p.yearlyPriceId === currentPriceId,
    );
    return current?.tier ?? 0;
  };

  const currentTier = getCurrentTier();

  const isCurrentPlan = (plan: PlanDisplayData) => {
    if (!currentPriceId) return false;
    return (
      plan.monthlyPriceId === currentPriceId ||
      plan.yearlyPriceId === currentPriceId
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#2d2b27] px-4 pb-20 pt-12">
      {/* Back arrow (if subscribed) */}
      {currentPriceId && (
        <button
          onClick={() => router.push("/dashboard")}
          className="absolute left-8 top-8 text-[#c8c5be] transition-colors hover:text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 10H5M5 10l5-5M5 10l5 5" />
          </svg>
        </button>
      )}

      {/* Title */}
      <h1 className="mb-8 text-center text-[2.25rem] font-bold leading-tight tracking-tight text-[#f5f4ef]">
        Plans that grow with you
      </h1>

      {/* Individual tab */}
      <div className="mb-10 inline-flex rounded-full border border-[#555350] p-1">
        <span className="rounded-full bg-[#3d3b37] px-6 py-2 text-sm font-medium text-[#f5f4ef]">
          Individual
        </span>
        <span className="rounded-full px-6 py-2 text-sm text-[#a8a59e]">
          Team and Enterprise
        </span>
      </div>

      {/* Plan Cards */}
      <div className="grid w-full max-w-[880px] grid-cols-1 gap-5 md:grid-cols-2">
        {plans.map((plan) => {
          const price =
            interval === "yearly" ? plan.yearlyAmount : plan.monthlyAmount;
          const priceId =
            interval === "yearly" ? plan.yearlyPriceId : plan.monthlyPriceId;
          const isCurrent = isCurrentPlan(plan);
          const canUpgrade = currentTier > 0 && plan.tier > currentTier;

          let ctaLabel: string;
          let ctaAction: (() => void) | null = null;
          let ctaDisabled = false;

          if (isCurrent) {
            ctaLabel = "Current plan";
            ctaDisabled = true;
          } else if (canUpgrade) {
            ctaLabel = `Upgrade to ${plan.label}`;
            ctaAction = () => handleUpgrade(priceId);
          } else if (currentTier >= plan.tier && currentTier > 0) {
            ctaLabel = `Downgrade to ${plan.label}`;
            ctaDisabled = true;
          } else {
            ctaLabel =
              plan.name === "max" ? `Get ${plan.label}` : `Get ${plan.label}`;
            ctaAction = () => handleSubscribe(priceId);
          }

          return (
            <div
              key={plan.name}
              className="flex flex-col rounded-2xl border border-[#444240] bg-[#252320] p-8"
            >
              {/* Header: icon + toggle */}
              <div className="mb-6 flex items-start justify-between">
                {plan.name === "pro" ? <ProIcon /> : <MaxIcon />}

                {plan.name === "pro" && (
                  <div className="flex items-center rounded-full border border-[#555350] bg-[#2d2b27] p-0.5 text-[13px]">
                    <button
                      onClick={() => setInterval("monthly")}
                      className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
                        interval === "monthly"
                          ? "bg-[#3d3b37] text-[#f5f4ef]"
                          : "text-[#a8a59e] hover:text-[#c8c5be]"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setInterval("yearly")}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium transition-colors ${
                        interval === "yearly"
                          ? "bg-[#3d3b37] text-[#f5f4ef]"
                          : "text-[#a8a59e] hover:text-[#c8c5be]"
                      }`}
                    >
                      Yearly
                      <span className="text-[#7dba5e]">· Save 17%</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Plan name */}
              <h2 className="text-xl font-bold text-[#f5f4ef]">{plan.label}</h2>
              <p className="mb-6 text-sm text-[#a8a59e]">{plan.description}</p>

              {/* Price */}
              <div className="mb-7 flex items-baseline gap-2">
                {plan.name === "max" && (
                  <span className="text-[2rem] font-bold text-[#f5f4ef]">From</span>
                )}
                <span className="text-[2.75rem] font-bold leading-none text-[#f5f4ef]">
                  €{price}
                </span>
                <div className="text-[13px] leading-tight text-[#a8a59e]">
                  <div>EUR / month</div>
                  <div>
                    {interval === "yearly"
                      ? "billed annually"
                      : "billed monthly"}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={ctaAction ?? undefined}
                disabled={ctaDisabled || loading === priceId}
                className={`w-full rounded-xl border border-[#555350] bg-transparent px-4 py-3.5 text-[15px] font-medium text-[#f5f4ef] transition-colors hover:bg-[#3d3b37] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent`}
              >
                {loading === priceId ? "Redirecting..." : ctaLabel}
              </button>

              {/* Cancel anytime (Max only) */}
              {plan.name === "max" && !isCurrent && !ctaDisabled && (
                <p className="mt-2 text-center text-xs text-[#706d66]">
                  Cancel anytime
                </p>
              )}

              {/* Divider */}
              <div className="my-6 border-t border-[#444240]" />

              {/* Features */}
              <div>
                <p className="mb-4 text-[15px] font-medium text-[#d4c5a0]">
                  {plan.name === "pro"
                    ? "Everything in Free and:"
                    : "Everything in Pro, plus:"}
                </p>
                <ul className="space-y-3">
                  {plan.features
                    .filter((f) => !f.startsWith("Everything in"))
                    .map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-[14px] text-[#c8c5be]"
                      >
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-[#706d66]">
        <span className="text-[#a89968]">*Usage limits apply.</span> Prices shown don&apos;t include applicable tax.
      </p>
      <p className="mt-4 text-center text-sm font-medium text-[#f5f4ef]">
        You will be charged 20% VAT, the standard rate in France, at checkout.
      </p>
    </div>
  );
}
