import { Badge } from "@/components/ui/badge";
import { UTILITY_ITEMS } from "@/lib/constants";
import { Gift } from "lucide-react";

const iconMap: Record<string, typeof Gift> = {
  Rewards: Gift,
};

export function UtilityGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {UTILITY_ITEMS.map((item) => {
        const Icon = iconMap[item.title];
        return (
          <div
            key={item.title}
            className="group rounded-2xl border border-border/40 bg-card/30 p-6 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                {Icon && <Icon className="w-5 h-5 text-primary" />}
              </div>
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            </div>
            <h3 className="text-lg font-semibold tracking-tight mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
