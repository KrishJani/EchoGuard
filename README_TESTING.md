# EchoGuard E2E Testing Guide

## Call Flow (Current: Post-Call Analysis)

**Twilio number = the monitored line** (elderly's phone). When someone calls it:

1. **Incoming call** → Twilio hits `/twilio/incoming-call` → We return TwiML with `<Record>` to record the call.
2. **During the call** → Twilio records; no analysis yet.
3. **Recording complete** → Twilio hits `/twilio/recording-complete` with `RecordingUrl` → We transcribe, run fraud analysis, send SMS if HIGH risk.

**Profile lookup** uses the **called number** (`To`) = your Twilio number. In onboarding, enter your Twilio number as "Monitored Phone Number".

## Real-Time vs Post-Call

| Mode | Current | Real-time (future) |
|------|---------|--------------------|
| When analyzed | After recording ends | During the call |
| How | Twilio `<Record>` → callback with URL | Twilio `<Stream>` → WebSocket |
| Requires | Convex HTTP only | Separate WebSocket server |

Real-time would need Twilio Media Streams (WebSocket) + a WebSocket server (Convex HTTP cannot hold WebSocket connections). This would require deploying a separate service (e.g. Node.js on Railway/Render) that receives audio chunks and streams to ElevenLabs STT.

---

## Fixes Applied

1. **Extract Call Data** – Reads `CallSid`, `From`, `RecordingUrl` from `body` (Twilio form payload)
2. **Map Risk Score** – Fixed early return; `call_id` comes from Extract Call Data
3. **Profile/KB arrays** – Uses `[0]` for `user_id` and `family_phone` from query results
4. **Fraud agent transcript** – Uses STT result (`text` or `transcript`) instead of mutation result
5. **Save Transcript** – Uses STT response for transcript text
6. **STT** – Supports `cloud_storage_url` for Twilio recording URLs
7. **Twilio SMS** – Uses `TWILIO_PHONE_NUMBER` or `API_TWILIO_FROM` env var
8. **Incoming vs recording** – Incoming call returns TwiML to record; recording-complete runs full analysis
9. **Recording-complete webhook** – Added `/twilio/recording-complete` route
10. **Webhook response** – Returns TwiML as `application/xml` when appropriate
11. **fetchCallRecord** – Added to look up existing calls before creating
12. **Frontend flow actions** – Use `api` instead of `internal` for public queries

## Environment Variables (Convex Dashboard)

- `API_ELEVENLABS_KEY` – ElevenLabs API key
- `API_TWILIO_KEY` – Twilio auth token
- `TWILIO_PHONE_NUMBER` or `API_TWILIO_FROM` – Twilio phone number for SMS
- `CONVEX_SITE_URL` – Your Convex site URL (e.g. `https://xxx.convex.site`)

## Twilio Configuration

1. **Voice webhook URL**: `https://YOUR_CONVEX_SITE/twilio/incoming-call`
2. **Recording status callback**: Set in TwiML (auto from `CONVEX_SITE_URL`) or `https://YOUR_CONVEX_SITE/twilio/recording-complete`

## Test Flow

### 1. Onboarding (via app)

1. Run `npm run dev`
2. Go to `/onboarding`
3. Fill form and submit
4. Should see success toast and redirect to dashboard

### 2. Incoming call webhook

```bash
curl -X POST "https://YOUR_CONVEX_SITE/twilio/incoming-call" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=CA123&From=%2B15551234567&To=%2B15559876543"
```

Expected: TwiML with `<Record>` and `recordingStatusCallback`

### 3. Recording complete webhook

```bash
curl -X POST "https://YOUR_CONVEX_SITE/twilio/recording-complete" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=CA123&From=%2B15551234567&RecordingUrl=https://api.twilio.com/...&RecordingSid=RE123"
```

Expected: Full analysis runs (STT, fraud check, etc.). Requires valid `RecordingUrl` and env vars.

### 4. E2E script

```bash
CONVEX_SITE_URL=https://YOUR_CONVEX_SITE npx tsx scripts/test-e2e.ts
```

## Deploy

```bash
npx convex deploy
```
