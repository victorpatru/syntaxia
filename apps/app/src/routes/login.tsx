import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: () => (
    <div className="max-w-md mx-auto p-6">
      <SignIn />
    </div>
  ),
});
