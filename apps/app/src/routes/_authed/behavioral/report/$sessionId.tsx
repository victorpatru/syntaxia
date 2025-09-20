import { api } from "@syntaxia/backend/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import { useEffect } from "react";
import { validateSessionForRoute } from "@/utils/route-guards";

export const Route = createFileRoute("/_authed/behavioral/report/$sessionId")({
  component: BehavioralReportRedirect,
});

function BehavioralReportRedirect() {
  const navigate = useNavigate();
  const { sessionId } = Route.useParams();
  const session = useQuery(api.sessions.getSession, {
    sessionId: sessionId as GenericId<"interview_sessions">,
  });

  useEffect(() => {
    if (session === undefined) return;
    const validation = validateSessionForRoute(
      session as unknown as any,
      ["complete"] as unknown as any,
    );
    if (!validation.isValid && validation.redirectTo) {
      navigate({
        to: validation.redirectTo.replace("/interview", "/behavioral"),
      });
      return;
    }
  }, [session, session?.status, navigate]);

  // Reuse the existing interview report UI by redirecting to it
  useEffect(() => {
    if (!session) return;
    if (session.status === "complete") {
      navigate({
        to: "/interview/report/$sessionId",
        params: { sessionId: session._id },
      });
    }
  }, [session?.status, navigate]);

  return null;
}
