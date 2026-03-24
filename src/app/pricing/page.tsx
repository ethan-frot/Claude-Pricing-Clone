import { getUser } from "@/lib/user";
import { getPlansDisplayData } from "@/lib/plans";
import { PricingContent } from "./pricing-content";

export default async function PricingPage() {
  const user = await getUser();
  const currentPriceId =
    user.stripeStatus === "active" ? user.stripePriceId : null;

  return (
    <PricingContent
      email={user.email}
      currentPriceId={currentPriceId}
      plans={getPlansDisplayData()}
    />
  );
}
