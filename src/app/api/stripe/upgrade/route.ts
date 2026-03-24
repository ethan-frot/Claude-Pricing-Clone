import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUser } from "@/lib/user";
import { getPlanByPriceId, getAllPriceIds } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const user = await getUser();

  const { priceId } = await req.json();

  if (!priceId || !getAllPriceIds().includes(priceId)) {
    return NextResponse.json({ error: "Prix invalide" }, { status: 400 });
  }

  if (!user.stripeSubscriptionId || user.stripeStatus !== "active") {
    return NextResponse.json(
      { error: "Aucun abonnement actif" },
      { status: 400 },
    );
  }

  const currentPlan = user.stripePriceId
    ? getPlanByPriceId(user.stripePriceId)
    : null;
  const targetPlan = getPlanByPriceId(priceId);

  if (!currentPlan || !targetPlan) {
    return NextResponse.json({ error: "Plan introuvable" }, { status: 400 });
  }

  if (targetPlan.plan.tier <= currentPlan.plan.tier) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas downgrader votre plan" },
      { status: 400 },
    );
  }

  const subscription = await stripe.subscriptions.retrieve(
    user.stripeSubscriptionId,
  );

  await stripe.subscriptions.update(user.stripeSubscriptionId, {
    items: [{ id: subscription.items.data[0].id, price: priceId }],
    proration_behavior: "create_prorations",
  });

  return NextResponse.json({ success: true });
}
