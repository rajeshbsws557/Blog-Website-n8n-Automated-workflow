"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeAction, type SubscribeResult } from "@/app/actions";

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState<SubscribeResult | null, FormData>(
    subscribeAction,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {showSuccess ? (
          /* ── Success state ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex flex-col items-center gap-3 py-4"
          >
            {/* Animated checkmark circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.1 }}
              className="w-14 h-14 rounded-full bg-success/15 border border-success/30 flex items-center justify-center"
            >
              <motion.svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-success"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                />
              </motion.svg>
            </motion.div>

            <p className="text-sm font-medium text-success text-center">
              {state?.success ? state.message : "Subscribed!"}
            </p>

            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="text-xs text-muted hover:text-accent transition-colors mt-1"
            >
              Subscribe another email
            </button>
          </motion.div>
        ) : (
          /* ── Form state ── */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <form ref={formRef} action={formAction} className="flex flex-col gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-accent/20 to-accent-secondary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />

                <div className="relative flex">
                  {/* Email icon */}
                  <div className="flex items-center pl-3.5 pr-1 bg-card border border-r-0 border-border/60 rounded-l-lg">
                    <svg
                      className="w-4.5 h-4.5 text-muted group-focus-within:text-accent transition-colors duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>

                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    disabled={isPending}
                    className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-card border border-x-0 border-border/60 text-foreground placeholder:text-muted/60 focus:outline-none disabled:opacity-50 transition-colors"
                  />

                  <motion.button
                    type="submit"
                    disabled={isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary rounded-r-lg hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 transition-all duration-200 whitespace-nowrap cursor-pointer"
                  >
                    {isPending ? (
                      <motion.span
                        className="flex items-center gap-1.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
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
                        Subscribing…
                      </motion.span>
                    ) : (
                      "Subscribe"
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Error / already-subscribed feedback */}
              <AnimatePresence>
                {state && !state.success && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-center text-danger"
                  >
                    {state.error}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            <p className="text-[11px] text-muted/60 text-center mt-2.5">
              No spam, ever. Unsubscribe anytime.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
