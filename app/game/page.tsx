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
import {
  DEFAULT_VIDEOS,
  GAME_ROUNDS,
  LAUGH_THRESHOLD,
  type GameVideo,
} from "@/lib/constants";
import {
  getUsername,
  setUsername as saveUsername,
  getLeaderboard,
  addScore,
  type LeaderboardEntry,
} from "@/lib/leaderboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Youtube, Film, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STORAGE_KEY = "lol-game-videos";

function loadVideos(): GameVideo[] {
  if (typeof window === "undefined") return DEFAULT_VIDEOS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as GameVideo[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_VIDEOS;
}

function saveVideos(videos: GameVideo[]) {
  const persistable = videos.filter((v) => v.type === "youtube");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
}

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

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Game state
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [videos, setVideos] = useState<GameVideo[]>(() => loadVideos());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [survived, setSurvived] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [laughedOnRound, setLaughedOnRound] = useState(false);
  const [gameVideos, setGameVideos] = useState<GameVideo[]>(() =>
    shuffleArray(loadVideos())
  );

  const { level, isActive, isLaughing, start, stop, error } =
    useMic(LAUGH_THRESHOLD);

  const currentVideo = gameVideos[currentRound - 1] || null;

  const upcomingVideos = useMemo(() => {
    return gameVideos.slice(currentRound, currentRound + 4);
  }, [gameVideos, currentRound]);

  // Load username and leaderboard on mount
  useEffect(() => {
    const stored = getUsername();
    if (stored) {
      setUsername(stored);
      setShowInstructions(true);
    } else {
      setShowUsernameDialog(true);
    }
    setLeaderboard(getLeaderboard());
  }, []);

  // Persist videos
  useEffect(() => {
    saveVideos(videos);
  }, [videos]);

  // Handle laugh detection — ONLY when actively playing
  useEffect(() => {
    if (!isPlaying || !isActive || !isLaughing) return;

    setIsPlaying(false);
    setLaughedOnRound(true);
    setGameOver(true);
    setShowGameOver(true);

    // Record score
    if (username) {
      const updated = addScore(username, survived, GAME_ROUNDS);
      setLeaderboard(updated);
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

  const handleAddVideo = useCallback((video: GameVideo) => {
    setVideos((prev) => [...prev, video]);
    toast.success(`Added "${video.title}"`);
  }, []);

  const handleRemoveVideo = useCallback((id: string) => {
    setVideos((prev) => {
      const updated = prev.filter((v) => v.id !== id);
      return updated.length > 0 ? updated : DEFAULT_VIDEOS;
    });
    toast("Video removed");
  }, []);

  const handleStart = useCallback(async () => {
    if (gameOver) return;
    if (videos.length === 0) {
      toast.error("Add some videos first!");
      return;
    }

    if (!isActive) {
      await start();
      toast.success("Mic connected!");
    }

    setIsPlaying(true);
    setLaughedOnRound(false);
    toast("Round " + currentRound + " — keep a straight face.");
  }, [gameOver, isActive, start, currentRound, videos.length]);

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

      // Record score
      if (username) {
        const updated = addScore(username, newSurvived, GAME_ROUNDS);
        setLeaderboard(updated);
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
    setGameVideos(shuffleArray(videos));
    toast("New game. New order. Let's go.");
  }, [videos]);

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
                  {videos.length} video{videos.length !== 1 ? "s" : ""} — add
                  your own YouTube links or upload files
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

            <div className="grid gap-2">
              {videos.map((video) => (
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
                      {video.type === "youtube" ? video.id : "Local file"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {video.type === "youtube" ? "YouTube" : "Upload"}
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
