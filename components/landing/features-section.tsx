import { FEATURES } from "@/lib/constants";
import { Gamepad2, Gift } from "lucide-react";

const iconMap = {
  Gamepad2,
  Gift,
};

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 md:px-8 py-24 md:py-32">
      <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
        {FEATURES.map((feature) => {
          const Icon = iconMap[feature.icon as keyof typeof iconMap];
          return (
            <div
              key={feature.title}
              className="group space-y-4 p-6 rounded-2xl border border-transparent hover:border-border/40 hover:bg-card/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
