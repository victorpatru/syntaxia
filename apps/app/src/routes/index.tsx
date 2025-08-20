import { SignedIn, SignedOut } from "@clerk/tanstack-react-start";
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
        <Navigate to="/login" />
      </SignedOut>
    </div>
  );
}
