import { api } from "@syntaxia/backend/api";
import { Button } from "@syntaxia/ui/button";
import { Textarea } from "@syntaxia/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@syntaxia/ui/tooltip";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAction, useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import { Play } from "lucide-react";
import { startTransition, useRef, useState } from "react";
import { toast } from "sonner";
import { WelcomeDiscountBanner } from "@/components/WelcomeDiscountBanner";
import { JD_PRESETS, PRIMARY_PRESET_COUNT } from "@/jd-presets";
import type { ExperienceLevel } from "@/types/interview";
import { isRateLimitFailure, showRateLimitToast } from "@/utils/rate-limit";
import { getSessionRoute } from "@/utils/route-guards";

export const Route = createFileRoute("/_authed/interview/")({
  validateSearch: (
    search: { sessionId?: GenericId<"interview_sessions"> } = {},
  ) => ({
    sessionId: search.sessionId,
  }),
  loader: async (opts) => {
    try {
      // Preload user profile
      void opts.context.convexClient.query(api.users.getCurrentUserProfile, {});

      // Check for existing session and redirect if found
      const currentSession = await opts.context.convexClient.query(
        api.sessions.getCurrentSession,
        {},
      );
      if (currentSession) {
        throw redirect({
          to: getSessionRoute(currentSession),
        });
      }
    } catch (error) {
      console.warn("Authentication not ready during route load:", error);
    }
  },
  component: InterviewStart,
});

