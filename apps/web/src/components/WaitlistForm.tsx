import { PUBLIC_CONVEX_URL, PUBLIC_TURNSTILE_SITE_KEY } from "astro:env/client";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  COMPANY_STAGE_OPTIONS,
  EXPERIENCE_OPTIONS,
  JOB_SEARCH_STATUS_OPTIONS,
  TECH_STACK_OPTIONS,
} from "@syntaxia/shared";
import type React from "react";
import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [jobSearchStatus, setJobSearchStatus] = useState("");
  const [companyStage, setCompanyStage] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const handleTechStackChange = (stack: string) => {
    setTechStack((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack],
    );
  };

  const handleCompanyStageChange = (stage: string) => {
    setCompanyStage((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !experience || !jobSearchStatus || !turnstileToken) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${PUBLIC_CONVEX_URL}/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          experience,
          techStack,
          jobSearchStatus,
          companyStage,
          turnstileToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Submission failed");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="border border-terminal-green/30 p-6 bg-background">
        <pre className="text-terminal-green text-sm">
          {`$ ./add-to-waitlist \\
          --email="${email}" \\
          --experience="${experience}" \\
          --tech-stack="${techStack.join(",")}" \\
          --job-status="${jobSearchStatus}" \\
          --company-stage="${companyStage.join(",")}"

          [SUCCESS] Profile added to waitlist

          > Thank you for joining! 🚀`}
        </pre>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Email Field */}
      <div>
        <label
          htmlFor="email-input"
          className="block text-terminal-green font-mono text-sm mb-2"
        >
          $ email --required
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-green/50 text-sm">
            user@
          </span>
          <input
            id="email-input"
            type="email"
            placeholder="your-email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-16 pr-3 py-2 bg-background border border-terminal-green/30 text-terminal-green placeholder:text-terminal-green/40 font-mono focus:outline-none focus:border-terminal-green/50"
            required
          />
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label
          htmlFor="experience-select"
          className="block text-terminal-green font-mono text-sm mb-2"
        >
          $ experience --years --required
        </label>
        <div className="relative">
          <select
            id="experience-select"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full pl-3 pr-8 sm:pr-10 py-2 bg-background border border-terminal-green/30 text-terminal-green font-mono focus:outline-none focus:border-terminal-green/50 appearance-none"
            required
          >
            <option value="" className="text-terminal-green/50">
              Select years of experience
            </option>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-2 sm:right-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-terminal-green/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <fieldset>
        <legend className="block text-terminal-green font-mono text-sm mb-2">
          $ tech-stack --select-multiple
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TECH_STACK_OPTIONS.map((stack) => (
            <label
              key={stack}
              className="flex items-center space-x-3 cursor-pointer py-1"
            >
              <input
                type="checkbox"
                checked={techStack.includes(stack)}
                onChange={() => handleTechStackChange(stack)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 border border-terminal-green/30 flex items-center justify-center flex-shrink-0 ${
                  techStack.includes(stack)
                    ? "bg-terminal-green text-black"
                    : "bg-background"
                }`}
              >
                {techStack.includes(stack) && (
                  <span className="text-xs">✓</span>
                )}
              </div>
              <span className="text-terminal-green font-mono text-sm">
                {stack}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Job Search Status */}
      <fieldset>
        <legend className="block text-terminal-green font-mono text-sm mb-2">
          $ job-search --status --required
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {JOB_SEARCH_STATUS_OPTIONS.map((status) => (
            <label
              key={status}
              className="flex items-center space-x-3 cursor-pointer py-1"
            >
              <input
                type="radio"
                name="jobSearchStatus"
                value={status}
                checked={jobSearchStatus === status}
                onChange={(e) => setJobSearchStatus(e.target.value)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 border border-terminal-green/30 flex items-center justify-center flex-shrink-0 ${
                  jobSearchStatus === status
                    ? "bg-terminal-green"
                    : "bg-background"
                }`}
              >
                {jobSearchStatus === status && (
                  <div className="w-2 h-2 bg-black"></div>
                )}
              </div>
              <span className="text-terminal-green font-mono text-sm">
                {status}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Company Stage */}
      <fieldset>
        <legend className="block text-terminal-green font-mono text-sm mb-2">
          $ company-stage --target --optional
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMPANY_STAGE_OPTIONS.map((stage) => (
            <label
              key={stage}
              className="flex items-center space-x-3 cursor-pointer py-1"
            >
              <input
                type="checkbox"
                checked={companyStage.includes(stage)}
                onChange={() => handleCompanyStageChange(stage)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 border border-terminal-green/30 flex items-center justify-center flex-shrink-0 ${
                  companyStage.includes(stage)
                    ? "bg-terminal-green text-black"
                    : "bg-background"
                }`}
              >
                {companyStage.includes(stage) && (
                  <span className="text-xs">✓</span>
                )}
              </div>
              <span className="text-terminal-green font-mono text-sm">
                {stage}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Turnstile */}
      <div className="flex justify-center">
        <Turnstile
          siteKey={PUBLIC_TURNSTILE_SITE_KEY || ""}
          onSuccess={setTurnstileToken}
          onError={() => setTurnstileToken(null)}
          onExpire={() => setTurnstileToken(null)}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="border border-red-500/30 p-3 bg-red-500/10">
          <p className="text-red-400 font-mono text-sm">Error: {error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={
            isSubmitting ||
            !email ||
            !experience ||
            !jobSearchStatus ||
            !turnstileToken
          }
          className="bg-terminal-amber text-black hover:bg-terminal-amber/80 font-mono px-8 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "./adding-to-waitlist..." : "./join-waitlist"}
        </button>
      </div>
      <p className="text-xs text-terminal-green/50">
        → No spam, just early access notifications
        <br />→ Unsubscribe anytime with one click
      </p>
    </form>
  );
}
