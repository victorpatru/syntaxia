import { useSignIn } from "@clerk/tanstack-react-start";
import type { OAuthStrategy } from "@clerk/types";
import { OAuthButton } from "@syntaxia/ui/auth";
import { GitHubIcon, GoogleIcon } from "@syntaxia/ui/icons";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoaded) return null;

  const bootSequence = [
    "$ ./syntaxia --init",
    "Loading authentication module...",
    "Establishing secure connection...",
    "Ready for authentication.",
  ];

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
      <div className="w-full max-w-2xl space-y-6">
        {/* Terminal Window Frame */}
        <div className="border border-terminal-green/30 bg-terminal-dark/20">
          {/* Terminal Title Bar */}
          <div className="bg-terminal-green/10 border-b border-terminal-green/30 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border border-terminal-green/50 bg-terminal-green/20"></div>
              <div className="w-3 h-3 border border-terminal-amber/50 bg-terminal-amber/20"></div>
              <div className="w-3 h-3 border border-red-500/50 bg-red-500/20"></div>
            </div>
            <div className="text-xs text-terminal-green/70 font-mono">
              syntaxia@auth:~$
            </div>
          </div>

          {/* Terminal Content */}
          <div className="px-12 py-20 space-y-6">
            {/* ASCII Art Banner */}
            <div className="text-center">
              <pre className="text-terminal-green text-xs leading-none">
                {`
 ███████╗██╗   ██╗███╗   ██╗████████╗ █████╗ ██╗  ██╗██╗ █████╗ 
 ██╔════╝╚██╗ ██╔╝████╗  ██║╚══██╔══╝██╔══██╗╚██╗██╔╝██║██╔══██╗
 ███████╗ ╚████╔╝ ██╔██╗ ██║   ██║   ███████║ ╚███╔╝ ██║███████║
 ╚════██║  ╚██╔╝  ██║╚██╗██║   ██║   ██╔══██║ ██╔██╗ ██║██╔══██║
 ███████║   ██║   ██║ ╚████║   ██║   ██║  ██║██╔╝ ██╗██║██║  ██║
 ╚══════╝   ╚═╝   ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
`}
              </pre>
            </div>

            {/* Boot Sequence */}
            <div className="bg-background border border-terminal-green/20 p-4">
              <pre className="text-terminal-green text-sm whitespace-pre-wrap">
                {bootSequence.join("\n")}
              </pre>
            </div>

            {/* Authentication Section */}
            <div className="space-y-4">
              <div className="border-b border-terminal-green/20 pb-2">
                <div className="text-terminal-amber text-sm font-mono">
                  # Available Authentication Methods
                </div>
                <div className="text-terminal-green/60 text-xs font-mono mt-1">
                  Select your preferred authentication provider:
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs text-terminal-green/60">
                  <span>➤</span>
                  <span>oauth_google</span>
                  <span className="text-terminal-amber">|</span>
                  <span>Continue with Google</span>
                </div>
                <OAuthButton
                  provider="oauth_google"
                  label="Google"
                  icon={<GoogleIcon />}
                  isLoading={isLoading}
                  onSignIn={signInWith}
                />

                <div className="flex items-center space-x-2 text-xs text-terminal-green/60">
                  <span>➤</span>
                  <span>oauth_github</span>
                  <span className="text-terminal-amber">|</span>
                  <span>Continue with GitHub</span>
                </div>
                <OAuthButton
                  provider="oauth_github"
                  label="GitHub"
                  icon={<GitHubIcon />}
                  isLoading={isLoading}
                  onSignIn={signInWith}
                />
              </div>

              {/* Status Line */}
              <div className="border-t border-terminal-green/20 pt-3 text-xs">
                <div className="flex justify-between text-terminal-green/50">
                  <span>
                    Status: {isLoading ? "Authenticating..." : "Ready"}
                  </span>
                  <span>Session: guest@syntaxia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-terminal-green/40 font-mono">
          <div>Secure authentication powered by Clerk</div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
