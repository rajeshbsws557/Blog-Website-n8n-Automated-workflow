"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { NewsletterForm } from "@/components/NewsletterForm";

const TOPICS = [
  "AI",
  "Machine Learning",
  "Deep Learning",
  "Cloud",
  "DevOps",
  "Web Dev",
] as const;

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-border/50 bg-card/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-lg font-bold gradient-text">Daily Developer Insights</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed">
              Cutting-edge insights on AI, Machine Learning, and emerging
              technologies shaping the future.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
            <div className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/search", label: "Search Articles" },
                { href: "/admin", label: "Admin Dashboard" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-muted hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Topics</h4>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => (
                <Link
                  key={topic}
                  href={`/search?q=${encodeURIComponent(topic)}`}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-border text-muted bg-card hover:border-accent/30 hover:text-accent transition-all duration-200"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>

          {/* Company / Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Company</h4>
            <div className="space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-muted hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Stay Updated</h4>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Get the latest articles delivered straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} Daily Developer Insights. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
}
