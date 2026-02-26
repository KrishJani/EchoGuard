# EchoGuard Real-Time Stream Server

Receives Twilio Media Streams, forwards audio to ElevenLabs realtime STT, and triggers Convex fraud analysis.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your values
```

## Env vars

| Var | Description |
|-----|-------------|
| `PORT` | Server port (default 8080) |
| `CONVEX_SITE_URL` | Your Convex site URL (e.g. `https://xxx.convex.site`) |
| `API_ELEVENLABS_KEY` | ElevenLabs API key |

## Run locally

```bash
npm run dev
```

For Twilio to connect, expose with ngrok:

```bash
ngrok http 8080
# Use the https URL, replace https with wss for STREAM_SERVER_URL
```

## Deploy (Railway example)

1. Create a new project, add this folder
2. Set env vars in Railway dashboard
3. Railway will assign a URL like `https://your-app.railway.app`
4. Use `wss://your-app.railway.app` as `STREAM_SERVER_URL` in Convex

## Convex env

In Convex Dashboard → Settings → Environment Variables, add:

- `STREAM_SERVER_URL` = `wss://your-deployed-stream-server`

When set, incoming calls use real-time analysis instead of post-call recording.
