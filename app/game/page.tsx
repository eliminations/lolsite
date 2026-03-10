"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VideoPlayer } from "@/components/game/video-player";
import { MicMonitor } from "@/components/game/mic-monitor";
import { GameControls } from "@/components/game/game-controls";
import { GameScore } from "@/components/game/game-score";
import { GameInstructionsDialog } from "@/components/game/game-instructions-dialog";
import { GameOverDialog } from "@/components/game/game-over-dialog";
import { useFakeMic } from "@/hooks/use-fake-mic";
import { DUMMY_VIDEOS, GAME_ROUNDS, LAUGH_THRESHOLD } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function GamePage() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [survived, setSurvived] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [laughedOnRound, setLaughedOnRound] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const { level, isActive, toggle, isLaughing } = useFakeMic(LAUGH_THRESHOLD);

  const currentVideo = DUMMY_VIDEOS[currentVideoIndex] || null;

  // Handle laugh detection during play
  useEffect(() => {
    if (isPlaying && isLaughing && isActive) {
      setIsPlaying(false);
      setLaughedOnRound(true);
      setGameOver(true);
      setShowGameOver(true);
      toast.error("Laugh detected! You lost the round.");
    }
  }, [isPlaying, isLaughing, isActive]);

  const handleStart = useCallback(() => {
    if (gameOver) return;

    if (!isActive) {
      toggle();
      toast.success("Microphone connected!");
    }

    setIsPlaying(true);
    setLaughedOnRound(false);
    toast("Round " + currentRound + " started. Keep a straight face.");
  }, [gameOver, isActive, toggle, currentRound]);

  const handleSkip = useCallback(() => {
    if (!isPlaying) return;

    // Survived the round
    const newSurvived = survived + 1;
    setSurvived(newSurvived);
    setIsPlaying(false);

    const nextRound = currentRound + 1;
    const nextVideoIndex = (currentVideoIndex + 1) % DUMMY_VIDEOS.length;
    setCurrentVideoIndex(nextVideoIndex);

    if (nextRound > GAME_ROUNDS) {
      setGameOver(true);
      setShowGameOver(true);
      setLaughedOnRound(false);
      toast.success("All rounds complete!");
    } else {
      setCurrentRound(nextRound);
      toast("Round survived! Moving to round " + nextRound);
    }
  }, [isPlaying, survived, currentRound, currentVideoIndex]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentRound(1);
    setSurvived(0);
    setGameOver(false);
    setShowGameOver(false);
    setLaughedOnRound(false);
    setCurrentVideoIndex(0);
    toast("Game reset. Ready for a new challenge.");
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <GameInstructionsDialog
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <GameOverDialog
        open={showGameOver}
        survived={survived}
        total={GAME_ROUNDS}
        laughedOnRound={laughedOnRound}
        onPlayAgain={() => {
          setShowGameOver(false);
          handleReset();
        }}
      />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 md:px-8 py-12 md:py-16">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Try Not to Laugh
            </h1>
            <p className="text-muted-foreground">
              Connect your mic. Watch the video. Don&apos;t laugh. Simple.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* Main area */}
            <div className="space-y-4">
              <VideoPlayer isPlaying={isPlaying} currentVideo={currentVideo} />

              <GameControls
                isPlaying={isPlaying}
                currentRound={currentRound}
                totalRounds={GAME_ROUNDS}
                onStart={handleStart}
                onSkip={handleSkip}
                onReset={handleReset}
                gameOver={gameOver}
              />

              <GameScore survived={survived} total={GAME_ROUNDS} />
            </div>

            {/* Sidebar: video queue */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Up Next</h3>
              <ScrollArea className="h-[500px] pr-3">
                <div className="space-y-3">
                  {DUMMY_VIDEOS.map((video, i) => (
                    <Card
                      key={video.id}
                      className={cn(
                        "border-border/50 bg-card/50 transition-all duration-200",
                        i === currentVideoIndex &&
                          "border-primary/50 bg-primary/5"
                      )}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <Skeleton className="w-16 h-10 rounded shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">
                            {video.title}
                          </p>
                          <Badge variant="secondary" className="text-[10px] mt-1">
                            {video.duration}
                          </Badge>
                        </div>
                        {i === currentVideoIndex && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Mic monitor at bottom */}
          <div className="mt-6">
            <MicMonitor
              level={level}
              isActive={isActive}
              isLaughing={isLaughing}
              onToggle={toggle}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
