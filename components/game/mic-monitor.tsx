"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicMonitorProps {
  level: number;
  isActive: boolean;
  isLaughing: boolean;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
}

export function MicMonitor({
  level,
  isActive,
  isLaughing,
  error,
  onStart,
  onStop,
}: MicMonitorProps) {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={isActive ? onStop : onStart}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors border cursor-pointer",
              isActive
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-secondary/60 text-muted-foreground border-border/40 hover:border-primary/30 hover:text-primary"
            )}
            aria-label={isActive ? "Mute microphone" : "Enable microphone"}
          >
            {isActive ? (
              <Mic className="w-4 h-4" />
            ) : (
              <MicOff className="w-4 h-4" />
            )}
          </button>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                {error ? (
                  <span className="flex items-center gap-1 text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </span>
                ) : (
                  "Microphone Level"
                )}
              </span>
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  isActive &&
                    !isLaughing &&
                    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                  isLaughing &&
                    "bg-red-500/15 text-red-400 border-red-500/30"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mr-1.5 inline-block",
                    isActive && !isLaughing && "bg-emerald-400",
                    isLaughing && "bg-red-400",
                    !isActive && "bg-muted-foreground"
                  )}
                />
                {isLaughing
                  ? "Laugh Detected"
                  : isActive
                  ? "Listening"
                  : "Muted"}
              </Badge>
            </div>
            <Progress
              value={isActive ? level : 0}
              className={cn(
                "h-2.5 [&_[data-slot=progress-indicator]]:!transition-none",
                isLaughing &&
                  "[&_[data-slot=progress-indicator]]:bg-red-500"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
