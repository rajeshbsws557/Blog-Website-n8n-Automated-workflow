"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="text-8xl mb-6"
        >
          ⚠️
        </motion.div>
        <h1 className="text-4xl font-extrabold mb-3">Something went wrong</h1>
        <p className="text-muted mb-8 max-w-md mx-auto">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-secondary text-white font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-card transition-all"
          >
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
