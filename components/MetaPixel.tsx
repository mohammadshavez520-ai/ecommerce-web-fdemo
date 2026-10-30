"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Standard helper to fire any Meta Pixel event safely across the app
 */
export function trackMetaEvent(event: string, params: Record<string, any> = {}) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
    console.log(`[Meta Pixel] Tracked ${event}:`, params);
  }
}

function PixelPageViewTracker({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pixelId) return;
    // Track PageView on initial load and on every SPA route transition
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
      console.log("[Meta Pixel] PageView tracked:", pathname);
    }
  }, [pathname, searchParams, pixelId]);

  return null;
}

export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  if (!pixelId) {
    return null;
  }

  return (
    <>
      {/* Meta Pixel Base Code */}
      <Script
        id="meta-pixel-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Track client-side navigation transitions */}
      <Suspense fallback={null}>
        <PixelPageViewTracker pixelId={pixelId} />
      </Suspense>

      {/* NoScript Fallback for privacy browsers */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt="Meta Pixel"
        />
      </noscript>
    </>
  );
}

