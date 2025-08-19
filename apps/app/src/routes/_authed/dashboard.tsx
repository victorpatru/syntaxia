import { Button } from "@syntaxia/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clock, FileText, Play } from "lucide-react";

export const Route = createFileRoute("/_authed/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();

  const startInterview = () => {
    navigate({ to: "/interview" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-mono">Welcome back!</h1>
        <p className="text-muted-foreground">
          Ready to practice your technical interview skills?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Start New Interview */}
        <div className="border border-terminal-green/30 bg-background p-6">
          <div className="flex items-center mb-4">
            <Play className="w-6 h-6 text-terminal-green mr-3" />
            <h3 className="font-mono text-lg text-terminal-green">
              New Interview
            </h3>
          </div>
          <p className="text-terminal-green/60 mb-4 text-sm">
            Start a new AI-powered technical interview practice session
          </p>
          <Button
            onClick={startInterview}
            className="w-full font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8"
          >
            ./start-interview
          </Button>
        </div>

        {/* Past Sessions - TODO: Implement with Convex */}
        <div className="border border-terminal-green/30 bg-background p-6">
          <div className="flex items-center mb-4">
            <FileText className="w-6 h-6 text-terminal-green mr-3" />
            <h3 className="font-mono text-lg text-terminal-green">
              Past Sessions
            </h3>
          </div>
          <p className="text-terminal-green/60 mb-4 text-sm">
            Review your previous interview sessions and reports
          </p>
          <Button
            disabled
            className="w-full font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green/40 px-3 py-1 h-8 cursor-not-allowed"
          >
            ./view-history
          </Button>
        </div>

        {/* Analytics - TODO: Implement */}
        <div className="border border-terminal-green/30 bg-background p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-terminal-green mr-3" />
            <h3 className="font-mono text-lg text-terminal-green">Progress</h3>
          </div>
          <p className="text-terminal-green/60 mb-4 text-sm">
            Track your improvement over time with detailed analytics
          </p>
          <Button
            disabled
            className="w-full font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green/40 px-3 py-1 h-8 cursor-not-allowed"
          >
            ./show-analytics
          </Button>
        </div>
      </div>

      <div className="border border-terminal-green/30 bg-background p-6">
        <div className="border-b border-terminal-green/30 pb-4 mb-4">
          <span className="font-mono text-terminal-green">
            recent-activity.log
          </span>
        </div>
        <div className="text-terminal-green/60 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-terminal-green">$</span>
            <span>No recent interview sessions found</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-terminal-green">$</span>
            <span>Start your first practice session to see activity here</span>
          </div>
        </div>
      </div>
    </div>
  );
}
