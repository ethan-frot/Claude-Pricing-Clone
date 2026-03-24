export type PlanName = "pro" | "max";
export type BillingInterval = "monthly" | "yearly";

export interface PlanPrice {
  priceId: string;
  amount: number;
}

export interface PlanConfig {
  name: PlanName;
  label: string;
  description: string;
  features: string[];
  prices: Record<BillingInterval, PlanPrice>;
  yearlyTotal: number;
  tier: number;
}

export const PLANS: Record<PlanName, PlanConfig> = {
  pro: {
    name: "pro",
    label: "Pro",
    description: "Research, code, and organize",
    features: [
      "Claude Code directly in your codebase",
      "Power through tasks with Cowork",
      "Higher usage limits",
      "Deep research and analysis",
      "Memory that carries across conversations",
    ],
    prices: {
      monthly: {
        priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
        amount: 18,
      },
      yearly: {
        priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
        amount: 15,
      },
    },
    yearlyTotal: 180,
    tier: 1,
  },
  max: {
    name: "max",
    label: "Max",
    description: "Higher limits, priority access",
    features: [
      "Everything in Pro, plus:",
      "Up to 20x more usage than Pro",
      "Early access to advanced Claude features",
      "Higher output limits for all tasks",
      "Priority access at high traffic times",
      "Claude in PowerPoint",
    ],
    prices: {
      monthly: {
        priceId: process.env.STRIPE_MAX_MONTHLY_PRICE_ID!,
        amount: 90,
      },
      yearly: {
        priceId: process.env.STRIPE_MAX_YEARLY_PRICE_ID!,
        amount: 75,
      },
    },
    yearlyTotal: 900,
    tier: 2,
  },
};

export function getPlanByPriceId(
  priceId: string
): { plan: PlanConfig; interval: BillingInterval } | null {
  for (const plan of Object.values(PLANS)) {
    if (plan.prices.monthly.priceId === priceId) {
      return { plan, interval: "monthly" };
    }
    if (plan.prices.yearly.priceId === priceId) {
      return { plan, interval: "yearly" };
    }
  }
  return null;
}

export function getAllPriceIds(): string[] {
  return Object.values(PLANS).flatMap((plan) => [
    plan.prices.monthly.priceId,
    plan.prices.yearly.priceId,
  ]);
}

export type PlanDisplayData = {
  name: PlanName;
  label: string;
  description: string;
  features: string[];
  monthlyAmount: number;
  yearlyAmount: number;
  yearlyTotal: number;
  monthlyPriceId: string;
  yearlyPriceId: string;
  tier: number;
};

export function getPlansDisplayData(): PlanDisplayData[] {
  return Object.values(PLANS).map((plan) => ({
    name: plan.name,
    label: plan.label,
    description: plan.description,
    features: plan.features,
    monthlyAmount: plan.prices.monthly.amount,
    yearlyAmount: plan.prices.yearly.amount,
    yearlyTotal: plan.yearlyTotal,
    monthlyPriceId: plan.prices.monthly.priceId,
    yearlyPriceId: plan.prices.yearly.priceId,
    tier: plan.tier,
  }));
}
