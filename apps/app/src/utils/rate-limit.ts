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
    const minutes = Math.ceil(seconds / 60);
    toast.error(
      minutes > 1
        ? `Too many attempts. Try again in ~${minutes} minutes.`
        : `Too many attempts. Try again in ~${seconds}s.`,
    );
  } else if (fallbackMessage) {
    toast.error(fallbackMessage);
  }
}

export function isRateLimitFailure(
  result: unknown,
): result is RateLimitFailure {
  return (
    !!result &&
    typeof result === "object" &&
    (result as any).success === false &&
    typeof (result as any).error === "string"
  );
}
