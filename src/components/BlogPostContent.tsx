"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { BlogImage } from "@/components/BlogImage";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { AdUnit } from "@/components/AdUnit";

interface BlogPostContentProps {
  post: Post;
}

/** Estimates reading time from markdown word count (~225 WPM average) */
function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const readingTime = getReadingTime(post.content_markdown || "");

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors mb-8"
        >
          <span>←</span> Back to articles
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
            AI & Tech
          </span>
          {formattedDate && (
            <time className="text-sm text-muted">{formattedDate}</time>
          )}
          <span className="text-sm text-muted">·</span>
          <span className="text-sm text-muted">{readingTime} min read</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {post.meta_description && (
          <p className="text-lg text-muted mb-8 leading-relaxed">
            {post.meta_description}
          </p>
        )}
      </motion.header>

      {/* Featured Image */}
      {post.image_url && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10 border border-border/50"
        >
          <BlogImage
            src={post.image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </motion.div>
      )}

      {/* Ad Placement: After Featured Image (Before Content) */}
      {/* TODO: Insert your AdSense ad slot ID below. Format: responsive */}
      <AdUnit
        slot="YOUR_AD_SLOT_ID_1" // Replace with your AdSense ad slot ID
        format="responsive"
        className="my-8"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <MarkdownRenderer content={post.content_markdown} />
      </motion.div>

      {/* Ad Placement: Middle of Content (Only for longer articles) */}
      {/* TODO: Insert your AdSense ad slot ID below. Format: responsive */}
      {/* This ad only appears if content is substantial (>2000 chars) */}
      {post.content_markdown && post.content_markdown.length > 2000 && (
        <AdUnit
          slot="YOUR_AD_SLOT_ID_2" // Replace with your AdSense ad slot ID
          format="responsive"
          className="my-8"
        />
      )}

      {/* Ad Placement: End of Article (Before Bottom Navigation) */}
      {/* TODO: Insert your AdSense ad slot ID below. Format: responsive */}
      <AdUnit
        slot="YOUR_AD_SLOT_ID_3" // Replace with your AdSense ad slot ID
        format="responsive"
        className="my-8"
      />

      {/* Bottom navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 pt-8 border-t border-border/50 text-center"
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-medium text-muted hover:text-accent hover:border-accent/30 transition-all"
        >
          ← More Articles
        </Link>
      </motion.div>
    </article>
  );
}
