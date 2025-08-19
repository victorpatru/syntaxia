import { Button } from "@syntaxia/ui/button";
import { ConversationPanel, WaveformRingOrb } from "@syntaxia/ui/interview";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Question,
  TranscriptEntry,
  VoiceSessionState,
} from "../../../../types/interview";

export const Route = createFileRoute("/_authed/interview/session/$sessionId")({
  component: InterviewSession,
});

function InterviewSession() {
  const navigate = useNavigate();
  const { sessionId } = Route.useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [interviewTime, setInterviewTime] = useState(0);
  const [isInterviewActive, setIsInterviewActive] = useState(false);

  // TODO: Replace with actual session data from Convex
  const [currentQuestion] = useState<Question>({
    id: "1",
    type: "background",
    text: "Tell me about a challenging technical problem you've solved recently. Walk me through your approach and the technologies you used.",
    expectedDuration: 300,
    difficulty: 3,
    tags: ["problem-solving", "technical-depth"],
  });

  const [transcript] = useState<TranscriptEntry[]>([]);

  const [voiceState, setVoiceState] = useState<VoiceSessionState>({
    isRecording: false,
    isPlaying: false,
    currentAudioLevel: 0.3,
    connectionStatus: "connected", // TODO: Set based on actual ElevenLabs connection
  });

  useEffect(() => {
    // TODO: Load interview session data from Convex
    // TODO: Initialize ElevenLabs voice connection

    setIsInterviewActive(true);

    // Start interview timer
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
  }, [sessionId]);

  const endInterview = () => {
    setIsInterviewActive(false);
    // TODO: Stop ElevenLabs session and save transcript

    // Navigate to analysis
    navigate({
      to: "/interview/analysis/$sessionId",
      params: { sessionId },
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleRecording = () => {
    // TODO: Integrate with ElevenLabs STT
    const newRecordingState = !isRecording;
    setIsRecording(newRecordingState);
    setVoiceState((prev) => ({
      ...prev,
      isRecording: newRecordingState,
    }));
  };

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
            <ConversationPanel
              transcript={transcript}
              currentQuestion={currentQuestion}
              isRecording={isRecording}
              onToggleRecording={toggleRecording}
              voiceState={voiceState}
            />

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
