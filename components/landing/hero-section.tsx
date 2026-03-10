"use client";

import { useState } from "react";
import { LolLogo } from "@/components/brand/lol-logo";
import { Copy, Check } from "lucide-react";

const CONTRACT_ADDRESS = "FygY4WBxy4zUtnxXwHZETN6G1ChHs56dFybWJNyipump";

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const copyCA = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 md:px-8 py-24 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.04] blur-3xl gpu-accelerated" />

      <div className="relative z-10 flex flex-col items-center gap-10 text-center max-w-2xl">
        <LolLogo size="xl" />

        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
            <span className="font-mono bg-gradient-to-r from-primary via-amber-300 to-primary bg-clip-text text-transparent">
              $lol
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-lg mx-auto font-medium">
            The legendary word &quot;LOL&quot; has been used since the 80&apos;s with proof that it was out before the infamous 2011 push. Lolillions.
          </p>
        </div>

        {/* Contract Address */}
        <button
          onClick={copyCA}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/60 border border-border/40 hover:border-primary/30 transition-colors group cursor-pointer"
        >
          <span className="text-sm text-muted-foreground font-mono truncate max-w-[200px] sm:max-w-none">
            {CONTRACT_ADDRESS}
          </span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
          )}
        </button>
      </div>
    </section>
  );
}
