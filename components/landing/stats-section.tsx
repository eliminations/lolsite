import { Wallet, ArrowDownToLine, Repeat, PartyPopper } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Get a Wallet",
    description: "Download Phantom or any Solana-compatible wallet.",
  },
  {
    icon: ArrowDownToLine,
    title: "Fund It",
    description: "Add SOL to your wallet via an exchange or onramp.",
  },
  {
    icon: Repeat,
    title: "Swap for $lol",
    description: "Head to Raydium or Jupiter and swap SOL for $lol.",
  },
  {
    icon: PartyPopper,
    title: "You're In",
    description: "Hold, play games, earn rewards. Welcome to the community.",
  },
];

export function HowToBuySection() {
  return (
    <section className="mx-auto max-w-5xl px-6 md:px-8 py-24 md:py-32">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
        How to Buy
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.title} className="relative space-y-3 p-6 rounded-2xl border border-border/40 bg-card/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <step.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight">{step.title}</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
