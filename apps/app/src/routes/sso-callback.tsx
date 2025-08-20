import { AuthenticateWithRedirectCallback } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

function SsoCallbackPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono grid place-items-center p-6">
      <div className="space-y-6">
        <div className="border border-terminal-green/30 p-4 bg-card">
          <pre className="text-terminal-green text-sm">
            {`┌─────────────────────────────────┐
│       PROCESSING LOGIN          │
│         PLEASE WAIT             │
└─────────────────────────────────┘`}
          </pre>
        </div>
        <div className="flex items-center justify-center gap-4 text-base text-terminal-green">
          <div className="inline-block h-6 w-6 animate-spin border-[3px] border-terminal-green" />
          <span className="font-mono">Authenticating session...</span>
        </div>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}

export const Route = createFileRoute("/sso-callback")({
  component: SsoCallbackPage,
});
