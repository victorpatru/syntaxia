import { api } from "@syntaxia/backend/api";
import { Button } from "@syntaxia/ui/button";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAction, useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import { useState } from "react";
import { toast } from "sonner";

type Category = "Conflict" | "Leadership" | "Failure" | "Ownership" | "Success";

const categoryDescriptions: Record<Category, string> = {
  Conflict: "Navigate team disagreements and challenging conversations",
  Leadership: "Demonstrate influence, vision, and team guidance",
  Failure: "Show resilience, learning, and recovery from setbacks",
  Ownership: "Take responsibility and drive initiatives to completion",
  Success: "Showcase achievements and positive impact delivery",
};

export const Route = createFileRoute("/_authed/behavioral/")({
  validateSearch: (
    search: { sessionId?: GenericId<"interview_sessions"> } = {},
  ) => ({
    sessionId: search.sessionId,
  }),
  loader: async (opts) => {
    try {
      const currentSession = await opts.context.convexClient.query(
        api.sessions.getCurrentSession,
        {},
      );
      if (currentSession) {
        throw redirect({
          to: "/behavioral/setup",
          search: { sessionId: currentSession._id },
        });
      }
    } catch {}
    return null;
  },
  component: BehavioralStart,
});

function BehavioralStart() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const data = useQuery(api.users.getCurrentUserProfile, {});
  const balance = data?.credits ?? 0;
  const isAffordable = balance >= 15;

  const createBehavioralSession = useAction(
    api.behavioral.createSessionValidated,
  );
  const [isCreating, setIsCreating] = useState(false);

  const start = async () => {
    if (!category) {
      toast.error("Select a category or choose Random.");
      return;
    }
    if (balance < 15) {
      toast.error("You need at least 15 credits to start.");
      return;
    }
    try {
      setIsCreating(true);
      const res = await createBehavioralSession({ category });
      if (!("success" in res) || !res.success) {
        toast.error(
          (res as { error?: string }).error || "Failed to start session",
        );
        return;
      }
      navigate({
        to: "/behavioral/setup",
        search: { sessionId: res.sessionId },
      });
    } finally {
      setIsCreating(false);
    }
  };

  const categories: Category[] = [
    "Conflict",
    "Leadership",
    "Failure",
    "Ownership",
    "Success",
  ];

  const pickRandom = () => {
    const c = categories[Math.floor(Math.random() * categories.length)];
    setCategory(c);
  };

  return (
    <div className="bg-background font-mono min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header Section */}
        <div className="border border-terminal-green/30 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-terminal-green text-lg font-mono">
                behavioral.interview
              </h1>
              <p className="text-terminal-green/70 text-xs mt-1">
                Practice STAR method with AI-powered behavioral interviews
              </p>
            </div>
            <div
              className={`text-xs px-3 py-1 border ${
                isAffordable
                  ? "border-terminal-green/30 text-terminal-green"
                  : "border-terminal-amber/50 text-terminal-amber bg-terminal-amber/5"
              }`}
            >
              credits: {balance} • cost: 15
              {!isAffordable && (
                <div className="text-xs mt-1">insufficient funds</div>
              )}
            </div>
          </div>

          {!isAffordable && (
            <div className="border border-terminal-amber/30 bg-terminal-amber/5 p-3 mb-4">
              <div className="text-terminal-amber text-xs">
                ⚠ You need 15 credits to start a behavioral session. Current
                balance: {balance}
              </div>
            </div>
          )}

          <div className="text-terminal-green/60 text-xs">
            • Duration: ~15-20 minutes • Format: STAR method practice • AI voice
            interviewer with real-time feedback
          </div>
        </div>

        {/* Category Selection */}
        <div className="border border-terminal-green/30 p-6 mb-6">
          <h2 className="text-terminal-green text-sm mb-3">select.category</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(category === c ? null : c)}
                disabled={!isAffordable}
                aria-pressed={category === c}
                aria-label={`Select ${c} category`}
                className={`p-3 border transition-all duration-200 text-left ${
                  !isAffordable
                    ? "border-terminal-green/10 text-terminal-green/30 cursor-not-allowed"
                    : category === c
                      ? "border-terminal-amber text-terminal-amber bg-terminal-amber/10"
                      : "border-terminal-green/30 text-terminal-green hover:border-terminal-amber/50 hover:bg-terminal-green/5 cursor-pointer"
                }`}
              >
                <div className="font-mono text-xs font-semibold mb-1">{c}</div>
                <div className="text-xs text-terminal-green/60 leading-relaxed">
                  {categoryDescriptions[c]}
                </div>
              </button>
            ))}
          </div>

          {/* Category Description */}
          {category && (
            <div className="border border-terminal-green/20 bg-terminal-green/5 p-3">
              <div className="text-terminal-green text-xs">
                <span className="text-terminal-amber">selected:</span>{" "}
                {category}
              </div>
              <div className="text-terminal-green/70 text-xs mt-1">
                {categoryDescriptions[category]}
              </div>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="border border-terminal-green/30 p-6">
          <h2 className="text-terminal-green text-sm mb-4">actions</h2>

          <div className="flex gap-3 mb-4">
            <Button
              onClick={pickRandom}
              disabled={!isAffordable}
              className={`font-mono text-xs px-4 py-2 transition-colors h-10 min-w-24 ${
                !isAffordable
                  ? "bg-transparent border border-terminal-green/10 text-terminal-green/30 cursor-not-allowed"
                  : "bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber cursor-pointer"
              }`}
            >
              ./random
            </Button>

            <Button
              disabled={!category || isCreating || !isAffordable}
              onClick={start}
              className={`font-mono text-xs px-6 py-2 transition-colors h-10 min-w-32 ${
                !category || isCreating || !isAffordable
                  ? "bg-transparent border border-terminal-green/10 text-terminal-green/30 cursor-not-allowed"
                  : "bg-terminal-amber text-black hover:bg-terminal-amber/80 cursor-pointer"
              }`}
            >
              {isCreating ? "starting..." : "./start.session"}
            </Button>
          </div>

          {!category && isAffordable && (
            <div className="text-terminal-green/60 text-xs">
              Select a category above or use ./random to begin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
