"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GameOverDialogProps {
  open: boolean;
  survived: number;
  total: number;
  laughedOnRound: boolean;
  onPlayAgain: () => void;
}

export function GameOverDialog({
  open,
  survived,
  total,
  laughedOnRound,
  onPlayAgain,
}: GameOverDialogProps) {
  const won = survived === total;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {laughedOnRound ? "You Laughed!" : won ? "You Survived!" : "Game Over"}
          </DialogTitle>
          <DialogDescription>
            {laughedOnRound
              ? "The mic caught you. Better luck next time."
              : won
              ? "Incredible. You kept a straight face through all rounds."
              : `You made it through ${survived} of ${total} rounds.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <p className="text-5xl font-mono font-bold text-primary">
              {survived}/{total}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Rounds Survived</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={onPlayAgain} className="font-semibold flex-1">
            Play Again
          </Button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex-1 border-border/50"
            )}
          >
            Back to Home
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
