import { Button } from "@syntaxia/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_authed/interview/report/$sessionId")({
  component: InterviewReport,
});

function InterviewReport() {
  const navigate = useNavigate();
  const { sessionId } = Route.useParams();

  // TODO: Load actual interview results from Convex based on sessionId
  const mockInterviewTime = 450; // 7:30 mock duration

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startNewInterview = () => {
    navigate({ to: "/interview" });
  };

  const downloadReport = () => {
    // TODO: Generate and download PDF/JSON report
    console.log("Downloading report for session:", sessionId);
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="border border-terminal-green/30 bg-background mb-8">
            <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
              <span className="font-mono text-terminal-green">
                interview-report.log
              </span>
              <span className="text-terminal-green/60 ml-4">
                generated: {new Date().toISOString()}
              </span>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <span className="text-terminal-green/60 font-mono text-sm">
                  SESSION_DURATION:
                </span>
                <span className="ml-2 text-terminal-green">
                  {formatTime(mockInterviewTime)}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-terminal-green/60 font-mono text-sm">
                  OVERALL_ASSESSMENT:
                </span>
                <div className="mt-2 border border-terminal-amber bg-terminal-amber/10 px-3 py-2">
                  <span className="text-terminal-amber font-mono">
                    PASS_WITH_RESERVATIONS
                  </span>
                </div>
              </div>
              <div className="text-terminal-green/60 text-sm">
                Strong technical knowledge demonstrated, but could improve
                communication clarity and provide more specific examples.
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-terminal-green/30 bg-background">
              <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
                <span className="font-mono text-terminal-green">
                  strengths.log
                </span>
              </div>
              <div className="p-4 space-y-4">
                {/* TODO: Replace with actual analysis results */}
                <div className="border-l-4 border-terminal-green pl-4">
                  <div className="text-terminal-green/60 font-mono text-xs mb-1">
                    [03:42] POSITIVE_SIGNAL
                  </div>
                  <div className="text-sm mb-2 text-terminal-green">
                    "I used React hooks to manage state efficiently..."
                  </div>
                  <div className="text-xs text-terminal-green">
                    ✓ Modern React patterns demonstrated
                  </div>
                </div>
                <div className="border-l-4 border-terminal-green pl-4">
                  <div className="text-terminal-green/60 font-mono text-xs mb-1">
                    [07:15] POSITIVE_SIGNAL
                  </div>
                  <div className="text-sm mb-2 text-terminal-green">
                    "I considered the trade-offs between performance and
                    maintainability..."
                  </div>
                  <div className="text-xs text-terminal-green">
                    ✓ Strong architectural thinking
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-terminal-green/30 bg-background">
              <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
                <span className="font-mono text-orange-400">
                  improvements.log
                </span>
              </div>
              <div className="p-4 space-y-4">
                {/* TODO: Replace with actual analysis results */}
                <div className="border-l-4 border-orange-400 pl-4">
                  <div className="text-terminal-green/60 font-mono text-xs mb-1">
                    [05:23] WARNING
                  </div>
                  <div className="text-sm mb-2 text-terminal-green">
                    "Um, well, it was kind of complex..."
                  </div>
                  <div className="text-xs text-orange-400">
                    ⚠ Be more specific about complexity
                  </div>
                </div>
                <div className="border-l-4 border-orange-400 pl-4">
                  <div className="text-terminal-green/60 font-mono text-xs mb-1">
                    [09:41] WARNING
                  </div>
                  <div className="text-sm mb-2 text-terminal-green">
                    "I think the solution worked fine..."
                  </div>
                  <div className="text-xs text-orange-400">
                    ⚠ Quantify results with metrics
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-terminal-green/30 bg-background mb-8">
            <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark">
              <span className="font-mono text-terminal-amber">
                next-steps.sh
              </span>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                {/* TODO: Replace with AI-generated personalized recommendations */}
                <div className="flex items-start space-x-2">
                  <span className="text-terminal-green">$</span>
                  <span className="text-terminal-green">
                    Practice explaining technical concepts with specific metrics
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-terminal-green">$</span>
                  <span className="text-terminal-green">
                    Prepare 2-3 detailed technical stories with clear structure
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-terminal-green">$</span>
                  <span className="text-terminal-green">
                    Reduce filler words and speak more confidently
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={startNewInterview}
              className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              ./practice-again
            </Button>
            <Button
              variant="outline"
              onClick={downloadReport}
              className="font-mono text-xs bg-transparent border border-terminal-amber/30 text-terminal-amber hover:bg-terminal-amber/10 hover:text-terminal-green px-3 py-1 transition-colors h-8 min-w-20"
            >
              <Download className="w-4 h-4 mr-2" />
              ./download-report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
