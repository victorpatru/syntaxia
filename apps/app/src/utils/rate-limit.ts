import { toast } from "sonner";

export type RateLimitFailure = {
  success: false;
  error: string;
  retryAfterMs?: number;
};

export function showRateLimitToast(
  retryAfterMs?: number,
  fallbackMessage?: string,
) {
  if (typeof retryAfterMs === "number") {
    const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    if (seconds >= 60) {
      const minutes = Math.ceil(seconds / 60);
      const unit = minutes === 1 ? "minute" : "minutes";
      toast.error(`Too many attempts. Try again in ~${minutes} ${unit}.`, {
        id: "rate-limit",
      });
    } else {
      toast.error(`Too many attempts. Try again in ~${seconds}s.`, {
        id: "rate-limit",
      });
    }
  } else if (fallbackMessage) {
    toast.error(fallbackMessage, { id: "rate-limit" });
  } else {
    toast.error("Too many attempts. Try again later.", { id: "rate-limit" });
  }
}

export function isRateLimitFailure(result: unknown): boolean {
  return (
    !!result &&
    typeof result === "object" &&
    (result as RateLimitFailure).success === false &&
    typeof (result as RateLimitFailure).retryAfterMs === "number"
  );
}
