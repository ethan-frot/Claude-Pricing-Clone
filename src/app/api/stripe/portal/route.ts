import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUser } from "@/lib/user";

export async function POST() {
  const user = await getUser();

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: "Aucun abonnement trouvé" },
      { status: 404 },
    );
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return NextResponse.json({ url: portalSession.url });
}
