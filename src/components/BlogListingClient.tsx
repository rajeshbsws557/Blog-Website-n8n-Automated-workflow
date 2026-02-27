"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { BlogImage } from "@/components/BlogImage";

type PostListItem = Omit<Post, "content_markdown"> & {
  content_markdown?: string;
};

type SortOption = "newest" | "oldest" | "popular";

interface BlogListingClientProps {
  posts: PostListItem[];
}

const POSTS_PER_PAGE = 12;

export function BlogListingClient({ posts }: BlogListingClientProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = [...posts];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.meta_description && p.meta_description.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sort) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.published_at || 0).getTime() -
            new Date(b.published_at || 0).getTime()
        );
        break;
      case "popular":
        result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
      default: // newest
        result.sort(
          (a, b) =>
            new Date(b.published_at || 0).getTime() -
            new Date(a.published_at || 0).getTime()
        );
    }

    return result;
  }, [posts, search, sort]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  // Reset page when filter changes
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };
  const handleSortChange = (val: SortOption) => {
    setSort(val);
    setPage(1);
  };

  const formattedDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              All <span className="gradient-text">Articles</span>
            </h1>
            <p className="text-muted text-lg max-w-xl">
              Browse, search, and explore our complete collection of tech
              insights.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar: Search + Sort */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder-muted text-sm focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-foreground transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted whitespace-nowrap hidden sm:inline">
              Sort by:
            </span>
            <div className="flex rounded-xl border border-border overflow-hidden bg-card">
              {(
                [
                  { key: "newest", label: "Newest" },
                  { key: "oldest", label: "Oldest" },
                  { key: "popular", label: "Popular" },
                ] as { key: SortOption; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSortChange(opt.key)}
                  className={`px-3.5 py-2 text-xs font-medium transition-all ${
                    sort === opt.key
                      ? "bg-accent text-white"
                      : "text-muted hover:text-foreground hover:bg-card-hover"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="text-xs text-muted mb-6">
          {search
            ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
            : `${filtered.length} article${filtered.length !== 1 ? "s" : ""}`}
        </div>

        {/* Articles Grid */}
        <AnimatePresence mode="wait">
          {paginated.length > 0 ? (
            <motion.div
              key={`${search}-${sort}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginated.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <div className="relative h-full flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden shrink-0">
                        {post.image_url ? (
                          <BlogImage
                            src={post.image_url}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent-secondary/10 to-accent/5 flex items-center justify-center">
                            <span className="text-4xl opacity-40">📰</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-medium text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
                            AI & Tech
                          </span>
                          <span className="text-xs text-muted">
                            {formattedDate(post.published_at)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                          {post.title}
                        </h3>

                        {post.meta_description && (
                          <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">
                            {post.meta_description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                          <span className="text-accent text-sm font-medium flex items-center gap-1">
                            Read more <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                          </span>
                          {post.view_count > 0 && (
                            <span className="text-xs text-muted flex items-center gap-1">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              {post.view_count.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted text-sm">
                {search
                  ? "Try different keywords or clear your search."
                  : "Check back soon for new content."}
              </p>
              {search && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="mt-4 px-5 py-2 rounded-lg text-sm font-medium text-accent border border-accent/30 hover:bg-accent/10 transition-all"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:border-accent/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Show first, last, current, and neighbors
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - page) <= 1) return true;
                return false;
              })
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] ?? 0) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-10 h-10 flex items-center justify-center text-muted text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      p === page
                        ? "bg-accent text-white"
                        : "border border-border text-muted hover:text-foreground hover:border-accent/30"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:border-accent/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
