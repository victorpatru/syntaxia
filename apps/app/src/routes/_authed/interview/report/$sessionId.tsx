import { api } from "@syntaxia/backend/convex/_generated/api";
import { Button } from "@syntaxia/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { validateSessionForRoute } from "@/utils/route-guards";

// Local type definitions for strong typing
type Highlight = {
  id: string;
  timestamp: number;
  type: "strength" | "improvement" | "concern";
  text: string;
  analysis: string;
  transcriptId: string;
};

export const Route = createFileRoute("/_authed/interview/report/$sessionId")({
  component: InterviewReport,
});

function InterviewReport() {
  const navigate = useNavigate();
  const { sessionId } = Route.useParams();

  // Load session data from Convex
  const session = useQuery(api.sessions.getSession, { sessionId });

  // Navigate based on session validity and status
  useEffect(() => {
    if (session === undefined) return;

    const validation = validateSessionForRoute(session, ["complete"]);
    if (!validation.isValid && validation.redirectTo) {
      navigate({ to: validation.redirectTo });
    }
  }, [session, session?.status, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startNewInterview = () => {
    navigate({ to: "/interview" });
  };

  // Helper to determine if session was too short for meaningful analysis
  const isShortSession = session ? (session.duration || 0) < 120 : false;

  // Loading state
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-terminal-green/60 mb-2">Loading report...</div>
          <div className="w-2 h-2 bg-terminal-green animate-pulse mx-auto"></div>
        </div>
      </div>
    );
  }

  // Not found: let the effect handle navigation without rendering a flicker
  if (session === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="border border-terminal-green/30 bg-background mb-8">
            <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
              <span className="font-mono text-terminal-green">
                interview-report.log
              </span>
              <span className="text-terminal-green/60 ml-4">
                generated: {new Date().toISOString()}
              </span>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <span className="text-terminal-green/60 font-mono text-sm">
                  SESSION_DURATION:
                </span>
                <span className="ml-2 text-terminal-green">
                  {formatTime(session.duration || 0)}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-terminal-green/60 font-mono text-sm">
                  OVERALL_ASSESSMENT:
                </span>
                {isShortSession ? (
                  <div className="mt-2 border border-orange-400 bg-orange-400/10 px-3 py-2">
                    <span className="text-orange-400 font-mono">
                      SESSION_TOO_SHORT_FOR_ANALYSIS
                    </span>
                  </div>
                ) : session.scores ? (
                  <div className="mt-2 border border-terminal-amber bg-terminal-amber/10 px-3 py-2">
                    <span className="text-terminal-amber font-mono">
                      SCORE: {session.scores.overall}/4
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 border border-terminal-amber bg-terminal-amber/10 px-3 py-2">
                    <span className="text-terminal-amber font-mono">
                      ANALYSIS_PENDING
                    </span>
                  </div>
                )}
              </div>
              <div className="text-terminal-green/60 text-sm">
                {isShortSession
                  ? "Session ended early. For detailed analysis, sessions must be at least 2 minutes long."
                  : session.scores?.comments?.strengths?.[0] ||
                    "Technical interview completed successfully."}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-terminal-green/30 bg-background">
              <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
                <span className="font-mono text-terminal-green">
                  strengths.log
                </span>
              </div>
              <div className="p-4 space-y-4">
                {isShortSession ? (
                  <div className="text-center py-4">
                    <div className="text-orange-400 text-sm">
                      ⚠ Session was too short for detailed strength analysis.
                      Try a longer session next time.
                    </div>
                  </div>
                ) : session.highlights?.filter(
                    (h: Highlight) => h.type === "strength",
                  ).length ? (
                  session.highlights
                    .filter((h: Highlight) => h.type === "strength")
                    .slice(0, 3)
                    .map((highlight: Highlight, index: number) => (
                      <div
                        key={highlight.id || index}
                        className="border-l-4 border-terminal-green pl-4"
                      >
                        <div className="text-terminal-green/60 font-mono text-xs mb-1">
                          [{Math.floor(highlight.timestamp / 60)}:
                          {(highlight.timestamp % 60)
                            .toString()
                            .padStart(2, "0")}
                          ] POSITIVE_SIGNAL
                        </div>
                        <div className="text-sm mb-2 text-terminal-green">
                          "{highlight.text.slice(0, 60)}..."
                        </div>
                        <div className="text-xs text-terminal-green">
                          ✓ {highlight.analysis}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4">
                    <span className="text-terminal-green/60 text-sm">
                      {session.scores?.comments?.strengths?.map(
                        (strength: string, index: number) => (
                          <div
                            key={index}
                            className="border-l-4 border-terminal-green pl-4 mb-2"
                          >
                            <div className="text-xs text-terminal-green">
                              ✓ {strength}
                            </div>
                          </div>
                        ),
                      ) || "No specific strengths recorded."}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-terminal-green/30 bg-background">
              <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
                <span className="font-mono text-orange-400">
                  improvements.log
                </span>
              </div>
              <div className="p-4 space-y-4">
                {isShortSession ? (
                  <div className="text-center py-4">
                    <span className="text-terminal-green/60 text-sm">
                      {session.scores?.comments?.improvements?.map(
                        (improvement: string, index: number) => (
                          <div
                            key={index}
                            className="border-l-4 border-orange-400 pl-4 mb-2"
                          >
                            <div className="text-xs text-orange-400">
                              ⚠ {improvement}
                            </div>
                          </div>
                        ),
                      ) || (
                        <div className="text-orange-400 text-sm">
                          ⚠ Session was too short for detailed analysis. Try a
                          longer session next time.
                        </div>
                      )}
                    </span>
                  </div>
                ) : session.highlights?.filter(
                    (h: Highlight) =>
                      h.type === "improvement" || h.type === "concern",
                  ).length ? (
                  session.highlights
                    .filter(
                      (h: Highlight) =>
                        h.type === "improvement" || h.type === "concern",
                    )
                    .slice(0, 3)
                    .map((highlight: Highlight, index: number) => (
                      <div
                        key={highlight.id || index}
                        className="border-l-4 border-orange-400 pl-4"
                      >
                        <div className="text-terminal-green/60 font-mono text-xs mb-1">
                          [{Math.floor(highlight.timestamp / 60)}:
                          {(highlight.timestamp % 60)
                            .toString()
                            .padStart(2, "0")}
                          ] WARNING
                        </div>
                        <div className="text-sm mb-2 text-terminal-green">
                          "{highlight.text.slice(0, 60)}..."
                        </div>
                        <div className="text-xs text-orange-400">
                          ⚠ {highlight.analysis}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4">
                    <span className="text-terminal-green/60 text-sm">
                      {session.scores?.comments?.improvements?.map(
                        (improvement: string, index: number) => (
                          <div
                            key={index}
                            className="border-l-4 border-orange-400 pl-4 mb-2"
                          >
                            <div className="text-xs text-orange-400">
                              ⚠ {improvement}
                            </div>
                          </div>
                        ),
                      ) || "No specific improvements identified."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border border-terminal-green/30 bg-background mb-8">
            <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
              <span className="font-mono text-terminal-amber">
                next-steps.sh
              </span>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                {isShortSession ? (
                  <>
                    <div className="flex items-start space-x-2">
                      <span className="text-terminal-green">$</span>
                      <span className="text-terminal-green">
                        Practice with longer interview sessions
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-terminal-green">$</span>
                      <span className="text-terminal-green">
                        Focus on detailed technical explanations
                      </span>
                    </div>
                  </>
                ) : session.scores?.comments?.nextSteps?.length ? (
                  session.scores.comments.nextSteps.map(
                    (step: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-terminal-green">$</span>
                        <span className="text-terminal-green">{step}</span>
                      </div>
                    ),
                  )
                ) : (
                  <>
                    <div className="flex items-start space-x-2">
                      <span className="text-terminal-green">$</span>
                      <span className="text-terminal-green">
                        Continue practicing technical interviews regularly
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-terminal-green">$</span>
                      <span className="text-terminal-green">
                        Focus on clear communication and specific examples
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-terminal-green">$</span>
                      <span className="text-terminal-green">
                        Review fundamentals in {session.experienceLevel} level{" "}
                        {session.domainTrack} engineering
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={startNewInterview}
              className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              ./practice-again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
