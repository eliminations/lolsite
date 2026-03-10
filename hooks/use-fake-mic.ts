"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseFakeMicReturn {
  level: number;
  isActive: boolean;
  toggle: () => void;
  isLaughing: boolean;
}

export function useFakeMic(threshold: number = 70): UseFakeMicReturn {
  const [level, setLevel] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isLaughing, setIsLaughing] = useState(false);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastUpdateRef = useRef(0);

  const toggle = useCallback(() => {
    setIsActive((prev) => !prev);
    if (!isActive) {
      setLevel(0);
      setIsLaughing(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      setLevel(0);
      return;
    }

    const tick = (timestamp: number) => {
      // Throttle to ~15fps — smooth enough for a level bar, way less CPU
      if (timestamp - lastUpdateRef.current < 66) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastUpdateRef.current = timestamp;
      timeRef.current += 0.066;
      const t = timeRef.current;

      const base = Math.sin(t * 2.3) * 8 + Math.sin(t * 3.7) * 5 + Math.sin(t * 1.1) * 3;
      const noise = Math.random() * 6;
      const baseline = 15;
      const spikeChance = Math.random();
      const spike = spikeChance > 0.97 ? 45 + Math.random() * 30 : 0;
      const raw = baseline + base + noise + spike;
      const clamped = Math.max(0, Math.min(100, raw));

      setLevel(clamped);
      setIsLaughing(clamped >= threshold);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isActive, threshold]);

  return { level, isActive, toggle, isLaughing };
}
