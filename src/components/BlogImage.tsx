"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

interface BlogImageProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
}

/**
 * A resilient image wrapper around next/image.
 * - Shows a gradient placeholder on error instead of broken alt-text.
 * - Uses `unoptimized` for non-Supabase URLs to avoid optimizer timeouts.
 */
export function BlogImage({ fallbackText, src, alt, className, ...rest }: BlogImageProps) {
  const [hasError, setHasError] = useState(false);

  // Optimize images from known allowed domains (Supabase + ImageBB).
  // All others use unoptimized to avoid Next.js optimizer timeouts.
  const srcStr = typeof src === "string" ? src : "";
  const isAllowedDomain = srcStr.includes("supabase.co") || srcStr.includes("ibb.co");
  const shouldOptimize = isAllowedDomain;

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
      unoptimized={!shouldOptimize}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
}
