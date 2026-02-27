"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { BlogCard } from "./BlogCard";

type PostListItem = Omit<Post, "content_markdown"> & { content_markdown?: string };

interface BlogFeedProps {
  posts: PostListItem[];
  currentPage: number;
  totalPages: number;
}

export function BlogFeed({ posts, currentPage, totalPages }: BlogFeedProps) {
  return (
    <section id="feed" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="text-3xl font-bold mb-2">All Articles</h2>
        <p className="text-muted">
          Browse our complete collection of tech insights
        </p>
      </motion.div>

      {/* Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
          <p className="text-muted">
            Check back soon for new content on AI and technology.
          </p>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mt-12"
        >
          {currentPage > 1 && (
            <Link
              href={`/?page=${currentPage - 1}`}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:border-accent/30 transition-all"
            >
              ← Previous
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/?page=${p}`}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                p === currentPage
                  ? "bg-accent text-white"
                  : "border border-border text-muted hover:text-foreground hover:border-accent/30"
              }`}
            >
              {p}
            </Link>
          ))}

          {currentPage < totalPages && (
            <Link
              href={`/?page=${currentPage + 1}`}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:border-accent/30 transition-all"
            >
              Next →
            </Link>
          )}
        </motion.div>
      )}
    </section>
  );
}