function InterviewStart() {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showAllPresets, setShowAllPresets] = useState(false);

  const data = useQuery(api.users.getCurrentUserProfile, {});

  const balance = data?.credits ?? 0;
  const isWelcomeEligible = data?.isWelcomeEligible ?? false;

  const convexCreateSession = useAction(api.sessions.createSessionValidated);
  const [isCreating, setIsCreating] = useState(false);

  const createSession = async () => {
    try {
      setIsCreating(true);
      const result = await convexCreateSession({
        jobDescription: jobDescription.trim(),
        experienceLevel: experienceLevel || undefined,
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

    if (balance < 15) {
      toast.error("You need at least 15 credits to start an interview.", {
        action: {
          label: "Buy Credits",
          onClick: () => navigate({ to: "/credits" }),
        },
      });
      return;
    }
    createSession();
  };

  return (
    <div className="bg-background font-mono min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header Section */}
        <div className="border border-terminal-green/30 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-terminal-green text-lg font-mono">
                technical.interview
              </h1>
              <p className="text-terminal-green/70 text-xs mt-1">
                Practice technical phone screens with AI-powered interviews
              </p>
            </div>
            <div
              className={`text-xs px-3 py-1 border ${
                balance >= 15
                  ? "border-terminal-green/30 text-terminal-green"
                  : "border-terminal-amber/50 text-terminal-amber bg-terminal-amber/5"
              }`}
            >
              credits: {balance} • cost: 15
              {balance < 15 && (
                <div className="text-xs mt-1">insufficient funds</div>
              )}
            </div>
          </div>

          {balance < 15 && (
            <div className="border border-terminal-amber/30 bg-terminal-amber/5 p-3 mb-4">
              <div className="text-terminal-amber text-xs">
                ⚠ You need 15 credits to start a technical session. Current
                balance: {balance}
              </div>
            </div>
          )}

          <div className="text-terminal-green/60 text-xs">
            • Duration: ~15 minutes • Format: Technical phone screen • AI voice
            interviewer with tailored questions
          </div>
        </div>

        {/* Job Description Section */}
        <div className="border border-terminal-green/30 p-6 mb-6">
          <h2 className="text-terminal-green text-sm mb-3">job.description</h2>
          <div className="mb-4">
            <span className="text-terminal-green/60 font-mono text-xs">
              Paste job description to generate personalized questions
            </span>
          </div>
          <Textarea
            ref={textareaRef}
            placeholder="We're looking for a Senior Full-Stack Engineer with experience in React, Node.js, and system design..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-32 font-mono bg-background border border-terminal-green/30 text-terminal-green placeholder:text-terminal-green/40 focus:outline-none focus:border-terminal-green/50 w-full"
            disabled={balance < 15}
          />

          <div className="mt-4 flex items-center justify-between">
            <span
              className={`text-xs font-mono ${
                jobDescription.length > 0 && jobDescription.length < 50
                  ? "text-terminal-amber"
                  : "text-terminal-green/60"
              }`}
            >
              {jobDescription.length}/50 chars minimum
            </span>
            {jobDescription.length >= 50 && (
              <span className="text-terminal-green/60 text-xs">
                ✓ Ready to start
              </span>
            )}
          </div>
        </div>

        {/* Experience Level Section */}
        <div className="border border-terminal-green/30 p-6 mb-6">
          <h2 className="text-terminal-green text-sm mb-3">experience.level</h2>
          <div className="mb-4">
            <span className="text-terminal-green/60 font-mono text-xs">
              Select your experience level for perfectly tailored question
              difficulty
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              {
                value: "junior" as const,
                label: "Junior (0-2 years)",
              },
              { value: "mid" as const, label: "Mid (2-5 years)" },
              {
                value: "senior" as const,
                label: "Senior (5+ years)",
              },
              { value: "staff" as const, label: "Staff/Principal" },
            ].map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() =>
                  setExperienceLevel(
                    experienceLevel === level.value ? null : level.value,
                  )
                }
                disabled={balance < 15}
                aria-pressed={experienceLevel === level.value}
                className={`font-mono text-xs border px-3 py-2 transition-colors h-10 min-w-24 ${
                  balance < 15
                    ? "border-terminal-green/10 text-terminal-green/30 cursor-not-allowed"
                    : experienceLevel === level.value
                      ? "border-terminal-amber text-terminal-amber bg-terminal-amber/10"
                      : "border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber cursor-pointer"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
        {/* Sample Job Descriptions Section - Optional */}
        <div className="border border-terminal-green/20 p-6 mb-6 bg-terminal-green/5">
          <h2 className="text-terminal-green/70 text-sm mb-3">
            sample.descriptions
            <span className="text-terminal-green/50 text-xs ml-2">
              (optional)
            </span>
          </h2>
          <div className="mb-4">
            <span className="text-terminal-green/60 font-mono text-xs">
              Click any sample to autofill the job description field, or skip to
              write your own
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {(showAllPresets
              ? JD_PRESETS
              : JD_PRESETS.slice(0, PRIMARY_PRESET_COUNT)
            ).map((preset) => {
              const company = preset.label.split(" — ")[0] || preset.label;
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
                      disabled={balance < 15}
                      className={`font-mono text-xs border px-3 py-2 transition-colors h-10 min-w-20 ${
                        balance < 15
                          ? "border-terminal-green/10 text-terminal-green/30 cursor-not-allowed"
                          : "border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber cursor-pointer"
                      }`}
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
                disabled={balance < 15}
                className={`font-mono text-xs border px-3 py-2 transition-colors h-10 min-w-20 ${
                  balance < 15
                    ? "border-terminal-green/10 text-terminal-green/30 cursor-not-allowed"
                    : "border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber cursor-pointer"
                }`}
              >
                {showAllPresets ? "./less" : "./more"}
              </button>
            )}
          </div>
        </div>

        {/* Action Section */}
        <div className="border border-terminal-green/30 p-6">
          <h2 className="text-terminal-green text-sm mb-4">actions</h2>

          <div className="flex gap-3 mb-4">
            <Button
              onClick={startInterview}
              disabled={
                !jobDescription.trim() ||
                jobDescription.trim().length < 50 ||
                isCreating ||
                balance < 15
              }
              className={`font-mono text-xs px-6 py-2 transition-colors h-10 min-w-32 ${
                !jobDescription.trim() ||
                jobDescription.trim().length < 50 ||
                isCreating ||
                balance < 15
                  ? "bg-transparent border border-terminal-green/10 text-terminal-green/30 cursor-not-allowed"
                  : "bg-terminal-amber text-black hover:bg-terminal-amber/80 cursor-pointer"
              }`}
            >
              <Play className="w-4 h-4 mr-2" />
              {isCreating ? "starting..." : "./start.interview"}
            </Button>
          </div>

          {(!jobDescription.trim() || jobDescription.trim().length < 50) &&
            balance >= 15 && (
              <div className="text-terminal-green/60 text-xs">
                Enter a job description (minimum 50 characters) to begin
              </div>
            )}
        </div>
      </div>

      <WelcomeDiscountBanner isEligible={isWelcomeEligible} />
    </div>
  );
}
