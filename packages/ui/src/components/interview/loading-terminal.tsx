import { LoadingTerminalProps } from "@syntaxia/shared/types";

export function LoadingTerminal({
  progress,
  currentStep,
  title,
  subtitle,
  additionalInfo = [],
}: LoadingTerminalProps) {
  return (
    <div className="min-h-screen bg-background font-mono flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        <div className="border border-terminal-green/30 bg-background">
          <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
            <span className="text-terminal-green font-mono">{title}</span>
            <span className="text-terminal-green/60">:</span>
            <span className="text-terminal-amber">{subtitle}</span>
            <span className="text-terminal-green/60">$</span>
          </div>
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-terminal-green font-mono">&gt;</span>
                <span className="ml-2 text-terminal-green/60">
                  {currentStep}
                </span>
                <span className="ml-2 animate-pulse text-terminal-green">
                  |
                </span>
              </div>
            </div>

            {/* Terminal-style progress bar */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="text-terminal-green/60 font-mono text-sm">
                  Progress:
                </span>
                <span className="ml-2 text-terminal-green font-mono">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="border border-terminal-green/30 bg-background p-1">
                <div className="flex">
                  {Array.from({ length: 50 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < Math.floor(progress / 2)
                          ? "text-terminal-green"
                          : "text-terminal-green/20"
                      }`}
                    >
                      █
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Terminal output simulation */}
            <div className="space-y-1 text-sm">
              {additionalInfo.map((info, index) => (
                <div
                  key={index}
                  className="text-terminal-green/60"
                  dangerouslySetInnerHTML={{ __html: info }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
