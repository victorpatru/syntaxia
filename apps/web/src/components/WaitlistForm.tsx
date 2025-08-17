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

  const handleTechStackChange = (stack: string) => {
    setTechStack(prev => 
      prev.includes(stack) 
        ? prev.filter(s => s !== stack)
        : [...prev, stack]
    );
  };

  const handleCompanyStageChange = (stage: string) => {
    setCompanyStage(prev => 
      prev.includes(stage) 
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !experience || !jobSearchStatus) return;

    setIsSubmitting(true);

    // TODO: Replace with actual waitlist API call
    // await addToWaitlist({ email, experience, techStack, jobSearchStatus, companyStage })

    // Mock submission delay
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="border border-terminal-green/30 p-6 bg-background">
        <pre className="text-terminal-green text-sm">
          {`$ ./add-to-waitlist \\
    --email="${email}" \\
    --experience="${experience}" \\
    --tech-stack="${techStack.join(',')}" \\
    --job-status="${jobSearchStatus}" \\
    --company-stage="${companyStage.join(',')}"

[SUCCESS] Profile added to waitlist
[INFO] Tailoring experience for ${experience} ${techStack.join('/')} engineer
[INFO] We'll be in touch soon with relevant opportunities

> Thank you for joining! 🚀`}
        </pre>
      </div>
    );
  }

  const techStackOptions = [
    "Frontend (React/Vue/Angular)", 
    "Backend (Node/Python/Go/Java)", 
    "Full Stack", 
    "DevOps/Infrastructure", 
    "Mobile", 
    "Data/ML"
  ];

  const companyStageOptions = [
    "Early startup (10-50 employees)",
    "Growth startup (50-200 employees)", 
    "Mid-size (200-500 employees)",
    "Enterprise (500+ employees)"
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email-input" className="block text-terminal-green font-mono text-sm mb-2">
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
        <label htmlFor="experience-select" className="block text-terminal-green font-mono text-sm mb-2">
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
            <option value="" className="text-terminal-green/50">Select years of experience</option>
            <option value="0-2">0-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">10+ years</option>
          </select>
          <div className="absolute inset-y-0 right-2 sm:right-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-terminal-green/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
          {techStackOptions.map((stack) => (
            <label key={stack} className="flex items-center space-x-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={techStack.includes(stack)}
                onChange={() => handleTechStackChange(stack)}
                className="sr-only"
              />
              <div className={`w-4 h-4 border border-terminal-green/30 flex items-center justify-center flex-shrink-0 ${
                techStack.includes(stack) ? 'bg-terminal-green text-black' : 'bg-background'
              }`}>
                {techStack.includes(stack) && <span className="text-xs">✓</span>}
              </div>
              <span className="text-terminal-green font-mono text-sm">{stack}</span>
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
          {[
            "Actively searching",
            "Passively looking", 
            "Just exploring",
            "Planning to search soon"
          ].map((status) => (
            <label key={status} className="flex items-center space-x-3 cursor-pointer py-1">
              <input
                type="radio"
                name="jobSearchStatus"
                value={status}
                checked={jobSearchStatus === status}
                onChange={(e) => setJobSearchStatus(e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 border border-terminal-green/30 flex items-center justify-center flex-shrink-0 ${
                jobSearchStatus === status ? 'bg-terminal-green' : 'bg-background'
              }`}>
                {jobSearchStatus === status && <div className="w-2 h-2 bg-black"></div>}
              </div>
              <span className="text-terminal-green font-mono text-sm">{status}</span>
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
          {companyStageOptions.map((stage) => (
            <label key={stage} className="flex items-center space-x-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={companyStage.includes(stage)}
                onChange={() => handleCompanyStageChange(stage)}
                className="sr-only"
              />
              <div className={`w-4 h-4 border border-terminal-green/30 flex items-center justify-center flex-shrink-0 ${
                companyStage.includes(stage) ? 'bg-terminal-green text-black' : 'bg-background'
              }`}>
                {companyStage.includes(stage) && <span className="text-xs">✓</span>}
              </div>
              <span className="text-terminal-green font-mono text-sm">{stage}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !email || !experience || !jobSearchStatus}
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
