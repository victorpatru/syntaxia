import type { OAuthStrategy } from "@clerk/types";
import { Button } from "@syntaxia/ui/button";

interface OAuthButtonProps {
  provider: OAuthStrategy;
  label: string;
  icon: React.ReactNode;
  isLoading: boolean;
  onSignIn: (provider: OAuthStrategy) => Promise<void>;
}

export function OAuthButton({
  provider,
  label,
  icon,
  isLoading,
  onSignIn,
}: OAuthButtonProps) {
  return (
    <Button
      onClick={() => void onSignIn(provider)}
      disabled={isLoading}
      className="w-full bg-terminal-green/10 hover:bg-terminal-green/20 border border-terminal-green/30 text-terminal-green font-mono"
      variant="outline"
    >
      {icon}
      {isLoading ? "Authenticating..." : `Continue with ${label}`}
    </Button>
  );
}
