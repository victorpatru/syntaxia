import { httpRouter } from "convex/server";
import { handleClerkWebhook } from "./http/clerk";

const http = httpRouter();

/**
 * Clerk webhook endpoint
 */
http.route({
  path: "/webhook/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
