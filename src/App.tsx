import { Routes, Route } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import HomePage from "./pages/home";
import OnboardingPage from "./pages/onboarding";
import CallDetailPage from "./pages/call-detail";
import NotFound from "./pages/not-found";

function GlobalAlertBanner() {
  const alerts = useQuery(api.alerts.listUnacknowledged);
  const calls = useQuery(api.calls.list);
  const hasAlert = (alerts?.length ?? 0) > 0;
  const latestHighRisk = calls?.[0]?.risk_score === "HIGH";
  if (!hasAlert && !latestHighRisk) return null;
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
  const needsPadding = (alerts?.length ?? 0) > 0 || calls?.[0]?.risk_score === "HIGH";
  return <div className={needsPadding ? "pt-24" : ""}>{children}</div>;
}

export default function App() {
  return (
    <>
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
