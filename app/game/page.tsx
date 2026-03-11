"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VideoPlayer } from "@/components/game/video-player";
import { MicMonitor } from "@/components/game/mic-monitor";
import { GameControls } from "@/components/game/game-controls";
import { GameScore } from "@/components/game/game-score";
import { GameInstructionsDialog } from "@/components/game/game-instructions-dialog";
import { GameOverDialog } from "@/components/game/game-over-dialog";
import { AddVideoDialog } from "@/components/game/add-video-dialog";
import { UsernameDialog } from "@/components/game/username-dialog";
import { MiniLeaderboard } from "@/components/game/mini-leaderboard";
import { useMic } from "@/hooks/use-mic";
import { GAME_ROUNDS, LAUGH_THRESHOLD, type GameVideo } from "@/lib/constants";
import {
  getUsername,
  setUsername as saveUsername,
  type LeaderboardEntry,
} from "@/lib/leaderboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Youtube, Film, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function GamePage() {
  // Username
  const [username, setUsername] = useState<string | null>(null);
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);

  // Shared data
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [videos, setVideos] = useState<GameVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  // Local file uploads (session only)
  const [localFiles, setLocalFiles] = useState<GameVideo[]>([]);

  // Game state
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [survived, setSurvived] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [laughedOnRound, setLaughedOnRound] = useState(false);
  const [gameVideos, setGameVideos] = useState<GameVideo[]>([]);

  const { level, isActive, isLaughing, start, stop, error } =
    useMic(LAUGH_THRESHOLD);

  // All available videos = server videos + local uploads
  const allVideos = useMemo(
    () => [...videos, ...localFiles],
    [videos, localFiles]
  );

  const currentVideo = gameVideos[currentRound - 1] || null;

  const upcomingVideos = useMemo(() => {
    return gameVideos.slice(currentRound, currentRound + 4);
  }, [gameVideos, currentRound]);

  // Load data on mount
  useEffect(() => {
    const stored = getUsername();
    if (stored) {
      setUsername(stored);
      setShowInstructions(true);
    } else {
      setShowUsernameDialog(true);
    }

    // Fetch shared videos
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => {
        const vids: GameVideo[] = (data || []).map(
          (v: { id: string; title: string }) => ({
            id: v.id,
            title: v.title,
            type: "youtube" as const,
          })
        );
        setVideos(vids);
        setGameVideos(shuffleArray(vids));
      })
      .catch(() => {
        // API not available, use empty
        setVideos([]);
      })
      .finally(() => setLoadingVideos(false));

    // Fetch shared leaderboard
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => setLeaderboard(data || []))
      .catch(() => setLeaderboard([]));
  }, []);

  // When allVideos changes, update gameVideos if not mid-game
  useEffect(() => {
    if (!isPlaying && !gameOver && currentRound === 1) {
      setGameVideos(shuffleArray(allVideos));
    }
  }, [allVideos, isPlaying, gameOver, currentRound]);

  // Handle laugh detection
  useEffect(() => {
    if (!isPlaying || !isActive || !isLaughing) return;

    setIsPlaying(false);
    setLaughedOnRound(true);
    setGameOver(true);
    setShowGameOver(true);

    // Record score to server
    if (username) {
      fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          score: survived,
          total: GAME_ROUNDS,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setLeaderboard(data);
        })
        .catch(() => {});
    }

    toast.error("You laughed! Game over.");
  }, [isPlaying, isLaughing, isActive, survived, username]);

  const handleSetUsername = useCallback((name: string) => {
    setUsername(name);
    saveUsername(name);
    setShowUsernameDialog(false);
    setShowInstructions(true);
    toast.success(`Welcome, ${name}!`);
  }, []);

  const handleAddVideo = useCallback(
    (video: GameVideo) => {
      if (video.type === "file") {
        // Local file — session only
        setLocalFiles((prev) => [...prev, video]);
        toast.success(`Added "${video.title}" (local)`);
        return;
      }

      // YouTube — save to server for all users
      fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: video.id,
          title: video.title,
          type: "youtube",
          addedBy: username || "anon",
        }),
      })
        .then((r) => {
          if (r.status === 409) {
            toast.error("Video already exists!");
            return null;
          }
          return r.json();
        })
        .then((data) => {
          if (data && !data.error) {
            setVideos((prev) => [
              ...prev,
              { id: data.id, title: data.title, type: "youtube" },
            ]);
            toast.success(`Added "${video.title}" for everyone!`);
          }
        })
        .catch(() => {
          toast.error("Failed to save video. Try again.");
        });
    },
    [username]
  );

  const handleRemoveVideo = useCallback((id: string) => {
    // Remove local file
    setLocalFiles((prev) => prev.filter((v) => v.id !== id));

    // Remove from server
    fetch(`/api/videos?id=${id}`, { method: "DELETE" })
      .then(() => {
        setVideos((prev) => prev.filter((v) => v.id !== id));
        toast("Video removed");
      })
      .catch(() => toast.error("Failed to remove video"));
  }, []);

  const handleStart = useCallback(async () => {
    if (gameOver) return;
    if (allVideos.length === 0) {
      toast.error("Add some videos first!");
      return;
    }

    // Make sure gameVideos is populated
    if (gameVideos.length === 0) {
      setGameVideos(shuffleArray(allVideos));
    }

    if (!isActive) {
      await start();
      toast.success("Mic connected!");
    }

    setIsPlaying(true);
    setLaughedOnRound(false);
    toast("Round " + currentRound + " — keep a straight face.");
  }, [gameOver, isActive, start, currentRound, allVideos, gameVideos.length]);

  const handleSkip = useCallback(() => {
    if (!isPlaying) return;

    const newSurvived = survived + 1;
    setSurvived(newSurvived);
    setIsPlaying(false);

    const nextRound = currentRound + 1;

    if (nextRound > GAME_ROUNDS) {
      setGameOver(true);
      setShowGameOver(true);
      setLaughedOnRound(false);

      if (username) {
        fetch("/api/leaderboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            score: newSurvived,
            total: GAME_ROUNDS,
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (Array.isArray(data)) setLeaderboard(data);
          })
          .catch(() => {});
      }

      toast.success("All rounds complete!");
    } else {
      setCurrentRound(nextRound);
      toast("Round survived! Next up: Round " + nextRound);
    }
  }, [isPlaying, survived, currentRound, username]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentRound(1);
    setSurvived(0);
    setGameOver(false);
    setShowGameOver(false);
    setLaughedOnRound(false);
    setGameVideos(shuffleArray(allVideos));
    toast("New game. New order. Let's go.");
  }, [allVideos]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <UsernameDialog
        open={showUsernameDialog}
        onSubmit={handleSetUsername}
      />

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

      <AddVideoDialog
        open={showAddVideo}
        onClose={() => setShowAddVideo(false)}
        onAdd={handleAddVideo}
      />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 md:px-8 py-12 md:py-16">
          {/* Header */}
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                Try Not to Lol
              </h1>
              <p className="text-lg text-muted-foreground">
                Your mic is hot. One laugh and you're out.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {username && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/40">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-medium">{username}</span>
                </div>
              )}
              <Badge
                variant="secondary"
                className="text-base px-4 py-1.5 font-mono hidden sm:flex"
              >
                Round {currentRound} / {GAME_ROUNDS}
              </Badge>
            </div>
          </div>

          {/* Game + Leaderboard grid */}
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* Main game area */}
            <div className="space-y-4">
              <VideoPlayer isPlaying={isPlaying} video={currentVideo} />

              <MicMonitor
                level={level}
                isActive={isActive}
                isLaughing={isLaughing}
                error={error}
                onStart={start}
                onStop={stop}
              />

              <div className="grid gap-4 sm:grid-cols-2">
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

              {/* Up next */}
              {upcomingVideos.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Up Next
                  </h3>
                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                    {upcomingVideos.map((video, i) => (
                      <div
                        key={video.id}
                        className="rounded-xl border border-border/40 bg-card/20 p-3 flex items-center gap-3"
                      >
                        <span className="text-xs font-mono text-primary font-bold shrink-0">
                          {String(currentRound + i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-xs font-medium truncate">
                          {video.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: Leaderboard */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <MiniLeaderboard
                entries={leaderboard}
                currentUser={username}
              />
            </div>
          </div>

          {/* Video library */}
          <div className="mt-12 border-t border-border/30 pt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Video Library
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {loadingVideos ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Loading shared videos...
                    </span>
                  ) : (
                    `${allVideos.length} video${allVideos.length !== 1 ? "s" : ""} — shared across all players`
                  )}
                </p>
              </div>
              <Button
                onClick={() => setShowAddVideo(true)}
                className="font-semibold gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Video
              </Button>
            </div>

            {allVideos.length === 0 && !loadingVideos && (
              <div className="rounded-xl border border-dashed border-border/40 bg-card/10 p-8 text-center">
                <p className="text-muted-foreground text-sm">
                  No videos yet. Be the first to add one!
                </p>
              </div>
            )}

            <div className="grid gap-2">
              {allVideos.map((video) => (
                <div
                  key={video.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border border-border/30 bg-card/10 hover:bg-card/30 transition-colors group"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {video.type === "youtube" ? (
                      <Youtube className="w-4 h-4 text-primary" />
                    ) : (
                      <Film className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      {video.type === "youtube" ? video.id : "Local file (this session)"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {video.type === "youtube" ? "YouTube" : "Local"}
                  </Badge>
                  <button
                    onClick={() => handleRemoveVideo(video.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 cursor-pointer"
                    aria-label="Remove video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
