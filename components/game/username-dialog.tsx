"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UsernameDialogProps {
  open: boolean;
  onSubmit: (username: string) => void;
}

export function UsernameDialog({ open, onSubmit }: UsernameDialogProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length < 1) return;
    onSubmit(trimmed.slice(0, 20));
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl">What's your name?</DialogTitle>
          <DialogDescription>
            Pick a username for the leaderboard. Keep it short.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. degen420"
            maxLength={20}
            autoFocus
            className="w-full rounded-lg border border-border/60 bg-secondary/40 px-4 py-3 text-base font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Max 20 characters. This is stored locally on your device.
          </p>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="w-full font-semibold"
            disabled={name.trim().length < 1}
          >
            Let's go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
