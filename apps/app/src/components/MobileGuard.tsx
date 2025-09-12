import { Smartphone } from "lucide-react";
import type React from "react";

interface MobileGuardProps {
  children: React.ReactNode;
}

function getIsMobile(): boolean {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent.toLowerCase();

  return /android|iphone|ipad|ipod|blackberry|webos|windows phone/i.test(
    userAgent,
  );
}

export function MobileGuard({ children }: MobileGuardProps) {
  const isMobile = getIsMobile();
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background font-mono flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Terminal Window */}
          <div className="border border-terminal-green/30 bg-background">
            {/* Terminal Header */}
            <div className="border-b border-terminal-green/30 px-6 py-3 bg-terminal-dark">
              <span className="text-terminal-green font-mono">
                syntaxia@mobile
              </span>
              <span className="text-terminal-green/60">:</span>
              <span className="text-terminal-amber">~/access-denied</span>
              <span className="text-terminal-green/60">$</span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center mb-6">
                <Smartphone className="w-12 h-12 text-terminal-green/30" />
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="font-mono text-xl text-terminal-green mb-3">
                    Mobile Version Coming Soon
                  </h1>
                  <p className="text-terminal-green/70 font-mono text-sm leading-relaxed">
                    # Desktop experience required for technical interviews
                  </p>
                  <span className="text-terminal-green/70 text-sm">
                    # Please access Syntaxia from a desktop or laptop computer
                  </span>
                </div>
              </div>

              {/* Contact Section */}
              <div className="border border-terminal-green/30 bg-background/50 p-4">
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-terminal-green/40">&gt;</span>
                    <span className="text-terminal-green">
                      Questions or need mobile access?
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 pl-4">
                    <span className="text-terminal-green/60">Email:</span>
                    <a
                      href="mailto:victor@usesyntaxia.com"
                      className="text-terminal-amber hover:text-terminal-amber/80 transition-colors underline"
                    >
                      victor@usesyntaxia.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Command Prompt */}
              <div className="pt-4 border-t border-terminal-green/30">
                <div className="flex items-center space-x-2 font-mono text-sm">
                  <span className="text-terminal-green">syntaxia@mobile</span>
                  <span className="text-terminal-green/60">$</span>
                  <span className="text-terminal-green/70">
                    ./switch-to-desktop
                  </span>
                  <span className="animate-pulse text-terminal-green">█</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
