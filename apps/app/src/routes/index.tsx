import { SignedIn, SignedOut, SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="p-6">
      <SignedIn>
        <Navigate to="/dashboard" />
      </SignedIn>
      <SignedOut>
        <div className="max-w-md mx-auto p-6">
          <SignIn />
        </div>
      </SignedOut>
    </div>
  );
}
