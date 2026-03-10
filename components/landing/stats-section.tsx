import { STATS } from "@/lib/constants";

export function StatsSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 md:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center space-y-1">
            <p className="text-3xl md:text-4xl font-bold font-mono text-primary tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
