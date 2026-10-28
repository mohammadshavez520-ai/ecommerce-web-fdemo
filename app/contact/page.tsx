import { Metadata } from "next";
import LegalLayout from "@/app/legal/layout";
import ContactGrievancePage from "@/app/legal/contact/page";

export const metadata: Metadata = {
  title: "Contact Us & Grievance Redressal | Leafora Herbal Private Limited",
  description:
    "Official customer care, order support, telephone helpline, and grievance desk of Leafora Herbal Private Limited.",
};

export default function Page() {
  return (
    <LegalLayout>
      <ContactGrievancePage />
    </LegalLayout>
  );
}
