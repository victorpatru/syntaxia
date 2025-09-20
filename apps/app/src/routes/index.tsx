import { SignedIn, SignedOut } from "@clerk/tanstack-react-start";
import { api } from "@syntaxia/backend/api";
import { DashboardHeader } from "@syntaxia/ui/dashboard-header";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const userData = useQuery(api.users.getCurrentUserProfile, {});
  const balance = userData?.credits ?? 0;
  const hasCredits = balance >= 15;

  return (
    <div className="bg-background font-mono min-h-screen">
      <SignedIn>
        <DashboardHeader credits={balance} />
      </SignedIn>
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SignedIn>
          {/* Welcome Header */}
          <div className="border border-terminal-green/30 bg-background mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-terminal-green text-xl font-mono">
                  syntaxia.dashboard
                </h1>
                <p className="text-terminal-green/70 text-sm mt-1">
                  AI-powered interview practice platform
                </p>
              </div>
              <div
                className={`text-sm px-4 py-2 border ${
                  hasCredits
                    ? "border-terminal-green/30 text-terminal-green"
                    : "border-terminal-amber/50 text-terminal-amber bg-terminal-amber/5"
                }`}
              >
                credits: {balance}
                {!hasCredits && <div className="text-xs mt-1">low balance</div>}
              </div>
            </div>

            {!hasCredits && (
              <div className="border border-terminal-amber/30 bg-terminal-amber/5 p-4 mb-4">
                <div className="text-terminal-amber text-sm">
                  ⚠ You need at least 15 credits to start a practice session.
                  Current balance: {balance}
                </div>
              </div>
            )}

            <div className="text-terminal-green/60 text-sm">
              Choose your practice mode below. Each session costs 15 credits and
              provides detailed feedback.
            </div>
          </div>

          {/* Practice Modes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technical Interview Card */}
            <div
              className={`border transition-all duration-200 ${
                hasCredits
                  ? "border-terminal-green/30 bg-background hover:border-terminal-green/50"
                  : "border-terminal-green/10 bg-background opacity-60"
              }`}
            >
              <div className="border-b border-terminal-green/30 px-6 py-3 bg-terminal-dark">
                <div className="flex items-center justify-between">
                  <span className="text-terminal-green font-mono">
                    technical-phone-screen.md
                  </span>
                  <span className="text-terminal-green/60 text-xs">
                    15 credits
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-terminal-green text-sm leading-relaxed">
                  Practice realistic technical phone screens with AI. Upload
                  your job description for tailored questions covering
                  algorithms, system design, and role-specific topics.
                </div>

                <div className="border border-terminal-green/30 p-4 bg-terminal-green/5">
                  <div className="text-terminal-green/70 text-xs font-mono mb-2">
                    session.config
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-terminal-green">duration: 15 min</div>
                    <div className="text-terminal-green">
                      mode: voice interview
                    </div>
                    <div className="text-terminal-green">
                      input: job description
                    </div>
                    <div className="text-terminal-green">
                      output: detailed scores
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-terminal-green/60 text-xs">
                    ✓ Algorithm & data structure questions
                    <br />✓ System design discussions
                    <br />✓ Role-specific technical scenarios
                    <br />✓ Real-time feedback and scoring
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link
                    to="/interview"
                    search={{ sessionId: undefined }}
                    className={`inline-flex items-center justify-center font-mono text-xs px-4 py-2 transition-colors h-10 min-w-32 ${
                      hasCredits
                        ? "bg-terminal-amber text-black hover:bg-terminal-amber/80 cursor-pointer"
                        : "bg-transparent border border-terminal-green/10 text-terminal-green/30 cursor-not-allowed"
                    }`}
                    onClick={
                      !hasCredits ? (e) => e.preventDefault() : undefined
                    }
                  >
                    ./start-technical
                  </Link>
                  <Link
                    to="/reports"
                    className="inline-flex items-center justify-center font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-10 min-w-24"
                  >
                    ./view-reports
                  </Link>
                </div>
              </div>
            </div>

            {/* Behavioral Interview Card */}
            <div
              className={`border transition-all duration-200 ${
                hasCredits
                  ? "border-terminal-green/30 bg-background hover:border-terminal-green/50"
                  : "border-terminal-green/10 bg-background opacity-60"
              }`}
            >
              <div className="border-b border-terminal-green/30 px-6 py-3 bg-terminal-dark">
                <div className="flex items-center justify-between">
                  <span className="text-terminal-green font-mono">
                    behavioral-practice.md
                  </span>
                  <span className="text-terminal-green/60 text-xs">
                    15 credits
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-terminal-green text-sm leading-relaxed">
                  Master behavioral interviews with STAR method practice. Choose
                  from five key categories to practice scenarios that showcase
                  your professional experience and problem-solving.
                </div>

                <div className="border border-terminal-green/30 p-4 bg-terminal-green/5">
                  <div className="text-terminal-green/70 text-xs font-mono mb-2">
                    session.config
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-terminal-green">duration: 15 min</div>
                    <div className="text-terminal-green">
                      mode: voice interview
                    </div>
                    <div className="text-terminal-green">
                      input: category selection
                    </div>
                    <div className="text-terminal-green">
                      output: STAR feedback
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-terminal-green/60 text-xs">
                    ✓ Conflict resolution scenarios
                    <br />✓ Leadership and influence challenges
                    <br />✓ Failure recovery and learning
                    <br />✓ Ownership and accountability examples
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link
                    to="/behavioral"
                    search={{ sessionId: undefined }}
                    className={`inline-flex items-center justify-center font-mono text-xs px-4 py-2 transition-colors h-10 min-w-32 ${
                      hasCredits
                        ? "bg-terminal-amber text-black hover:bg-terminal-amber/80 cursor-pointer"
                        : "bg-transparent border border-terminal-green/10 text-terminal-green/30 cursor-not-allowed"
                    }`}
                    onClick={
                      !hasCredits ? (e) => e.preventDefault() : undefined
                    }
                  >
                    ./start-behavioral
                  </Link>
                  <Link
                    to="/reports"
                    className="inline-flex items-center justify-center font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-10 min-w-24"
                  >
                    ./view-reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          {/* Welcome for Unauthenticated Users */}
          <div className="border border-terminal-green/30 bg-background p-8">
            <div className="max-w-2xl">
              <h1 className="text-terminal-green text-2xl font-mono mb-4">
                syntaxia.platform
              </h1>
              <p className="text-terminal-green/70 text-sm mb-6 leading-relaxed">
                AI-powered interview practice platform designed for software
                engineers. Practice technical phone screens and behavioral
                interviews with realistic voice conversations and detailed
                feedback.
              </p>

              <div className="border border-terminal-green/30 p-4 mb-6 bg-terminal-green/5">
                <div className="text-terminal-green/70 text-xs font-mono mb-2">
                  features
                </div>
                <div className="text-terminal-green/60 text-xs space-y-1">
                  <div>✓ Real-time voice interviews with AI</div>
                  <div>
                    ✓ Tailored technical questions from job descriptions
                  </div>
                  <div>✓ STAR method behavioral practice</div>
                  <div>✓ Detailed scoring and improvement feedback</div>
                </div>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center justify-center font-mono text-sm bg-terminal-amber text-black hover:bg-terminal-amber/80 px-6 py-3 transition-colors h-12 min-w-32"
              >
                ./login
              </Link>
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
