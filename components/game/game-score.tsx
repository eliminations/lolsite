"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GameScoreProps {
  survived: number;
  total: number;
}

export function GameScore({ survived, total }: GameScoreProps) {
  const percentage = total > 0 ? (survived / total) * 100 : 0;

  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="py-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Score</span>
          <span className="text-sm font-mono text-primary font-bold">
            {survived} / {total}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {survived === 0 && total === 0
            ? "Start playing to track your score"
            : `${survived} round${survived !== 1 ? "s" : ""} survived`}
        </p>
      </CardContent>
    </Card>
  );
}
