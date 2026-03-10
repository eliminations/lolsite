"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Upload } from "lucide-react";
import type { GameVideo } from "@/lib/constants";

interface AddVideoDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (video: GameVideo) => void;
}

function parseYouTubeId(input: string): string | null {
  const trimmed = input.trim();

  // Already a bare ID (11 chars, no slashes/dots)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  // Standard + short URLs
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match) return match[1];
  }

  return null;
}

export function AddVideoDialog({ open, onClose, onAdd }: AddVideoDialogProps) {
  const [tab, setTab] = useState("youtube");
  const [ytUrl, setYtUrl] = useState("");
  const [ytTitle, setYtTitle] = useState("");
  const [ytError, setYtError] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setYtUrl("");
    setYtTitle("");
    setYtError("");
    setFileTitle("");
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAddYouTube = () => {
    const videoId = parseYouTubeId(ytUrl);
    if (!videoId) {
      setYtError("Invalid YouTube URL or video ID");
      return;
    }
    const title = ytTitle.trim() || `Video ${videoId.slice(0, 6)}`;
    onAdd({ id: videoId, title, type: "youtube" });
    handleClose();
  };

  const handleAddFile = () => {
    if (!selectedFile) return;
    const blobUrl = URL.createObjectURL(selectedFile);
    const title =
      fileTitle.trim() || selectedFile.name.replace(/\.[^.]+$/, "");
    onAdd({
      id: crypto.randomUUID(),
      title,
      type: "file",
      url: blobUrl,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Video</DialogTitle>
          <DialogDescription>
            Paste a YouTube link or upload your own video.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="youtube" className="flex-1 gap-2">
              <Link2 className="w-3.5 h-3.5" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-1 gap-2">
              <Upload className="w-3.5 h-3.5" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="youtube" className="space-y-3 mt-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                YouTube URL or Video ID
              </label>
              <input
                type="text"
                value={ytUrl}
                onChange={(e) => {
                  setYtUrl(e.target.value);
                  setYtError("");
                }}
                placeholder="https://youtube.com/watch?v=... or video ID"
                className="w-full rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
              />
              {ytError && (
                <p className="text-xs text-red-400 mt-1">{ytError}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Title (optional)
              </label>
              <input
                type="text"
                value={ytTitle}
                onChange={(e) => setYtTitle(e.target.value)}
                placeholder="Give it a name"
                className="w-full rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-3 mt-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Video File
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-lg border border-dashed border-border/60 bg-secondary/20 px-3 py-6 text-center cursor-pointer hover:border-primary/40 hover:bg-secondary/40 transition-colors"
              >
                <Upload className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to select a video file"}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  MP4, WebM, MOV
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) =>
                  setSelectedFile(e.target.files?.[0] || null)
                }
                className="hidden"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Title (optional)
              </label>
              <input
                type="text"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                placeholder="Give it a name"
                className="w-full rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {tab === "youtube" ? (
            <Button
              onClick={handleAddYouTube}
              className="font-semibold"
              disabled={!ytUrl.trim()}
            >
              Add Video
            </Button>
          ) : (
            <Button
              onClick={handleAddFile}
              className="font-semibold"
              disabled={!selectedFile}
            >
              Add Video
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
