import { AppSidebar } from "@syntaxia/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@syntaxia/ui/sidebar";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";

function AuthedLayout() {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/new-session":
        return "New Session";
      case "/reports":
        return "Performance Reports";
      case "/interview":
        return "Interview Session";
      default:
        return "Dashboard";
    }
  };

  return (
    <>
      <Authenticated>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b">
              <div className="flex items-center gap-2 px-3">
                <SidebarTrigger className="-ml-1" />
                <span className="text-base font-semibold text-slate-900">
                  {getPageTitle(location.pathname)}
                </span>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
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
