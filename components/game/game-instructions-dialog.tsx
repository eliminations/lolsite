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
            <span>Enable your microphone by clicking the mic button.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-primary font-bold shrink-0">02</span>
            <span>Press &quot;Start Round&quot; to begin watching a video.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-primary font-bold shrink-0">03</span>
            <span>The mic listens for laughter. If it detects a laugh — you lose the round.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-primary font-bold shrink-0">04</span>
            <span>Survive all 5 rounds without laughing to win.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-primary font-bold shrink-0">05</span>
            <span>Videos are picked by the community. Good luck keeping a straight face.</span>
          </li>
        </ol>

        <DialogFooter>
          <Button onClick={onClose} className="w-full font-semibold">
            Got it, let&apos;s go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
