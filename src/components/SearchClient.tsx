"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/types";
import { BlogCard } from "./BlogCard";

export function SearchClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const supabase = createClient();

  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setSearched(false);
        return;
      }

      setLoading(true);
      setSearched(true);

      try {
        // Sanitize search input: escape LIKE special characters to prevent wildcard injection
        const sanitized = searchQuery
          .replace(/\\/g, "\\\\")
          .replace(/%/g, "\\%")
          .replace(/_/g, "\\_")
          .slice(0, 200); // Limit query length

        const { data } = await supabase
          .from("posts")
          .select("*")
          .eq("is_published", true)
          .or(
            `title.ilike.%${sanitized}%,content_markdown.ilike.%${sanitized}%,meta_description.ilike.%${sanitized}%`
          )
          .order("published_at", { ascending: false })
          .limit(20);

        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold mb-4">
          Search <span className="gradient-text">Articles</span>
        </h1>
        <p className="text-muted mb-8">
          Find articles on AI, machine learning, cloud computing, and more
        </p>

        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              className="w-5 h-5 text-muted"
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, content, or topic..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card text-foreground placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-lg"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-12"
          >
            <div className="flex items-center gap-3 text-muted">
              <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              Searching...
            </div>
          </motion.div>
        ) : searched ? (
          results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-muted mb-6">
                Found {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted">
                Try different keywords or check your spelling
              </p>
            </motion.div>
          )
        ) : (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">
              Start typing to search
            </h3>
            <p className="text-muted">
              Search through all published articles instantly
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
