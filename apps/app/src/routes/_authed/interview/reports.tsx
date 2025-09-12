import { api } from "@syntaxia/backend/convex/_generated/api";
import { Button } from "@syntaxia/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@syntaxia/ui/table";
import { createFileRoute, Link } from "@tanstack/react-router";
import { usePaginatedQuery } from "convex/react";
import { format } from "date-fns";
import { CheckCircle, Clock, FileText } from "lucide-react";
import type { InterviewScores } from "@/types/interview";

export const Route = createFileRoute("/_authed/interview/reports")({
  component: InterviewReports,
});

function InterviewReports() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.sessions.getCompletedSessionsList,
    {},
    { initialNumItems: 5 },
  );

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getScoreDisplay = (scores: InterviewScores, duration?: number) => {
    // Check if it was a short session first
    if (duration && duration < 120) {
      return "TOO_SHORT";
    }
    if (!scores || !scores.overall) {
      return "N/A";
    }
    return `${scores.overall}/10`;
  };

  return (
    <div className="bg-background font-mono">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Terminal Header */}
        <div className="border border-terminal-green/30 bg-background mb-8">
          <div className="border-b border-terminal-green/30 px-6 py-3 bg-terminal-dark">
            <span className="text-terminal-green font-mono">
              syntaxia@terminal
            </span>
            <span className="text-terminal-green/60">:</span>
            <span className="text-terminal-amber">~/interview/reports</span>
            <span className="text-terminal-green/60">$</span>
          </div>
          <div className="p-6">
            <h1 className="font-mono text-2xl text-terminal-green mb-2">
              Interview Reports Archive
            </h1>
            <p className="text-terminal-green/70 font-mono text-sm">
              # Your completed technical interviews and performance reports
            </p>
          </div>
        </div>

        {/* Reports Table */}
        <div className="border border-terminal-green/30 bg-background">
          <div className="border-b border-terminal-green/30 px-6 py-3 bg-terminal-dark">
            <span className="text-terminal-green font-mono text-sm">
              ./list-reports --format=table
            </span>
          </div>

          {status === "LoadingFirstPage" ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-terminal-green/30 border-t-terminal-green animate-spin"></div>
              </div>
              <p className="text-terminal-green/70 font-mono">
                Loading reports...
              </p>
              <p className="text-terminal-green/50 font-mono text-sm mt-2">
                # Fetching your interview history
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-terminal-green/30 mx-auto mb-4" />
              <p className="text-terminal-green/70 font-mono">
                No completed interviews found.
              </p>
              <p className="text-terminal-green/50 font-mono text-sm mt-2">
                Complete your first interview to see reports here.
              </p>
              <Link to="/interview" search={{ sessionId: undefined }}>
                <Button className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20 mt-4">
                  ./start-interview
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-terminal-green/30 hover:bg-transparent">
                    <TableHead className="font-mono text-terminal-green text-xs h-10 pl-10">
                      DATE
                    </TableHead>
                    <TableHead className="font-mono text-terminal-green text-xs h-10">
                      DURATION
                    </TableHead>
                    <TableHead className="font-mono text-terminal-green text-xs h-10">
                      SCORE
                    </TableHead>
                    <TableHead className="font-mono text-terminal-green text-xs h-10">
                      STATUS
                    </TableHead>
                    <TableHead className="font-mono text-terminal-green text-xs h-10">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((session) => (
                    <TableRow
                      key={session._id}
                      className="border-b border-terminal-green/30 hover:bg-terminal-green/5"
                    >
                      <TableCell className="font-mono text-terminal-green/80 text-xs p-3 pl-10">
                        {format(new Date(session.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="font-mono text-terminal-green/80 text-xs p-3">
                        {session.duration ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(session.duration)}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-terminal-green/80 text-xs p-3">
                        <span
                          className={
                            session.duration && session.duration < 120
                              ? "text-orange-400"
                              : session.scores?.overall >= 7
                                ? "text-terminal-amber"
                                : session.scores?.overall >= 4
                                  ? "text-terminal-green"
                                  : session.scores?.overall
                                    ? "text-red-400"
                                    : "text-terminal-green/60"
                          }
                        >
                          {getScoreDisplay(session.scores, session.duration)}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-terminal-green/80 text-xs p-3">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-terminal-amber" />
                          COMPLETE
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-terminal-green/80 text-xs p-3">
                        <Link
                          to="/interview/report/$sessionId"
                          params={{ sessionId: session._id }}
                        >
                          <Button className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20">
                            ./view-report
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {(status === "CanLoadMore" || status === "LoadingMore") && (
            <div className="border-t border-terminal-green/30 px-6 py-4 bg-terminal-dark">
              <div className="flex justify-between items-center">
                <span className="text-terminal-green/60 font-mono text-xs">
                  Showing {results.length} results
                </span>
                <Button
                  onClick={() => loadMore(10)}
                  disabled={status !== "CanLoadMore"}
                  className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20 disabled:opacity-50"
                >
                  {status === "LoadingMore" ? "./loading..." : "./load-more"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 border border-terminal-green/30 bg-background/50 backdrop-blur-sm p-6 relative overflow-hidden">
          <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-terminal-green/30"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-terminal-green/30"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-terminal-green/30"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-terminal-green/30"></div>

          <div className="space-y-2 font-mono text-sm relative">
            <div className="flex items-center space-x-2">
              <span className="text-terminal-green/40">#</span>
              <span className="text-terminal-green/70">
                Reports show detailed analysis of your technical interview
                performance
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-terminal-green/40">#</span>
              <span className="text-terminal-green/70">
                Click "./view-report" to see full analysis and recommendations
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-terminal-green/40">#</span>
              <span className="text-terminal-green/70">
                Use reports to track your improvement over time
              </span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-terminal-green/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
