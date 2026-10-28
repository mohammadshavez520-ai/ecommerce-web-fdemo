import LegalLayout from "@/app/legal/layout";
import PrivacyPolicyPage, { metadata } from "@/app/legal/privacy-policy/page";

export { metadata };

export default function Page() {
  return (
    <LegalLayout>
      <PrivacyPolicyPage />
    </LegalLayout>
  );
}
