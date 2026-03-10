"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, SkipForward, RotateCcw } from "lucide-react";

interface GameControlsProps {
  isPlaying: boolean;
  currentRound: number;
  totalRounds: number;
  onStart: () => void;
  onSkip: () => void;
  onReset: () => void;
  gameOver: boolean;
}

export function GameControls({
  isPlaying,
  currentRound,
  totalRounds,
  onStart,
  onSkip,
  onReset,
  gameOver,
}: GameControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {!gameOver ? (
          <>
            <Button onClick={onStart} className="font-semibold" disabled={isPlaying}>
              <Play className="w-4 h-4 mr-2" />
              {isPlaying ? "In Progress" : "Start Round"}
            </Button>
            <Button
              onClick={onSkip}
              variant="outline"
              className="border-border/50"
              disabled={!isPlaying}
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip
            </Button>
          </>
        ) : (
          <Button onClick={onReset} className="font-semibold">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        )}
      </div>

      <Badge variant="secondary" className="text-sm px-3 py-1 font-mono">
        Round {currentRound} / {totalRounds}
      </Badge>
    </div>
  );
}
