import { Button } from "@syntaxia/ui/button";
import { AlertCircle, Mic, MicOff, Wifi, WifiOff } from "lucide-react";

export function ConversationPanel({
  onToggleRecording,
  voiceState,
}: {
  onToggleRecording: () => void;
  voiceState: {
    isRecording: boolean;
    isPlaying: boolean;
    currentAudioLevel: number;
    connectionStatus: "connecting" | "connected" | "disconnected" | "error";
    lastError?: string;
  };
}) {
  const getConnectionIcon = () => {
    switch (voiceState.connectionStatus) {
      case "connected":
        return <Wifi className="w-3 h-3 text-terminal-green" />;
      case "connecting":
        return <Wifi className="w-3 h-3 text-terminal-amber animate-pulse" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      default:
        return <WifiOff className="w-3 h-3 text-terminal-green/40" />;
    }
  };

  const getSimpleStatus = () => {
    if (voiceState.connectionStatus !== "connected") {
      return "Connecting...";
    }
    return "Interview in progress";
  };

  return (
    <div className="border border-terminal-green/30 bg-background mb-6">
      <div className="border-b border-terminal-green/30 px-4 py-2 bg-terminal-dark flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-terminal-green/60 font-mono text-sm">
            CONVERSATION
          </span>
          {getConnectionIcon()}
        </div>
        <Button
          variant={voiceState.isRecording ? "destructive" : "default"}
          size="sm"
          className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20"
          onClick={onToggleRecording}
          disabled={voiceState.connectionStatus !== "connected"}
        >
          {voiceState.isRecording ? (
            <div className="flex items-center space-x-1">
              <MicOff className="w-3 h-3" />
              <span className="text-xs">STOP</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <Mic className="w-3 h-3" />
              <span className="text-xs">REC</span>
            </div>
          )}
        </Button>
      </div>

      <div className="p-6">
        {/* Dynamic Conversation Status */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div
              className={`w-2 h-2 mr-3 ${
                voiceState.isPlaying
                  ? "bg-terminal-amber animate-pulse"
                  : voiceState.connectionStatus === "connected"
                    ? "bg-terminal-green"
                    : "bg-terminal-green/40"
              }`}
            ></div>
            <span className="text-terminal-green/60 font-mono text-sm">
              STATUS
            </span>
          </div>
          <div className="text-lg leading-relaxed text-terminal-green font-mono">
            {getSimpleStatus()}
          </div>
        </div>

        {/* Response Area */}
        <div className="border-t border-terminal-green/30 pt-4">
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 bg-terminal-green mr-3"></div>
            <span className="text-terminal-green/60 font-mono text-sm">
              YOUR_RESPONSE
            </span>
            {voiceState.isRecording && (
              <div className="ml-3 flex items-center">
                <div className="w-2 h-2 bg-red-400 animate-pulse mr-2"></div>
                <span className="text-red-400 text-xs font-mono">LIVE</span>
              </div>
            )}
          </div>

          <div className="min-h-16">
            {voiceState.isRecording ? (
              <span className="text-terminal-green">
                Recording your response...
              </span>
            ) : (
              <span className="text-terminal-green/60">
                Press REC to respond
              </span>
            )}
          </div>

          {/* Connection Status */}
          {voiceState.connectionStatus !== "connected" && (
            <div className="mt-4 p-3 border border-orange-400/30 bg-orange-400/10">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-mono">
                  {voiceState.connectionStatus === "connecting" &&
                    "Connecting to voice service..."}
                  {voiceState.connectionStatus === "disconnected" &&
                    "Voice service disconnected"}
                  {voiceState.connectionStatus === "error" &&
                    `Error: ${voiceState.lastError}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
