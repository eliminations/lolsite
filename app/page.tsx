"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowToBuySection } from "@/components/landing/stats-section";
import { CTASection } from "@/components/landing/cta-section";
import { ChartSection } from "@/components/landing/chart-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        <ChartSection />

        <div className="mx-auto max-w-5xl px-6 md:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </div>

        <FeaturesSection />

        <HowToBuySection />

        <div className="mx-auto max-w-5xl px-6 md:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </div>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
