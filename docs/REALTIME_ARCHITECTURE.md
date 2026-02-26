# Real-Time Call Analysis Architecture

## Post-Call (Fallback when STREAM_SERVER_URL is not set)

```
Caller → Twilio Number → Record entire call → Recording complete webhook → STT → Fraud analysis → SMS alert
```

- **Pros:** Simple, works with Convex only, no extra infrastructure
- **Cons:** Analysis happens after the call ends; cannot intervene mid-call

## Real-Time (Implemented)

```
Caller → Twilio Number → <Stream> TwiML → WebSocket server ← audio chunks (mulaw 8kHz)
                              ↓
                    ElevenLabs realtime STT (ulaw_8000)
                              ↓
                    Fraud analysis on committed transcript (every ~5s)
                              ↓
                    If HIGH: SMS alert via Convex
```

### Setup

1. **Deploy the stream server** (`realtime-stream/`):
   - `cd realtime-stream && npm install`
   - Set env: `CONVEX_SITE_URL`, `API_ELEVENLABS_KEY`, `PORT`
   - Deploy to Railway, Render, Fly.io, or run locally with ngrok

2. **Set Convex env vars**:
   - `STREAM_SERVER_URL` = `wss://your-deployed-server` (e.g. `wss://echoguard-stream.railway.app`)

3. **Twilio config**: No changes needed. The incoming-call webhook returns `<Stream>` TwiML when `STREAM_SERVER_URL` is set.

### Flow

- Twilio sends `connected` → `start` (with custom params: CallSid, From, To) → `media` (base64 mulaw) → `stop`
- Server forwards media to ElevenLabs `/v1/speech-to-text/realtime` with `audio_format=ulaw_8000`
- On `committed_transcript`, server POSTs to Convex `/realtime-fraud-check`
- Convex runs profile lookup, KB fetch, fraud agent, updates call risk, sends SMS if HIGH
