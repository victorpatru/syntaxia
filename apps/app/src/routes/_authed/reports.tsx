import { Badge } from "@syntaxia/ui/badge";
import { Button } from "@syntaxia/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@syntaxia/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@syntaxia/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle, Clock, Target, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authed/reports")({
  component: Reports,
});

function Reports() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-slate-600">+3 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.8/10</div>
              <p className="text-xs text-green-600">+0.5 improvement</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Practice Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2h</div>
              <p className="text-xs text-slate-600">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">83%</div>
              <p className="text-xs text-slate-600">Above target</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            <TabsTrigger value="skills">Skill Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Interview Sessions</CardTitle>
                <CardDescription>
                  Your latest practice sessions and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    date: "Dec 8, 2024",
                    role: "Senior Full-Stack Engineer",
                    company: "TechCorp",
                    score: 8.5,
                    duration: "42 min",
                    status: "completed",
                  },
                  {
                    date: "Dec 6, 2024",
                    role: "Backend Engineer",
                    company: "StartupXYZ",
                    score: 7.2,
                    duration: "38 min",
                    status: "completed",
                  },
                  {
                    date: "Dec 4, 2024",
                    role: "Frontend Developer",
                    company: "BigTech Inc",
                    score: 8.9,
                    duration: "35 min",
                    status: "completed",
                  },
                ].map((session) => (
                  <div
                    key={`${session.company}-${session.date}`}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{session.role}</h3>
                        <p className="text-sm text-slate-600">
                          {session.company} • {session.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        {session.duration}
                      </Badge>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {session.score}/10
                        </div>
                        <div className="text-xs text-slate-600">
                          Overall Score
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>
                  Track your improvement across different skill areas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        Code Debugging
                      </span>
                      <span className="text-sm text-slate-600">8.2/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "82%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">System Design</span>
                      <span className="text-sm text-slate-600">7.5/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "75%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Communication</span>
                      <span className="text-sm text-slate-600">8.8/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "88%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        Problem Solving
                      </span>
                      <span className="text-sm text-slate-600">7.9/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "79%" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Clear Communication</span>
                    <Badge variant="secondary">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Code Readability</span>
                    <Badge variant="secondary">Strong</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Edge Case Handling</span>
                    <Badge variant="secondary">Good</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-600" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Time Management</span>
                    <Badge variant="outline">Focus Area</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System Scalability</span>
                    <Badge variant="outline">Practice More</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Algorithm Optimization</span>
                    <Badge variant="outline">Review</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
