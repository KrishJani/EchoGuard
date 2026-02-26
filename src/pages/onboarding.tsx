import { useState } from "react";
import { useNavigate } from "react-router";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    elderly_phone: "",
    family_phone: "",
    user_id: "",
    qa_1_question: "",
    qa_1_answer: "",
    qa_2_question: "",
    qa_2_answer: "",
  });

  // Action for saving profile
  const saveProfile = useAction(api.actions.processFlow_node_1772062308325_ijvljhn);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await saveProfile({ input: formData });
      
      if (result?.__error) {
        throw new Error(result.__error);
      }

      toast.success("Protection activated! EchoGuard is now monitoring calls.");
      navigate("/");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to activate protection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="max-w-2xl w-full shadow-xl border-t-4 border-t-blue-600">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-slate-500 hover:text-slate-800 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">Set Up EchoGuard Protection</CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Help protect your loved one from phone scams by configuring their profile.
            </CardDescription>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm">1</div>
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="elderly_phone" className="text-slate-700">Monitored Phone Number (Twilio number)</Label>
                  <Input
                    id="elderly_phone"
                    name="elderly_phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                    value={formData.elderly_phone}
                    onChange={handleChange}
                    className="border-slate-300 focus:border-blue-500"
                  />
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Your Twilio number—the line EchoGuard will monitor. Callers to this number will be analyzed.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="family_phone" className="text-slate-700">Your Phone Number (for alerts)</Label>
                  <Input
                    id="family_phone"
                    name="family_phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                    value={formData.family_phone}
                    onChange={handleChange}
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user_id" className="text-slate-700">User ID (unique identifier)</Label>
                <Input
                  id="user_id"
                  name="user_id"
                  type="text"
                  placeholder="e.g. john-smith-2024"
                  required
                  value={formData.user_id}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-blue-500"
                />
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  This links your profile to the phone system
                </p>
              </div>
            </div>

            <Separator />

            {/* Verification Questions */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm">2</div>
                  Verification Questions
                </h3>
                <p className="text-sm text-slate-500 ml-8">
                  Set secret questions that the AI can use to verify caller identity if suspicious.
                </p>
              </div>

              <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qa_1_question" className="text-slate-700">Question 1</Label>
                    <Input
                      id="qa_1_question"
                      name="qa_1_question"
                      placeholder="e.g. What was our childhood dog's name?"
                      required
                      value={formData.qa_1_question}
                      onChange={handleChange}
                      className="bg-white border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qa_1_answer" className="text-slate-700">Answer 1</Label>
                    <Input
                      id="qa_1_answer"
                      name="qa_1_answer"
                      placeholder="Answer"
                      required
                      value={formData.qa_1_answer}
                      onChange={handleChange}
                      className="bg-white border-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qa_2_question" className="text-slate-700">Question 2</Label>
                    <Input
                      id="qa_2_question"
                      name="qa_2_question"
                      placeholder="e.g. Where did we celebrate Christmas in 2019?"
                      required
                      value={formData.qa_2_question}
                      onChange={handleChange}
                      className="bg-white border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qa_2_answer" className="text-slate-700">Answer 2</Label>
                    <Input
                      id="qa_2_answer"
                      name="qa_2_answer"
                      placeholder="Answer"
                      required
                      value={formData.qa_2_answer}
                      onChange={handleChange}
                      className="bg-white border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-900 hover:bg-blue-800 text-white text-lg py-6 shadow-lg transition-all transform hover:scale-[1.01]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   activating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Activate Protection
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
