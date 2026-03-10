"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="mx-auto max-w-5xl px-6 md:px-8 py-24 md:py-32">
      <div className="relative rounded-2xl border border-border/40 bg-card/30 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/[0.06] blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center py-16 px-8 gap-5">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Get in early
          </h2>
          <p className="text-muted-foreground max-w-sm">
            Join the community. Play the game. Have a say in what gets built next.
          </p>
          <Link
            href="/game"
            className={cn(
              buttonVariants({ size: "lg" }),
              "text-base px-8 font-semibold mt-2 group"
            )}
          >
            Start Playing
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
