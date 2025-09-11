import { useClerk, useUser } from "@clerk/tanstack-react-start";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// Terminal-style icon for menu items
const TerminalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <polyline points="4,17 10,11 4,5" />
    <line x1="12" x2="20" y1="19" y2="19" />
  </svg>
);

// Custom terminal-styled user menu component
export function TerminalUserMenu() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) return null;

  const handleSignOut = () => signOut();
  const handleProfile = () => openUserProfile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs bg-transparent border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 h-8 gap-2 cursor-pointer"
        >
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt={user.fullName || "User"}
              className="w-4 h-4 border border-terminal-green/30"
            />
          )}
          {user.firstName ||
            user.emailAddresses[0]?.emailAddress.split("@")[0] ||
            "user"}
          @session
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 p-0 bg-terminal-dark border-terminal-green/30 font-mono"
      >
        {/* User info header */}
        <div className="p-3 border-b border-terminal-green/30">
          <div className="flex items-center gap-3">
            {user.imageUrl && (
              <img
                src={user.imageUrl}
                alt={user.fullName || "User"}
                className="w-8 h-8 border border-terminal-green/30"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-terminal-green text-sm font-semibold truncate">
                {user.fullName || user.firstName || "User"}
              </div>
              <div className="text-terminal-green/70 text-xs truncate">
                {user.emailAddresses[0]?.emailAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-1">
          <button
            onClick={handleProfile}
            type="button"
            className="flex items-center gap-2 px-3 py-2 text-terminal-green/90 hover:text-terminal-amber hover:bg-terminal-green/5 text-sm transition-colors w-full text-left"
          >
            <TerminalIcon />
            ~/profile
          </button>
          <div className="border-t border-terminal-green/30 my-1" />
          <button
            onClick={handleSignOut}
            type="button"
            className="flex items-center gap-2 px-3 py-2 text-terminal-green/90 hover:text-terminal-amber hover:bg-terminal-green/5 text-sm transition-colors w-full text-left"
          >
            <TerminalIcon />
            ./logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
