import { api } from "@syntaxia/backend";
import { Button } from "@syntaxia/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@syntaxia/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { BarChart3, History, Plus } from "lucide-react";

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* New Session Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              New Session
            </CardTitle>
            <CardDescription>
              Start a new senior-level interview practice session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/new-session">
              <Button className="w-full">Create Session</Button>
            </Link>
          </CardContent>
        </Card>

        {/* My Sessions Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-green-600" />
              My Sessions
            </CardTitle>
            <CardDescription>
              View your previous interview practice sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        {/* Reports Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Progress Reports
            </CardTitle>
            <CardDescription>
              Track your improvement and get detailed feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/reports">
              <Button variant="outline" className="w-full">
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Debug Info */}
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
