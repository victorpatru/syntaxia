import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/tanstack-react-start";
import { Button } from "@syntaxia/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Index Route</h1>
      <SignedIn>
        <p className="mb-4">You are signed in</p>
        <UserButton />
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button>Button</Button>
        </div>
      </SignedIn>
      <SignedOut>
        <p className="mb-4">You are signed out</p>
        <SignInButton />
      </SignedOut>
    </div>
  );
}
