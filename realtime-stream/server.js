/**
 * EchoGuard Real-Time Stream Server
 *
 * Receives Twilio Media Streams (mulaw 8kHz), forwards to ElevenLabs
 * realtime STT, runs fraud analysis via Convex, and sends SMS on HIGH risk.
 *
 * Deploy to Railway, Render, or run locally with ngrok for testing.
 */

import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { config } from "dotenv";

config();

const PORT = parseInt(process.env.PORT || "8080", 10);
const CONVEX_SITE_URL = process.env.CONVEX_SITE_URL;
const API_ELEVENLABS_KEY = process.env.API_ELEVENLABS_KEY;

if (!CONVEX_SITE_URL || !API_ELEVENLABS_KEY) {
  console.error("Missing CONVEX_SITE_URL or API_ELEVENLABS_KEY");
  process.exit(1);
}

const ELEVENLABS_STT_URL = "wss://api.elevenlabs.io/v1/speech-to-text/realtime";

function createServer() {
  return http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("EchoGuard Real-Time Stream Server");
  });
}

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (twilioWs, req) => {
  let streamSid = null;
  let callSid = null;
  let from = null;
  let to = null;
  let elevenLabsWs = null;
  let transcriptBuffer = "";
  let lastAnalysisTime = 0;
  let mediaChunkCount = 0;
  const mediaQueue = [];
  const ANALYSIS_INTERVAL_MS = 5000; // Run fraud check every 5 seconds
  const MIN_TRANSCRIPT_LENGTH = 20; // Minimum chars before analyzing

  let elevenLabsReady = false;

  const flushMediaQueue = () => {
    if (!elevenLabsReady || !elevenLabsWs || elevenLabsWs.readyState !== WebSocket.OPEN) return;
    console.log("[ElevenLabs] Flushing", mediaQueue.length, "queued chunks");
    while (mediaQueue.length > 0) {
      elevenLabsWs.send(mediaQueue.shift());
    }
  };

  const connectToElevenLabs = () => {
    const url = new URL(ELEVENLABS_STT_URL);
    url.searchParams.set("audio_format", "ulaw_8000");
    url.searchParams.set("model_id", "scribe_v2_realtime");
    url.searchParams.set("commit_strategy", "vad");

    elevenLabsWs = new WebSocket(url.toString(), {
      headers: { "xi-api-key": API_ELEVENLABS_KEY },
    });

    elevenLabsWs.on("open", () => {
      console.log("[ElevenLabs] WebSocket open for call", callSid);
    });

    elevenLabsWs.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        const mt = msg.message_type;
        if (mt === "session_started") {
          elevenLabsReady = true;
          console.log("[ElevenLabs] Session started, config:", msg.config?.audio_format, msg.config?.sample_rate);
          flushMediaQueue();
          return;
        }
        if (mt === "error" || mt === "auth_error" || mt === "input_error" || mt === "chunk_size_exceeded") {
          console.error("[ElevenLabs] API error:", mt, msg);
          return;
        }
        if (mt === "partial_transcript" && msg.text) {
          transcriptBuffer = msg.text;
          if (transcriptBuffer.length <= 80) console.log("[ElevenLabs] Partial:", msg.text);
        } else if (msg.message_type === "committed_transcript" && msg.text) {
          transcriptBuffer += (transcriptBuffer ? " " : "") + msg.text;
          console.log("[ElevenLabs] Committed:", msg.text?.slice(0, 50) + (msg.text?.length > 50 ? "..." : ""));
          runFraudAnalysis();
        }
      } catch (e) {
        // ignore parse errors
      }
    });

    elevenLabsWs.on("error", (err) => {
      console.error("[ElevenLabs] Error:", err.message);
    });

    elevenLabsWs.on("close", () => {
      runFraudAnalysis(); // Final analysis on stream end
    });
  };

  const runFraudAnalysis = async () => {
    const text = transcriptBuffer.trim();
    if (!text || text.length < MIN_TRANSCRIPT_LENGTH) return;
    const now = Date.now();
    if (now - lastAnalysisTime < ANALYSIS_INTERVAL_MS) return;
    lastAnalysisTime = now;

    try {
      const res = await fetch(`${CONVEX_SITE_URL}/realtime-fraud-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: text,
          call_id: callSid,
          from,
          to,
        }),
      });
      if (!res.ok) {
        console.error("[Convex] Fraud check failed:", res.status, await res.text());
      } else {
        const result = await res.json();
        console.log("[Convex] Fraud check OK:", result?.risk_level ?? result);
      }
    } catch (err) {
      console.error("[Convex] Fraud check error:", err.message);
    }
  };

  twilioWs.on("message", async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.event === "connected") {
        // Wait for start
      } else if (msg.event === "start") {
        streamSid = msg.streamSid ?? msg.start?.streamSid;
        callSid = msg.start?.callSid;
        const params = msg.start?.customParameters ?? {};
        from = params.From ?? params.from;
        to = params.To ?? params.to;
        console.log("[Twilio] Stream started", { callSid, from, to });

        await connectToElevenLabs();
      } else if (msg.event === "media") {
        const payload = msg.media?.payload;
        if (payload) {
          if (!mediaChunkCount) mediaChunkCount = 0;
          mediaChunkCount++;
          if (mediaChunkCount <= 3 || mediaChunkCount % 50 === 0) {
            console.log("[Twilio] Media chunk", mediaChunkCount, "len:", payload?.length);
          }
          const chunk = JSON.stringify({
            message_type: "input_audio_chunk",
            audio_base_64: payload,
            commit: false,
            sample_rate: 8000,
          });
          if (elevenLabsReady && elevenLabsWs?.readyState === WebSocket.OPEN) {
            elevenLabsWs.send(chunk);
          } else {
            mediaQueue.push(chunk);
          }
        }
      } else if (msg.event === "stop") {
        console.log("[Twilio] Stream stopped", callSid, "transcript length:", transcriptBuffer.length);
        if (elevenLabsWs) elevenLabsWs.close();
      }
    } catch (e) {
      console.error("[Twilio] Parse error:", e.message);
    }
  });

  twilioWs.on("close", () => {
    if (elevenLabsWs) elevenLabsWs.close();
  });
});

server.listen(PORT, () => {
  console.log(`EchoGuard Real-Time Stream listening on port ${PORT}`);
});
