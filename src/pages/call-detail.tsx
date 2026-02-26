import { useParams, useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Phone, Clock, Shield, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CallDetailPage() {
  const { callId } = useParams<{ callId: string }>();
  const navigate = useNavigate();
  
  const calls = useQuery(api.calls.list);
  const call = calls?.find((c: any) => c.call_id === callId);
  const transcript = useQuery(api.transcripts.getByCallId, callId ? { callId } : "skip");

  const getRiskColor = (score: string | undefined) => {
    switch (score) {
      case "HIGH":
        return "bg-red-100 text-red-700 border-red-300";
      case "MEDIUM":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "LOW":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getRiskIcon = (score: string | undefined) => {
    switch (score) {
      case "HIGH":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "MEDIUM":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "LOW":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Shield className="h-5 w-5 text-slate-400" />;
    }
  };

  if (!callId) return <div>Invalid Call ID</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div>
          <Button variant="ghost" onClick={() => navigate("/")} className="text-slate-600 hover:text-slate-900 pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Header / Call Info */}
        {calls === undefined ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : call ? (
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>Call ID: {call.call_id}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900">{call.phone_number}</h1>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatDistanceToNow(call._creationTime, { addSuffix: true })}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`text-base px-4 py-1.5 ${getRiskColor(call.risk_score)}`}>
                    <span className="flex items-center gap-2">
                      {getRiskIcon(call.risk_score)}
                      Risk Level: {call.risk_score || "ANALYZING"}
                    </span>
                  </Badge>
                  <Badge variant="outline" className="text-slate-500 bg-slate-50">
                    Status: {call.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-red-700">Call Not Found</h2>
              <p className="text-red-600">Could not retrieve details for this call.</p>
            </CardContent>
          </Card>
        )}

        {/* Risk Analysis (Placeholder if data missing) */}
        {call && call.risk_score && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <CardTitle>Risk Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* Since we don't have detailed analysis stored, we show a simplified view based on risk score */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <h4 className="font-semibold text-slate-700 mb-2">Assessment</h4>
                  <p className="text-slate-600">
                    {call.risk_score === "HIGH" 
                      ? "This call has been flagged as HIGH RISK. It likely contains patterns associated with known fraud schemes. Immediate attention recommended."
                      : call.risk_score === "MEDIUM"
                      ? "This call shows some suspicious patterns but is not definitively fraudulent. Caution is advised."
                      : "No significant fraud patterns detected. This call appears to be safe."}
                  </p>
                </div>
                
                {/* Note: In a real app with full data persistence, we would list specific matched patterns here */}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transcript */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-600" />
              <CardTitle>Call Transcript</CardTitle>
            </div>
            <CardDescription>Real-time transcription of the conversation</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {transcript === undefined ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : transcript.length > 0 ? (
              <div className="space-y-6">
                {transcript.map((chunk: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">
                      {chunk.chunk_index + 1}
                    </div>
                    <div className="flex-1 p-4 bg-slate-50 rounded-lg border border-slate-100 text-lg leading-relaxed text-slate-800">
                      {chunk.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 italic">
                No transcript available for this call yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
