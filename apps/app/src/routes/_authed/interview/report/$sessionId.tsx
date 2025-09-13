import { api } from "@syntaxia/backend/api";
import { Button } from "@syntaxia/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { validateSessionForRoute } from "@/utils/route-guards";

type Highlight = {
  id: string;
  timestamp: number;
  type: "strength" | "improvement" | "concern";
  text: string;
  analysis: string;
  transcriptId: string;
};

interface TerminalPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

function TerminalPagination({
  currentPage,
  totalPages,
  onPageChange,
}: TerminalPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="border-t border-terminal-green/30 px-4 py-3 bg-terminal-dark">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 font-mono text-xs">
        <div className="flex items-center justify-center sm:justify-end space-x-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-2 py-1 transition-colors h-8 min-w-16 disabled:opacity-50 disabled:hover:text-terminal-green"
          >
            ./prev
          </button>
          <span className="text-terminal-green/60 px-2 py-1 min-w-12 text-center">
            {currentPage + 1}/{totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-2 py-1 transition-colors h-8 min-w-16 disabled:opacity-50 disabled:hover:text-terminal-green"
          >
            ./next
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_authed/interview/report/$sessionId")({
  component: InterviewReport,
});

function InterviewReport() {
  const navigate = useNavigate();
  const { sessionId } = Route.useParams();

  const session = useQuery(api.sessions.getSession, {
    sessionId: sessionId as GenericId<"interview_sessions">,
  });

  const [strengthsPage, setStrengthsPage] = useState(0);
  const [improvementsPage, setImprovementsPage] = useState(0);
  const ITEMS_PER_PAGE = 5;

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
    navigate({ to: "/interview", search: { sessionId: undefined } });
  };

  const isShortSession = session ? (session.duration || 0) < 120 : false;

  const strengthHighlights = useMemo(() => {
    return (
      session?.highlights?.filter((h: Highlight) => h.type === "strength") || []
    );
  }, [session?.highlights]);

  const improvementHighlights = useMemo(() => {
    return (
      session?.highlights?.filter(
        (h: Highlight) => h.type === "improvement" || h.type === "concern",
      ) || []
    );
  }, [session?.highlights]);

  const paginatedStrengths = useMemo(() => {
    const start = strengthsPage * ITEMS_PER_PAGE;
    return strengthHighlights.slice(start, start + ITEMS_PER_PAGE);
  }, [strengthHighlights, strengthsPage, ITEMS_PER_PAGE]);

  const paginatedImprovements = useMemo(() => {
    const start = improvementsPage * ITEMS_PER_PAGE;
    return improvementHighlights.slice(start, start + ITEMS_PER_PAGE);
  }, [improvementHighlights, improvementsPage, ITEMS_PER_PAGE]);

  const strengthsTotalPages = Math.max(
    1,
    Math.ceil(strengthHighlights.length / ITEMS_PER_PAGE),
  );
  const improvementsTotalPages = Math.max(
    1,
    Math.ceil(improvementHighlights.length / ITEMS_PER_PAGE),
  );

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

  if (session === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="border border-terminal-green/30 bg-background mb-8">
          <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
            <span className="font-mono text-terminal-green">
              interview-report.log
            </span>
            <span className="text-terminal-green/60 ml-4">
              generated:{" "}
              {new Date(
                session.reportGeneratedAt ||
                  session.completedAt ||
                  session._creationTime,
              ).toISOString()}
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
                    SCORE: {session.scores.overall}/10
                  </span>
                </div>
              ) : session.failureMessage || session.failureCode ? (
                <div className="mt-2 border border-orange-400 bg-orange-400/10 px-3 py-2">
                  <span className="text-orange-400 font-mono">
                    ANALYSIS_UNAVAILABLE
                    {session.failureMessage
                      ? `: ${session.failureMessage}`
                      : ""}
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="border border-terminal-green/30 bg-background">
            <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
              <span className="font-mono text-terminal-green">
                strengths.log
              </span>
            </div>
            <div className="p-4 space-y-4 min-h-48">
              {isShortSession ? (
                <div className="text-center py-4">
                  <div className="text-orange-400 text-sm">
                    ⚠ Session was too short for detailed strength analysis. Try
                    a longer session next time.
                  </div>
                </div>
              ) : strengthHighlights.length > 0 ? (
                paginatedStrengths.map(
                  (highlight: Highlight, index: number) => (
                    <div
                      key={highlight.id || index}
                      className="border-l-4 border-terminal-green pl-4"
                    >
                      <div className="text-terminal-green/60 font-mono text-xs mb-1">
                        [{Math.floor(highlight.timestamp / 60)}:
                        {(highlight.timestamp % 60).toString().padStart(2, "0")}
                        ] POSITIVE_SIGNAL [line{" "}
                        {strengthsPage * ITEMS_PER_PAGE + index + 1}]
                      </div>
                      <div className="text-sm mb-2 text-terminal-green">
                        "{highlight.text}"
                      </div>
                      <div className="text-xs text-terminal-green">
                        ✓ {highlight.analysis}
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="text-center py-4">
                  <span className="text-terminal-green/60 text-sm">
                    {session.scores?.comments?.strengths?.map(
                      (strength: string) => (
                        <div
                          key={`strength-${strength}`}
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
            {strengthHighlights.length > ITEMS_PER_PAGE && (
              <TerminalPagination
                currentPage={strengthsPage}
                totalPages={strengthsTotalPages}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={strengthHighlights.length}
                onPageChange={setStrengthsPage}
              />
            )}
          </div>

          <div className="border border-terminal-green/30 bg-background">
            <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
              <span className="font-mono text-orange-400">
                improvements.log
              </span>
            </div>
            <div className="p-4 space-y-4 min-h-48">
              {isShortSession ? (
                <div className="text-center py-4">
                  <span className="text-terminal-green/60 text-sm">
                    {session.scores?.comments?.improvements?.map(
                      (improvement: string) => (
                        <div
                          key={`improvement-short-${improvement}`}
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
              ) : improvementHighlights.length > 0 ? (
                paginatedImprovements.map(
                  (highlight: Highlight, index: number) => (
                    <div
                      key={highlight.id || index}
                      className="border-l-4 border-orange-400 pl-4"
                    >
                      <div className="text-terminal-green/60 font-mono text-xs mb-1">
                        [{Math.floor(highlight.timestamp / 60)}:
                        {(highlight.timestamp % 60).toString().padStart(2, "0")}
                        ] WARNING [line{" "}
                        {improvementsPage * ITEMS_PER_PAGE + index + 1}]
                      </div>
                      <div className="text-sm mb-2 text-terminal-green">
                        "{highlight.text}"
                      </div>
                      <div className="text-xs text-orange-400">
                        ⚠ {highlight.analysis}
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="text-center py-4">
                  <span className="text-terminal-green/60 text-sm">
                    {session.scores?.comments?.improvements?.map(
                      (improvement: string) => (
                        <div
                          key={`improvement-${improvement}`}
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
            {improvementHighlights.length > ITEMS_PER_PAGE && (
              <TerminalPagination
                currentPage={improvementsPage}
                totalPages={improvementsTotalPages}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={improvementHighlights.length}
                onPageChange={setImprovementsPage}
              />
            )}
          </div>
        </div>

        <div className="border border-terminal-green/30 bg-background mb-8">
          <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
            <span className="font-mono text-terminal-amber">next-steps.sh</span>
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
                session.scores.comments.nextSteps.map((step: string) => (
                  <div
                    key={`step-${step}`}
                    className="flex items-start space-x-2"
                  >
                    <span className="text-terminal-green">$</span>
                    <span className="text-terminal-green">{step}</span>
                  </div>
                ))
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
  );
}
