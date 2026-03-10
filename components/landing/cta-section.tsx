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
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Get in early
          </h2>
          <p className="text-lg text-muted-foreground max-w-sm">
            Join the community. Play the game. Have a say in what gets built next.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link
              href="/game"
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-base px-8 font-semibold group"
              )}
            >
              Start Playing
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="https://x.com/i/communities/2030949530640720055"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-base px-8 font-semibold border-border/60 hover:bg-primary/5 hover:border-primary/30"
              )}
            >
              Join Community
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
