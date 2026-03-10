"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  onStart,
  onSkip,
  onReset,
  gameOver,
}: GameControlsProps) {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="py-4">
        <div className="flex items-center gap-3">
          {!gameOver ? (
            <>
              <Button
                onClick={onStart}
                className="font-semibold flex-1"
                disabled={isPlaying}
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                {isPlaying ? "In Progress..." : "Start Round"}
              </Button>
              <Button
                onClick={onSkip}
                variant="outline"
                className="border-border/50 flex-1"
                disabled={!isPlaying}
                size="lg"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Survived
              </Button>
            </>
          ) : (
            <Button onClick={onReset} className="font-semibold flex-1" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
