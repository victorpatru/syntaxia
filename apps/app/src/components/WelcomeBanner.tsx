import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface WelcomeBannerProps {
  isEligible: boolean;
}

const DISMISSAL_KEY = "welcomeBannerDismissed";
const TTL_DAYS = 3;

export function WelcomeBanner({ isEligible }: WelcomeBannerProps) {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissalData = localStorage.getItem(DISMISSAL_KEY);
    if (dismissalData) {
      try {
        const { timestamp } = JSON.parse(dismissalData);
        const ttlMs = TTL_DAYS * 24 * 60 * 60 * 1000;
        const isStillDismissed = Date.now() - timestamp < ttlMs;

        if (isStillDismissed) {
          setIsDismissed(true);
        } else {
          // Clean up expired entry
          localStorage.removeItem(DISMISSAL_KEY);
        }
      } catch {
        // Invalid data, remove it
        localStorage.removeItem(DISMISSAL_KEY);
      }
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(
      DISMISSAL_KEY,
      JSON.stringify({
        timestamp: Date.now(),
      }),
    );
    setIsDismissed(true);
  };

  if (!isEligible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="border border-terminal-green/30 bg-background/95 backdrop-blur px-4 py-2 flex items-center gap-3">
        <span className="text-terminal-green text-xs">
          First session for $1 — use code
        </span>
        <code className="text-terminal-amber text-xs">WELCOME1</code>
        <button
          type="button"
          onClick={() => navigate({ to: "/credits" })}
          className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20 cursor-pointer"
        >
          ./redeem
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-terminal-green/60 hover:text-terminal-green text-lg ml-1 cursor-pointer leading-none"
          aria-label="Dismiss banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}
