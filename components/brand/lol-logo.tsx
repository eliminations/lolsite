"use client";

import { cn } from "@/lib/utils";

interface LolLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showGlow?: boolean;
}

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-32 h-32",
};

const emojiSizeMap = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-10 h-10",
  xl: "w-16 h-16",
};

const glowSizeMap = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-36 h-36",
  xl: "w-56 h-56",
};

export function LolLogo({ size = "md", className, showGlow = true }: LolLogoProps) {
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {showGlow && (
        <div
          className={cn(
            "absolute rounded-full gpu-accelerated animate-[glow-pulse_4s_ease-in-out_infinite] bg-primary/20 blur-2xl",
            glowSizeMap[size]
          )}
        />
      )}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full",
          sizeMap[size]
        )}
      >
        {/* Twemoji for consistent cross-platform emoji rendering */}
        <img
          src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f602.svg"
          alt="😂"
          className={cn("relative z-10", emojiSizeMap[size])}
          draggable={false}
        />
      </div>
    </div>
  );
}
