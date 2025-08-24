import { Button } from "@syntaxia/ui/button";
import { Textarea } from "@syntaxia/ui/textarea";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authed/interview/")({
  component: InterviewStart,
});

function InterviewStart() {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");

  const startInterview = () => {
    if (!jobDescription.trim()) return;

    // TODO: Generate session ID and store job description in Convex
    const sessionId = crypto.randomUUID();

    // Navigate to setup/processing route
    navigate({
      to: "/interview/setup",
      search: { sessionId, jobDescription: encodeURIComponent(jobDescription) },
    });
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-mono font-bold text-3xl md:text-5xl mb-6 leading-tight">
              <span className="text-muted-foreground">$ ./practice</span>{" "}
              <span className="text-primary">--mode=technical</span>{" "}
              <span className="text-accent">--feel=real</span>
            </h1>
          </div>

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
                  placeholder="We're looking for a Senior Full-Stack Engineer with experience in React, Node.js, and system design..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-32 font-mono bg-background border border-terminal-green/30 text-terminal-green placeholder:text-terminal-green/40 focus:outline-none focus:border-terminal-green/50 resize-none"
                />
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-terminal-green/60 text-sm font-mono">
                    {jobDescription.length} chars
                  </span>
                  <Button
                    onClick={startInterview}
                    disabled={!jobDescription.trim()}
                    className="font-mono text-sm bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-4 py-2 transition-colors h-10 min-w-28"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    ./start-interview
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
                    Interview requires 15 credits (15-minute duration)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-terminal-green/40">#</span>
                  <span className="text-terminal-green/70">
                    Technical phone screening format
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-terminal-green/40">#</span>
                  <span className="text-terminal-green/70">
                    Full payment processed after 2-minute commitment threshold
                  </span>
                </div>
              </div>

              {/* Subtle bottom accent line */}
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-terminal-green/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
