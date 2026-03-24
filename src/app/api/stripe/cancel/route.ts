import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUser } from "@/lib/user";

export async function POST() {
  const user = await getUser();

  if (!user.stripeSubscriptionId) {
    return NextResponse.json(
      { error: "Aucun abonnement trouvé" },
      { status: 404 },
    );
  }

  await stripe.subscriptions.update(user.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  return NextResponse.json({ success: true });
}
