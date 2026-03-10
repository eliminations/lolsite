export function ChartSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 md:px-8 py-16 md:py-24">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Chart</h2>
      </div>

      <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/20">
        <iframe
          src="https://dexscreener.com/solana/FygY4WBxy4zUtnxXwHZETN6G1ChHs56dFybWJNyipump?embed=1&theme=dark&info=0"
          className="w-full h-[500px] md:h-[600px]"
          title="Dexscreener Chart"
        />
      </div>
    </section>
  );
}
