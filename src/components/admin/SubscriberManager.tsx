"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { deleteSubscriber } from "@/app/admin/actions";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

interface SubscriberData {
  subscribers: Subscriber[];
  totalCount: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface Props {
  data: SubscriberData;
}

export function SubscriberManagerClient({ data }: Props) {
  const { subscribers, totalCount, page, totalPages } = data;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deleteSubscriber(id);
    if (result.success) {
      startTransition(() => {
        router.refresh();
      });
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const goToPage = (p: number) => {
    router.push(`/admin/subscribers?page=${p}`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Subscribers
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {totalCount.toLocaleString()} total subscriber{totalCount !== 1 ? "s" : ""}
          </p>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
      >
        <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 blur-xl" />
        <div className="relative bg-[#0c0c14]/80 backdrop-blur-xl rounded-2xl border border-white/[0.04] overflow-hidden">
          {subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg
                className="w-12 h-12 text-zinc-700 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-sm text-zinc-500">No subscribers yet</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_180px_60px] gap-4 px-6 py-3 border-b border-white/[0.04] bg-white/[0.02]">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Email
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Subscribed
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 text-center">
                  Action
                </span>
              </div>

              {/* Rows */}
              <AnimatePresence>
                {subscribers.map((sub, i) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="grid grid-cols-[1fr_180px_60px] gap-4 px-6 py-3.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center"
                  >
                    {/* Email */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-cyan-400 uppercase">
                          {sub.email[0]}
                        </span>
                      </div>
                      <span className="text-sm text-zinc-300 truncate">
                        {sub.email}
                      </span>
                    </div>

                    {/* Date */}
                    <span className="text-sm text-zinc-500">
                      {new Date(sub.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                    {/* Delete */}
                    <div className="flex justify-center">
                      {confirmDeleteId === sub.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(sub.id)}
                            disabled={deletingId === sub.id}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            title="Confirm delete"
                          >
                            {deletingId === sub.id ? (
                              <svg
                                className="w-4 h-4 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                            ) : (
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:bg-white/[0.04] transition-colors"
                            title="Cancel"
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
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(sub.id)}
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete subscriber"
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
                              strokeWidth={1.5}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2"
        >
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    pageNum === page
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </motion.div>
      )}
    </div>
  );
}
