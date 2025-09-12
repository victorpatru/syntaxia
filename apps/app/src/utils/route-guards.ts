/**
 * Route guard utilities for handling session-based redirects
 * Replaces useEffect navigation logic with proper route-level handling
 */

import type { Question } from "@/types/interview";

export interface SessionData {
  _id: string;
  status: "setup" | "active" | "analyzing" | "complete" | "failed";
  questions?: Question[];
  experienceLevel?: string;
  domainTrack?: string;
  startedAt?: number;
  duration?: number;
  jobDescription?: string;
  failureCode?:
    | "AUTH"
    | "UNAUTHORIZED"
    | "NOT_FOUND"
    | "CREDITS"
    | "RATE_LIMIT"
    | "PARSE"
    | "UNKNOWN";
  failureMessage?: string;
}

/**
 * Determines the correct route for a session based on its status
 */
export function getSessionRoute(session: SessionData): string {
  switch (session.status) {
    case "setup":
      return `/interview/setup?sessionId=${session._id}`;
    case "active":
      return `/interview/session/${session._id}`;
    case "analyzing":
      return `/interview/analysis/${session._id}`;
    case "complete":
      return `/interview/report/${session._id}`;
    case "failed":
      return `/interview/setup-failed?sessionId=${session._id}`;
    default:
      return "/interview";
  }
}

/**
 * Validates if a session can be accessed for a specific route type
 */
export function validateSessionForRoute(
  session: SessionData | null,
  expectedStatus: SessionData["status"][],
): { isValid: boolean; redirectTo?: string } {
  if (!session) {
    return { isValid: false, redirectTo: "/interview" };
  }

  if (!expectedStatus.includes(session.status)) {
    return { isValid: false, redirectTo: getSessionRoute(session) };
  }

  return { isValid: true };
}

/**
 * Validates setup route requirements
 */
export function validateSetupRoute(session: SessionData | null): {
  isValid: boolean;
  redirectTo?: string;
} {
  if (!session) {
    return { isValid: false, redirectTo: "/interview" };
  }
  if (session.status === "failed") {
    return {
      isValid: false,
      redirectTo: `/interview/setup-failed?sessionId=${session._id}`,
    };
  }
  // If questions are ready, redirect to session (session route accepts 'setup' or 'active')
  if (session.questions && session.questions.length > 0) {
    return { isValid: false, redirectTo: `/interview/session/${session._id}` };
  }

  // Otherwise, only allow setup status
  return validateSessionForRoute(session, ["setup"]);
}

/**
 * Validates session route requirements
 */
export function validateSessionRoute(session: SessionData | null): {
  isValid: boolean;
  redirectTo?: string;
} {
  return validateSessionForRoute(session, ["setup", "active"]);
}

/**
 * Validates analysis route requirements
 */
export function validateAnalysisRoute(session: SessionData | null): {
  isValid: boolean;
  redirectTo?: string;
} {
  return validateSessionForRoute(session, ["analyzing"]);
}
