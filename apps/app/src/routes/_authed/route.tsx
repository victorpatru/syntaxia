import { DashboardHeader } from "@syntaxia/ui/dashboard-header";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";

function AuthedLayout() {
  return (
    <>
      <Authenticated>
        <div className="min-h-screen">
          <DashboardHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">
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
