import { api } from "@syntaxia/backend/api";
import { DashboardHeader } from "@syntaxia/ui/dashboard-header";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";

function AuthedLayout() {
  const location = useLocation();
  const isInterviewFlow =
    location.pathname.includes("/interview/setup") ||
    location.pathname.includes("/interview/session/") ||
    location.pathname.includes("/interview/analysis/");
  const userData = useQuery(api.users.getCurrentUserProfile, {});
  const balance = userData?.credits ?? 0;

  return (
    <>
      <Authenticated>
        <div className="min-h-screen">
          {!isInterviewFlow &&
            (!userData ? (
              <div className="border-b border-terminal-green/30 bg-terminal-dark font-mono">
                <div className="mx-auto max-w-6xl px-6 flex h-14 md:h-16 items-center justify-between gap-4">
                  <div className="h-4 w-24 bg-terminal-green/10 animate-pulse" />
                  <div className="h-6 w-20 bg-terminal-green/10 animate-pulse" />
                </div>
              </div>
            ) : (
              <DashboardHeader credits={balance} />
            ))}
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
