import { httpRouter } from "convex/server";
import { handleClerkWebhook } from "./http/clerk";
import { handlePolarWebhook } from "./http/polar";

const http = httpRouter();

/**
 * Clerk webhook endpoint
 */
http.route({
  path: "/webhook/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});

/**
 * Polar webhook endpoint
 */
http.route({
  path: "/webhook/polar",
  method: "POST",
  handler: handlePolarWebhook,
});

export default http;
