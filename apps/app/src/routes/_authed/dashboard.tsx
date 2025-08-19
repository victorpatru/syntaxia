import { api } from "@syntaxia/backend";
import { Card, CardContent, CardHeader, CardTitle } from "@syntaxia/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_authed/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const who = useQuery(api.users.currentUser);
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground">
          Welcome back! Ready to practice your technical interview skills?
        </p>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs">{JSON.stringify(who, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
