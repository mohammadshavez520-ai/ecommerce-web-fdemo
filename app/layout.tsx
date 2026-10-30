import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { MetaPixel } from "@/components/MetaPixel";

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
    url: "https://www.leaforaherbal.in",
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
        {/* Shiprocket Checkout Stylesheet */}
        <link
          rel="stylesheet"
          href="https://checkout-ui.shiprocket.com/assets/styles/shopify.css"
        />
      </head>
      <body className="min-h-screen bg-[#fdfbf7] text-[#111827] antialiased">
        {children}

        {/* Hidden seller domain required by Shiprocket checkout script */}
        <input
          type="hidden"
          value="www.leaforaherbal.in"
          id="sellerDomain"
        />

        {/* Official Shiprocket Checkout Script */}
        <Script
          src="https://checkout-ui.shiprocket.com/assets/js/channels/shopify.js"
          strategy="afterInteractive"
        />

        {/* Meta Pixel (Facebook Ads) Global Tracking */}
        <MetaPixel />

        {/* Fastrr configuration & script */}
        <Script
          id="shiprocket-checkout-fastrr"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.fastrr_config = {
                app_id: "${process.env.NEXT_PUBLIC_SHIPROCKET_APP_ID || ''}",
                environment: "production"
              };
            `,
          }}
        />
        <Script
          src="https://fastrr-boost-ui.pickrr.com/assets/js/fastrr.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
