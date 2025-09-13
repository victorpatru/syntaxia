import { api } from "@syntaxia/backend/api";
import { LoadingTerminal } from "@syntaxia/ui/interview";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAction, useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { isRateLimitFailure, showRateLimitToast } from "@/utils/rate-limit";
import { validateSetupRoute } from "@/utils/route-guards";

export const Route = createFileRoute("/_authed/interview/setup")({
  beforeLoad: ({ search }: { search: { sessionId: string } }) => {
    const sessionId = search.sessionId;
    if (!sessionId) {
      throw redirect({ to: "/interview", search: { sessionId: undefined } });
    }
  },
  component: InterviewSetup,
  validateSearch: (search: {
    sessionId: GenericId<"interview_sessions">;
  }): { sessionId: GenericId<"interview_sessions"> } => ({
    sessionId: search.sessionId,
  }),
});

function InterviewSetup() {
  const navigate = useNavigate();
  const { sessionId } = Route.useSearch() as {
    sessionId: GenericId<"interview_sessions">;
  };
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("Preparing session...");
  const hasStartedSetupRef = useRef(false);
  // removed unused retryCount state

  const startSetupAction = useAction(api.sessions.startSetup);
  const session = useQuery(
    api.sessions.getSession,
    sessionId ? { sessionId } : "skip",
  );

  const startSetupProcess = useCallback(async () => {
    if (hasStartedSetupRef.current) return;

    hasStartedSetupRef.current = true;
    setLoadingStep("Parsing job description...");

    try {
      const result = await startSetupAction({ sessionId });
      if (isRateLimitFailure(result)) {
        showRateLimitToast(
          result.retryAfterMs,
          "Failed to process job description",
        );
        hasStartedSetupRef.current = false;
        navigate({ to: "/interview/setup-failed", search: { sessionId } });
        return;
      }
      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        !result.success
      ) {
        hasStartedSetupRef.current = false;
        navigate({ to: "/interview/setup-failed", search: { sessionId } });
        return;
      }
    } catch (error: unknown) {
      console.error("Failed to start setup:", error);
      hasStartedSetupRef.current = false;
      navigate({ to: "/interview/setup-failed", search: { sessionId } });
    }
  }, [sessionId, startSetupAction, setLoadingStep, navigate]);

  useEffect(() => {
    if (!hasStartedSetupRef.current && sessionId) {
      startSetupProcess();
    }
  }, [sessionId, startSetupProcess]);

  useEffect(() => {
    if (session === undefined) return;

    const validation = validateSetupRoute(session);
    if (!validation.isValid && validation.redirectTo) {
      const url = new URL(validation.redirectTo, window.location.origin);
      navigate({
        to: url.pathname,
        search: Object.fromEntries(url.searchParams),
      });
    }
  }, [session, navigate]);

  useEffect(() => {
    if (!session || session.status !== "setup" || session.questions) return;

    const interval = setInterval(() => {
      const loadingSteps = [
        "Parsing job description...",
        "Analyzing required skills...",
        "Generating technical questions...",
        "Calibrating difficulty level...",
        "Preparing interview session...",
      ];

      const stepIndex = Math.floor(Date.now() / 1000) % loadingSteps.length;
      startTransition(() => {
        setLoadingStep(loadingSteps[stepIndex]);
        setLoadingProgress((prev) => Math.min(prev + 1, 95));
      });
    }, 200);

    return () => clearInterval(interval);
  }, [session?.status, session?.questions]);

  const additionalInfo = [
    `<span class="text-terminal-green font-mono">[INFO]</span> Job description length: ${session?.jobDescription?.length || 0} chars`,
    `<span class="text-terminal-amber">[AI]</span> Extracting technical requirements...`,
    ...(loadingProgress > 40
      ? [
          `<span class="text-terminal-amber">[AI]</span> Identified key technologies and skills`,
        ]
      : []),
    ...(loadingProgress > 80
      ? [
          `<span class="text-terminal-green">[READY]</span> Interview session prepared`,
        ]
      : []),
  ];

  if (session === undefined) {
    return (
      <LoadingTerminal
        progress={0}
        currentStep="Loading session..."
        title="syntaxia@ai-parser"
        subtitle="~/processing"
        additionalInfo={[
          `<span class=\"text-terminal-green font-mono\">[INFO]</span> Retrieving session data...`,
        ]}
      />
    );
  }

  if (
    session === null ||
    session.status === "analyzing" ||
    session.status === "complete"
  ) {
    return null;
  }

  return (
    <LoadingTerminal
      progress={loadingProgress}
      currentStep={loadingStep}
      title="syntaxia@ai-parser"
      subtitle="~/processing"
      additionalInfo={additionalInfo}
    />
  );
}
