import { LoadingTerminal } from "@syntaxia/ui/interview";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authed/interview/setup")({
  component: InterviewSetup,
  validateSearch: (search): { sessionId: string; jobDescription: string } => ({
    sessionId: (search.sessionId as string) || "",
    jobDescription: (search.jobDescription as string) || "",
  }),
});

function InterviewSetup() {
  const navigate = useNavigate();
  const { sessionId, jobDescription } = Route.useSearch();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("");

  useEffect(() => {
    if (!sessionId || !jobDescription) {
      navigate({ to: "/interview" });
      return;
    }

    // TODO: Replace with actual Gemini API call
    // const processJobDescription = async () => {
    //   try {
    //     const response = await fetch('/api/interview/parse-job', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({
    //         jobDescription: decodeURIComponent(jobDescription),
    //         sessionId
    //       })
    //     });
    //     const result = await response.json();
    //     // Navigate to interview session with processed data
    //   } catch (error) {
    //     console.error('Failed to process job description:', error);
    //   }
    // };

    // Mock loading sequence - replace with actual API processing
    const loadingSteps = [
      "Parsing job description...",
      "Analyzing required skills...",
      "Generating technical questions...",
      "Calibrating difficulty level...",
      "Preparing interview session...",
    ];

    let stepIndex = 0;
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 2; // Increment by 2% each 100ms

        // Update loading step based on progress
        const stepProgress = Math.floor(newProgress / 20); // Each step is 20%
        if (stepProgress < loadingSteps.length && stepProgress !== stepIndex) {
          stepIndex = stepProgress;
          setLoadingStep(loadingSteps[stepIndex]);
        }

        // Complete loading after processing
        if (newProgress >= 100) {
          clearInterval(loadingInterval);
          // Navigate to interview session
          navigate({
            to: "/interview/session/$sessionId",
            params: { sessionId },
          });
          return 100;
        }

        return newProgress;
      });
    }, 100); // Update every 100ms for smooth progress

    return () => clearInterval(loadingInterval);
  }, [sessionId, jobDescription, navigate]);

  const decodedJobDescription = jobDescription
    ? decodeURIComponent(jobDescription)
    : "";

  const additionalInfo = [
    `<span class="text-terminal-green font-mono">[INFO]</span> Job description length: ${decodedJobDescription.length} chars`,
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
