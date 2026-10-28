import LegalLayout from "@/app/legal/layout";
import RefundsPage, { metadata } from "@/app/legal/refunds/page";

export { metadata };

export default function Page() {
  return (
    <LegalLayout>
      <RefundsPage />
    </LegalLayout>
  );
}
