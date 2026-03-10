"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/leaderboard";

interface MiniLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUser: string | null;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
  if (rank === 2) return <Medal className="w-3.5 h-3.5 text-zinc-300" />;
  if (rank === 3) return <Medal className="w-3.5 h-3.5 text-amber-600" />;
  return null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function MiniLeaderboard({ entries, currentUser }: MiniLeaderboardProps) {
  if (entries.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardContent className="py-6 text-center">
          <Trophy className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No scores yet. Be the first!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold tracking-tight">Leaderboard</h3>
          <Badge variant="secondary" className="text-[10px] ml-auto">
            Top {entries.length}
          </Badge>
        </div>

        <div className="space-y-1">
          {entries.slice(0, 10).map((entry, i) => {
            const rank = i + 1;
            const isCurrentUser =
              currentUser && entry.username === currentUser;

            return (
              <div
                key={`${entry.username}-${entry.date}`}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  isCurrentUser
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-card/40",
                  rank <= 3 && !isCurrentUser && "bg-card/20"
                )}
              >
                {/* Rank */}
                <span className="w-5 text-center shrink-0">
                  {getRankIcon(rank) || (
                    <span className="text-xs font-mono text-muted-foreground">
                      {rank}
                    </span>
                  )}
                </span>

                {/* Username */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {isCurrentUser && (
                    <User className="w-3 h-3 text-primary shrink-0" />
                  )}
                  <span
                    className={cn(
                      "truncate font-medium",
                      isCurrentUser ? "text-primary" : "text-foreground"
                    )}
                  >
                    {entry.username}
                  </span>
                </div>

                {/* Score */}
                <span className="font-mono font-bold text-primary shrink-0">
                  {entry.score}/{entry.total}
                </span>

                {/* Time */}
                <span className="text-[10px] text-muted-foreground/60 shrink-0 hidden sm:inline w-12 text-right">
                  {timeAgo(entry.date)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
