import { api } from "@syntaxia/backend/convex/_generated/api";
import { LoadingTerminal } from "@syntaxia/ui/interview";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction as useConvexAction, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/interview/analysis/$sessionId")({
  component: InterviewAnalysis,
});

function InterviewAnalysis() {
  const navigate = useNavigate();
  const { sessionId } = Route.useParams();
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState("Preparing analysis...");
  const [hasTriggeredAnalysis, setHasTriggeredAnalysis] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Convex hooks
  const session = useQuery(api.sessions.getSession, { sessionId });
  const analyzeAction = useConvexAction(api.sessions.analyzeSession);

  // Trigger analysis once when session is ready
  useEffect(() => {
    if (!session || hasTriggeredAnalysis) return;

    // Only proceed if session is in analyzing status
    if (session.status !== "analyzing") {
      // Redirect based on status
      if (session.status === "setup") {
        navigate({ to: "/interview/setup", search: { sessionId } });
      } else if (session.status === "active") {
        navigate({
          to: "/interview/session/$sessionId",
          params: { sessionId },
        });
      } else if (session.status === "complete") {
        navigate({ to: "/interview/report/$sessionId", params: { sessionId } });
      } else {
        navigate({ to: "/interview" });
      }
      return;
    }

    // Trigger analysis
    setHasTriggeredAnalysis(true);
    setAnalysisStep("Processing audio transcript...");

    analyzeAction({ sessionId }).catch((error: any) => {
      console.error("Failed to analyze session:", error);
      if (retryCount < 1) {
        toast.error("Failed to analyze interview", {
          action: {
            label: "Retry",
            onClick: () => {
              setRetryCount((prev) => prev + 1);
              setHasTriggeredAnalysis(false); // Reset to allow retry
            },
          },
        });
        setHasTriggeredAnalysis(false); // Reset to allow retry
      } else {
        toast.error("Failed to analyze interview. Returning to start page.");
        setTimeout(() => navigate({ to: "/interview" }), 2000);
      }
    });
  }, [
    session,
    hasTriggeredAnalysis,
    sessionId,
    analyzeAction,
    navigate,
    retryCount,
  ]);

  // Monitor session status and update progress
  useEffect(() => {
    if (!session) return;

    if (session.status === "analyzing") {
      // Show progress animation while analyzing
      const analysisSteps = [
        "Processing audio transcript...",
        "Analyzing response quality...",
        "Evaluating technical accuracy...",
        "Identifying improvement areas...",
        "Generating personalized feedback...",
      ];

      // Cycle through steps for visual feedback
      const stepIndex = Math.floor(Date.now() / 2000) % analysisSteps.length;
      setAnalysisStep(analysisSteps[stepIndex]);
      setAnalysisProgress(Math.min(analysisProgress + 1, 90)); // Keep progress moving but not complete
    } else if (session.status === "complete") {
      // Analysis complete, navigate to report
      setAnalysisStep("Analysis complete!");
      setAnalysisProgress(100);
      setTimeout(() => {
        navigate({
          to: "/interview/report/$sessionId",
          params: { sessionId },
        });
      }, 500);
    }
  }, [session, navigate, sessionId, analysisProgress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const interviewDuration = session?.duration || 0;

  const additionalInfo = [
    `<span class="text-terminal-green font-mono">[INFO]</span> Interview duration: ${formatTime(interviewDuration)}`,
    `<span class="text-terminal-amber">[AI]</span> Transcribing audio responses...`,
    ...(analysisProgress > 20
      ? [
          `<span class="text-terminal-amber">[AI]</span> Evaluating technical depth and accuracy`,
        ]
      : []),
    ...(analysisProgress > 40
      ? [
          `<span class="text-terminal-amber">[AI]</span> Comparing against industry standards`,
        ]
      : []),
    ...(analysisProgress > 60
      ? [
          `<span class="text-terminal-amber">[AI]</span> Identifying communication patterns`,
        ]
      : []),
    ...(analysisProgress > 80
      ? [
          `<span class="text-terminal-green">[COMPLETE]</span> Feedback report generated`,
        ]
      : []),
  ];

  // Loading state
  if (!session) {
    return (
      <LoadingTerminal
        progress={0}
        currentStep="Loading session..."
        title="syntaxia@ai-analyzer"
        subtitle="~/analysis"
        additionalInfo={[
          `<span class="text-terminal-green font-mono">[INFO]</span> Retrieving session data...`,
        ]}
      />
    );
  }

  return (
    <LoadingTerminal
      progress={analysisProgress}
      currentStep={analysisStep}
      title="syntaxia@ai-analyzer"
      subtitle="~/analysis"
      additionalInfo={additionalInfo}
    />
  );
}
