import { useConversation } from "@elevenlabs/react";
import { api } from "@syntaxia/backend/convex/_generated/api";
import { Button } from "@syntaxia/ui/button";
import { ConversationPanel, WaveformRingOrb } from "@syntaxia/ui/interview";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  useAction,
  useMutation as useConvexMutation,
  useQuery,
} from "convex/react";
import { Clock } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { env } from "@/env";
import {
  Question,
  TranscriptEntry,
  VoiceSessionState,
} from "@/types/interview";
import { isRateLimitFailure, showRateLimitToast } from "@/utils/rate-limit";
import { validateSessionRoute } from "@/utils/route-guards";

export const Route = createFileRoute("/_authed/interview/session/$sessionId")({
  component: InterviewSession,
});

function InterviewSession() {
  const navigate = useNavigate();
  const { sessionId } = Route.useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [interviewTime, setInterviewTime] = useState(0);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [hasStartedActive, setHasStartedActive] = useState(false);
  const [micOnAt, setMicOnAt] = useState<number | null>(null);

  // Convex hooks
  const session = useQuery(api.sessions.getSession, { sessionId });
  const startActiveMutation = useConvexMutation(api.sessions.startActive);
  const endMutation = useConvexMutation(api.sessions.endSession);
  const getConversationTokenAction = useAction(
    api.sessions.getConversationToken,
  );

  // ElevenLabs conversation hook
  const conversation = useConversation({
    onConnect: () => {
      setVoiceState((prev) => ({ ...prev, connectionStatus: "connected" }));

      // Auto-start recording when connection is established
      if (!isRecording) {
        toggleRecording();
      }
    },
    onDisconnect: () => {
      setVoiceState((prev) => ({ ...prev, connectionStatus: "disconnected" }));
    },
    onMessage: () => {
      // Handle transcript or other messages if needed
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      setVoiceState((prev) => ({
        ...prev,
        connectionStatus: "error",
        lastError: String(error),
      }));
    },
  });

  // Get current question from session data safely
  const idxRaw = session?.currentQuestionIndex;
  const idx = typeof idxRaw === "number" ? idxRaw : -1;
  const questions = session?.questions ?? [];
  const currentQuestion: Question | null =
    idx >= 0 && idx < questions.length ? (questions[idx] ?? null) : null;

  const [transcript] = useState<TranscriptEntry[]>([]);

  const [voiceState, setVoiceState] = useState<VoiceSessionState>({
    isRecording: false,
    isPlaying: false,
    currentAudioLevel: 0.3,
    connectionStatus: "disconnected",
  });

  // Compute voice state directly - replaced useEffect with useMemo for better performance
  const computedVoiceState = useMemo(
    () => ({
      ...voiceState,
      isPlaying: conversation.isSpeaking || false,
      connectionStatus: (conversation.status === "connected"
        ? "connected"
        : conversation.status === "disconnected"
          ? "disconnected"
          : "connecting") as VoiceSessionState["connectionStatus"],
    }),
    [
      conversation.status,
      conversation.isSpeaking,
      voiceState.isRecording,
      voiceState.currentAudioLevel,
      voiceState.lastError,
    ],
  );

  // Use useEffect for voice state updates to prevent infinite renders
  useEffect(() => {
    if (
      computedVoiceState.isPlaying !== voiceState.isPlaying ||
      computedVoiceState.connectionStatus !== voiceState.connectionStatus
    ) {
      setVoiceState(computedVoiceState);
    }
  }, [
    computedVoiceState.isPlaying,
    computedVoiceState.connectionStatus,
    voiceState.isPlaying,
    voiceState.connectionStatus,
  ]);

  const startVoiceConnection = useCallback(async () => {
    if (
      !session?.experienceLevel ||
      !session?.domainTrack ||
      hasStartedActive
    ) {
      return;
    }

    // Require questions before starting; if missing, fail setup and navigate back
    if (!session?.questions || session.questions.length === 0) {
      navigate({ to: "/interview" });
      return;
    }

    setHasStartedActive(true);

    const dynamicVariables = {
      experience_level: session.experienceLevel,
      domain_track: session.domainTrack,
      top_skills: session.detectedSkills?.join(", ") || "",
      questions_json: JSON.stringify(session.questions || []),
      time_limit_secs: "900",
      charge_threshold_secs: "120",
    } as const;

    try {
      const tokenResponse = await getConversationTokenAction({ sessionId });
      if (isRateLimitFailure(tokenResponse)) {
        showRateLimitToast(
          tokenResponse.retryAfterMs,
          "Failed to initialize voice conversation",
        );
        setHasStartedActive(false);
        return;
      }
      await conversation.startSession({
        agentId: env.VITE_ELEVENLABS_AGENT_ID,
        conversationToken: tokenResponse.conversationToken,
        connectionType: "webrtc",
        userId: sessionId,
        dynamicVariables,
      });
    } catch (error) {
      // If token fetch fails, fail the setup and navigate out
      console.error("Failed to start WebRTC session:", error);
      setHasStartedActive(false);
      navigate({ to: "/interview" });
    }
  }, [
    session,
    hasStartedActive,
    getConversationTokenAction,
    sessionId,
    conversation,
    navigate,
  ]);

  // Use useEffect for session validation and state updates to prevent infinite renders
  useEffect(() => {
    if (session === undefined) return;

    const validation = validateSessionRoute(session);
    if (!validation.isValid && validation.redirectTo) {
      navigate({ to: validation.redirectTo });
      return;
    }

    // Update interview state based on session status
    const shouldBeActive = session.status === "active" && session.startedAt;
    if (shouldBeActive && !isInterviewActive) {
      setIsInterviewActive(true);
      // Calculate elapsed time from when session started
      const elapsed = Math.floor((Date.now() - session.startedAt!) / 1000);
      setInterviewTime(elapsed);
    }

    // Auto-start voice connection logic
    const shouldAutoStart =
      session.status === "active" &&
      session.experienceLevel &&
      session.domainTrack &&
      !hasStartedActive;

    const shouldStartSetupVoice =
      session.status === "setup" &&
      session.experienceLevel &&
      session.domainTrack &&
      session.questions &&
      session.questions.length > 0 &&
      !hasStartedActive;

    if (shouldAutoStart) {
      startVoiceConnection();
    } else if (shouldStartSetupVoice) {
      startVoiceConnection();
    }
  }, [
    session,
    session?.status,
    navigate,
    isInterviewActive,
    hasStartedActive,
    startVoiceConnection,
  ]);

  const endInterview = useCallback(async () => {
    setIsInterviewActive(false);

    // End ElevenLabs conversation and get conversation ID
    let conversationId: string | undefined;
    try {
      if (conversation.status === "connected") {
        conversationId = conversation.getId();
        await conversation.endSession();
      }
    } catch (error) {
      console.error("Failed to end ElevenLabs conversation:", error);
    }

    // Call Convex end mutation
    endMutation({ sessionId, elevenlabsConversationId: conversationId })
      .then((res: any) => {
        if (isRateLimitFailure(res)) {
          showRateLimitToast(
            res.retryAfterMs,
            "Failed to end session. Please try again.",
          );
          return;
        }
        // Navigate to analysis
        navigate({
          to: "/interview/analysis/$sessionId",
          params: { sessionId },
        });
      })
      .catch((error: any) => {
        console.error("Failed to end session:", error);
        alert("Failed to end session. Please try again.");
      });
  }, [sessionId, endMutation, navigate, conversation]);

  // Timer effect - separate from session loading
  useEffect(() => {
    if (!isInterviewActive) return;

    const timer = setInterval(() => {
      setInterviewTime((prev) => {
        if (prev >= 900) {
          // 15 minutes max
          clearInterval(timer);
          endInterview();
          return 900;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isInterviewActive, endInterview]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // startVoiceConnection function moved earlier in the component to avoid hoisting issues

  const toggleRecording = async () => {
    const newRecordingState = !isRecording;
    setIsRecording(newRecordingState);
    setVoiceState((prev) => ({
      ...prev,
      isRecording: newRecordingState,
    }));

    // On first mic-ON for setup sessions, trigger startActive
    if (newRecordingState && session?.status === "setup") {
      setHasStartedActive(true);
      const micStartTime = Date.now();
      setMicOnAt(micStartTime);

      try {
        // Start Convex session
        const res = await startActiveMutation({
          sessionId,
          micOnAt: micStartTime,
        });
        if (isRateLimitFailure(res)) {
          showRateLimitToast(
            res.retryAfterMs,
            "Failed to start interview session",
          );
          setHasStartedActive(false);
          setIsRecording(false);
          setIsInterviewActive(false);
          return;
        }
        setIsInterviewActive(true);

        // Voice connection will be started automatically when session becomes active
      } catch (error: any) {
        console.error("Failed to start session:", error);
        alert("Failed to start interview session. Please try again.");
        setHasStartedActive(false);
        setIsRecording(false);
        setIsInterviewActive(false);
      }
    }
  };

  // Loading state
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-terminal-green/60 mb-2">Loading session...</div>
          <div className="w-2 h-2 bg-terminal-green animate-pulse mx-auto"></div>
        </div>
      </div>
    );
  }

  // Not found: let the effect handle navigation without rendering a flicker
  if (session === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-mono">
      <div className="border-b border-terminal-green/30 bg-background">
        <div className="px-6 py-3 flex items-center justify-between">
          <span className="text-terminal-green font-mono">
            interview-session.active
          </span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-terminal-green/60" />
              <span className="font-mono text-terminal-green">
                {formatTime(interviewTime)}
              </span>
              <span className="text-terminal-green/60">/</span>
              <span className="text-terminal-green/60">15:00</span>
            </div>
            <div className="w-2 h-2 bg-terminal-green animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
        <div className="flex items-center justify-center py-8">
          <WaveformRingOrb
            isActive={isInterviewActive}
            audioLevel={voiceState.currentAudioLevel}
            size="medium"
          />
        </div>

        <div className="flex-1 pt-4">
          <div className="max-w-2xl mx-auto w-full">
            {currentQuestion && (
              <ConversationPanel
                transcript={transcript}
                currentQuestion={currentQuestion}
                isRecording={isRecording}
                onToggleRecording={toggleRecording}
                voiceState={voiceState}
              />
            )}

            {!currentQuestion && (
              <div className="text-center py-8">
                <span className="text-terminal-green/60 font-mono">
                  Loading interview questions...
                </span>
              </div>
            )}

            <div className="text-center">
              <Button
                variant="outline"
                onClick={endInterview}
                className="font-mono text-xs bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-3 py-1 transition-colors h-8 min-w-20"
              >
                ./end-session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
