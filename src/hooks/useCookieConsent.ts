"use client";

import { useState, useEffect, useCallback } from "react";

export type CookieConsentType = {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
};

const STORAGE_KEY = "cookie-consent";

const defaultConsent: CookieConsentType = {
  essential: true,
  analytics: false,
  advertising: false,
};

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsentType>(defaultConsent);
  const [hasDecided, setHasDecided] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConsent({
          essential: true,
          analytics: parsed.analytics ?? false,
          advertising: parsed.advertising ?? false,
        });
        setHasDecided(true);
      } catch {
        // Invalid stored data, treat as undecided
      }
    }
    setIsLoaded(true);
  }, []);

  const updateConsent = useCallback((newConsent: Partial<CookieConsentType>) => {
    setConsent((prev) => {
      const updated = { ...prev, ...newConsent, essential: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setHasDecided(true);
  }, []);

  const acceptAll = useCallback(() => {
    const allAccepted: CookieConsentType = {
      essential: true,
      analytics: true,
      advertising: true,
    };
    setConsent(allAccepted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allAccepted));
    setHasDecided(true);
  }, []);

  const declineAll = useCallback(() => {
    const minimal: CookieConsentType = {
      essential: true,
      analytics: false,
      advertising: false,
    };
    setConsent(minimal);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
    setHasDecided(true);
  }, []);

  const hasConsented = useCallback(
    (type: keyof CookieConsentType): boolean => {
      return consent[type] === true;
    },
    [consent]
  );

  const resetConsent = useCallback(() => {
    setHasDecided(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    consent,
    hasDecided,
    isLoaded,
    hasConsented,
    updateConsent,
    acceptAll,
    declineAll,
    resetConsent,
  };
}
