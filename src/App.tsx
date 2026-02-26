import { useEffect, useRef } from "react";
import { Routes, Route } from "react-router";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../convex/_generated/api";
import HomePage from "./pages/home";
import OnboardingPage from "./pages/onboarding";
import CallDetailPage from "./pages/call-detail";
import NotFound from "./pages/not-found";

function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
    setTimeout(() => {
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.connect(g2);
      g2.connect(ctx.destination);
      o2.frequency.value = 880;
      o2.type = "sine";
      g2.gain.setValueAtTime(0.3, ctx.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      o2.start(ctx.currentTime);
      o2.stop(ctx.currentTime + 0.3);
    }, 200);
  } catch (_) {}
}

function HighRiskAlertToast() {
  const alerts = useQuery(api.alerts.listUnacknowledged);
  const calls = useQuery(api.calls.list);
  const lastAlertId = useRef<string | null>(null);
  const lastHighRiskCallId = useRef<string | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const latestAlert = alerts?.[0];
    const latestCall = calls?.[0];

    if (alerts === undefined && calls === undefined) return;

    if (!hasInitialized.current) {
      hasInitialized.current = true;
      lastAlertId.current = latestAlert?._id ?? null;
      lastHighRiskCallId.current = latestCall?.risk_score === "HIGH" ? latestCall.call_id : null;
      return;
    }

    if (latestAlert && latestAlert._id !== lastAlertId.current) {
      lastAlertId.current = latestAlert._id;
      lastHighRiskCallId.current = latestAlert.call_id;
      playAlertSound();
      toast.error("🚨 FRAUD ALERT - HIGH RISK CALL DETECTED", {
        description: "Check the call details and contact your loved one immediately.",
        duration: 30000,
        className: "bg-red-600 text-white border-red-800",
      });
    } else if (latestCall?.risk_score === "HIGH" && latestCall.call_id !== lastHighRiskCallId.current) {
      lastHighRiskCallId.current = latestCall.call_id;
      playAlertSound();
      toast.error("🚨 FRAUD ALERT - HIGH RISK CALL DETECTED", {
        description: "Check the call details and contact your loved one immediately.",
        duration: 30000,
        className: "bg-red-600 text-white border-red-800",
      });
    }
  }, [alerts, calls]);
  return null;
}

function GlobalAlertBanner() {
  const alerts = useQuery(api.alerts.listUnacknowledged);
  const calls = useQuery(api.calls.list);
  const loadedAt = useRef<number | null>(null);

  useEffect(() => {
    if ((alerts !== undefined || calls !== undefined) && loadedAt.current === null) {
      loadedAt.current = Date.now();
    }
  }, [alerts, calls]);

  const latestAlert = alerts?.[0];
  const latestCall = calls?.[0];
  const hasAlert = (alerts?.length ?? 0) > 0;
  const latestHighRisk = calls?.[0]?.risk_score === "HIGH";
  const ALERT_BUFFER_MS = 2000;
  const CALL_BUFFER_MS = 60000;
  const loadTime = loadedAt.current ?? 0;
  const alertIsNew = latestAlert && latestAlert.sent_at >= loadTime - ALERT_BUFFER_MS;
  const callIsNew = latestCall?.risk_score === "HIGH" && (latestCall._creationTime ?? 0) >= loadTime - CALL_BUFFER_MS;
  const showBanner = loadedAt.current !== null && (hasAlert || latestHighRisk) && (alertIsNew || callIsNew);

  if (!showBanner) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white py-4 px-6 shadow-2xl animate-pulse border-b-4 border-red-800">
      <div className="container mx-auto flex items-center justify-center gap-4 flex-wrap">
        <span className="text-3xl">🚨</span>
        <div className="text-center">
          <p className="text-xl md:text-2xl font-bold uppercase tracking-wider">
            ⚠️ FRAUD ALERT - HIGH RISK CALL DETECTED ⚠️
          </p>
          <p className="text-sm md:text-base mt-1 opacity-95">
            Check the call details and contact your loved one immediately.
          </p>
        </div>
        <span className="text-3xl">🚨</span>
      </div>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const alerts = useQuery(api.alerts.listUnacknowledged);
  const calls = useQuery(api.calls.list);
  const loadedAt = useRef<number | null>(null);
  useEffect(() => {
    if ((alerts !== undefined || calls !== undefined) && loadedAt.current === null) {
      loadedAt.current = Date.now();
    }
  }, [alerts, calls]);
  const latestAlert = alerts?.[0];
  const latestCall = calls?.[0];
  const hasAlert = (alerts?.length ?? 0) > 0;
  const latestHighRisk = calls?.[0]?.risk_score === "HIGH";
  const loadTime = loadedAt.current ?? 0;
  const alertIsNew = latestAlert && latestAlert.sent_at >= loadTime - 2000;
  const callIsNew = latestCall?.risk_score === "HIGH" && (latestCall._creationTime ?? 0) >= loadTime - 60000;
  const needsPadding = loadedAt.current !== null && (hasAlert || latestHighRisk) && (alertIsNew || callIsNew);
  return <div className={needsPadding ? "pt-24" : ""}>{children}</div>;
}

export default function App() {
  return (
    <>
      <HighRiskAlertToast />
      <GlobalAlertBanner />
      <AppLayout>
        <Routes>
      <Route index element={<HomePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/call/:callId" element={<CallDetailPage />} />
      {/* CRITICAL: ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </>
  );
}
