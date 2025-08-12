import { AuthenticateWithRedirectCallback } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

function SsoCallbackPage() {
  return (
    <div className="min-h-svh grid place-items-center p-6">
      <div className="flex items-center gap-4 text-base md:text-lg text-muted-foreground">
        <span className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-primary border-r-transparent" />
        <span className="font-medium">Hold tight — setting things up…</span>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}

export const Route = createFileRoute("/sso-callback")({
  component: SsoCallbackPage,
});
