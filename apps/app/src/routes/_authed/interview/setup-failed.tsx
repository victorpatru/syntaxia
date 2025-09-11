import { api } from "@syntaxia/backend/convex/_generated/api";
import type { Id } from "@syntaxia/backend/convex/_generated/dataModel";
import { Button } from "@syntaxia/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_authed/interview/setup-failed")({
  component: SetupFailed,
  validateSearch: (search: {
    sessionId?: Id<"interview_sessions">;
  }): { sessionId?: Id<"interview_sessions"> } => ({
    sessionId: search.sessionId,
  }),
});

function SetupFailed() {
  const navigate = useNavigate();
  const { sessionId } = Route.useSearch() as {
    sessionId?: Id<"interview_sessions">;
  };

  const session = useQuery(
    api.sessions.getSession,
    sessionId ? { sessionId } : "skip",
  );

  const failureCode = session?.failureCode || "UNKNOWN";
  const failureMessage = session?.failureMessage || "Setup failed.";

  const primaryCta = () => {
    if (failureCode === "CREDITS") {
      return (
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/credits" })}
          className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20"
        >
          ./buy-credits
        </Button>
      );
    }
    return (
      <Button
        variant="outline"
        onClick={() =>
          navigate({ to: "/interview", search: { sessionId: undefined } })
        }
        className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20"
      >
        ./start-new
      </Button>
    );
  };

  const secondaryCtas = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() =>
          navigate({
            to: "/interview",
            search: { sessionId },
          })
        }
        className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20"
      >
        ./edit-description
      </Button>
      {failureCode !== "CREDITS" && (
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/credits" })}
          className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20"
        >
          ./buy-credits
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto border border-terminal-green/30 bg-background">
          <div className="border-b border-terminal-green/30 px-6 py-3 bg-terminal-dark">
            <span className="text-terminal-green">syntaxia@setup</span>
            <span className="text-terminal-green/60">:</span>
            <span className="text-terminal-amber">~/failed</span>
            <span className="text-terminal-green/60">$</span>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-terminal-amber mb-2">[ERROR]</div>
              <div className="text-terminal-green">{failureMessage}</div>
              {failureCode && (
                <div className="text-terminal-green/60 text-sm mt-1">
                  code: {failureCode}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {primaryCta()}
              {secondaryCtas}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
