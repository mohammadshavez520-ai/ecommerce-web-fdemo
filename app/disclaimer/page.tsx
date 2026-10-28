import LegalLayout from "@/app/legal/layout";
import DisclaimerPage, { metadata } from "@/app/legal/disclaimer/page";

export { metadata };

export default function Page() {
  return (
    <LegalLayout>
      <DisclaimerPage />
    </LegalLayout>
  );
}
