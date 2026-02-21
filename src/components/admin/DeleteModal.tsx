"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({
  isOpen,
  title,
  loading,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md rounded-2xl border border-border/50 bg-card p-6"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-danger"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete Post</h3>
              <p className="text-sm text-muted mb-6">
                Are you sure you want to delete &ldquo;{title}&rdquo;? This
                action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
