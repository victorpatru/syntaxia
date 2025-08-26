import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

export async function verifyClerkWebhook(
  request: Request,
  secret: string,
): Promise<WebhookEvent | null> {
  const payload = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id")!,
    "svix-timestamp": request.headers.get("svix-timestamp")!,
    "svix-signature": request.headers.get("svix-signature")!,
  };
  const webhook = new Webhook(secret);
  try {
    const event = webhook.verify(payload, headers) as WebhookEvent;
    return event;
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return null;
  }
}
