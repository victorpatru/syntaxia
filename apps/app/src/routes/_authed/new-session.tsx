import { Badge } from "@syntaxia/ui/badge";
import { Button } from "@syntaxia/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@syntaxia/ui/card";
import { Textarea } from "@syntaxia/ui/textarea";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authed/new-session")({
  component: NewSession,
});

function NewSession() {
  const [jobDescription, setJobDescription] = useState("");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Voice-first practice sessions tailored to real job descriptions. Get
            actionable feedback on debugging, system design, and communication.
          </p>
        </div>

        {/* Session Setup */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Start Your Practice Session</CardTitle>
            <CardDescription>
              Paste a job description to get a personalized senior-level
              technical interview experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label
                htmlFor="job-description"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Job Description
              </label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here... We'll analyze the requirements and create a tailored senior-level interview session."
                className="min-h-32"
              />
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="secondary">Senior Full-Stack Engineer</Badge>
              <Badge variant="outline">30-40 minutes</Badge>
              <Badge variant="outline">Voice + Visual</Badge>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">
                Session will include: Background warm-up • Code debugging •
                System design • Feedback
              </div>
              <Link to="/interview">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!jobDescription.trim()}
                >
                  Start Interview
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
