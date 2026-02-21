"use client";

import { motion } from "framer-motion";

export function BlogCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-2xl border border-border/50 bg-card overflow-hidden"
        >
          <div className="h-48 skeleton" />
          <div className="p-5 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full skeleton" />
              <div className="h-5 w-20 rounded-full skeleton" />
            </div>
            <div className="h-6 w-3/4 rounded skeleton" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded skeleton" />
              <div className="h-4 w-2/3 rounded skeleton" />
            </div>
            <div className="h-4 w-24 rounded skeleton" />
          </div>
        </motion.div>
      ))}
    </>
  );
}
