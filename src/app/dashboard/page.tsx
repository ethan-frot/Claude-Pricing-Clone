import { getUser } from "@/lib/user";
import { getPlanByPriceId } from "@/lib/plans";
import { SubscriptionStatus } from "./subscription-status";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getUser();

  const isSubscribed = user.stripeStatus === "active";
  const currentPlan = user.stripePriceId
    ? getPlanByPriceId(user.stripePriceId)
    : null;
  const isCanceling = user.stripeCancelAtPeriodEnd;

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#2d2b27] px-4 pt-12">
      {/* Back to pricing */}
      <Link
        href="/pricing"
        className="absolute left-8 top-8 text-[#a8a59e] transition-colors hover:text-[#f5f4ef]"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 10H5M5 10l5-5M5 10l5 5" />
        </svg>
      </Link>

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-bold text-[#f5f4ef]">Account</h1>
          <p className="text-[15px] text-[#a8a59e]">{user.email}</p>
        </div>

        {/* Plan Card */}
        <div className="rounded-2xl border border-[#444240] bg-[#252320] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-medium text-[#a8a59e]">Current plan</h2>
            {isSubscribed && currentPlan && (
              <span className="rounded-full bg-[#1a3a2a] px-3 py-1 text-xs font-medium text-[#4ade80]">
                Active
              </span>
            )}
          </div>

          {isSubscribed && currentPlan ? (
            <div className="mb-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#f5f4ef]">
                  {currentPlan.plan.label}
                </span>
                <span className="text-sm text-[#a8a59e]">
                  {currentPlan.interval === "yearly" ? "Annual" : "Monthly"}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#706d66]">
                €{currentPlan.interval === "yearly"
                  ? currentPlan.plan.prices.yearly.amount
                  : currentPlan.plan.prices.monthly.amount} / month
              </p>
            </div>
          ) : (
            <div className="mb-5">
              <span className="text-3xl font-bold text-[#f5f4ef]">Free</span>
              <p className="mt-1 text-sm text-[#706d66]">
                No active subscription
              </p>
            </div>
          )}

          <SubscriptionStatus
            isSubscribed={isSubscribed}
            planName={currentPlan?.plan.label ?? null}
            interval={currentPlan?.interval ?? null}
            isCanceling={isCanceling}
            canUpgrade={isSubscribed && currentPlan ? currentPlan.plan.tier < 2 : false}
          />
        </div>

        {/* Quick links */}
        <div className="mt-5 rounded-2xl border border-[#444240] bg-[#252320] p-6">
          <h2 className="mb-4 text-[15px] font-medium text-[#a8a59e]">Quick links</h2>
          <div className="flex flex-col gap-2">
            <Link
              href="/pricing"
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] text-[#c8c5be] transition-colors hover:bg-[#2d2b27]"
            >
              View plans
              <svg className="h-4 w-4 text-[#706d66]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
