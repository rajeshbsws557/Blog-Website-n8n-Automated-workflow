"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Gradient orbs — CSS-only animation (no JS repaints) */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl hero-orb-1" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl hero-orb-2" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-accent">
              AI-Powered Tech Insights
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Explore the Future of{" "}
            <span className="gradient-text">AI &amp; Technology</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted mb-10">
            Deep dives into artificial intelligence, machine learning, cloud
            computing, and the technologies reshaping our digital world.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/blog"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-secondary text-white font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Read Articles
            </Link>
            <Link
              href="/search"
              className="px-8 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-card hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Search Topics
            </Link>
          </motion.div>

          {/* Newsletter subscription */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 max-w-md mx-auto"
          >
            <p className="text-sm text-muted mb-3">
              Get the latest insights delivered to your inbox
            </p>
            <NewsletterForm />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
