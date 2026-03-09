"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Inline icon components to avoid lucide-react dependency
function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
    </svg>
  );
}
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    </svg>
  );
}
function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
}
function BanIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>
    </svg>
  );
}
function MousePointerClickIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.4 3 20 7.5"/><path d="m21.6 8.4-2.1 2.8"/><path d="M4.6 13.5l3.4 2.5"/><path d="m4 16.4 5.3 3.8c.4.3.9.5 1.4.5.5 0 1-.2 1.4-.5l2.1-1.6c.4-.3.6-.8.6-1.3V9.7c0-.5-.2-1-.6-1.3l-2.1-1.6c-.4-.3-.9-.5-1.4-.5-.5 0-1 .2-1.4.5l-5.3 3.8"/><path d="m9.5 10.5-6 6"/><path d="m14.5 10.5 6 6"/>
    </svg>
  );
}

const GUIDELINES = [
  {
    icon: FileTextIcon,
    text: "All content must be original and authored by you",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: ShieldIcon,
    text: "Use only images you own or have proper licensing for",
    color: "text-accent-secondary",
    bgColor: "bg-accent-secondary/10",
  },
  {
    icon: BanIcon,
    text: "No invalid traffic, bot visits, or artificial engagement",
    color: "text-danger",
    bgColor: "bg-danger/10",
  },
  {
    icon: MousePointerClickIcon,
    text: "Never click your own ads or encourage others to do so",
    color: "text-danger",
    bgColor: "bg-danger/10",
  },
] as const;

interface ContentPolicyNoticeProps {
  isAdmin?: boolean;
}

export function ContentPolicyNotice({ isAdmin = false }: ContentPolicyNoticeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the notice
    const dismissed = localStorage.getItem("contentPolicyNoticeDismissed");
    
    // Show notice if:
    // 1. User is admin (controlled by parent component)
    // 2. User hasn't dismissed it
    if (isAdmin && !dismissed) {
      setIsVisible(true);
    } else if (!isAdmin && dismissed !== "true") {
      // Non-admin users can also see it once unless dismissed
      // This behavior can be toggled as needed
      setIsVisible(true);
    }
  }, [isAdmin]);

  const handleDismiss = () => {
    setIsDismissed(true);
    // Wait for animation to complete
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem("contentPolicyNoticeDismissed", "true");
    }, 300);
  };

  const handleShowAgain = () => {
    localStorage.removeItem("contentPolicyNoticeDismissed");
    setIsDismissed(false);
    setIsVisible(true);
  };

  if (!isVisible && !isDismissed) {
    return isAdmin ? (
      <button
        onClick={handleShowAgain}
        className="fixed bottom-4 left-4 z-40 px-3 py-2 rounded-lg bg-card border border-border/50 shadow-lg hover:border-accent/30 transition-all text-xs text-muted hover:text-accent flex items-center gap-2"
      >
        <ShieldIcon className="w-4 h-4" />
        Show Content Guidelines
      </button>
    ) : null;
  }

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl"
        >
          <div className="rounded-xl border border-accent/30 bg-card/95 backdrop-blur-sm shadow-xl shadow-accent/5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-accent/10 to-accent-secondary/10 border-b border-accent/20">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">
                  AdSense Content Policy Guidelines
                </h3>
                {isAdmin && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-accent/10 transition-colors"
                aria-label="Dismiss content policy notice"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Guidelines Grid */}
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GUIDELINES.map((guideline, index) => (
                  <motion.div
                    key={guideline.text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-3 p-3 rounded-lg ${guideline.bgColor} border border-${guideline.color.replace("text-", "")}/20`}
                  >
                    <div className={`p-1.5 rounded-lg ${guideline.bgColor} shrink-0`}>
                      {guideline.icon({ className: `w-4 h-4 ${guideline.color}` })}
                    </div>
                    <span className="text-sm text-foreground/90 leading-relaxed">
                      {guideline.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-4 pt-3 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-xs text-muted">
                  Violations can result in AdSense account suspension. 
                  <a
                    href="https://support.google.com/adsense/topic/1250106"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-light underline underline-offset-2 ml-1"
                  >
                    Learn more
                  </a>
                </p>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ContentPolicyNotice;
