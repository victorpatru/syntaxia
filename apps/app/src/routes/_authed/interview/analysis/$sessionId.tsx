import { api } from "@syntaxia/backend/convex/_generated/api";
import { LoadingTerminal } from "@syntaxia/ui/interview";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction as useConvexAction, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { validateAnalysisRoute } from "@/utils/route-guards";

export const Route = createFileRoute("/_authed/interview/analysis/$sessionId")({
  component: InterviewAnalysis,
});

function InterviewAnalysis() {
  const navigate = useNavigate();
  const { sessionId } = Route.useParams();
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState("Preparing analysis...");
  const hasTriggeredAnalysisRef = useRef(false);
  const [retryCount, setRetryCount] = useState(0);

  const session = useQuery(api.sessions.getSession, { sessionId });
  const analyzeAction = useConvexAction(api.sessions.analyzeSession);

  const triggerAnalysis = async () => {
    if (hasTriggeredAnalysisRef.current) return;

    hasTriggeredAnalysisRef.current = true;
    setAnalysisStep("Processing audio transcript...");

    try {
      await analyzeAction({ sessionId });
    } catch (error: unknown) {
      console.error("Failed to analyze session:", error);
      hasTriggeredAnalysisRef.current = false;

      if (retryCount < 1) {
        toast.error("Failed to analyze interview", {
          action: {
            label: "Retry",
            onClick: () => {
              setRetryCount((prev) => prev + 1);
              triggerAnalysis();
            },
          },
        });
      } else {
        toast.error("Failed to analyze interview. Returning to start page.");
        setTimeout(() => navigate({ to: "/interview" }), 2000);
      }
    }
  };

  useEffect(() => {
    if (session === undefined) return;

    if (session === null) {
      const validation = validateAnalysisRoute(session);
      if (!validation.isValid && validation.redirectTo) {
        navigate({ to: validation.redirectTo });
      }
      return;
    }

    if (session.status === "analyzing" && !hasTriggeredAnalysisRef.current) {
      triggerAnalysis();
    }

    if (session.status === "complete") {
      navigate({
        to: "/interview/report/$sessionId",
        params: { sessionId },
      });
    }
  }, [session, navigate, sessionId]);

  useEffect(() => {
    if (!session || session.status !== "analyzing") return;

    const interval = setInterval(() => {
      const analysisSteps = [
        "Processing audio transcript...",
        "Analyzing response quality...",
        "Evaluating technical accuracy...",
        "Identifying improvement areas...",
        "Generating personalized feedback...",
      ];

      const stepIndex = Math.floor(Date.now() / 2000) % analysisSteps.length;
      setAnalysisStep(analysisSteps[stepIndex]);
      setAnalysisProgress((prev) => Math.min(prev + 1, 100));
    }, 100);

    return () => clearInterval(interval);
  }, [session?.status]);

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

  if (session === undefined) {
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

  if (session === null) {
    return null;
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
