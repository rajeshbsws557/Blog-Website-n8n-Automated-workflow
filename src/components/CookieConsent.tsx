"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export function CookieConsent() {
  const { consent, hasDecided, isLoaded, updateConsent, acceptAll, declineAll } =
    useCookieConsent();
  const [showCustomize, setShowCustomize] = useState(false);

  // Don't show until consent is loaded from storage
  if (!isLoaded) {
    return null;
  }

  // Don't show if user has already decided
  if (hasDecided) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl p-6">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                🍪 Cookie Preferences
              </h3>
              <p className="text-sm text-muted mt-1">
                We use cookies to enhance your experience, serve personalized
                content, and analyze our traffic. By clicking &quot;Accept All&quot;, you
                consent to our use of cookies, including for Google AdSense and
                Google Analytics.
              </p>
            </div>

            {/* Customization Panel */}
            {showCustomize && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 space-y-3"
              >
                {/* Essential - Always On */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Essential Cookies
                    </p>
                    <p className="text-xs text-muted">
                      Required for the website to function properly
                    </p>
                  </div>
                  <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-accent">
                    <span className="translate-x-4 inline-block h-3 w-3 rounded-full bg-white" />
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Analytics Cookies
                    </p>
                    <p className="text-xs text-muted">
                      Help us understand how visitors interact with our website
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateConsent({ analytics: !consent.analytics })
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      consent.analytics ? "bg-accent" : "bg-muted/50"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 rounded-full bg-white transition-transform ${
                        consent.analytics ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Advertising */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Advertising Cookies
                    </p>
                    <p className="text-xs text-muted">
                      Used by Google AdSense to display relevant ads
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateConsent({ advertising: !consent.advertising })
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      consent.advertising ? "bg-accent" : "bg-muted/50"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 rounded-full bg-white transition-transform ${
                        consent.advertising
                          ? "translate-x-4"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <a
                    href="/privacy"
                    className="text-accent hover:text-accent-light underline underline-offset-2"
                  >
                    Privacy Policy
                  </a>
                  <span className="text-muted">•</span>
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-light underline underline-offset-2"
                  >
                    Google Ad Settings
                  </a>
                </div>
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCustomize(!showCustomize)}
                className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground hover:border-accent/30 transition-all"
              >
                {showCustomize ? "Hide Options" : "Customize"}
              </button>

              {showCustomize && (
                <button
                  onClick={() => {
                    updateConsent({
                      essential: true,
                      analytics: consent.analytics,
                      advertising: consent.advertising,
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground hover:border-accent/30 transition-all"
                >
                  Save Preferences
                </button>
              )}

              <button
                onClick={declineAll}
                className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground hover:border-accent/30 transition-all sm:ml-auto"
              >
                Decline All
              </button>

              <button
                onClick={acceptAll}
                className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
