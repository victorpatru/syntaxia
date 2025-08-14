import { Badge } from "@syntaxia/ui/badge";
import { Button } from "@syntaxia/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@syntaxia/ui/card";
import { VoiceOrb } from "@syntaxia/ui/voice-orb";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, MessageCircle, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_authed/interview")({
  component: Interview,
});

function Interview() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline">Section B: Code Debugging</Badge>
            <div className="text-sm text-slate-600">15:23 elapsed</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "45%" }}
              />
            </div>
            <span className="text-sm text-slate-600">45%</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid lg:grid-cols-3 gap-6">
        {/* Code Display */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Authentication Middleware
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">auth.js</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono text-slate-100 overflow-auto max-h-96">
                <div className="space-y-1">
                  <div className="text-slate-400">1</div>
                  <div className="text-slate-400">2</div>
                  <div className="text-slate-400">3</div>
                  <div className="bg-yellow-500/20 border-l-2 border-yellow-500 pl-2">
                    <span className="text-slate-400">4</span>
                    <span className="ml-4">
                      export async function authenticate(req, res, next) {"{"}
                    </span>
                  </div>
                  <div className="bg-yellow-500/20 border-l-2 border-yellow-500 pl-2">
                    <span className="text-slate-400">5</span>
                    <span className="ml-4">
                      {" "}
                      const token = req.headers.authorization;
                    </span>
                  </div>
                  <div className="text-slate-400">6</div>
                  <div>
                    <span className="text-slate-400">7</span>
                    <span className="ml-4"> if (!token) {"{"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">8</span>
                    <span className="ml-4">
                      {" "}
                      return res.status(401).json({"{"} error: 'No token' {"}"}
                      );
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">9</span>
                    <span className="ml-4"> {"}"}</span>
                  </div>
                  <div className="text-slate-400">10</div>
                  <div className="bg-red-500/20 border-l-2 border-red-500 pl-2">
                    <span className="text-slate-400">11</span>
                    <span className="ml-4">
                      {" "}
                      const user = await verifyToken(token);
                    </span>
                  </div>
                  <div className="bg-red-500/20 border-l-2 border-red-500 pl-2">
                    <span className="text-slate-400">12</span>
                    <span className="ml-4"> req.user = user;</span>
                  </div>
                  <div>
                    <span className="text-slate-400">13</span>
                    <span className="ml-4"> next();</span>
                  </div>
                  <div>
                    <span className="text-slate-400">14</span>
                    <span className="ml-4">{"}"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>AI Interviewer:</strong> "I'm highlighting lines 4-5
                  and 11-12. Can you walk me through what potential issues you
                  see with this authentication middleware?"
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voice Controls & Status */}
        <div className="space-y-6">
          {/* Audio Waveform */}
          <Card>
            <CardContent className="p-6 flex justify-center items-center">
              <VoiceOrb
                conversation={{
                  status: "connected",
                  isSpeaking: true,
                }}
              />
            </CardContent>
          </Card>

          {/* Session Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Session Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">✓ Background Warm-up</span>
                  <span className="text-slate-500">5 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 font-medium">
                    → Code Debugging
                  </span>
                  <span className="text-slate-500">15 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">System Design</span>
                  <span className="text-slate-400">12 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Wrap-up</span>
                  <span className="text-slate-400">3 min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Repeat Question
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Clarify Audio
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Eye className="w-4 h-4 mr-2" />
                Highlight Lines
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
