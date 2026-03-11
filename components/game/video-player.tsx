"use client";

import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import type { GameVideo } from "@/lib/constants";

interface VideoPlayerProps {
  isPlaying: boolean;
  video: GameVideo | null;
}

export function VideoPlayer({ isPlaying, video }: VideoPlayerProps) {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden">
      <div className="relative aspect-video bg-black/40 flex items-center justify-center">
        {isPlaying && video ? (
          video.type === "youtube" ? (
            <iframe
              key={video.id}
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&playsinline=1`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              title={video.title}
            />
          ) : (
            <video
              key={video.id}
              src={video.url}
              className="absolute inset-0 w-full h-full object-contain"
              autoPlay
              controls
              playsInline
            />
          )
        ) : (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Play className="w-8 h-8 text-primary ml-1" />
            </div>
            <p className="text-sm font-medium">
              {video
                ? "Press Start Round to play"
                : "Add some videos to get started"}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
