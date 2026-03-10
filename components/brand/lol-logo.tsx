"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LolLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showGlow?: boolean;
}

const sizeMap = {
  sm: { container: "w-10 h-10", img: 40 },
  md: { container: "w-14 h-14", img: 56 },
  lg: { container: "w-20 h-20", img: 80 },
  xl: { container: "w-32 h-32", img: 128 },
};

const glowSizeMap = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-36 h-36",
  xl: "w-56 h-56",
};

export function LolLogo({ size = "md", className, showGlow = true }: LolLogoProps) {
  const s = sizeMap[size];

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
          "relative flex items-center justify-center",
          s.container
        )}
      >
        <Image
          src="/lol-logo.svg"
          alt="$lol"
          width={s.img}
          height={s.img}
          className="relative z-10"
          priority
          draggable={false}
        />
      </div>
    </div>
  );
}
