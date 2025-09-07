import { convexQuery } from "@convex-dev/react-query";
import { api } from "@syntaxia/backend/convex/_generated/api";
import { Button } from "@syntaxia/ui/button";
import { Card } from "@syntaxia/ui/card";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { CreditCard, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { isRateLimitFailure, showRateLimitToast } from "@/utils/rate-limit";

interface CreditPackage {
  id: string;
  credits: number;
  price: string;
  description: string;
}

export const Route = createFileRoute("/_authed/credits")({
  component: Credits,
});

function Credits() {
  const { data: balance } = useSuspenseQuery(
    convexQuery(api.credits.getBalance, {}),
  );
  const { data: availablePackages } = useSuspenseQuery(
    convexQuery(api.credits.getAvailablePackages, {}),
  );

  const convexCreateCheckout = useAction(api.credits.createCheckout);

  const createCheckoutMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const result = await convexCreateCheckout({ packageId });

      if (!result.success) {
        // Handle specific error cases with proper toast notifications
        if (isRateLimitFailure(result)) {
          showRateLimitToast(
            result.retryAfterMs,
            "Too many purchase attempts. Please try again later.",
          );
          return; // Don't throw, just show toast and exit
        }

        // Handle invalid packageId and other errors
        if (result.error === "Invalid packageId") {
          toast.error(
            "This credit package is no longer available. Please refresh the page.",
          );
          return;
        }

        // Handle any other server errors
        toast.error(
          result.error || "Failed to start purchase process. Please try again.",
        );
        return;
      }

      return result;
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      // This will only catch network errors or unexpected issues
      console.error("Purchase error:", error);
      toast.error("Network error. Please check your connection and try again.");
    },
  });

  return (
    <div className="px-6 py-8 space-y-8 max-w-5xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">
          Credits
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-prose">
          Purchase interview credits to unlock more practice sessions
        </p>
      </div>

      {/* Current Balance */}
      <Card className="border border-terminal-green/30 bg-background p-6 md:p-7">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center">
            <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-terminal-green mr-3" />
            <div>
              <h3 className="font-mono text-base md:text-lg text-terminal-green">
                Current Balance
              </h3>
              <p className="text-terminal-green/60 text-xs md:text-sm">
                Available credits for interviews
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl md:text-5xl leading-none font-bold font-mono text-terminal-green">
              {balance}
            </div>
            <div className="text-xs md:text-sm uppercase tracking-wider text-terminal-green/60">
              credits
            </div>
          </div>
        </div>
      </Card>

      {/* Purchase Options */}
      <div className="space-y-4">
        <h2 className="text-2xl font-mono text-terminal-green">
          Purchase Credits
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {availablePackages.map((pkg: CreditPackage) => (
            <Card
              key={pkg.id}
              className="border border-terminal-green/30 bg-background p-6 md:p-7"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-terminal-green mr-3" />
                  <div className="text-base md:text-lg font-mono font-medium text-terminal-green">
                    {pkg.credits} Credits
                  </div>
                </div>

                <div className="flex-1 mb-4">
                  <div className="text-3xl font-bold font-mono text-terminal-green mb-2">
                    {pkg.price}
                  </div>
                  <p className="text-terminal-green/60 text-sm">
                    {pkg.description}
                  </p>
                </div>

                <Button
                  onClick={() => createCheckoutMutation.mutate(pkg.id)}
                  disabled={createCheckoutMutation.isPending || !pkg.id}
                  className="w-full font-mono text-xs md:text-sm bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-4 transition-colors h-9 md:h-10"
                >
                  {createCheckoutMutation.isPending
                    ? "./processing..."
                    : "./purchase"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <Card className="border border-terminal-green/30 bg-background p-6">
        <div className="border-b border-terminal-green/30 pb-4 mb-4">
          <span className="font-mono text-xs uppercase tracking-wider text-terminal-green">
            credits-info.txt
          </span>
        </div>
        <div className="text-terminal-green/60 text-sm space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-terminal-green">$</span>
            <span>Each interview session costs 15 credits</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-terminal-green">$</span>
            <span>Credits never expire and are tied to your account</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-terminal-green">$</span>
            <span>Secure payment processing powered by Polar</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
