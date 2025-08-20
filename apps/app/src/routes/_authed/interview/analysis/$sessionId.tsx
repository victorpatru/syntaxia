import { LoadingTerminal } from "@syntaxia/ui/interview";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authed/interview/analysis/$sessionId")({
  component: InterviewAnalysis,
});

function InterviewAnalysis() {
  const navigate = useNavigate();
  const { sessionId } = Route.useParams();
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState("");

  useEffect(() => {
    // TODO: Replace with actual AI analysis API call
    // const analyzeInterview = async () => {
    //   try {
    //     const response = await fetch('/api/interview/analyze', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ sessionId })
    //     });
    //     const result = await response.json();
    //     // Navigate to report with analysis results
    //   } catch (error) {
    //     console.error('Failed to analyze interview:', error);
    //   }
    // };

    // Mock analysis sequence - replace with actual AI analysis
    const analysisSteps = [
      "Processing audio transcript...",
      "Analyzing response quality...",
      "Evaluating technical accuracy...",
      "Identifying improvement areas...",
      "Generating personalized feedback...",
    ];

    let stepIndex = 0;
    const analysisInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        const newProgress = prev + 2; // Increment by 2% each 100ms

        // Update analysis step based on progress
        const stepProgress = Math.floor(newProgress / 20); // Each step is 20%
        if (stepProgress < analysisSteps.length && stepProgress !== stepIndex) {
          stepIndex = stepProgress;
          setAnalysisStep(analysisSteps[stepIndex]);
        }

        // Complete analysis after processing
        if (newProgress >= 100) {
          clearInterval(analysisInterval);
          // Navigate to report
          navigate({
            to: "/interview/report/$sessionId",
            params: { sessionId },
          });
          return 100;
        }

        return newProgress;
      });
    }, 100); // Update every 100ms for smooth progress

    return () => clearInterval(analysisInterval);
  }, [sessionId, navigate]);

  // TODO: Get actual interview duration from session data
  const mockInterviewTime = 450; // 7:30 mock duration

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const additionalInfo = [
    `<span class="text-terminal-green font-mono">[INFO]</span> Interview duration: ${formatTime(mockInterviewTime)}`,
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
