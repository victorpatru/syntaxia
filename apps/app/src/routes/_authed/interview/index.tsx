import { convexQuery } from "@convex-dev/react-query";
import { api } from "@syntaxia/backend/convex/_generated/api";
import type { Id } from "@syntaxia/backend/convex/_generated/dataModel";
import { Button } from "@syntaxia/ui/button";
import { Textarea } from "@syntaxia/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@syntaxia/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { Play } from "lucide-react";
import { startTransition, useRef, useState } from "react";
import { toast } from "sonner";
import { JD_PRESETS, PRIMARY_PRESET_COUNT } from "@/jd-presets";
import { isRateLimitFailure, showRateLimitToast } from "@/utils/rate-limit";
import { getSessionRoute } from "@/utils/route-guards";

export const Route = createFileRoute("/_authed/interview/")({
  validateSearch: (search: { sessionId?: Id<"interview_sessions"> } = {}) => ({
    sessionId: search.sessionId,
  }),
  loader: async (opts) => {
    void opts.context.queryClient.fetchQuery(
      convexQuery(api.credits.getBalance, {}),
    );

    const currentSession = await opts.context.queryClient.ensureQueryData({
      ...convexQuery(api.sessions.getCurrentSession, {}),
      staleTime: 5000,
    });
    if (currentSession) {
      throw redirect({ to: getSessionRoute(currentSession) });
    }
  },
  component: InterviewStart,
});

function InterviewStart() {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showAllPresets, setShowAllPresets] = useState(false);

  const { data: balance } = useQuery({
    ...convexQuery(api.credits.getBalance, {}),
    staleTime: 10000,
  });

  const convexCreateSession = useAction(api.sessions.createSessionValidated);
  const [isCreating, setIsCreating] = useState(false);

  const createSession = async () => {
    try {
      setIsCreating(true);
      const result = await convexCreateSession({
        jobDescription: jobDescription.trim(),
      });

      if (!result.success) {
        if (isRateLimitFailure(result)) {
          showRateLimitToast(result.retryAfterMs);
        } else {
          toast.error(result.error);
        }
        return;
      }

      navigate({
        to: "/interview/setup",
        search: { sessionId: result.sessionId },
      });
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsCreating(false);
    }
  };

  const startInterview = () => {
    if (!jobDescription.trim()) return;
    if (jobDescription.trim().length < 50) {
      toast.error("Job description must be at least 50 characters.");
      return;
    }
    // TODO: Uncomment this when Polar payments are ready
    /*
    if (balance < 15) {
      toast.error("You need at least 15 credits to start an interview.", {
        action: {
          label: "Buy Credits",
          onClick: () => navigate({ to: "/credits" }),
        },
      });
      return;
    }
    */
    createSession();
  };

  return (
    <div className="bg-background font-mono">
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="border border-terminal-green/30 bg-background">
              <div className="border-b border-terminal-green/30 px-6 py-3 bg-terminal-dark">
                <span className="text-terminal-green font-mono">
                  syntaxia@terminal
                </span>
                <span className="text-terminal-green/60">:</span>
                <span className="text-terminal-amber">~/job-description</span>
                <span className="text-terminal-green/60">$</span>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <span className="text-terminal-green/60 font-mono text-sm">
                    # Paste job description to generate personalized questions
                  </span>
                </div>
                <Textarea
                  ref={textareaRef}
                  placeholder="We're looking for a Senior Full-Stack Engineer with experience in React, Node.js, and system design..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-32 font-mono bg-background border border-terminal-green/30 text-terminal-green placeholder:text-terminal-green/40 focus:outline-none focus:border-terminal-green/50 resize-none"
                />
                <div className="mt-4">
                  <div className="mb-2">
                    <span className="text-terminal-green/60 font-mono text-xs">
                      # Sample job descriptions (click to autofill)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(showAllPresets
                      ? JD_PRESETS
                      : JD_PRESETS.slice(0, PRIMARY_PRESET_COUNT)
                    ).map((preset) => {
                      const company =
                        preset.label.split(" — ")[0] || preset.label;
                      return (
                        <Tooltip key={preset.id}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => {
                                startTransition(() => {
                                  setJobDescription(preset.description.trim());
                                });
                                textareaRef.current?.focus();
                              }}
                              className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20"
                            >
                              {company}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="font-mono">{preset.label}</span>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                    {JD_PRESETS.length > PRIMARY_PRESET_COUNT && (
                      <button
                        type="button"
                        onClick={() => setShowAllPresets((v) => !v)}
                        className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20"
                      >
                        {showAllPresets ? "./less" : "./more"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span
                    className={`text-sm font-mono ${
                      jobDescription.length > 0 && jobDescription.length < 50
                        ? "text-terminal-amber"
                        : "text-terminal-green/60"
                    }`}
                  >
                    {jobDescription.length}/50 chars minimum
                  </span>
                  <Button
                    onClick={startInterview}
                    disabled={
                      !jobDescription.trim() ||
                      jobDescription.trim().length < 50 ||
                      isCreating ||
                      balance < 15
                    }
                    className="font-mono text-sm bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-4 py-2 transition-colors h-10 min-w-28"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isCreating ? "./creating..." : "./start-interview"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-6 border border-terminal-green/30 bg-background/50 backdrop-blur-sm p-6 relative overflow-hidden">
              <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-terminal-green/30"></div>
              <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-terminal-green/30"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-terminal-green/30"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-terminal-green/30"></div>

              <div className="space-y-2 font-mono text-sm relative">
                <div className="flex items-center space-x-2">
                  <span className="text-terminal-green/40">#</span>
                  <span className="text-terminal-green/70">
                    You'll need 15 credits for a 15-minute interview
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-terminal-green/40">#</span>
                  <span className="text-terminal-green/70">
                    This is a technical phone screen
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-terminal-green/40">#</span>
                  <span className="text-terminal-green/70">
                    15 credits get charged once you hit the 2-minute mark
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-terminal-green/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
