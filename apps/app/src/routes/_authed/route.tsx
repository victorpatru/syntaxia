import { AppSidebar } from "@syntaxia/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "@syntaxia/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";

export const Route = createFileRoute("/_authed")({
  component: () => (
    <>
      <Authenticated>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </Authenticated>
      <Unauthenticated>
        <div className="max-w-md mx-auto p-6">
          <p>Please sign in to continue.</p>
        </div>
      </Unauthenticated>
    </>
  ),
});
