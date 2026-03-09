"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { NewsletterForm } from "@/components/NewsletterForm";
// External link icon component
function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

const TOPICS = [
  "AI",
  "Machine Learning",
  "Deep Learning",
  "Cloud",
  "DevOps",
  "Web Dev",
] as const;

const CURRENT_YEAR = new Date().getFullYear();

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
                { href: "/blog", label: "All Articles" },
                { href: "/search", label: "Search" },
                { href: "/about", label: "About" },
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

        {/* AdChoices / Ad Disclosure Section */}
        <div className="mt-10 pt-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs text-muted">
              <span className="font-medium text-foreground/80 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                AdChoices
              </span>
              <span className="hidden sm:inline text-border">|</span>
              <span>
                This site uses Google AdSense to display ads.{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-accent hover:text-accent-light underline underline-offset-2 transition-colors"
                >
                  Learn more
                  <ExternalLinkIcon className="w-3 h-3" />
                </a>{" "}
                about how Google uses your data.
              </span>
            </div>
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-accent transition-colors flex items-center gap-1"
            >
              Manage ad preferences
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            {/* Copyright Info */}
            <div className="text-sm text-muted">
              <p className="mb-1">
                <span className="text-foreground font-medium">
                  © {CURRENT_YEAR} Daily Developer Insights. All rights reserved.
                </span>
              </p>
              <p className="text-xs text-muted/80">
                Content is for informational purposes only. Not professional advice.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-xs">
              <Link
                href="/terms"
                className="text-muted hover:text-accent transition-colors underline underline-offset-2"
              >
                Terms
              </Link>
              <span className="text-border">|</span>
              <Link
                href="/privacy"
                className="text-muted hover:text-accent transition-colors underline underline-offset-2"
              >
                Privacy
              </Link>
              <span className="text-border">|</span>
              <Link
                href="/about"
                className="text-muted hover:text-accent transition-colors underline underline-offset-2"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
