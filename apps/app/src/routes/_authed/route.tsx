import { convexQuery } from "@convex-dev/react-query";
import { api } from "@syntaxia/backend/convex/_generated/api";
import { DashboardHeader } from "@syntaxia/ui/dashboard-header";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";

function AuthedLayout() {
  const location = useLocation();
  const isInterviewFlow =
    location.pathname.includes("/interview/setup") ||
    location.pathname.includes("/interview/session/") ||
    location.pathname.includes("/interview/analysis/");
  const { data: balance } = useSuspenseQuery(
    convexQuery(api.credits.getBalance, {}),
  );

  return (
    <>
      <Authenticated>
        <div className="min-h-screen">
          {!isInterviewFlow && <DashboardHeader credits={balance} />}
          <div
            className={`flex flex-1 flex-col ${isInterviewFlow ? "" : "gap-4 p-4"}`}
          >
            <Outlet />
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="max-w-md mx-auto p-6">
          <p>Please sign in to continue.</p>
        </div>
      </Unauthenticated>
    </>
  );
}

export const Route = createFileRoute("/_authed")({
  component: AuthedLayout,
});
