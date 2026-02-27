"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

interface BlogImageProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
}

/**
 * A resilient image wrapper around next/image.
 * - Shows a gradient placeholder on error instead of broken alt-text.
 * - External images are loaded directly (unoptimized) to avoid server-side
 *   optimizer failures (CDN blocking, timeouts, rate-limits).
 * - Supabase storage images go through the optimizer (reliable same-infra).
 */
export function BlogImage({ fallbackText, src, alt, className, ...rest }: BlogImageProps) {
  const [hasError, setHasError] = useState(false);

  const srcStr = typeof src === "string" ? src : "";

  // Only optimise images from our own Supabase storage — we control the server
  // and know the optimizer can always reach it.  Every other external URL is
  // loaded directly by the browser (unoptimized) which is 100% reliable.
  const isSupabaseImage = srcStr.includes("supabase.co");

  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-accent/20 via-accent-secondary/10 to-accent/5 ${className ?? ""}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <span className="text-3xl opacity-60">📰</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      unoptimized={!isSupabaseImage}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
}
