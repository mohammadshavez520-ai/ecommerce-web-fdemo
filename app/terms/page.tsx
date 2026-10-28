import LegalLayout from "@/app/legal/layout";
import TermsPage, { metadata } from "@/app/legal/terms/page";

export { metadata };

export default function Page() {
  return (
    <LegalLayout>
      <TermsPage />
    </LegalLayout>
  );
}
