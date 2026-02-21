"use client";

import { useState } from "react";
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

export function AdminDashboardClient({
  posts: initialPosts,
  userEmail,
}: AdminDashboardClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted text-sm mt-1">
            Signed in as {userEmail}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-secondary text-white font-semibold text-sm hover:shadow-lg hover:shadow-accent/25 transition-all"
          >
            + New Post
          </Link>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground hover:border-danger/30 transition-all"
          >
            Sign Out
          </button>
        </div>
      </motion.div>

      {/* Stats */}
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
            color: "text-accent",
          },
          {
            label: "Published",
            value: posts.filter((p) => p.is_published).length,
            color: "text-success",
          },
          {
            label: "Drafts",
            value: posts.filter((p) => !p.is_published).length,
            color: "text-muted",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl border border-border/50 bg-card"
          >
            <p className="text-sm text-muted mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Posts Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border/50 bg-card overflow-hidden"
      >
        <div className="p-5 border-b border-border/50">
          <h2 className="text-lg font-semibold">All Posts</h2>
        </div>

        {posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                    Title
                  </th>
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Slug
                  </th>
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                    Date
                  </th>
                  <th className="text-right text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {posts.map((post, i) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/30 hover:bg-card-hover/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground text-sm line-clamp-1">
                          {post.title}
                        </p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <code className="text-xs text-muted bg-background px-2 py-0.5 rounded">
                          {post.slug}
                        </code>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            post.is_published
                              ? "bg-success/10 text-success"
                              : "bg-muted/10 text-muted"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              post.is_published ? "bg-success" : "bg-muted"
                            }`}
                          />
                          {post.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-xs text-muted">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted hover:text-accent hover:border-accent/30 transition-all"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(post)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted hover:text-danger hover:border-danger/30 transition-all"
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
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-muted mb-4">No posts yet</p>
            <Link
              href="/admin/posts/new"
              className="inline-flex px-5 py-2.5 rounded-xl bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
            >
              Create your first post
            </Link>
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
