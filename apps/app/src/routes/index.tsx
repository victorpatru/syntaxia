import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/tanstack-react-start";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="p-6">
      <SignedIn>
        <Navigate to="/dashboard" />
      </SignedIn>
      <SignedOut>
        <div className="max-w-md mx-auto p-6 space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Welcome to Syntaxia</h1>
            <p className="text-muted-foreground">
              {mode === "signin"
                ? "Sign in to your account or create one to get started"
                : "Create your account to get started"}
            </p>
          </div>

          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setMode("signin")}
              type="button"
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              type="button"
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === "signin" ? (
            <SignIn
              fallbackRedirectUrl="/dashboard"
              signUpUrl="/"
              signUpFallbackRedirectUrl="/"
            />
          ) : (
            <SignUp fallbackRedirectUrl="/dashboard" />
          )}
        </div>
      </SignedOut>
    </div>
  );
}
