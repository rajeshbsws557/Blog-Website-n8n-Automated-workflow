"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/types";

interface BlogCardProps {
  post: Post;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Draft";

  const excerpt = post.meta_description || 
    post.content_markdown.slice(0, 150).replace(/[#*`\[\]]/g, "") + "...";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5">
          {/* Image */}
          {post.image_url && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
                AI & Tech
              </span>
              <span className="text-xs text-muted">{formattedDate}</span>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
              {post.title}
            </h3>

            <p className="text-sm text-muted line-clamp-3 mb-4">
              {excerpt}
            </p>

            <div className="flex items-center text-accent text-sm font-medium">
              Read more
              <motion.span
                className="ml-1 inline-block"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                →
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
