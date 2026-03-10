"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GameInstructionsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function GameInstructionsDialog({ open, onClose }: GameInstructionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            How to Play
            <Badge variant="secondary" className="font-mono">
              $lol
            </Badge>
          </DialogTitle>
          <DialogDescription>
            The rules are simple. Your composure is the challenge.
          </DialogDescription>
        </DialogHeader>

        <ol className="space-y-3 text-sm text-muted-foreground my-4">
          <li className="flex gap-3">
            <span className="font-mono text-primary font-bold shrink-0">01</span>
            <span>Allow microphone access when prompted. Your browser will ask for permission.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-primary font-bold shrink-0">02</span>
            <span>Press &quot;Start Round&quot; to begin. A random video will play.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-primary font-bold shrink-0">03</span>
            <span>Your mic is listening. If it picks up a laugh — game over.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-primary font-bold shrink-0">04</span>
            <span>Survive the video? Hit &quot;Survived&quot; to move to the next round.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-primary font-bold shrink-0">05</span>
            <span>Beat all 5 rounds without laughing to prove you're built different.</span>
          </li>
        </ol>

        <DialogFooter>
          <Button onClick={onClose} className="w-full font-semibold">
            Let&apos;s go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
