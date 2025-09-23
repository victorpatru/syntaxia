import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

export async function verifyClerkWebhook(
  request: Request,
  secret: string,
): Promise<{ event: WebhookEvent; eventId: string } | null> {
  const payload = await request.text();
  const svixId = request.headers.get("svix-id")!;
  const headers = {
    "svix-id": svixId,
    "svix-timestamp": request.headers.get("svix-timestamp")!,
    "svix-signature": request.headers.get("svix-signature")!,
  };
  const webhook = new Webhook(secret);
  try {
    const event = webhook.verify(payload, headers) as WebhookEvent;
    return { event, eventId: svixId };
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return null;
  }
}
