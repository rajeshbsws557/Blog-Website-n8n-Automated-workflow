"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/types";
import { DeleteModal } from "./DeleteModal";

interface AdminDashboardClientProps {
  posts: Post[];
  userEmail: string;
}

type ViewMode = "grid" | "list";
type FilterStatus = "all" | "published" | "draft";
type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

export function AdminDashboardClient({
  posts: initialPosts,
  userEmail,
}: AdminDashboardClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", deleteTarget.id);

    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    }

    setDeleting(false);
    setDeleteTarget(null);
  };

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query) ||
          (p.meta_description && p.meta_description.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (filterStatus === "published") {
      result = result.filter((p) => p.is_published);
    } else if (filterStatus === "draft") {
      result = result.filter((p) => !p.is_published);
    }

    // Sort
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }, [posts, searchQuery, filterStatus, sortOption]);

  const publishedCount = posts.filter((p) => p.is_published).length;
  const draftCount = posts.filter((p) => !p.is_published).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Signed in as {userEmail}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="group px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-secondary text-white font-semibold text-sm hover:shadow-lg hover:shadow-accent/25 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </Link>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground hover:border-danger/30 hover:bg-danger/5 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        {[
          {
            label: "Total Posts",
            value: posts.length,
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            ),
            gradient: "from-accent/20 to-accent-secondary/20",
            iconBg: "bg-accent/10 text-accent",
            color: "text-accent",
          },
          {
            label: "Published",
            value: publishedCount,
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            gradient: "from-success/20 to-emerald-500/20",
            iconBg: "bg-success/10 text-success",
            color: "text-success",
          },
          {
            label: "Drafts",
            value: draftCount,
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ),
            gradient: "from-orange-500/20 to-amber-500/20",
            iconBg: "bg-orange-500/10 text-orange-400",
            color: "text-orange-400",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`relative overflow-hidden p-5 rounded-2xl border border-border/50 bg-card`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-30`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Toolbar: Search, Filters, View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-border/50 bg-card p-4 mb-6"
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search posts by title, slug, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center rounded-xl border border-border/50 bg-background overflow-hidden">
              {(["all", "published", "draft"] as FilterStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3.5 py-2 text-xs font-medium capitalize transition-all ${
                    filterStatus === status
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:text-foreground hover:bg-card-hover/50"
                  }`}
                >
                  {status}
                  {status === "all" && ` (${posts.length})`}
                  {status === "published" && ` (${publishedCount})`}
                  {status === "draft" && ` (${draftCount})`}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-3.5 py-2 rounded-xl bg-background border border-border/50 text-xs font-medium text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center rounded-xl border border-border/50 bg-background overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-all ${
                  viewMode === "grid"
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-foreground"
                }`}
                title="Grid view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-all ${
                  viewMode === "list"
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-foreground"
                }`}
                title="List view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search results count */}
        {(searchQuery || filterStatus !== "all") && (
          <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
            <p className="text-xs text-muted">
              Showing <span className="text-foreground font-medium">{filteredAndSortedPosts.length}</span>{" "}
              of <span className="text-foreground font-medium">{posts.length}</span> posts
              {searchQuery && (
                <> matching &ldquo;<span className="text-accent">{searchQuery}</span>&rdquo;</>
              )}
            </p>
            {(searchQuery || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                }}
                className="text-xs text-accent hover:text-accent-light transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Posts Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredAndSortedPosts.length > 0 ? (
          viewMode === "grid" ? (
            /* ===== GRID VIEW ===== */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.03 }}
                    className="group relative rounded-2xl border border-border/50 bg-card hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Card Header with Image or Gradient */}
                    {post.image_url ? (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                              post.is_published
                                ? "bg-success/20 text-success border border-success/30"
                                : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                post.is_published ? "bg-success" : "bg-orange-400"
                              }`}
                            />
                            {post.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-24 bg-gradient-to-br from-accent/5 via-accent-secondary/5 to-transparent">
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                              post.is_published
                                ? "bg-success/10 text-success border border-success/20"
                                : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                post.is_published ? "bg-success" : "bg-orange-400"
                              }`}
                            />
                            {post.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      {post.meta_description && (
                        <p className="text-xs text-muted line-clamp-2 mb-3">
                          {post.meta_description}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/30">
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(post.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <code className="text-[10px] text-muted/60 bg-background px-1.5 py-0.5 rounded max-w-[120px] truncate">
                          /{post.slug}
                        </code>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="px-4 pb-4 flex items-center gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border/50 text-muted hover:text-foreground hover:border-border transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="flex items-center justify-center p-2 rounded-xl text-xs font-medium border border-border/50 text-muted hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-all"
                        title="Delete post"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* ===== LIST VIEW ===== */
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-background/50">
                      <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3.5">
                        Post
                      </th>
                      <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">
                        Slug
                      </th>
                      <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3.5">
                        Status
                      </th>
                      <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3.5 hidden sm:table-cell">
                        Date
                      </th>
                      <th className="text-right text-xs font-medium text-muted uppercase tracking-wider px-5 py-3.5">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredAndSortedPosts.map((post, i) => (
                        <motion.tr
                          key={post.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-border/30 hover:bg-card-hover/50 transition-colors group"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {post.image_url ? (
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border/30">
                                  <img
                                    src={post.image_url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/10 to-accent-secondary/10 flex items-center justify-center flex-shrink-0 border border-border/30">
                                  <svg className="w-5 h-5 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-foreground text-sm line-clamp-1 group-hover:text-accent transition-colors">
                                  {post.title}
                                </p>
                                {post.meta_description && (
                                  <p className="text-xs text-muted/70 line-clamp-1 mt-0.5">
                                    {post.meta_description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <code className="text-xs text-muted bg-background px-2 py-1 rounded-md border border-border/30">
                              /{post.slug}
                            </code>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                post.is_published
                                  ? "bg-success/10 text-success border border-success/20"
                                  : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  post.is_published ? "bg-success" : "bg-orange-400"
                                }`}
                              />
                              {post.is_published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="px-5 py-4 hidden sm:table-cell">
                            <span className="text-xs text-muted">
                              {new Date(post.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/blog/${post.slug}`}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted hover:text-foreground hover:border-border transition-all"
                                title="View post"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </Link>
                              <Link
                                href={`/admin/posts/${post.id}/edit`}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-all"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => setDeleteTarget(post)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-all"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          /* ===== EMPTY STATE ===== */
          <div className="rounded-2xl border border-border/50 bg-card">
            <div className="text-center py-20">
              {searchQuery || filterStatus !== "all" ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-accent/5 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-muted font-medium mb-2">No matching posts found</p>
                  <p className="text-sm text-muted/70 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                    }}
                    className="inline-flex px-5 py-2.5 rounded-xl bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
                  >
                    Clear all filters
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-accent/5 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-muted font-medium mb-2">No posts yet</p>
                  <p className="text-sm text-muted/70 mb-4">
                    Get started by creating your first blog post
                  </p>
                  <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-secondary text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create your first post
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.title || ""}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
