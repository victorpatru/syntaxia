import {
  SignedIn,
  SignedOut,
  SignIn,
  // UserButton,
} from "@clerk/tanstack-react-start";
import { AppSidebar } from "@syntaxia/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "@syntaxia/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  component: () => (
    <>
      <SignedIn>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </SignedIn>
      <SignedOut>
        <div className="max-w-md mx-auto p-6">
          <SignIn />
        </div>
      </SignedOut>
    </>
  ),
});
