"use client";

import { useEffect, useRef } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export type AdFormat = "auto" | "responsive" | "horizontal" | "vertical" | "rectangle" | "fluid";

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  className?: string;
  responsive?: boolean;
}

export function AdUnit({
  slot,
  format = "auto",
  className = "",
  responsive = true,
}: AdUnitProps) {
  const { hasConsented, isLoaded } = useCookieConsent();
  const adRef = useRef<HTMLModElement>(null);

  // Don't render if user hasn't loaded consent state yet
  if (!isLoaded) {
    return null;
  }

  // Don't render if user hasn't consented to advertising
  if (!hasConsented("advertising")) {
    return (
      <div className={`bg-muted/10 rounded-lg border border-dashed border-border/50 flex items-center justify-center min-h-[100px] ${className}`}>
        <p className="text-xs text-muted/60 text-center px-4">
          Advertising is disabled. Enable in cookie settings to support our site.
        </p>
      </div>
    );
  }

  // Placeholder slot - show placeholder instead of actual ad
  if (slot.startsWith("YOUR_") || slot === "") {
    return (
      <div className={`bg-accent/5 rounded-lg border border-dashed border-accent/30 flex items-center justify-center min-h-[100px] p-4 ${className}`}>
        <div className="text-center">
          <p className="text-xs font-medium text-accent/80 mb-1">Ad Placeholder</p>
          <p className="text-[10px] text-muted/60">Slot: {slot}</p>
          <p className="text-[10px] text-muted/50 mt-1">Replace with your AdSense ad slot ID</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Initialize AdSense ad
    if (typeof window !== "undefined" && (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle) {
      try {
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
      } catch {
        // AdSense error - silently fail
      }
    }
  }, []);

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-placeholder" // Will be set by AdSenseScript
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}

// Common AdSense ad slot configurations
export const AD_SLOTS = {
  // In-article ads (placed within blog post content)
  ARTICLE_TOP: "YOUR_ARTICLE_TOP_SLOT_ID",
  ARTICLE_MIDDLE: "YOUR_ARTICLE_MIDDLE_SLOT_ID",
  ARTICLE_BOTTOM: "YOUR_ARTICLE_BOTTOM_SLOT_ID",

  // Feed ads (in blog listing)
  FEED_1: "YOUR_FEED_AD_SLOT_1",
  FEED_2: "YOUR_FEED_AD_SLOT_2",
  FEED_3: "YOUR_FEED_AD_SLOT_3",

  // Sidebar/Leaderboard
  LEADERBOARD: "YOUR_LEADERBOARD_SLOT_ID",
  SIDEBAR: "YOUR_SIDEBAR_SLOT_ID",
} as const;
