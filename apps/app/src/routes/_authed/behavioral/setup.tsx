import { api } from "@syntaxia/backend/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction, useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import { useCallback, useEffect, useRef, useState } from "react";
import { isRateLimitFailure, showRateLimitToast } from "@/utils/rate-limit";

export const Route = createFileRoute("/_authed/behavioral/setup")({
  validateSearch: (search: { sessionId: GenericId<"interview_sessions"> }) => ({
    sessionId: search.sessionId,
  }),
  component: BehavioralSetup,
});

function BehavioralSetup() {
  const navigate = useNavigate();
  const { sessionId } = Route.useSearch() as {
    sessionId: GenericId<"interview_sessions">;
  };
  const startSetup = useAction(api.behavioral.startSetup);
  const session = useQuery(
    api.sessions.getSession,
    sessionId ? { sessionId } : "skip",
  );
  const [loadingStep, setLoadingStep] = useState("Preparing session...");
  const startedRef = useRef(false);

  const start = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setLoadingStep("Preparing behavioral session...");
    const res = await startSetup({ sessionId });
    if (isRateLimitFailure(res)) {
      showRateLimitToast(
        (res as { retryAfterMs?: number }).retryAfterMs,
        "Failed to start session",
      );
      startedRef.current = false;
      return;
    }
  }, [sessionId, startSetup]);

  useEffect(() => {
    if (!startedRef.current && sessionId) start();
  }, [sessionId, start]);

  useEffect(() => {
    if (session === undefined) return;
    if (session === null) {
      navigate({ to: "/behavioral", search: { sessionId: undefined } });
      return;
    }
    if (session.status === "setup" && session.questions?.length) {
      navigate({ to: "/behavioral/session/$sessionId", params: { sessionId } });
      return;
    }
  }, [session, navigate, sessionId]);

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      const steps = [
        "Loading questions...",
        "Configuring voice agent...",
        "Warming up session...",
      ];
      const i = Math.floor(Date.now() / 1500) % steps.length;
      setLoadingStep(steps[i]);
    }, 100);
    return () => clearInterval(interval);
  }, [session]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-mono">
      <div className="text-center">
        <div className="text-terminal-green/60 mb-2">{loadingStep}</div>
        <div className="w-2 h-2 bg-terminal-green animate-pulse mx-auto"></div>
      </div>
    </div>
  );
}
