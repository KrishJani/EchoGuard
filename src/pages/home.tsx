import { Link, useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Phone, Bell, PhoneOff, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const calls = useQuery(api.calls.list);
  const alerts = useQuery(api.alerts.listUnacknowledged);

  const getRiskColor = (score: string | undefined) => {
    switch (score) {
      case "HIGH":
        return "bg-red-100 text-red-700 border-red-300 hover:bg-red-200";
      case "MEDIUM":
        return "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200";
      case "LOW":
        return "bg-green-100 text-green-700 border-green-300 hover:bg-green-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">EchoGuard</h1>
              <p className="text-xs text-slate-400">Real-Time Fraud Protection</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-400">Live</span>
            </div>
            <Link to="/onboarding">
              <Button variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700 border-none">
                Set Up Protection
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Calls Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-6 w-6 text-slate-700" />
              <h2 className="text-2xl font-bold text-slate-800">Recent Calls</h2>
            </div>

            {calls === undefined ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : calls.length === 0 ? (
              <Card className="bg-slate-50 border-dashed border-2 border-slate-300">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <PhoneOff className="h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-slate-700">No calls recorded yet</h3>
                  <p className="text-slate-500">Waiting for incoming calls...</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {calls.slice(0, 20).map((call) => (
                  <Card 
                    key={call._id} 
                    className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
                    onClick={() => navigate(`/call/${call.call_id}`)}
                  >
                    <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xl font-semibold text-slate-900">{call.phone_number}</span>
                          <Badge className={`${call.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'} hover:bg-opacity-80 border-0`}>
                            {call.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-2">
                          <span>ID: {call.call_id.substring(0, 8)}...</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(call._creationTime, { addSuffix: true })}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <Badge variant="outline" className={`px-3 py-1 text-sm font-medium border ${getRiskColor(call.risk_score)}`}>
                          {call.risk_score || "Analyzing..."}
                        </Badge>
                        <ArrowRight className="h-5 w-5 text-slate-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Active Alerts Panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-slate-700" />
                <h2 className="text-2xl font-bold text-slate-800">Active Alerts</h2>
              </div>
              {(alerts?.length ?? 0) > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {alerts.length}
                </span>
              )}
            </div>

              {alerts === undefined ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : alerts.length === 0 ? (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-green-800">No active alerts</h3>
                  <p className="text-green-600">All clear! ✅</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Card key={alert._id} className="border-l-4 border-l-red-500 shadow-sm bg-red-50/30">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                          HIGH RISK
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(alert.sent_at, { addSuffix: true })}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase">Family Contact</p>
                          <p className="text-base font-semibold text-slate-900">{alert.family_phone}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase">Call Reference</p>
                          <p className="text-sm font-mono text-slate-700">{alert.call_id}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
