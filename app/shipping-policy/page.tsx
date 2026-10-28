import LegalLayout from "@/app/legal/layout";
import ShippingPolicyPage, { metadata } from "@/app/legal/shipping-policy/page";

export { metadata };

export default function Page() {
  return (
    <LegalLayout>
      <ShippingPolicyPage />
    </LegalLayout>
  );
}
