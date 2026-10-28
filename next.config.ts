import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**/*": ["./data/**/*"],
    "/admin/**/*": ["./data/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "heightveda.com",
      },
      {
        protocol: "https",
        hostname: "heightveda.in",
      },
      {
        protocol: "https",
        hostname: "allergysaffa.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/login",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/terms-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/shipping",
        destination: "/shipping-policy",
        permanent: true,
      },
      {
        source: "/delivery-policy",
        destination: "/shipping-policy",
        permanent: true,
      },
      {
        source: "/returns",
        destination: "/refunds",
        permanent: true,
      },
      {
        source: "/medical-disclaimer",
        destination: "/disclaimer",
        permanent: true,
      },
      {
        source: "/policies",
        destination: "/legal",
        permanent: true,
      },
      {
        source: "/policy",
        destination: "/legal",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/#about-sec",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/#about-sec",
        permanent: true,
      },
      {
        source: "/legal/ayush-gmp-certified",
        destination: "/legal/terms",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
