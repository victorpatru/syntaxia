import { useSignIn } from "@clerk/tanstack-react-start";
import type { OAuthStrategy } from "@clerk/types";
import { OAuthButton } from "@syntaxia/ui/auth";
import { Card } from "@syntaxia/ui/card";
import { GitHubIcon, GoogleIcon } from "@syntaxia/ui/icons";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoaded) return null;

  const signInWith = async (strategy: OAuthStrategy) => {
    setIsLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl text-terminal-green">
              $ ./syntaxia auth --login
            </h1>
          </div>
        </div>

        <Card className="border-terminal-green/30 bg-card p-6 space-y-6">
          <div className="space-y-4">
            <div className="text-terminal-amber text-sm font-mono">
              # Social Sign-In Providers
            </div>

            <div className="space-y-3">
              <OAuthButton
                provider="oauth_google"
                label="Google"
                icon={<GoogleIcon />}
                isLoading={isLoading}
                onSignIn={signInWith}
              />

              <OAuthButton
                provider="oauth_github"
                label="GitHub"
                icon={<GitHubIcon />}
                isLoading={isLoading}
                onSignIn={signInWith}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
