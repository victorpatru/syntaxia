import { api } from "@syntaxia/backend";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_authed/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const who = useQuery(api.users.whoami);
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">You are signed in.</p>
      <pre className="text-xs bg-muted p-3 rounded">
        {JSON.stringify(who, null, 2)}
      </pre>
    </div>
  );
}
