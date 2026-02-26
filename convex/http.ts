import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Real-time fraud check: called by the WebSocket stream server
http.route({
  path: "/realtime-fraud-check",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { transcript, call_id, from, to } = body ?? {};
      if (!transcript || !call_id) {
        return new Response(
          JSON.stringify({ error: "Missing transcript or call_id" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const result = await ctx.runAction(internal.actions.realtimeFraudCheck, {
        transcript: String(transcript),
        call_id: String(call_id),
        from: from ? String(from) : undefined,
        to: to ? String(to) : undefined,
      });
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Realtime fraud check error:", error);
      return new Response(
        JSON.stringify({
          error: "Processing failed",
          message: error instanceof Error ? error.message : String(error),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

http.route({
  path: "/twilio/incoming-call",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log("📥 Webhook received:", "/twilio/incoming-call", "POST");
    try {
      const requestUrl = new URL(request.url);
      const contentType = request.headers.get("content-type");
      let body;
      if (contentType?.includes("application/json")) {
        body = await request.json();
      } else if (contentType?.includes("application/x-www-form-urlencoded")) {
        const text = await request.text();
        body = Object.fromEntries(new URLSearchParams(text).entries());
      } else {
        body = await request.text();
      }
      const flowResult = await ctx.runAction(
        api.actions.processFlow_node_1772062308325_xcjw1lt,
        {
          input: {
            body,
            headers: {} as Record<string, string>,
            query: Object.fromEntries(requestUrl.searchParams.entries()),
            method: request.method,
            path: "twilio/incoming-call",
            url: request.url,
          },
        }
      );
      const result = flowResult?.__result;
      if (typeof result === "string" && (flowResult?.__isTwiml || result.trim().startsWith("<?xml"))) {
        return new Response(result, {
          status: 200,
          headers: { "Content-Type": "application/xml" },
        });
      }
      return new Response(
        JSON.stringify({
          success: true,
          result: flowResult,
          timestamp: new Date().toISOString(),
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("❌ Webhook error (/twilio/incoming-call):", error);
      return new Response(
        JSON.stringify({
          error: "Webhook processing failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

http.route({
  path: "/twilio/recording-complete",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log("📥 Webhook received:", "/twilio/recording-complete", "POST");
    try {
      const contentType = request.headers.get("content-type");
      let body;
      if (contentType?.includes("application/json")) {
        body = await request.json();
      } else if (contentType?.includes("application/x-www-form-urlencoded")) {
        const text = await request.text();
        body = Object.fromEntries(new URLSearchParams(text).entries());
      } else {
        body = await request.text();
      }
      const flowResult = await ctx.runAction(
        api.actions.processFlow_node_1772062308325_xcjw1lt,
        {
          input: {
            body,
            headers: {} as Record<string, string>,
            query: Object.fromEntries(new URL(request.url).searchParams.entries()),
            method: request.method,
            path: "twilio/recording-complete",
            url: request.url,
          },
        }
      );
      const result = flowResult?.__result;
      if (typeof result === "string" && (flowResult?.__isTwiml || result.trim().startsWith("<?xml"))) {
        return new Response(result, {
          status: 200,
          headers: { "Content-Type": "application/xml" },
        });
      }
      return new Response(result ?? "OK", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    } catch (error) {
      console.error("❌ Recording complete webhook error:", error);
      return new Response("Error", { status: 500 });
    }
  }),
});

export default http;