"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/admin")) return;

    const sessionKey = `tracked:${pathname}`;

    // Prevent duplicate tracking within the same session
    if (sessionStorage.getItem(sessionKey)) return;

    const track = async () => {
      try {
        const supabase = createClient();

        // Determine the page_slug: for blog posts, extract slug; otherwise use pathname
        let pageSlug = pathname;
        const blogMatch = pathname.match(/^\/blog\/(.+)$/);
        if (blogMatch) {
          pageSlug = blogMatch[1];
        }

        // Insert analytics event
        await supabase.from("analytics_events").insert({
          event_type: "page_view",
          page_slug: pageSlug,
        });

        // If it's a blog post, also increment view_count via RPC
        if (blogMatch) {
          await supabase.rpc("increment_view_count", {
            post_slug: blogMatch[1],
          });
        }

        // Mark as tracked for this session
        sessionStorage.setItem(sessionKey, "1");
      } catch (err) {
        // Silently fail — analytics should never break the user experience
        console.error("Analytics tracking error:", err);
      }
    };

    track();
  }, [pathname]);

  return null;
}
