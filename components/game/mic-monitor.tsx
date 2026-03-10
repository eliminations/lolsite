"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicMonitorProps {
  level: number;
  isActive: boolean;
  isLaughing: boolean;
  onToggle: () => void;
}

export function MicMonitor({ level, isActive, isLaughing, onToggle }: MicMonitorProps) {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger render={<div className="inline-flex" />}>
              <Toggle
                pressed={isActive}
                onPressedChange={onToggle}
                className={cn(
                  "data-[state=on]:bg-primary/20 data-[state=on]:text-primary",
                  isActive && "animate-[mic-pulse_1.5s_ease-in-out_infinite]"
                )}
                aria-label="Toggle microphone"
              >
                {isActive ? (
                  <Mic className="w-4 h-4" />
                ) : (
                  <MicOff className="w-4 h-4" />
                )}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              {isActive ? "Microphone active — mute" : "Click to enable microphone"}
            </TooltipContent>
          </Tooltip>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                Microphone Level
              </span>
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  isActive && !isLaughing && "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                  isLaughing && "bg-red-500/15 text-red-400 border-red-500/30"
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
                {isLaughing ? "Laugh Detected" : isActive ? "Listening" : "Muted"}
              </Badge>
            </div>
            <Progress
              value={isActive ? level : 0}
              className={cn(
                "h-2.5 [&_[data-slot=progress-indicator]]:!transition-none",
                isLaughing && "[&_[data-slot=progress-indicator]]:bg-red-500"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
