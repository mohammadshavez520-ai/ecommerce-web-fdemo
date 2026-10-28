import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leafora Herbal Private Limited - Healing Naturally",
  description:
    "Leafora Herbal Private Limited - Authentic Ayurvedic Wellness, Natural Supplements, and Herbal Care. 100% Ayurvedic, formulated with pure lab-tested herbs.",
  keywords: [
    "Leafora",
    "Leafora Herbal",
    "Leafora Herbal Private Limited",
    "Ayurvedic body growth supplement",
    "Ayurvedic wellness",
    "Herbal health",
    "Natural healing",
  ],
  authors: [{ name: "Leafora Herbal Private Limited" }],
  openGraph: {
    title: "Leafora Herbal Private Limited - Healing Naturally",
    description:
      "Natural Wellness & Ayurvedic Health Solutions. 100% Ayurvedic · Clinically Tested.",
    url: "https://leaforaherbal.com",
    siteName: "Leafora Herbal Private Limited",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 512,
        alt: "Leafora Herbal Private Limited Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#fdfbf7] text-[#111827] antialiased">
        {children}
      </body>
    </html>
  );
}
