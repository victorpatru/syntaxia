import { api } from "@syntaxia/backend/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction, useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import { startTransition, useEffect, useRef, useState } from "react";
import { isRateLimitFailure, showRateLimitToast } from "@/utils/rate-limit";

export const Route = createFileRoute("/_authed/behavioral/analysis/$sessionId")(
  {
    component: BehavioralAnalysis,
  },
);

function BehavioralAnalysis() {
  const navigate = useNavigate();
  const { sessionId } = Route.useParams() as {
    sessionId: GenericId<"interview_sessions">;
  };
  const session = useQuery(api.sessions.getSession, { sessionId });
  const analyzeAction = useAction(api.behavioral.analyzeSession);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0); // UI progression only
  const [analysisStep, setAnalysisStep] = useState("Preparing analysis...");
  const hasTriggeredRef = useRef(false);

  const trigger = async () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    const result = await analyzeAction({ sessionId });
    if (isRateLimitFailure(result)) {
      showRateLimitToast(
        (result as { retryAfterMs?: number }).retryAfterMs,
        "Failed to analyze interview",
      );
      hasTriggeredRef.current = false;
      return;
    }
  };

  useEffect(() => {
    if (!session) return;
    if (session.status === "analyzing" && !hasTriggeredRef.current) trigger();
    if (session.status === "complete") {
      navigate({ to: "/behavioral/report/$sessionId", params: { sessionId } });
    }
  }, [session?.status, navigate]);

  useEffect(() => {
    if (!session || session.status !== "analyzing") return;
    const interval = setInterval(() => {
      const steps = [
        "Processing audio transcript...",
        "Analyzing STAR structure...",
        "Identifying strengths...",
        "Finding improvement areas...",
        "Generating recommendations...",
      ];
      const i = Math.floor(Date.now() / 2000) % steps.length;
      startTransition(() => {
        setAnalysisStep(steps[i]);
        setAnalysisProgress((p) => Math.min(p + 1, 95));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [session?.status]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-mono">
      <div className="text-center">
        <div className="text-terminal-green/60 mb-2">{analysisStep}</div>
        <div className="w-2 h-2 bg-terminal-green animate-pulse mx-auto"></div>
      </div>
    </div>
  );
}
