import { api } from "@syntaxia/backend/convex/_generated/api";
import { LoadingTerminal } from "@syntaxia/ui/interview";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/interview/setup")({
  component: InterviewSetup,
  validateSearch: (search): { sessionId: string } => ({
    sessionId: (search.sessionId as string) || "",
  }),
});

function InterviewSetup() {
  const navigate = useNavigate();
  const { sessionId } = Route.useSearch();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("Preparing session...");
  const [hasStartedSetup, setHasStartedSetup] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Convex hooks
  const startSetupAction = useAction(api.sessions.startSetup);
  const session = useQuery(
    api.sessions.getSession,
    sessionId ? { sessionId } : "skip",
  );

  useEffect(() => {
    if (!sessionId) {
      navigate({ to: "/interview" });
      return;
    }

    // Start setup process only once
    if (!hasStartedSetup) {
      setHasStartedSetup(true);
      setLoadingStep("Parsing job description...");
      startSetupAction({ sessionId }).catch((error: any) => {
        console.error("Failed to start setup:", error);
        if (retryCount < 1) {
          toast.error("Failed to process job description", {
            action: {
              label: "Retry",
              onClick: () => {
                setRetryCount((prev) => prev + 1);
                setHasStartedSetup(false); // Reset to allow retry
              },
            },
          });
          setHasStartedSetup(false); // Reset to allow retry
        } else {
          toast.error(
            "Failed to process job description. Returning to start page.",
          );
          setTimeout(() => navigate({ to: "/interview" }), 2000);
        }
      });
    }
  }, [sessionId, hasStartedSetup, startSetupAction, navigate, retryCount]);

  // Monitor session status and progress
  useEffect(() => {
    if (!session) return;

    // Update loading steps based on session status
    if (session.status === "setup" && !session.questions) {
      // Still processing
      const loadingSteps = [
        "Parsing job description...",
        "Analyzing required skills...",
        "Generating technical questions...",
        "Calibrating difficulty level...",
        "Preparing interview session...",
      ];

      // Cycle through steps for visual feedback
      const stepIndex = Math.floor(Date.now() / 1000) % loadingSteps.length;
      setLoadingStep(loadingSteps[stepIndex]);
      setLoadingProgress(Math.min(loadingProgress + 2, 85)); // Keep progress moving but not complete
    } else if (session.questions) {
      // Questions are ready, navigate to session
      setLoadingStep("Interview session ready!");
      setLoadingProgress(100);
      setTimeout(() => {
        navigate({
          to: "/interview/session/$sessionId",
          params: { sessionId },
        });
      }, 500); // Small delay for UX
    }
  }, [session, navigate, sessionId, loadingProgress]);

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
