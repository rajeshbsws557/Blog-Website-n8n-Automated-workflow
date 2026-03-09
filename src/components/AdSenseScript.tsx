"use client";

import Script from "next/script";
import { useCookieConsent } from "@/hooks/useCookieConsent";

interface AdSenseScriptProps {
  publisherId: string;
}

export function AdSenseScript({ publisherId }: AdSenseScriptProps) {
  const { hasConsented } = useCookieConsent();

  // Only load AdSense if user has consented to advertising cookies
  if (!hasConsented("advertising")) {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
