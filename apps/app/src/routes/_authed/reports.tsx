import { api } from "@syntaxia/backend/api";
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

type Row = {
  _id: string;
  createdAt: number;
  duration?: number;
  status: "complete";
  mode?: "technical" | "behavioral";
  scores?: { overall: number };
};

export const Route = createFileRoute("/_authed/reports")({
  component: Reports,
});

function Reports() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.sessions.getAllCompletedSessionsList,
    {},
    { initialNumItems: 10 },
  );

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getScoreDisplay = (row: Row) => {
    if (row.duration != null && row.duration < 120) return "TOO_SHORT";
    if (row.scores?.overall == null) return "N/A";
    return `${row.scores.overall}/10`;
  };

  const getModeLabel = (mode?: Row["mode"]) =>
    mode === "behavioral" ? "BEHAVIORAL" : "PHONE_SCREEN";

  return (
    <div className="bg-background font-mono">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="border border-terminal-green/30 bg-background mb-8">
          <div className="border-b border-terminal-green/30 px-6 py-3 bg-terminal-dark">
            <span className="text-terminal-green font-mono">
              syntaxia@terminal
            </span>
            <span className="text-terminal-green/60">:</span>
            <span className="text-terminal-amber">~/reports</span>
            <span className="text-terminal-green/60">$</span>
          </div>
          <div className="p-6">
            <h1 className="font-mono text-2xl text-terminal-green mb-2">
              Reports Archive
            </h1>
            <p className="text-terminal-green/70 font-mono text-sm">
              # Completed interviews
            </p>
          </div>
        </div>

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
                No reports yet.
              </p>
              <div className="mt-4 flex gap-3 justify-center">
                <Link to="/interview" search={{ sessionId: undefined }}>
                  <Button className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20">
                    ./start-technical
                  </Button>
                </Link>
                <Link to="/behavioral" search={{ sessionId: undefined }}>
                  <Button className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-3 py-1 transition-colors h-8 min-w-20">
                    ./start-behavioral
                  </Button>
                </Link>
              </div>
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
                      TYPE
                    </TableHead>
                    <TableHead className="font-mono text-terminal-green text-xs h-10">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((s: Row) => (
                    <TableRow
                      key={s._id}
                      className="border-b border-terminal-green/30 hover:bg-terminal-green/5"
                    >
                      <TableCell className="font-mono text-terminal-green/80 text-xs p-3 pl-10">
                        {format(new Date(s.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="font-mono text-terminal-green/80 text-xs p-3">
                        {s.duration != null ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(s.duration)}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-terminal-green/80 text-xs p-3">
                        <span
                          className={
                            s.duration != null && s.duration < 120
                              ? "text-orange-400"
                              : (s.scores?.overall ?? 0) >= 7
                                ? "text-terminal-amber"
                                : (s.scores?.overall ?? 0) >= 4
                                  ? "text-terminal-green"
                                  : s.scores?.overall != null
                                    ? "text-red-400"
                                    : "text-terminal-green/60"
                          }
                        >
                          {getScoreDisplay(s)}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-terminal-green/80 text-xs p-3">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-terminal-amber" />
                          {getModeLabel(s.mode)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-terminal-green/80 text-xs p-3">
                        <Link
                          to="/interview/report/$sessionId"
                          params={{ sessionId: s._id }}
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
      </div>
    </div>
  );
}
