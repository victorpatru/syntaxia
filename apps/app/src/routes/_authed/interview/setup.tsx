import { api } from "@syntaxia/backend/convex/_generated/api";
import { LoadingTerminal } from "@syntaxia/ui/interview";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAction, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/interview/setup")({
  beforeLoad: ({ search }) => {
    const sessionId = (search as any).sessionId;
    if (!sessionId) {
      throw redirect({ to: "/interview" });
    }
  },
  component: InterviewSetup,
  validateSearch: (search): { sessionId: string } => ({
    sessionId: (search.sessionId as string) || "",
  }),
});

function InterviewSetup() {
  const navigate = useNavigate();
  const { sessionId } = Route.useSearch() as { sessionId: string };
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("Preparing session...");
  const hasStartedSetupRef = useRef(false);
  const [retryCount, setRetryCount] = useState(0);

  // Convex hooks
  const startSetupAction = useAction(api.sessions.startSetup);
  const session = useQuery(
    api.sessions.getSession,
    sessionId ? { sessionId } : "skip",
  );

  // Start setup process - moved from useEffect to improve performance and follow React patterns
  const startSetupProcess = async () => {
    if (hasStartedSetupRef.current) return;

    hasStartedSetupRef.current = true;
    setLoadingStep("Parsing job description...");

    try {
      await startSetupAction({ sessionId });
    } catch (error: any) {
      console.error("Failed to start setup:", error);
      hasStartedSetupRef.current = false; // Reset for retry

      if (retryCount < 1) {
        toast.error("Failed to process job description", {
          action: {
            label: "Retry",
            onClick: () => {
              setRetryCount((prev) => prev + 1);
              startSetupProcess();
            },
          },
        });
      } else {
        toast.error(
          "Failed to process job description. Returning to start page.",
        );
        setTimeout(() => navigate({ to: "/interview" }), 2000);
      }
    }
  };

  // Use useEffect for setup initialization to prevent infinite renders
  useEffect(() => {
    if (!hasStartedSetupRef.current && sessionId) {
      startSetupProcess();
    }
  }, [sessionId, startSetupProcess]);

  // Use useEffect for navigation to prevent infinite renders
  useEffect(() => {
    if (session === undefined) return;

    // Not found: redirect user out of setup
    if (session === null) {
      navigate({ to: "/interview" });
      return;
    }

    // If analysis already started or completed, navigate accordingly
    if (session.status === "analyzing") {
      navigate({
        to: "/interview/analysis/$sessionId",
        params: { sessionId },
      });
      return;
    }

    if (session.status === "complete") {
      navigate({
        to: "/interview/report/$sessionId",
        params: { sessionId },
      });
      return;
    }

    // If questions are ready, go to the live session view
    if (session?.questions) {
      navigate({
        to: "/interview/session/$sessionId",
        params: { sessionId },
      });
    }
  }, [session, session?.status, session?.questions, navigate, sessionId]);

  // Use useEffect for progress animation to prevent infinite renders
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
      setLoadingStep(loadingSteps[stepIndex]);
      setLoadingProgress((prev) => Math.min(prev + 4, 100));
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

  // Only render setup UI when in loading or setup states to avoid flicker
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
    // Let the effect handle navigation without rendering the setup UI
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
