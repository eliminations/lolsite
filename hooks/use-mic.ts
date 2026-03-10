"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseMicReturn {
  level: number;
  isActive: boolean;
  isLaughing: boolean;
  start: () => Promise<void>;
  stop: () => void;
  error: string | null;
}

// Require sustained loud audio (consecutive frames above threshold) to count as a laugh
const SUSTAINED_FRAMES = 8; // ~400ms at 20fps

export function useMic(threshold: number = 70): UseMicReturn {
  const [level, setLevel] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isLaughing, setIsLaughing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const lastUpdateRef = useRef(0);
  const aboveThresholdCountRef = useRef(0);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    aboveThresholdCountRef.current = 0;
    setIsActive(false);
    setLevel(0);
    setIsLaughing(false);
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      analyserRef.current = analyser;

      aboveThresholdCountRef.current = 0;
      setIsActive(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Microphone access denied";
      setError(msg);
      setIsActive(false);
    }
  }, []);

  // Animation loop for reading levels
  useEffect(() => {
    if (!isActive || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const tick = (timestamp: number) => {
      // ~20fps
      if (timestamp - lastUpdateRef.current < 50) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastUpdateRef.current = timestamp;

      analyser.getByteFrequencyData(dataArray);

      // RMS of frequency data normalized to 0-100
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const normalized = Math.min(100, (rms / 128) * 100);

      setLevel(normalized);

      // Sustained detection: must stay above threshold for consecutive frames
      if (normalized >= threshold) {
        aboveThresholdCountRef.current++;
      } else {
        aboveThresholdCountRef.current = 0;
      }

      setIsLaughing(aboveThresholdCountRef.current >= SUSTAINED_FRAMES);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, threshold]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { level, isActive, isLaughing, start, stop, error };
}
