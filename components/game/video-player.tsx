"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  isPlaying: boolean;
  currentVideo: { title: string; duration: string } | null;
}

export function VideoPlayer({ isPlaying, currentVideo }: VideoPlayerProps) {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden">
      <div className="relative aspect-video bg-background/50 flex items-center justify-center">
        {currentVideo ? (
          <>
            {/* Fake video placeholder with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 backdrop-blur-sm transition-all duration-300 hover:bg-primary/30 hover:scale-105 cursor-pointer">
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-primary" />
                ) : (
                  <Play className="w-6 h-6 text-primary ml-1" />
                )}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
              <p className="text-sm font-medium">{currentVideo.title}</p>
              <p className="text-xs text-muted-foreground">{currentVideo.duration}</p>
            </div>
          </>
        ) : (
          <div className="space-y-4 p-8 w-full">
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
        )}
      </div>
    </Card>
  );
}
