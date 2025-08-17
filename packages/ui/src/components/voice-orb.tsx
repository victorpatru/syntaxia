import { cn } from "../utils";

interface VoiceOrbProps {
  conversation: {
    status: "connected" | "disconnected";
    isSpeaking: boolean;
  };
}

export function VoiceOrb({ conversation }: VoiceOrbProps) {
  return (
    <div className={"flex flex-col gap-y-4 text-center"}>
      <div
        className={cn(
          "orb my-16 mx-12",
          conversation.status === "connected" && conversation.isSpeaking
            ? "orb-active animate-orb"
            : conversation.status === "connected"
              ? "animate-orb-slow orb-inactive"
              : "orb-inactive",
        )}
      ></div>
    </div>
  );
}
