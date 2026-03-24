import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getUser } from "@/lib/user";
import { getAllPriceIds } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const user = await getUser();

  const { priceId } = await req.json();

  if (!priceId || !getAllPriceIds().includes(priceId)) {
    return NextResponse.json({ error: "Prix invalide" }, { status: 400 });
  }

  if (user.stripeStatus === "active") {
    return NextResponse.json(
      { error: "Vous avez déjà un abonnement actif" },
      { status: 400 },
    );
  }

  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
