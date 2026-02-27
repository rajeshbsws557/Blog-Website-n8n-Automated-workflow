"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BlogImage } from "@/components/BlogImage";
import type { Post } from "@/lib/types";

interface LatestPostsProps {
  posts: Omit<Post, "content_markdown">[];
}

export function LatestPosts({ posts }: LatestPostsProps) {
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  const formattedDate = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-4">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
          </span>
          <h2 className="text-2xl md:text-3xl font-bold">Latest News</h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-accent/40 to-transparent" />
      </motion.div>

      {/* Featured Layout: 1 big + 2 side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Main Featured Post */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3 group"
        >
          <Link href={`/blog/${featured.slug}`} className="block h-full">
            <div className="relative h-full min-h-[340px] md:min-h-[420px] rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-accent/40 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10">
              {/* Background Image */}
              {featured.image_url ? (
                <BlogImage
                  src={featured.image_url}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-secondary/20" />
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white">
                    Featured
                  </span>
                  <span className="text-xs text-white/70">
                    {formattedDate(featured.published_at)}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-light transition-colors">
                  {featured.title}
                </h3>
                {featured.meta_description && (
                  <p className="text-sm md:text-base text-white/70 line-clamp-2 max-w-xl">
                    {featured.meta_description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-4 text-accent-light text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Read article <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.article>

        {/* Side Posts */}
        {rest.length > 0 && (
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rest.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group flex-1"
              >
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <div className="relative h-full min-h-[180px] rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-accent/40 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10">
                    {/* Background Image */}
                    {post.image_url ? (
                      <BlogImage
                        src={post.image_url}
                        alt={post.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/20 to-accent/20" />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-secondary/90 text-white">
                          New
                        </span>
                        <span className="text-xs text-white/70">
                          {formattedDate(post.published_at)}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-white line-clamp-2 group-hover:text-accent-light transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
